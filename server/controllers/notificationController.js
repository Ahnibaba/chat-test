const notificationModel = require("../models/notificationModel")

const createNotification = async(req, res) => {
    try {
        const { senderId, isRead } = req.body

        const newNotification = new notificationModel({
            senderId,
            isRead
        })

        await newNotification.save()

        res.status(201).json({ success: false, newNotification }) 

    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: err }) 
    }
}

const getAllNotification = async(req, res) => {
    const { user } = req.body
    console.log(user);
    
    try {
      const notifications = await notificationModel.find({ senderId: { $ne: user } })

      console.log(notifications);
      

      res.status(200).json({ success: true, notifications })
    }catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: err })
    }
}
const getUnreadNotifications = async(req, res) => {
    try {
      const unreadNotifications = await notificationModel.find({isRead: false})

      res.status(200).json({ success: true, unreadNotifications })
    }catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: err })
    }
}

const readNotification = async (req, res) => {
    console.log("I am being called");
    
    try {
        const { senderId } = req.body;
        console.log(senderId);
        

        // Find notifications with the specified senderId
        const notifications = await notificationModel.find({ senderId });

        // Update isRead for each notification
        for (const notification of notifications) {
            notification.isRead = true; // Update the isRead field
            await notification.save(); // Save the changes to the database
        }


        console.log(notifications);
        
        

        res.status(200).json({ success: true, notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = { getAllNotification, getUnreadNotifications, readNotification, createNotification }