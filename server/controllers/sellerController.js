const User = require('../models/user');
const Seller = require('../models/seller');
const Address = require('../models/address');
const bcrypt = require('bcrypt');
const createToken = require('../utils/generateToken');
const Product = require('../models/product');
const Review = require('../models/review');
const { averageProductRating } = require('./orderController');

//sign-up
const signup = async(req, res, next) => {
    let savedUser = null;
    let savedAddress = null;

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
        savedUser = await newUser.save()
        //const userData = savedUser.toObject();  //Convert Mongoose document to plain JS object
        //delete userData.password    //not returning password [security]

        //new Address
        const newAddress = new Address ({buildingNo, street, city, state, pincode, country})
        savedAddress = await newAddress.save();

        //new Customer
        const newSeller = new Seller ({userID: savedUser._id, addressIDs: [savedAddress._id], GSTIN})
        const savedSeller = await newSeller.save();
        const sellerData = savedSeller.toObject();
        return res.status(201).json({ message: "Account Created Successfully",sellerData })

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

//check seller - authentication for Seller
const checkSeller = async(req, res, next) => {
    try {
        const userID = req.user.id;

        //finding seller
        const seller = await Seller.findOne({userID});
        if(!seller) {
            return res.status(403).json({ message: "Access denied. Seller account required." });
        }
        req.sellerID = seller._id;
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
        const userData = await User.findById(userID).select('-password');
        if(!userData) {
            return res.status(400).json({ message: "User Not Found" });
        }
        //fetching seller info
        const sellerData = await Seller.findOne({ userID: userID }).populate('addressIDs');
        if(!sellerData) {
            return res.status(400).json({ message : "User Not Found" });
        }

        //return both seller and user info

        return res.status(200).json({
             message: "Seller Profile fetched Successfully",
            profile: {
                userData,
                sellerData
            }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//listing products
const listProduct = async (req, res, next) => {
    try {
        //inputting values from request
        const {title ,specification, description, price, discount, quantity, category, keywords, image, releaseDate} = req.body || {}
        if(!title || !specification || !price  || !category) {
            return res.status(400).json({ error: "All fields are mandatory" })
        }
        //checking status
        let status;
        if (quantity > 0) {
            status = 'In-Stock';
        } else {
            status = 'Out-of-Stock';
        }
        //writing to Product Schema
        const newProduct = new Product({title ,specification, description, price, discount, quantity, category, keywords, image, status, releaseDate:  releaseDate || null, sellerID: req.sellerID});
        const savedProduct = await newProduct.save();
        const productData = savedProduct.toObject();
        return res.status(201).json({message: "Product Added Successfully",productData})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//deleting Product - with product ID through front end
const deleteProduct = async (req, res) => {
    try {
        const productID = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productID);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//updating Product through front end
const updateProduct = async (req, res) => {
    try {
        const productID = req.params.id;
        const updates = req.body; // can include any fields: quantity, title, etc.

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No update fields provided" });
        }

        // Auto-update status based on quantity (if quantity is part of update)
        if ('quantity' in updates) {
            const qty = updates.quantity;
            updates.status = (qty === 0) ? 'Out-of-Stock' : 'In-Stock';
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productID,
            { $set: updates },
            { new: true }   //return updatedProduct
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//view product details
const viewProducts = async(req, res) => {
    try {
        //getting sellerID
        const sellerID = req.sellerID;

        //finding details of all products of seller
        const productData = await Product.find({sellerID: sellerID});
        if(productData.length == 0) {
            return res.status(404).json({ message : "No Products Found" });
        }

        // Attach ratings
        const productsWithRatings = await Promise.all(
            productData.map(async (product) => {
                const rating = await averageProductRating(product._id);
                return {
                    ...product.toObject(),
                    averageRating: rating.averageRating,
                    totalReviews: rating.totalReviews
                };
            })
        );

        return res.status(200).json({
            message: "Products fetched successfully",
            products: productsWithRatings
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {signup, checkSeller, viewProfile, listProduct, deleteProduct, updateProduct, viewProducts} 