const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        }
    }],
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    otherFees: { type: Number, required: true },
    orderAt: { type: Date, required: true, default: Date.now },
    shippedAt: { type: Date, required: false },
    deliveredAt: { type: Date, required: false },
    status: { 
        type: String, 
        required: true, 
        enum: ['Ordered', 'Shipped', 'Out for delivery', 'Delivered', 'Canceled', 'Returned', 'Unable to Deliver']
    },
    deliveryAddressID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    shippingAddressID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;