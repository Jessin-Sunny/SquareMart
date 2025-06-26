const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    addressIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }],
    GSTIN: {
        type: String,
        unique: true,
        required: true,
        match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    }
}, { timestamps: true });

//for making sure atleast one address is present for seller
sellerSchema.path('addressIDs').validate(function (value) {
  return Array.isArray(value) && value.length > 0;
}, 'At least one address is required.')

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;