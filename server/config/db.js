require("dotenv").config()
const mongoose = require("mongoose")

//const MONGO_URL = process.env.MONGO_URL
const MONGO_URL = "mongodb://localhost:27017/chatDB"


mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready");
    
})

mongoose.connection.on("error", (err) => {
    console.error(err)
})

async function dbConnect() {
    await mongoose.connect(MONGO_URL)
}

async function dbDisconnect () {
    await mongoose.disconnect()
}

module.exports ={ dbConnect, dbDisconnect }