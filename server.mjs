import { createServer } from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverEntryPath = pathToFileURL(join(__dirname, 'dist/server/server.js')).href;
const serverEntry = await import(serverEntryPath);
const clientDir = join(__dirname, 'dist/client');

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  
  const staticPath = join(clientDir, url.pathname);
  if (existsSync(staticPath) && !staticPath.endsWith('/')) {
    const ext = staticPath.split('.').pop();
    const contentTypes = {
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      ico: 'image/x-icon',
      woff: 'font/woff',
      woff2: 'font/woff2',
      ttf: 'font/ttf',
      eot: 'application/vnd.ms-fontobject',
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(readFileSync(staticPath));
    return;
  }

  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
  });
  
  const response = await serverEntry.default.fetch(request, {}, {});
  
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  const body = await response.arrayBuffer();
  res.end(Buffer.from(body));
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
