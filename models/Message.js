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
                message: this.message,
                user: this.user,
                replies: this.replies,
            });
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('messages').find().toArray()
    }

    static findById(id) {
        const db = getDb();
        return db.collection("messages").findOne({ _id: new mongodb.ObjectId(id) });
    }
    static deleteById(id) {
        const db = getDb();
        return db
            .collection('messages')
            .deleteOne({ _id: new mongodb.ObjectId(id) })

    }
    static update(id, message) {
        console.log(id);
        console.log(message);
        const db = getDb();
        return db
            .collection('messages')
            .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { message: message } });

    }
}


exports.Message = Message;

