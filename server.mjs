/**
 * ULTRAMETRICA — Hardened Zero-Dependency Local HTTP Observatory Server.
 *
 * Provides:
 *   - GET / HEAD static serving strictly sandboxed inside src/
 *   - GET /healthz structured JSON observability probe (Build Standard A34)
 *   - Structured JSON access/error logging with request ids (LOG_FORMAT=json)
 *   - Fail-fast PORT/HOST validation (Build Standard A33)
 *   - Defense-in-depth headers (CSP, nosniff, CORP, Referrer-Policy)
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SRC_ROOT = path.resolve(__dirname, 'src');
const VERSION_PATH = path.resolve(__dirname, 'VERSION');
let DEFAULT_VERSION = '1.6.0';
try {
  DEFAULT_VERSION = readFileSync(VERSION_PATH, 'utf8').trim() || DEFAULT_VERSION;
} catch {}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
};

export function parsePort(raw = process.env.PORT) {
  if (raw === undefined || raw === '') return 4173;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 65535) {
    throw new RangeError(`Invalid PORT='${raw}'. Expected integer in [0, 65535].`);
  }
  return n;
}

export function createUltrametricaServer({
  srcRoot = DEFAULT_SRC_ROOT,
  fsImpl = fs,
  logFn = null,
  version = DEFAULT_VERSION,
} = {}) {
  const rootAbs = path.resolve(srcRoot);
  const startedAt = Date.now();
  let reqSeq = 0;

  const emitLog = (level, fields) => {
    if (typeof logFn === 'function') {
      logFn({ ts: new Date().toISOString(), level, ...fields });
    }
  };

  return http.createServer(async (req, res) => {
    const reqId = ++reqSeq;
    const method = req.method || 'GET';
    const rawUrl = req.url || '/';

    try {
      if (method !== 'GET' && method !== 'HEAD') {
        res.writeHead(405, {
          'Content-Type': 'text/plain; charset=utf-8',
          Allow: 'GET, HEAD',
          ...SECURITY_HEADERS,
        });
        res.end('Method Not Allowed');
        emitLog('warn', { reqId, method, url: rawUrl, status: 405 });
        return;
      }

      if (rawUrl.startsWith('//')) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
        res.end('Bad Request');
        emitLog('warn', { reqId, method, url: rawUrl, status: 400, reason: 'protocol_relative_url' });
        return;
      }

      let parsed;
      try {
        parsed = new URL(rawUrl, 'http://127.0.0.1');
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
        res.end('Bad Request');
        emitLog('warn', { reqId, method, url: rawUrl, status: 400, reason: 'invalid_url' });
        return;
      }

      if (parsed.pathname === '/healthz') {
        const body = JSON.stringify({
          status: 'ok',
          service: 'ultrametrica',
          version,
          uptime_s: Number(((Date.now() - startedAt) / 1000).toFixed(3)),
        });
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
          'Cache-Control': 'no-store',
          ...SECURITY_HEADERS,
        });
        res.end(method === 'HEAD' ? undefined : body);
        emitLog('info', { reqId, method, path: '/healthz', status: 200 });
        return;
      }

      if (parsed.pathname === '/') {
        res.writeHead(302, { Location: `/web/${parsed.search}`, ...SECURITY_HEADERS });
        res.end();
        emitLog('info', { reqId, method, path: '/', status: 302 });
        return;
      }

      if (parsed.pathname === '/blueprint' || parsed.pathname === '/blueprint.html') {
        res.writeHead(302, { Location: `/web/blueprint.html${parsed.search}`, ...SECURITY_HEADERS });
        res.end();
        emitLog('info', { reqId, method, path: parsed.pathname, status: 302 });
        return;
      }

      let decodedPath;
      try {
        decodedPath = decodeURIComponent(parsed.pathname);
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
        res.end('Bad Request');
        emitLog('warn', { reqId, method, path: parsed.pathname, status: 400, reason: 'bad_uri_encoding' });
        return;
      }

      // Reject null bytes, backslashes, and ASCII control characters ([\x00-\x1f\x7f])
      if (/[\x00-\x1f\x7f\\]/.test(decodedPath)) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
        res.end('Bad Request');
        emitLog('warn', { reqId, method, path: decodedPath, status: 400, reason: 'forbidden_char' });
        return;
      }

      const urlPath = decodedPath.endsWith('/') ? `${decodedPath}index.html` : decodedPath;
      const relPath = urlPath.replace(/^\/+/, '');
      const fullPath = path.resolve(rootAbs, relPath);
      const relativeToRoot = path.relative(rootAbs, fullPath);

      if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
        res.end('Forbidden');
        emitLog('warn', { reqId, method, path: decodedPath, status: 403, reason: 'traversal' });
        return;
      }

      const stat = await fsImpl.stat(fullPath);
      if (!stat.isFile()) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
        res.end('Forbidden');
        emitLog('warn', { reqId, method, path: decodedPath, status: 403, reason: 'not_a_file' });
        return;
      }

      // Symlink-escape defense: resolve real paths when fsImpl supports realpath
      if (typeof fsImpl.realpath === 'function') {
        const [realRoot, realTarget] = await Promise.all([
          fsImpl.realpath(rootAbs),
          fsImpl.realpath(fullPath),
        ]);
        const realRel = path.relative(realRoot, realTarget);
        if (realRel.startsWith('..') || path.isAbsolute(realRel)) {
          res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
          res.end('Forbidden');
          emitLog('warn', { reqId, method, path: decodedPath, status: 403, reason: 'symlink_escape' });
          return;
        }
      }

      const ext = path.extname(fullPath).toLowerCase();
      if (method === 'HEAD') {
        res.writeHead(200, {
          'Content-Type': MIME[ext] || 'application/octet-stream',
          'Content-Length': stat.size,
          'Cache-Control': 'no-store',
          ...SECURITY_HEADERS,
        });
        res.end();
        emitLog('info', { reqId, method, path: decodedPath, status: 200 });
        return;
      }
      const data = await fsImpl.readFile(fullPath);
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Length': data.length,
        'Cache-Control': 'no-store',
        ...SECURITY_HEADERS,
      });
      res.end(data);
      emitLog('info', { reqId, method, path: decodedPath, status: 200, bytes: data.length });
    } catch (err) {
      if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) {
        if (!res.headersSent) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
          res.end('Not Found');
        } else {
          res.destroy();
        }
        emitLog('info', { reqId, method, url: rawUrl, status: 404 });
      } else {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
          res.end('Internal Server Error');
        } else {
          res.destroy();
        }
        emitLog('error', {
          reqId,
          method,
          url: rawUrl,
          status: 500,
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    }
  });
}

// Start listener only when executed directly as CLI entry point
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const PORT = parsePort(process.env.PORT);
  const HOST = process.env.HOST || '127.0.0.1';
  const jsonLogs = process.env.LOG_FORMAT === 'json';
  const version = DEFAULT_VERSION;

  const logFn = (entry) => {
    if (jsonLogs || entry.level === 'error') {
      const stream = entry.level === 'error' ? process.stderr : process.stdout;
      stream.write(`${JSON.stringify(entry)}\n`);
    }
  };

  const server = createUltrametricaServer({ srcRoot: DEFAULT_SRC_ROOT, logFn, version });
  server.listen(PORT, HOST, () => {
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : PORT;
    if (jsonLogs) {
      process.stdout.write(
        `${JSON.stringify({ ts: new Date().toISOString(), level: 'info', event: 'listen', host: HOST, port: actualPort, version })}\n`
      );
    } else {
      console.log(`ULTRAMETRICA v${version} running at http://${HOST}:${actualPort} (health: /healthz)`);
    }
  });
}
