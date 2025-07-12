const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    specification: {
        type: Map,
        of: String,
        required: true
    },
    description: {
        type: [String],
        required: true
    },
    price: { type: Number, required: true },            //actual price without discount [selling price]
    costPrice: { type: Number },
    discount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    keywords: {
        type: [String],
        required: false
    },
    image: { type: [String], required: true },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            required: true,
    },
    releaseDate: {
        type: Date,
        default: null
    },
    updatedDate: {
        type: Date, default: Date.now
    },
    status : {
        type: String,
        required: true,
        enum: ['In-Stock', 'Out-of-Stock']
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product