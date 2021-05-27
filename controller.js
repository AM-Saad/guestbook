const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    const reqUrl = url.parse(req.url, true);

    // SignUp Endpoint
    if (reqUrl.pathname == '/signup' && req.method === 'POST') {
        var body = ''
        req.on('data', function (data) {
            body += data
            console.log(`Data ${body}`)
        })
        req.on('end', function () {
            console.log(`Compelete Data  ${body}`)
        })


    }



});