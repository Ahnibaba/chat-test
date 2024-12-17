const messageModel = require("../models/messageModel")

//createMessage
const createMessage = async(req, res) => {
  const { chatId, senderId, text } = req.body

  try {
    const newMessage = new messageModel({
        chatId,
        senderId,
        text
      })
    await newMessage.save() 
    res.status(201).json({ success: true, newMessage })
  } catch(error) {
    console.log(error);
    res.status(500).json({ success: false, message: error})
  }
}

//getMessage
const getMessage = async(req, res) => {
    const { chatId } = req.params
    try {
      const messages = await messageModel.find({ chatId })
      res.status(200).json({ success: true, messages })
    } catch(error) {
      console.log(error);
      res.status(500).json({ success: false, message: error})
      
    }
}



module.exports = { createMessage, getMessage }
