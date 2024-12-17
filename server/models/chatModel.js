const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    members: Array
}, {
    timestamps: true
})

const chatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema)

module.exports = chatModel