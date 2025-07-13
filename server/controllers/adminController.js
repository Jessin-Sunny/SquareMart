const Address = require('../models/address');
const Customer = require('../models/customer');
const Order = require('../models/order');
const Review = require('../models/review');
const Seller = require('../models/seller');
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

//viewing Profile
const viewProfile = async(req, res, next) => {
    try {
        //fetching data with user id from request
        const userID = req.user.id;
        console.log(userID)
        const userData = await User.findById(userID).select('-password');
        if(!userData) {
            return res.status(400).json({ message: "User Not Found" });
        }
        return res.status(200).json({
             message: "Admin Profile fetched Successfully",
            profile: {
                userData
            }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//CAREFULL OPERATION
//Should be used only on incorrect data
//May cause reference issues
const deleteUser = async(req, res) => {
    try {
        //getting id and role
        const { id, role } = req.params

        //proceed to delete if it is customer
        if (role === "Customer") {
            const customer = await Customer.findById(id);
            if (!customer) return res.status(404).json({ message: "Customer not found" });
            const userID = customer.userID;
            const addressID = customer.addressID;

            //delete cart
            await Cart.deleteOne({ customer: id });

            //delete address linked to customer
            if (addressID) {
                await Address.findByIdAndDelete(addressID);
            }

            const customerOrders = await Order.find({ customerID: id }, '_id');
            const orderIDs = customerOrders.map(order => order._id);

            // Delete related payments using those orderIDs
            if (orderIDs.length > 0) {
                await Payment.deleteMany({ orderID: { $in: orderIDs } });
            }

            //delete all orders
            await Order.deleteMany({ customerID: id });

            //delete all reviews linked with customer
            await Review.deleteMany({customerID: id});

            //delete customer data
            await Customer.findByIdAndDelete(id);

            //delete user data
            await User.findByIdAndDelete(userID);

            return res.status(200).json({ message: "Customer and related data deleted successfully" });
        }
        // proceed to delete if it is seller
        //CAREFULL!!
        //High chance of reference issues
        else if (role === "Seller") {
            const seller = await Seller.findById(id);
            if (!seller) return res.status(404).json({ message: "Seller not found" });

            const userID = seller.userID;
            const addressIDs = seller.addressIDs || [];

            //Delete all addresses linked to seller
            if (addressIDs.length !== 0) {
                for (const addressID of addressIDs) {
                    await Address.findByIdAndDelete(addressID);
                }
            }

            //Get all product IDs of this seller
            const sellerProducts = await Product.find({ sellerID: id }, '_id');
            const productIDs = sellerProducts.map(p => p._id);

            //Delete orders containing these products
            if (productIDs.length > 0) {
                const orders = await Order.find({ 'products.productID': { $in: productIDs } }, '_id');
                const orderIDs = orders.map(order => order._id);

                // Delete those orders
                await Order.deleteMany({ _id: { $in: orderIDs } });

                // Delete related payments
                if (orderIDs.length > 0) {
                    await Payment.deleteMany({ orderID: { $in: orderIDs } });
                }

                //Delete related reviews
                await Review.deleteMany({ productID: { $in: productIDs } });

                // Delete related products from carts
                await Cart.updateMany(
                    {},
                    { $pull: { products: { productID: { $in: productIDs } } } }
                );
            }

            // Delete all products of seller
            await Product.deleteMany({ sellerID: id });

            // Delete seller and user data
            await Seller.findByIdAndDelete(id);
            await User.findByIdAndDelete(userID);

            return res.status(200).json({ message: "Seller and related data deleted successfully" });
        }
        //proceed to delete if it is admin
        else if(role == "Admin") {
            //delete User data
            await Admin.findByIdAndDelete(id);
            return res.status(200).json({ message: " Admin data deleted successfully" });
        }
        // Invalid role
        else {
            return res.status(400).json({ message: "Invalid role provided" });
        }
    } catch (error) {
        console.error("Error deleting", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {signup, checkAdmin, viewProfile, deleteUser} 