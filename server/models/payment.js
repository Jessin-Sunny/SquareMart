const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    transactionID: { type: String, unique: true },
    modeofPayment: {
        type: String,
        required: true,
        enum: ['UPI', 'Net Banking', 'Debit/Credit Card','Cash on Delivery']
    },
    status: {
        type: String,
        required: true,
        enum: ['Paid', 'Not Paid', 'Failed', 'Refunded'],
    },
    amount: {
        type: Number,
        required: true
    },
    paymentAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;