const getDb = require("../util/db").getDb;
const mongodb = require("mongodb");

class User {
    constructor({ name, email, password }) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    save() {
        console.log(this.name);
        const db = getDb();
        return db.collection("users")
            .insertOne({
                name: this.name,
                email: this.email,
                password: this.password,
            });
    }
    static findByEmail(email) {
        const db = getDb();
        return db.collection("users").findOne({ email: email });
    }

}
exports.User = User;

