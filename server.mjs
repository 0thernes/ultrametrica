/**
 * ULTRAMETRICA — Hardened Zero-Dependency Local HTTP Server.
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(__dirname, 'src');
const PORT = Number(process.env.PORT || 4173);

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

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD', ...SECURITY_HEADERS });
      res.end('Method Not Allowed');
      return;
    }

    const parsed = new URL(req.url || '/', `http://127.0.0.1:${PORT}`);
    if (parsed.pathname === '/') {
      res.writeHead(302, { Location: `/web/${parsed.search}`, ...SECURITY_HEADERS });
      res.end();
      return;
    }

    let decodedPath;
    try {
      decodedPath = decodeURIComponent(parsed.pathname);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
      res.end('Bad Request');
      return;
    }

    if (decodedPath.includes('\0') || decodedPath.includes('\\')) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
      res.end('Bad Request');
      return;
    }

    const urlPath = decodedPath.endsWith('/') ? `${decodedPath}index.html` : decodedPath;
    const relPath = urlPath.replace(/^\/+/, '');
    const fullPath = path.resolve(SRC_ROOT, relPath);
    const relativeToRoot = path.relative(SRC_ROOT, fullPath);

    if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
      res.end('Forbidden');
      return;
    }

    const stat = await fs.stat(fullPath);
    if (!stat.isFile()) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
      res.end('Forbidden');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS,
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    const data = await fs.readFile(fullPath);
    res.end(data);
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
      res.end('Not Found');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
      res.end('Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`ULTRAMETRICA running at http://localhost:${PORT} (http://127.0.0.1:${PORT})`);
});
