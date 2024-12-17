const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY

    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" })
}

const loginUser = async(req, res) => {
    const { email, password } = req.body

    try {

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required..." })
     }

      let user = await userModel.findOne({ email })
      if(!user) return res.status(400).json({ success: false, message: "Invalid email or password" })

      const isValidPassword = await bcrypt.compare(password, user.password) 
      
      if(!isValidPassword) {
        return res.status(400).json({ success: false, message: "Incorrect password" })
      }

      const token = createToken(user._id)
      res.status(200).json({ success: true, message: "Login Successful", userData: { _id: user._id, name: user.name, email, token } })
    } catch(err) {
        res.status(500).json({ success: false, message: err })
    }
}

module.exports = { loginUser }
