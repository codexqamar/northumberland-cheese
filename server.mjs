import { createServer } from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';
import { readFileSync, statSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverEntryPath = pathToFileURL(resolve(__dirname, 'dist/server/server.js')).href;
const serverEntry = await import(serverEntryPath);
const clientDir = resolve(__dirname, 'dist/client');

const resolveStaticPath = (pathname) => {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const staticPath = resolve(clientDir, `.${decodedPath}`);
  const isInsideClientDir =
    staticPath === clientDir || staticPath.startsWith(`${clientDir}${sep}`);

  return isInsideClientDir ? staticPath : null;
};

const isStaticFile = (path) => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  
  const staticPath = resolveStaticPath(url.pathname);
  if (staticPath && isStaticFile(staticPath)) {
    const ext = extname(staticPath).slice(1);
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

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
