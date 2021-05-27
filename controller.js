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
            console.log(data);
            console.log(`Data ${body}`)
        })
        req.on('end', function () {
            let parsedBody = JSON.parse(body.data)
            console.log(parsedBody);
            User.findByEmail(body.email)
                .then(exist => {
                    if (exist) {
                        console.log(exist);
                        // return message
                        return
                    }
                    console.log(body.name);
                    const newUser = new User({
                        name: body.name,
                        email: body.email,
                        password: body.password
                    });
                    newUser.save();
                }).catch(error => {
                    console.log(error);
                })

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