 const express = require("express")
 const cors = require("cors") 
 const { dbConnect } = require("./config/db")

 const registerRouter = require("./routes/registerRoute")
 const loginRouter = require("./routes/loginRoute")
 const userRouter = require("./routes/userRoute")
 const chatRouter = require("./routes/chatRoute")
 const messageRouter = require("./routes/messageRoute")

 const PORT = process.env.PORT || 5000

 const app = express()

 app.use(express.json())
 
 app.use(cors({
    origin: "http://localhost:5173"
}))

 app.use("/api/", registerRouter)
 app.use("/api/", loginRouter)
 app.use("/api/", userRouter)
 app.use("/api/chats", chatRouter)
 app.use("/api/messages", messageRouter)

 async function startServer() {
    dbConnect()
    app.listen(PORT, (req, res) => {
        console.log(`Server running on port ${PORT}`);
        
     })
 }

 startServer()