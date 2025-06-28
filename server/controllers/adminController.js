const User = require('../models/user');
const bcrypt = require('bcrypt');

//sign-up
const signup = async(req, res, next) => {
    try {
        const { name, email, phoneno,  profilePic, password } = req.body || {}
        console.log(name, email)

        //validating input
        if(!name || !email || !password || !phoneno) {
            return res.status(400).json({ error: "All fields are mandatory" })
        }

        //checking whether user already exists or not
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(400).json({ message: "Already Existing User "})
        }

        // Strong password validation
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{5,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 5 characters long and include letters, numbers, and special characters."
            });
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //new User
        const newUser = new User ({name, email, phoneno, profilePic, password: hashedPassword, role: 'Admin'})
        const savedUser = await newUser.save()
        const userData = savedUser.toObject();  //Convert Mongoose document to plain JS object
        delete userData.password    //not returning password [security]
        return res.status(201).json({ message: "Account Created Successfully",userData })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( {error: error.message || "Internal Server Error"})
    }
}

//check admin - authentication for Admin
const checkAdmin = async(req, res, next) => {
    try {
        res.json({message: "Authorized Admin", loggedinUser: req.user.id})
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || "Internal Server Error"})
    }
}


module.exports = {signup, checkAdmin} 