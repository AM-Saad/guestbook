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
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Name, email and password are required' }));
                return
            }
            User.findByEmail(parsedBody.email)
                .then(exist => {
                    if (exist) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
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
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Your account created successfully' }));
                            return
                        }).catch(error => {
                            console.log(error);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: '500 internal server error' }));
                        })

                }).catch(error => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })

        })

    }




    // Login Endpoint
    if (reqUrl.pathname == '/login' && req.method === 'POST') {
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
            const parsedBody = JSON.parse(body)
            if (!parsedBody.email || !parsedBody.password) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Email and password are required' }));
                return
            }
            User.findByEmail(parsedBody.email)
                .then(user => {
                    if (!user) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'This email not exists' }));
                        return
                    }
                    if (user.password != parsedBody.password) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Password is wrong' }));
                        return
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(user));
                    return
                }).catch(error => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
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
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Message and user id are required' }));
                return
            }
            User.findById(parsedBody.user)
                .then(user => {
                    if (!user) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'This user not exists' }));
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
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Message created successfully', newMsg: newMsg }));
                            return
                        }).catch(error => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: '500 internal server error' }));
                        })
                }).catch(error => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })

        })


    }

    // Messages Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'GET') {
        console.log('here');
        Message.fetchAll()
            .then(messages => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(messages));
                return
            }).catch(error => {
                console.log(error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: '500 internal server error' }));
            })
    }






    // Delete Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'DELETE') {
        let id = req.url.split('=').pop()
        var body = ''
        let parsedBody
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
            parsedBody = JSON.parse(body)
            if (!parsedBody.user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "You're not allowed to preform this action" }));
                return
            }
            User.findById(user)
                .then(doc => {
                    if (!doc || doc._id.toString() !== parsedBody.user.toString()) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "You're not allowed to preform this action" }));
                        return
                    }
                    Message.findById(id)
                        .then(message => {
                            if (!message) {
                                res.writeHead(404, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Message not found!' }));
                            }

                            Message.deleteById(id)
                                .then(result => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: 'Message Deleted' }));
                                }).catch(error => {
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: '500 internal server error' }));
                                })
                        }).catch(error => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: '500 internal server error' }));
                        })

                }).catch(error => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })

        })

    }

    // Edit To Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'PUT') {
        let id = req.url.split('=').pop()
        var body = ''
        let parsedBody
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
            parsedBody = JSON.parse(body)
            if (!parsedBody.message || !parsedBody.user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Message and user id are required' }));
            }

            Message.findById(id)
                .then(message => {
                    if (!message) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Message not found!' }));
                        return
                    }
                    Message.update(id, parsedBody.message)
                        .then(result => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Message Updated' }));
                            return
                        }).catch(error => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: '500 internal server error' }));
                        })
                }).catch(error => {
                    console.log(error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })
        })

    }

    // Reply Message Endpoint
    if (reqUrl.pathname == '/messages' && req.method === 'PUT') {

    }

});