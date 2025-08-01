const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  // Serve the static HTML file
  const filePath = path.join(__dirname, 'cosmic-delivery.html');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Cosmic Delivery static server running on port ${port}`);
  console.log(`🌌 Visit: http://localhost:${port}`);
});