const http = require('http');
const mongoConnect = require("./util/db").mongoConnect;

const server = require('./controller.js');




const port = 3000
server.listen(port, () => {
    mongoConnect();
    console.log(`Server running at ${port}`);
});

