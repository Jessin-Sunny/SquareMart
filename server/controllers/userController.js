const User = require("../models/user")
const bcrypt = require("bcrypt")
const createToken = require("../utils/generateToken")
const Review = require("../models/review")
const Product = require("../models/product")

//login
const login = async(req, res, next) => {
    try {
        const { email,  password} = req.body || {}
        console.log(email, password)

        //validating input
        if(!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        //check if user exists
        const userExists = await User.findOne({email})
        if(!userExists) {
            return res.status(400).json({ message: "User doesn't exists"})
        }
        console.log(userExists)

        //compare password with hashed password in database
        const passwordMatch = await bcrypt.compare(password, userExists.password)
        console.log(passwordMatch, "passwordMatch");

        if(!passwordMatch) {
            return res.status(400).json({ error: "Invalid Password" })
        }

        //fetching the role of the user
        const role = userExists.role

       //delete password from userObject and returning userObject 
        const userObject = userExists.toObject()
        delete userObject.password
        //create token for login
        const token = createToken(userExists._id, role)

        //setting expiration time based on roles
        const age = (role === 'Admin') ? 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

        const node_env = process.env.NODE_ENV
        console.log(token)
        console.log(process.env.NODE_ENV)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PRODUCTION',
            sameSite: 'Strict',
            maxAge: age
        })
        return res.status(200).json({ message: "Login Successfull", userObject})

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( {error: error.message || "Internal Server Error"})
    }
}

//logout
const logout = async(req, res, next) =>{
    try {
        res.clearCookie("token")
        res.json({ message: "User logout successfull"})
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error"})
    }
}

//check user - authenticated User
const checkUser = async(req, res, next) => {
    try {
        res.json({message: "User Authorized", loggedinUser: req.user.id})
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || "Internal Server Error"})
    }
}

//top 5 deals
const topDeals = async(req, res, next) => {
    try {
        const topItems = await Product.find({status:'In-Stock'}).sort({discount: -1}).limit(5);
        const result = topItems.map(item => ({
            _id: item._id,
            title: item.title,
            price: item.price,
            costPrice: item.costPrice,
            discount: item.discount,
            image: item.image
        }));
        console.log(topItems)
        res.json({message: "Top Deals Fetched Successfully", result})
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || "Internal Server Error"})
    }
}

module.exports = { login, logout, checkUser, topDeals}