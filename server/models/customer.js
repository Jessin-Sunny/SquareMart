const mongoose =  require('mongoose');

const customerSchema =  new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    gender: { 
        type: String, 
        required: false, 
        enum: ['Male', 'Female', 'Other']
    },
    addressID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;