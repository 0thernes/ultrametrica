/**
 * ULTRAMETRICA — Zero-Dependency Local HTTP Server.
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.join(__dirname, 'src');
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url || '/', `http://127.0.0.1:${PORT}`).pathname;
    const relPath = urlPath === '/' ? 'web/index.html' : urlPath.replace(/^\/+/, '');
    const fullPath = path.resolve(SRC_ROOT, relPath);

    if (!fullPath.startsWith(SRC_ROOT + path.sep) && fullPath !== SRC_ROOT) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    const data = await fs.readFile(fullPath);
    const ext = path.extname(fullPath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`ULTRAMETRICA running at http://localhost:${PORT} (http://127.0.0.1:${PORT})`);
});
