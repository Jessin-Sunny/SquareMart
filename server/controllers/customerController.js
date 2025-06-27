const User = require('../models/user');
const Customer = require('../models/customer');
const Address = require('../models/address')
const bcrypt = require('bcrypt');

//sign-up
const signup = async(req, res, next) => {
    try {
        const { name, email, phoneno,  profilePic, password, gender, buildingNo, street, city, state, pincode, country } = req.body || {}
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

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //new User
        const newUser = new User ({name, email, phoneno, profilePic, password: hashedPassword, role: 'Customer'})
        const savedUser = await newUser.save()
        //const userData = savedUser.toObject();  //Convert Mongoose document to plain JS object
        //delete userData.password    //not returning password [security]

        //new Address
        const newAddress = new Address ({buildingNo, street, city, state, pincode, country})
        const savedAddress = await newAddress.save();

        //new Customer
        const newCustomer = new Customer ({userID: savedUser._id, gender, addressID: savedAddress._id})
        const savedCustomer = await newCustomer.save();
        const customerData = savedCustomer.toObject();
        return res.status(201).json({ message: "Account Created Successfully",customerData })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( {error: error.message || "Internal Server Error"})
    }
}

module.exports = {signup} 