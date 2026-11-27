/**
 * ULTRAMETRICA (v1.7.0) — Concurrency, Async Burst & AudioWorklet Race Suite (Build Standard B19, F54).
 *
 * Exercises concurrent async execution paths in ULTRAMETRICA:
 *   1. 100 simultaneous in-flight HTTP requests against live `server.mjs` mixing `/healthz`,
 *      `/web/index.html`, `/web/blueprint.html`, `/engine/padic.js`, `HEAD`, traversal probes,
 *      and `404`s — verifying zero dropped connections, zero race corruption, and exact content.
 *   2. Concurrent disk `EIO` failure storm mixed with healthy `/healthz` probes — verifying
 *      fault isolation across overlapping async requests with zero `ERR_HTTP_HEADERS_SENT` crashes.
 *   3. AudioWorklet `PadicSynthProcessor` (`src/web/audio-worklet.js`) executed directly in Node
 *      under interleaved rapid `port.onmessage` state/pluck bursts (including hostile NaN/Infinity
 *      messages) and 48 kHz `process()` audio-block rendering — verifying zero clicks/NaNs/crashes.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createUltrametricaServer } from '../server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function fetchReq(port, method, reqPath) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method, path: reqPath, agent: false }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('B19 Concurrency (server.mjs): 100 parallel mixed HTTP requests complete cleanly with zero corruption', async () => {
  const logs = [];
  const server = createUltrametricaServer({ logFn: (entry) => logs.push(entry) });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  const specs = [
    { method: 'GET', path: '/healthz', expect: 200, contains: '"status":"ok"' },
    { method: 'GET', path: '/web/index.html', expect: 200, contains: 'ULTRAMETRICA' },
    { method: 'GET', path: '/web/blueprint.html', expect: 200, contains: 'Lean 4 Proof Blueprint' },
    { method: 'HEAD', path: '/engine/padic.js', expect: 200, contains: '' },
    { method: 'GET', path: '/web/%2e%2e%2f%2e%2e%2fpackage.json', expect: 403, contains: 'Forbidden' },
    { method: 'GET', path: '/web/nonexistent.xyz', expect: 404, contains: 'Not Found' },
  ];

  try {
    const promises = Array.from({ length: 100 }, (_, i) => {
      const spec = specs[i % specs.length];
      return fetchReq(port, spec.method, spec.path).then((res) => ({ spec, res }));
    });
    const results = await Promise.all(promises);
    assert.equal(results.length, 100);
    for (const { spec, res } of results) {
      assert.equal(res.status, spec.expect, `Mismatch on ${spec.method} ${spec.path}`);
      if (spec.contains) {
        assert.ok(res.body.includes(spec.contains), `Body corruption on ${spec.path}`);
      }
    }
    const reqIds = new Set(logs.map((l) => l.reqId));
    assert.equal(reqIds.size, 100, `Expected 100 unique sequential request IDs, got ${reqIds.size}`);
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
});

test('B19 Concurrency + B21 Fault Isolation: interleaved concurrent EIO storms do not starve or crash /healthz', async () => {
  const errorLogs = [];
  const flakyFs = {
    async stat() {
      await new Promise((r) => setTimeout(r, 2));
      return { isFile: () => true, size: 64 };
    },
    async realpath(p) {
      return p;
    },
    async readFile() {
      await new Promise((r) => setTimeout(r, 3));
      throw Object.assign(new Error('concurrent EIO fault'), { code: 'EIO' });
    },
  };

  const server = createUltrametricaServer({
    fsImpl: flakyFs,
    logFn: (e) => {
      if (e.level === 'error') errorLogs.push(e);
    },
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const jobs = [];
    for (let i = 0; i < 40; i++) {
      if (i % 2 === 0) {
        jobs.push(fetchReq(port, 'GET', '/web/index.html').then((r) => ({ kind: 'eio', r })));
      } else {
        jobs.push(fetchReq(port, 'GET', '/healthz').then((r) => ({ kind: 'health', r })));
      }
    }
    const settled = await Promise.all(jobs);
    for (const item of settled) {
      if (item.kind === 'eio') {
        assert.equal(item.r.status, 500);
        assert.equal(item.r.body, 'Internal Server Error');
      } else {
        assert.equal(item.r.status, 200);
        assert.equal(JSON.parse(item.r.body).status, 'ok');
      }
    }
    assert.equal(errorLogs.length, 20);
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
});

test('B19 AudioWorklet Async Message/Render Race Stress: PadicSynthProcessor yields 100% finite bounded audio', () => {
  const workletSrc = fs.readFileSync(path.join(ROOT, 'src', 'web', 'audio-worklet.js'), 'utf8');
  let RegisteredCtor = null;
  const sandbox = {
    sampleRate: 48000,
    Math,
    Number,
    Array,
    Float32Array,
    Float64Array,
    AudioWorkletProcessor: class {
      constructor() {
        this.port = { onmessage: null };
      }
    },
    registerProcessor(name, ctor) {
      if (name === 'padic-synth-processor') RegisteredCtor = ctor;
    },
  };
  vm.runInNewContext(workletSrc, sandbox);
  assert.ok(RegisteredCtor, 'Failed to register padic-synth-processor from src/web/audio-worklet.js');

  const proc = new RegisteredCtor();
  const outL = new Float32Array(128);
  const outR = new Float32Array(128);
  const outputs = [[outL, outR]];

  for (let block = 0; block < 200; block++) {
    const hostile = block % 7 === 0;
    proc.port.onmessage({
      data: {
        type: 'state',
        p: hostile ? NaN : [2, 3, 5, 7][block % 4],
        n: hostile ? -3 : 4,
        alpha: hostile ? Infinity : 0.6 + 0.3 * (block % 5),
        isBTZ: block % 2 === 0,
        horizonCurrent: hostile ? NaN : Math.sin(block * 0.2),
        gravStrain: hostile ? -5 : Math.abs(Math.cos(block * 0.1)),
        masterGain: hostile ? 99 : 0.25,
        shellPower: hostile ? [NaN, -1, Infinity, 0.5] : [0.1, 0.3, 0.4, 0.15, 0.05],
        shellCentroid: hostile ? [NaN, -5, 5, 0.5] : [0.5, 0.2, 0.8, 0.4, 0.6],
      },
    });
    if (block % 3 === 0) {
      proc.port.onmessage({
        data: {
          type: 'pluck',
          shell: hostile ? 999 : block % 5,
          intensity: hostile ? NaN : 0.9,
          pan: hostile ? Infinity : 0.3,
        },
      });
    }
    const keepAlive = proc.process([], outputs);
    assert.equal(keepAlive, true);
    for (let i = 0; i < 128; i++) {
      assert.ok(Number.isFinite(outL[i]) && Math.abs(outL[i]) <= 1.0, `Invalid left sample at block ${block}[${i}]: ${outL[i]}`);
      assert.ok(Number.isFinite(outR[i]) && Math.abs(outR[i]) <= 1.0, `Invalid right sample at block ${block}[${i}]: ${outR[i]}`);
    }
  }
});
