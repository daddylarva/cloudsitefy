const http = require('http');
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // 메인 응답
  res.writeHead(200, { 
    'content-type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CloudSitefy - App Hosting</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #2563eb; }
            .status { color: #059669; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>CloudSitefy App Hosting</h1>
        <p class="status">✅ Status: Running Successfully</p>
        <p>Backend: cloudsitefy</p>
        <p>Region: us-central1</p>
        <p>Time: ${new Date().toISOString()}</p>
    </body>
    </html>
  `;
  
  res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('CloudSitefy App Hosting server listening on port', PORT);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
