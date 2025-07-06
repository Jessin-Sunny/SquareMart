const User = require('../models/user');
const Customer = require('../models/customer');
const Address = require('../models/address');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const Review = require('../models/review');
const { averageProductRating, countBroughts, estimatedDelivery } = require('./orderController');

//sign-up
const signup = async(req, res, next) => {
    let savedUser = null;
    let savedAddress = null;

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
        savedUser = await newUser.save()
        //const userData = savedUser.toObject();  //Convert Mongoose document to plain JS object
        //delete userData.password    //not returning password [security]

        //new Address
        const newAddress = new Address ({buildingNo, street, city, state, pincode, country})
        savedAddress = await newAddress.save();

        //new Customer
        const newCustomer = new Customer ({userID: savedUser._id, gender, addressID: savedAddress._id})
        const savedCustomer = await newCustomer.save();
        const customerData = savedCustomer.toObject();
        return res.status(201).json({ message: "Account Created Successfully",customerData })

    } catch (error) {
        //roll-back
        if(savedUser) {
            await User.findByIdAndDelete(savedUser._id)
        }
        if(savedAddress) {
            await Address.findByIdAndDelete(savedAddress._id)
        }
        console.log(error);
        res.status(error.status || 500).json( {error: error.message || "Internal Server Error"})
    }
}
//check customer - authentication for Customer
const checkCustomer = async(req, res, next) => {
    try {
        const userID = req.user.id;

        //finding customer
        const customer = await Customer.findOne({userID});
        if(!customer) {
            return res.status(403).json({ message: "Access denied. customer account required." });
        }
        req.customerID = customer._id;
        next();
    } catch (error) {
        res.status(error.status || 500).json({error: error.message || "Internal Server Error"})
    }
}

//viewing Profile
const viewProfile = async(req, res, next) => {
    try {
        //fetching data with user id from request
        const userID = req.user.id;
        console.log(userID)
        //field projection
        const userData = await User.findById(userID).select('-password');
        if(!userData) {
            return res.status(400).json({ message: "User Not Found" });
        }
        //fetching customer info
        const customerData = await Customer.findOne({ userID: userID }).populate('addressID');
        if(!customerData) {
            return res.status(400).json({ message : "User Not Found" });
        }

        //return both customer and user info

        return res.status(200).json({
             message: "Customer Profile fetched Successfully",
            profile: {
                userData,
                customerData
            }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//product page display
const productPage = async(req, res) => {
    //productID as input
    //product details + reviews + order
    //reviews - details + no. of reviews + avg rating + images
    //order - estimated delivery + no. of broughts [delivered]
    try {
        const productID = req.params.id
        const productData = await Product.findById(productID);
        if(!productData) {
            return res.status(404).json({ message: "Product not found"})
        }

        //fetch all reviews
        const reviews = await Review.find({ productID })
        .populate({
            path: 'customerID',
            populate: {
            path: 'userID',
            select: 'name profilePic'
            }
        });
        const totalReviews = reviews.length
        const avgRating = await averageProductRating(productID)
        const broughtCount = await countBroughts(productID)
        const eDelivery =  estimatedDelivery('Kerala')

        //combine product, review and order
        const result = {
            "product": productData,
            "reviews": {reviews, totalReviews, avgRating},
            "order": {eDelivery, broughtCount}     //future
        }

        return res.status(200).json({ message: "Product, Review, Order fetched successfully", result})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {signup, checkCustomer, viewProfile, productPage} 