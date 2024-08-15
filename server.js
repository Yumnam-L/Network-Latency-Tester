const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/test') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Dummy transaction completed');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
