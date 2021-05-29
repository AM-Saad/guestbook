const http = require('http');
const url = require('url');

const User = require("./models/User").User;
const Message = require("./models/Message").Message;

module.exports = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    if (req.method === 'OPTIONS') {
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {

        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')



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

        // Message Endpoint
        if (reqUrl.pathname == '/message' && req.method === 'GET') {
            let id = req.url.split('=').pop()

            Message.findById(id)
                .then(message => {
                    if (!message) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Message Not Found!!' }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(message));
                }).catch(error => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })
        }

        // Messages Endpoint
        if (reqUrl.pathname == '/messages' && req.method === 'GET') {
            Message.fetchAll()
                .then(messages => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(messages));
                    return
                }).catch(error => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
                })
        }






        // Delete Message Endpoint
        if (reqUrl.pathname == '/messages' && req.method === 'DELETE') {
            let id = req.url.split('id=').pop().split('&')[0];
            let user = req.url.split('user=').pop()
            User.findById(user)
                .then(doc => {
                    if (!doc || doc._id.toString() !== user.toString()) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "You're not allowed to preform this action" }));
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
                                    console.log(error);
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: '500 internal server error' }));
                                })
                        }).catch(error => {
                            console.log(error);

                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: '500 internal server error' }));
                        })

                }).catch(error => {
                    console.log(error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: '500 internal server error' }));
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
                        }
                        if (message.user.toString() != parsedBody.user.toString()) {
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: "You're not allowed to preform this action" }));
                        }
                        Message.update(id, parsedBody.message)
                            .then(result => {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Message Updated' }));
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

        // Reply Message Endpoint
        if (reqUrl.pathname == '/messages/reply' && req.method === 'PUT') {
            console.log('replyin');
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
                User.findById(user)
                    .then(doc => {
                        if (!doc) {
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: "User Not Found" }));
                        }
                        Message.findById(id)
                            .then(message => {
                                if (!message) {
                                    res.writeHead(404, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: 'Message not found!' }));
                                }
                                let reply = {
                                    message: message,
                                    user: user.name
                                }
                                Message.reply(id, reply)
                                    .then(result => {
                                        res.writeHead(200, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ message: 'Reply added' }));
                                    }).catch(error => {
                                        res.writeHead(500, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ message: '500 internal server error' }));
                                    })
                            }).catch(error => {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: '500 internal server error' }));
                            })
                    }).catch(error => {

                    })

            })
        }
    }

});