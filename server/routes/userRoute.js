const express = require("express")
const { findUser, getUsers } = require("../controllers/userController")

const userRouter = express.Router()

userRouter.get("/users/:userId", findUser)
userRouter.get("/users", getUsers)


module.exports = userRouter