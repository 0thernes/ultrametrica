/**
 * ULTRAMETRICA (v1.4.0) — Local HTTP Server Contract (B09), Security (B36),
 * Observability (A34), & Failure-Injection (B21) Test Suite.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createUltrametricaServer, parsePort, SECURITY_HEADERS } from '../server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(__dirname, '..', 'src');

function rawRequest(port, method, rawPath) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: '127.0.0.1', port, method, path: rawPath, agent: false, headers: { connection: 'close' } },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

test('A33 Configuration: parsePort validates defaults, valid bounds, and rejects hostile values', () => {
  assert.equal(parsePort(undefined), 4173);
  assert.equal(parsePort(''), 4173);
  assert.equal(parsePort('0'), 0);
  assert.equal(parsePort('4174'), 4174);
  assert.equal(parsePort('65535'), 65535);
  assert.throws(() => parsePort('-1'), RangeError);
  assert.throws(() => parsePort('70000'), RangeError);
  assert.throws(() => parsePort('abc'), RangeError);
  assert.throws(() => parsePort('4173.5'), RangeError);
});

test('B09 Contract, A34 Observability & B36 Security: HTTP routes, headers, and traversal defense', async () => {
  const logs = [];
  const server = createUltrametricaServer({
    srcRoot: SRC_ROOT,
    logFn: (entry) => logs.push(entry),
    version: '1.4.0',
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    // 1. A34 /healthz JSON contract
    const health = await rawRequest(port, 'GET', '/healthz');
    assert.equal(health.status, 200);
    assert.match(health.headers['content-type'], /^application\/json/);
    const payload = JSON.parse(health.body);
    assert.equal(payload.status, 'ok');
    assert.equal(payload.service, 'ultrametrica');
    assert.equal(payload.version, '1.4.0');
    assert.equal(typeof payload.uptime_s, 'number');

    // 2. Root redirect preserving query permalink
    const redir = await rawRequest(port, 'GET', '/?exp=btz_black_hole&p=5');
    assert.equal(redir.status, 302);
    assert.equal(redir.headers.location, '/web/?exp=btz_black_hole&p=5');

    // 3. Static HTML + Security Headers (CSP, nosniff, CORP, Referrer-Policy)
    const idx = await rawRequest(port, 'GET', '/web/');
    assert.equal(idx.status, 200);
    assert.match(idx.headers['content-type'], /^text\/html/);
    assert.ok(idx.body.includes('ULTRAMETRICA'));
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      assert.equal(idx.headers[k.toLowerCase()], v, `Missing/mismatched security header ${k}`);
    }

    // 4. HEAD returns empty body with Content-Length
    const head = await rawRequest(port, 'HEAD', '/web/index.html');
    assert.equal(head.status, 200);
    assert.equal(head.body, '');
    assert.ok(Number(head.headers['content-length']) > 1000);

    // 5. Method allowlist (405)
    const post = await rawRequest(port, 'POST', '/web/');
    assert.equal(post.status, 405);
    assert.equal(post.headers.allow, 'GET, HEAD');

    // 6. Malformed URI encoding, null byte, backslash -> 400
    assert.equal((await rawRequest(port, 'GET', '/web/%ZZ')).status, 400);
    assert.equal((await rawRequest(port, 'GET', '/web/index.html%00.js')).status, 400);
    assert.equal((await rawRequest(port, 'GET', '/web/..%5cpackage.json')).status, 400);

    // 7. Directory traversal & bare directory -> 403
    assert.equal((await rawRequest(port, 'GET', '/..%2fpackage.json')).status, 403);
    assert.equal((await rawRequest(port, 'GET', '/web')).status, 403);

    // 8. Missing file -> 404
    assert.equal((await rawRequest(port, 'GET', '/web/does-not-exist.js')).status, 404);

    // 9. Structured logs emitted with request ids & levels
    assert.ok(logs.length >= 10);
    assert.ok(logs.every((e) => typeof e.ts === 'string' && typeof e.reqId === 'number' && typeof e.level === 'string'));
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
});

test('B21 Failure Injection: Induced disk EIO read error returns clean 500 & logs stack trace without crashing', async () => {
  const logs = [];
  const faultyFs = {
    stat: (p) => fs.stat(p),
    readFile: async () => {
      const err = new Error('Simulated EIO disk read failure');
      err.code = 'EIO';
      throw err;
    },
  };

  const server = createUltrametricaServer({
    srcRoot: SRC_ROOT,
    fsImpl: faultyFs,
    logFn: (entry) => logs.push(entry),
    version: '1.4.0',
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const res = await rawRequest(port, 'GET', '/web/index.html');
    assert.equal(res.status, 500);
    assert.equal(res.body, 'Internal Server Error');

    const errLog = logs.find((l) => l.level === 'error');
    assert.ok(errLog, 'Induced error must produce an error-level structured log');
    assert.equal(errLog.status, 500);
    assert.match(errLog.error, /Simulated EIO/);
    assert.ok(typeof errLog.stack === 'string' && errLog.stack.includes('Simulated EIO'));

    // Server remains healthy after fault
    const health = await rawRequest(port, 'GET', '/healthz');
    assert.equal(health.status, 200);
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
});
