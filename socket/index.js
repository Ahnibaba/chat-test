const { Server } = require("socket.io")

const PORT = process.env.PORT || 3000;

const io = new Server({
    cors: "https://chat-test-hazel.vercel.app/"
})

let onlineUsers = []

io.on("connection", (socket) => {
    console.log("new connection" + socket.id);

    // listen to a connection
    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
            onlineUsers.push({ userId, socketId: socket.id })

        console.log("online users", onlineUsers);

        io.emit("getOnlineUsers", onlineUsers)
    })

    // add message
    socket.on("sendMessage", (message) => {
      const user = onlineUsers.find(user => user.userId === message.recipientId)

      console.log(onlineUsers);
      
      if(user) {
        io.to(user.socketId).emit("getMessage", message)
        io.to(user.socketId).emit("getNotifications", {
            senderId: message.senderId,
            isRead: false,
            date: new Date()
        })
      }
    })

    //Listen for activity
    socket.on("activity", ({ recipientId, activityName }) => {
        const user = onlineUsers.find(user => user.userId === recipientId)  
    
        if(user) {
            socket.broadcast.to(user.socketId).emit("activity", activityName)
          }
    })
 





    



    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
        io.emit("getOnlineUsers", onlineUsers)

    })


})

io.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});