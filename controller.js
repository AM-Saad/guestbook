const http = require('http');
const url = require('url');

const User = require("./models/User").User;
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

    // Login Endpoint
    if (reqUrl.pathname == '/login' && req.method === 'POST') {

    }

    // Messages Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'GET') {

    }


    // New Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'POST') {

    }


    // Edit Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'PUT') {

    }

    // Delete Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'DELETE') {

    }

    // Reply To Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'PUT') {

    }

});