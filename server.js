const http = require('http');
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end('<h1>Cloudsitefy App Hosting OK</h1>');
});

server.listen(PORT, () => console.log('listening on', PORT));
