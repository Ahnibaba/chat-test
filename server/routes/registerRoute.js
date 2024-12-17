const express = require("express")
const { registerUser } = require("../controllers/registerController")

const registerRouter = express.Router()

registerRouter.post("/register", registerUser)


module.exports = registerRouter