const getDb = require("../util/db").getDb;
const mongodb = require("mongodb");

class Message {
    constructor({ message, user, id, replies }) {
        this.message = message;
        this.user = user;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.replies = replies;
    }

    async save() {
        const db = getDb();
        return db.collection("messages")
            .insertOne({
                messsage: this.message,
                user: this.user,
                replies: this.replies,
            });
    }

}


exports.Message = Message;

