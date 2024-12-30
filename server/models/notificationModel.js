const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    senderId: String,
    isRead: Boolean,
}, {
    timestamps: true
})

const notificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema)

module.exports = notificationModel