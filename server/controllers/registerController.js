const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY

    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" })
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required..." })
        }

        let user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "User with the email already exist" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Enter a secure password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user = new userModel({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        const token = createToken(user._id)

        res.status(201).json({ success: true, message: "Registration Successful", userData: { _id: user._id, name, email, token  }})

    } catch (err) {
        res.status(500).json({ success: false, message: err })

    }

}

module.exports = { registerUser }