// for testing routes/proxy.js 
// run in a separate terminal by doing commmand node server.js

const http = require('http');

const servers = [
    { host: 'localhost', port: 3001, users: 1 },
    { host: 'localhost', port: 8080, users: 2 },
    { host: 'localhost', port: 5000, users: 2 },
    { host: 'localhost', port: 1234, users: 5 },
    { host: 'localhost', port: 9000, users: 3 },
    { host: 'localhost', port: 7070, users: 4 }
];

servers.forEach(server => {
    const { host, port, users } = server;
    const serverInstance = http.createServer((req, res) => {
        if (req.url === '/app/healthcheck' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', users: users }));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });

    serverInstance.listen(port, host, () => {
        console.log(`Server running at http://${host}:${port}/`);
    });
});

