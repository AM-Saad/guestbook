const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    const reqUrl = url.parse(req.url, true);

    // GET Endpoint
    if (reqUrl.pathname == '/' && req.method === 'GET') {

            res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
            // set response content    
            res.write('<html><body><p>This is home Page.</p></body></html>');
            res.end();

    }
});