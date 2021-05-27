const getDb = require("../util/db").getDb;
const mongodb = require("mongodb");

class User {
    constructor(name, email, password) {
        Object.assign(this, { name, email, password });
    }
    save() {
        const db = getDb();
        return db.collection("users").insertOne({
            name: this.name,
            email: this.email,
            password: this.password,
        });
    }
  

}
exports.User = User;

