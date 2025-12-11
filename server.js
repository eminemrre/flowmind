const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const publicDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function sendFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Dosya bulunamadı');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const safePath = req.url.split('?')[0].replace(/\.\./g, '');
  const requestPath = safePath === '/' ? '/index.html' : safePath;
  const filePath = path.join(publicDir, requestPath);
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(filePath, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Sayfa bulunamadı');
    }
  });
});

server.listen(port, () => {
  console.log(`Statik sunucu http://localhost:${port} adresinde çalışıyor`);
});
