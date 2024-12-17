const userModel = require("../models/userModel")

const findUser = async(req, res) => {
    const userId = req.params.userId

    try{
        let user = await userModel.findById(userId).select("-password")

        res.status(200).json({ success: true, user })
    } catch(err) {
        res.status(500).json({ success: false, error: err })
    }
}
const getUsers = async(req, res) => {

    try{
        let users = await userModel.find().select("-password")

        res.status(200).json({ success: true, users })
    } catch(err) {
        res.status(500).json({ success: false, error: err })
    }
}

module.exports = { findUser, getUsers }