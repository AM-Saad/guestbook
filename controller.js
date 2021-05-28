const http = require('http');
const url = require('url');

const User = require("./models/User").User;
const Message = require("./models/Message").Message;

module.exports = http.createServer((req, res) => {

    const reqUrl = url.parse(req.url, true);

    // SignUp Endpoint
    if (reqUrl.pathname == '/signup' && req.method === 'POST') {
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
            const parsedBody = JSON.parse(body)
            if (!parsedBody.name || !parsedBody.email || !parsedBody.password) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Name, email and password are required' }));
                return
            }
            User.findByEmail(parsedBody.email)
                .then(exist => {
                    if (exist) {
                        res.statusCode = 401;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'This email already exists' }));
                        return
                    }
                    const newUser = new User({
                        name: parsedBody.name,
                        email: parsedBody.email,
                        password: parsedBody.password
                    });
                    newUser.save()
                        .then(result => {
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: 'Your account created successfully' }));
                            return
                        }).catch(error => {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: '500 internal server error' }));
                        })

                }).catch(error => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })

        })

    }




    // Login Endpoint
    if (reqUrl.pathname == '/login' && req.method === 'POST') {
        var body = ''
        req.on('data', function (data) {
            body += data
            console.log(body);
        })
        req.on('end', function () {
            const parsedBody = JSON.parse(body)
            if (!parsedBody.email || !parsedBody.password) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Email and password are required' }));
                return
            }
            User.findByEmail(parsedBody.email)
                .then(user => {
                    if (!user) {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'This email not exists' }));
                        return
                    }
                    if (user.password != parsedBody.password) {
                        res.statusCode = 401;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Password is wrong' }));
                        return
                    }
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(user));
                    return
                }).catch(error => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })

        })

    }



    // New Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'POST') {
        var body = ''
        let parsedBody
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
            parsedBody = JSON.parse(body)
            if (!parsedBody.message || !parsedBody.user) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Message and user id are required' }));
                return
            }
            const newMsg = new Message({
                message: parsedBody.message,
                user: parsedBody.user,
                id: null,
                replies: []
            });
            newMsg.save()
                .then(result => {
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Message created successfully', newMsg: newMsg }));
                    return
                }).catch(error => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })
        })


    }

    // Messages Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'GET') {
        Message.fetchAll()
            .then(messages => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(messages));
                return
            }).catch(error => {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: '500 internal server error' }));
            })
    }




    // Edit Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'PUT') {

    }

    // Delete Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'DELETE') {
        let id = url.parse(req.url, true).query
        Message.findById(eq.url)
            .then(message => {
                console.log(message);
                if (!message) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Message not found!' }));
                    return
                }
                Message.deleteById(id)
                    .then(result => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Message Deleted' }));
                        return
                    })
            }).catch(error => {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: '500 internal server error' }));
            })
    }

    // Reply To Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'PUT') {

    }

});