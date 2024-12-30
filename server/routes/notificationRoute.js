const express = require("express")
const { getAllNotification, getUnreadNotifications,  readNotification, createNotification } = require("../controllers/notificationController")

const notificationRouter = express.Router()

notificationRouter.post("/new", createNotification)
notificationRouter.post("/", getAllNotification)
notificationRouter.get("/unread", getUnreadNotifications)
notificationRouter.post("/read", readNotification)

module.exports = notificationRouter