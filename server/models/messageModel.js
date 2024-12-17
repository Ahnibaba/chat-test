const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    chatId: String,
    senderId: String,
    text: String
}, {
    timestamps: true
})

const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)

module.exports = messageModel