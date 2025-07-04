const Cart = require('../models/cart');
const Product = require('../models/product');

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

module.exports = { addToCart };