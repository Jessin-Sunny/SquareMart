const mongoose =  require('mongoose');

const adminSchema =  new mongoose.Schema({
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
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;