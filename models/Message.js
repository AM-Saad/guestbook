const getDb = require("../util/db").getDb;
const mongodb = require("mongodb");

class Message {
    constructor(message, user, replies) {
        Object.assign(this, { message, user, replies });
    }


}
exports.Message = Message;

