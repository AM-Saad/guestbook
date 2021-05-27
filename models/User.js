const getDb = require("../util/db").getDb;
const mongodb = require("mongodb");

class User {
    constructor(name, email, password, messages) {
        Object.assign(this, { name, email, password, messages });
    }
}
exports.User = User;
