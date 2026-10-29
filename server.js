import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatically load .env.local or .env if present
for (const envFile of ['.env.local', '.env']) {
  const envPath = path.join(__dirname, envFile);
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(envPath);
      console.log(`Loaded environment from ${envFile}`);
      break;
    } catch (e) {
      console.warn(`Could not load ${envFile}:`, e.message);
    }
  }
}

// Import Vercel serverless chat handler
let chatHandler = null;
try {
  const chatModule = await import('./api/chat.js');
  chatHandler = chatModule.default;
} catch (e) {
  console.warn('Could not load api/chat.js:', e.message);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle /api/chat route
  if (pathname === '/api/chat') {
    if (!chatHandler) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Chat handler unavailable' }));
    }

    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', async () => {
      try {
        req.body = rawBody ? JSON.parse(rawBody) : {};
      } catch (err) {
        req.body = {};
      }

      // Emulate Vercel serverless res helpers: .status(code).json(payload)
      const mockRes = {
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          res.writeHead(this.statusCode || 200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        }
      };

      try {
        await chatHandler(req, mockRes);
      } catch (err) {
        console.error('API Error:', err);
        if (!res.writableEnded) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      }
    });
    return;
  }

  // Handle static file serving
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname);

  // Security: prevent path traversal outside workspace
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio server is running locally at: http://localhost:${PORT}`);
});
