const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    },
    customerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
    },
    image : { type : [String], required: false},
    rating: { type: Number, required: true, min: 1.0, max: 5.0 },
    title: { type: String, required: true },
    comment: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

//one review for customer for each product
reviewSchema.index({ productID: 1, customerID: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;