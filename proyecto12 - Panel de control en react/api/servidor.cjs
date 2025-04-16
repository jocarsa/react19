// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // --- Add CORS headers for every request ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // If it's an OPTIONS request (CORS preflight), return a 200 right away
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }
  // ------------------------------------------

  // We only serve files under /api/
  if (req.url.startsWith('/api/')) {
    // e.g. /api/menu.json or /api/Artículos.json
    const fileName = req.url.replace('/api/', '');
    // Path to the file in the local 'api' folder
    const filePath = path.join(__dirname, 'api', fileName);

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });
  } else {
    // Return a simple response for all non-API endpoints
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Node server is running. Use /api/... to fetch JSON data.');
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
