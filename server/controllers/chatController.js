const chatModel = require("../models/chatModel")

//createChat
//findUserChats
//findChat

const createChat = async(req, res) => {
    const { firstId, secondId } = req.body

    try {
      const chat = await chatModel.findOne({
        members: {$all: [firstId, secondId]}
      })

      if(chat) return res.status(200).json({ success: true, chat })

      const newChat = new chatModel({
        members: [firstId, secondId]
      })  

      await newChat.save()

      res.status(201).json({ success: true, chat: newChat })

    } catch(error) {
        console.log(error);
        res.status(500).json({ success: false, message: error })
        
    }
}

const findUserChats = async(req, res) => {
    const userId = req.params.userId

    try {

        const chats = await chatModel.find({
            members: {$in: [userId]}
        })
        res.status(200).json({ success: true, chats })
    } catch(error) {
        console.log(error);
        res.status(500).json({ success: false, message: error })
        
    }
}

const findChat = async(req, res) => {
    const{ firstId, secondId } = req.params
    try {
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
         })
         res.status(200).json({ success: true, chat })
    } catch(error) {
      console.log(error);
      res.status(500).json({ success: false, message: error })
    }
}

module.exports ={ createChat, findUserChats, findChat }