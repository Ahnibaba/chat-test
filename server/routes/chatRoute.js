const express = require("express")
const { createChat, findUserChats, findChat } = require("../controllers/chatController")

const chatRouter = express.Router()

chatRouter.post("/", createChat)
chatRouter.get("/:userId", findUserChats)
chatRouter.get("/:firstId/:secondId", findChat)

module.exports = chatRouter