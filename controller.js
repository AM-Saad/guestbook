const http = require('http');
const url = require('url');

const User = require("./models/User").User;
const Message = require("./models/Message").Message;

module.exports = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    var headers = {};

    // set header to handle the CORS
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With';
    headers['Access-Contrl-Allow-Methods'] = 'PUT, POST, GET, DELETE, OPTIONS';
    headers["Access-Control-Max-Age"] = '86400';
    res.writeHead(200, headers);

    if (req.method === 'OPTIONS') {
        res.end();
    } else {

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
                    res.end(JSON.stringify({ message: 'Name, email and password are required' }));
                }
                User.findByEmail(parsedBody.email)
                    .then(exist => {
                        if (exist) {
                            res.statusCode = 401;
                            res.end(JSON.stringify({ message: 'This email already exists' }));
                        }
                        const newUser = new User({
                            name: parsedBody.name,
                            email: parsedBody.email,
                            password: parsedBody.password
                        });
                        newUser.save()
                            .then(result => {
                                res.statusCode = 201;
                                res.end(JSON.stringify({ message: 'Your account created successfully' }));
                            }).catch(error => {
                                console.log(error);
                                res.statusCode = 500;
                                res.end(JSON.stringify({ message: '500 internal server error' }));
                            })

                    }).catch(error => {
                        res.statusCode = 500;
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
                    res.statusCode = 401;
                    res.end(JSON.stringify({ message: 'Email and password are required' }));
                }
                User.findByEmail(parsedBody.email)
                    .then(user => {
                        if (!user) {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ message: 'This email not exists' }));
                        }
                        if (user.password != parsedBody.password) {
                            res.statusCode = 401;
                            res.end(JSON.stringify({ message: 'Password is wrong' }));
                        }
                        res.statusCode = 201;
                        res.end(JSON.stringify(user));
                    }).catch(error => {
                        res.statusCode = 500;
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
                    res.end(JSON.stringify({ message: 'Message and user id are required' }));
                }
                User.findById(parsedBody.user)
                    .then(user => {
                        if (!user) {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ message: 'This user not exists' }));
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
                                res.end(JSON.stringify({ message: 'Message created successfully', newMsg: newMsg }));
                            }).catch(error => {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ message: '500 internal server error' }));
                            })
                    }).catch(error => {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: '500 internal server error' }));
                    })

            })


        }

        // Messages Endpoint
        if (reqUrl.pathname == '/messages' && req.method === 'GET') {
            console.log('here');
            Message.fetchAll()
                .then(messages => {
                    res.statusCode = 201;
                    res.end(JSON.stringify(messages));
                }).catch(error => {
                    console.log(error);
                    res.statusCode = 500;
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
                    res.statusCode = 401;
                    res.end(JSON.stringify({ message: "You're not allowed to preform this action" }));
                }
                User.findById(user)
                    .then(doc => {
                        if (!doc || doc._id.toString() !== parsedBody.user.toString()) {
                            res.statusCode = 401;
                            res.end(JSON.stringify({ message: "You're not allowed to preform this action" }));
                        }
                        Message.findById(id)
                            .then(message => {
                                if (!message) {
                                    res.statusCode = 404;
                                    res.end(JSON.stringify({ message: 'Message not found!' }));
                                }

                                Message.deleteById(id)
                                    .then(result => {
                                        res.statusCode = 200;
                                        res.end(JSON.stringify({ message: 'Message Deleted' }));
                                    }).catch(error => {
                                        console.log(error);

                                        res.statusCode = 500;
                                        res.end(JSON.stringify({ message: '500 internal server error' }));
                                    })
                            }).catch(error => {
                                console.log(error);
                                res.statusCode = 500;
                                res.end(JSON.stringify({ message: '500 internal server error' }));
                            })

                    }).catch(error => {
                        res.statusCode = 401;
                        res.end(JSON.stringify({ message: "You're not allowed to preform this action" }));
                        return
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
                    res.statusCode = 401;
                    res.end(JSON.stringify({ message: 'Message and user id are required' }));
                }

                Message.findById(id)
                    .then(message => {
                        if (!message) {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ message: 'Message not found!' }));
                        }
                        Message.update(id, parsedBody.message)
                            .then(result => {
                                res.statusCode = 200;
                                res.end(JSON.stringify({ message: 'Message Updated' }));
                            }).catch(error => {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ message: '500 internal server error' }));
                            })
                    }).catch(error => {
                        console.log(error);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: '500 internal server error' }));
                    })
            })

        }

        // Reply Message Endpoint
        if (reqUrl.pathname == '/messages' && req.method === 'PUT') {

        }
    }


});