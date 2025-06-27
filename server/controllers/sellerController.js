const User = require('../models/user');
const Seller = require('../models/seller');
const Address = require('../models/address')
const bcrypt = require('bcrypt');
const createToken = require('../utils/generateToken');

//sign-up
const signup = async(req, res, next) => {
    try {
        const { name, email, phoneno,  profilePic, password, buildingNo, street, city, state, pincode, country, GSTIN } = req.body || {}
        console.log(name, email)

        //validating input
        if(!name || !email || !password || !phoneno) {
            return res.status(400).json({ error: "All fields are mandatory" })
        }

        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstinRegex.test(req.body.GSTIN)) {
            return res.status(400).json({ error: 'Invalid GSTIN format' });
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
        const newUser = new User ({name, email, phoneno, profilePic, password: hashedPassword, role: 'Seller'})
        const savedUser = await newUser.save()
        //const userData = savedUser.toObject();  //Convert Mongoose document to plain JS object
        //delete userData.password    //not returning password [security]

        //new Address
        const newAddress = new Address ({buildingNo, street, city, state, pincode, country})
        const savedAddress = await newAddress.save();

        //new Customer
        const newSeller = new Seller ({userID: savedUser._id, addressIDs: [savedAddress._id], GSTIN})
        const savedSeller = await newSeller.save();
        const sellerData = savedSeller.toObject();
        return res.status(201).json({ message: "Account Created Successfully",sellerData })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( {error: error.message || "Internal Server Error"})
    }
}

module.exports = {signup} 