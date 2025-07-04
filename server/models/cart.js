const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        unique: true
    },
    products: [{
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
            }
        }],
})

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;