const http = require('http');
const mongoConnect = require("./util/db").mongoConnect;
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

const server = http.createServer((req, res) => {

   
});


const port =  3000
server.listen(port, () => {
    console.log(`Server running at ${port}`);
});

mongoConnect(() => {});
