const Cart = require('../models/cart');
const Product = require('../models/product');
const Seller = require('../models/seller');
const User = require('../models/user');

//adding products
const addToCart = async (req, res) => {
    try {
        const customerID = req.customerID;
        const productID = req.params.id;
        const {quantity} = req.body;
        if(!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Quantity is required"} );
        }

        //finding product
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        //finding whether customer already exists in cart schema
        let cartData = await Cart.findOne({ customerID });
        let existingProduct = null;
        let alreadyInCartQty = 0;
        //if exists, just add to product
        if (cartData) {
            existingProduct = cartData.products.find(
                item => item.productID.toString() === productID
            );
            alreadyInCartQty = existingProduct ? existingProduct.quantity : 0;
        }

        const totalRequested = alreadyInCartQty + quantity;
        if (product.quantity < totalRequested) {
            return res.status(400).json({
                message: `Only ${product.quantity} unit(s) available. You already have ${alreadyInCartQty} in cart, and you're trying to add ${quantity} more.`
            });
        }

        if (cartData) {
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cartData.products.push({ productID, quantity });
            }
        } else {
            cartData = new Cart({
                customerID,
                products: [{ productID, quantity }]
            });
        }

        //adding product to cart
        let savedCartProduct = await cartData.save();
        let returnData = savedCartProduct.toObject();
        return res.status(201).json({ message: "Product added to cart successfully", returnData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//view cart
const viewCart = async(req, res) => {
    try {
        const customerID = req.customerID

        //getting cart info with customerID
        const cartData = await Cart.findOne({ customerID })
         if (!cartData || !cartData.products || cartData.products.length === 0) {
            return res.status(200).json({ message: "Your Cart is Empty" });
        }

        //delivery time calculation -> order Controller
        //getting productID
        const returnData = [];
        for (const item of cartData.products) {
            const { productID, quantity } = item;

            // Fetch product details
            const product = await Product.findById(productID);
            if (!product) continue;
            const { image, title, price, discount, sellerID } = product;

            // Get seller name
            const seller = await Seller.findById(sellerID);
            let sellerName = "Unknown Seller";

            if (seller) {
                const user = await User.findById(seller.userID);
                if (user) sellerName = user.name;
            }

            // Calculate sell price
            const sellPrice = price - (price * discount) / 100;

            // Push required data
            returnData.push({
                firstImage: image[0],
                title,
                price,
                sellPrice,
                quantity,
                sellerName
            });

        }

        return res.status(200).json({
            message: "Cart Information Fetched Successfully",
            returnData
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

//remove cart
const removeCartProduct =  async(req, res) => {
    try {
        const productID = req.params.id
        const customerID = req.customerID
        if (!productID || !customerID) {
            return res.status(400).json({ message: "Product ID and Customer ID are required" });
        }
        //delete cart data with productID and customerID
        const updatedCart = await Cart.findOneAndUpdate(
            { customerID },
            { $pull: { products: { productID } } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ message: "Cart not found or product not present" });
        }

        //deleting cart if no products are available
        if (updatedCart.products.length === 0) {
            await Cart.deleteOne({ customerID });
            return res.status(200).json({
                message: "Product removed and cart is now empty. Cart deleted.",
                updatedCart: null
            });
        }

        return res.status(200).json({
            message: "Product removed from cart successfully",
            updatedCart
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

//increment quantity
const incQuantity = async(req, res) => {
    try {
        const customerID = req.customerID
        const productID = req.params.id
        if (!productID || !customerID) {
            return res.status(400).json({ message: "Product ID and Customer ID are required" });
        }

        //find product of customer from cart
        let reqQuantity;
        const cartData = await Cart.findOne({ customerID });
        if (!cartData) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const cartProduct = cartData.products.find(
            item => item.productID.toString() === productID
        );
        if (!cartProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        reqQuantity = cartProduct.quantity + 1; //increment

        //retrieving available quantity from product
        const product = await Product.findById(productID)
        const availQuantity = product.quantity

        //checking if stock is available for requested quantity
        if(reqQuantity > availQuantity) {
            return res.status(404).json({ message: `Only ${availQuantity} units are available cuurently and you are requesting ${reqQuantity} units`})
        }

        //updating quantity
        cartProduct.quantity = reqQuantity;
        const savedData = await cartData.save()
        const returnData = savedData.toObject()

        return res.status(200).json({ message: "Quantity incremented Successfully", returnData})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

//decrement quantity
const decQuantity = async(req, res) => {
    try {
        const customerID = req.customerID
        const productID = req.params.id
        if (!productID || !customerID) {
            return res.status(400).json({ message: "Product ID and Customer ID are required" });
        }

        //find product of customer from cart
        const cartData = await Cart.findOne({ customerID });
        if (!cartData) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const cartProduct = cartData.products.find(
            item => item.productID.toString() === productID
        );
        if (!cartProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const reqQuantity = cartProduct.quantity - 1; //decrement

        if(reqQuantity < 1) {
            return res.status(400).json({ message: "Quantity cannot be less than one"})
        }

        //updating quantity
        cartProduct.quantity = reqQuantity;
        const savedData = await cartData.save()
        const returnData = savedData.toObject()

        return res.status(200).json({ message: "Quantity decremented Successfully", returnData})

        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { addToCart, viewCart, removeCartProduct, incQuantity, decQuantity };