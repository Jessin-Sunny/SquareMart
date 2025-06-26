const User = require('../models/user');
const bcrypt = require('bcrypt');
const createToken = require('../utils/generateToken');

//sign-up
const signup = async(req, res, next) => {
    try {
        const { name, email, password, profilePic } = req.body || {}
        console.log(name, email, password)

        //validating input
        if(!name || !email || !password) {
            return res.status(400).json({ error: "All fields are mandatory" })
        }

        //checking whether user already exists or not
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(400).json({ message: "Already Existing User "})
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //new User
        const newUser = new User ({name, email, password: hashedPassword, profilePic})
        const savedUser = await newUser.save()
        const userData = savedUser.toObject();  //Convert Mongoose document to plain JS object
        delete userData.password    //not returning password [security]
        return res.status(201).json({ message: "Account Created Successfully", userData })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( {error: error.message || "Internal Server Error"})
    }
}

module.exports = {signup} 