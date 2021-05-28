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
    static fetchAll() {
        const db = getDb();
        return db.collection('messages').find().toArray()
    }

    static findById(id) {
        console.log(id);
        const db = getDb();
        return db.collection("messages").findOne({ _id: new mongodb.ObjectId(id) });
    }
    static deleteById(id) {
        const db = getDb();
        return db
            .collection('messages')
            .deleteOne({ _id: new mongodb.ObjectId(id) })

    }
}


exports.Message = Message;

