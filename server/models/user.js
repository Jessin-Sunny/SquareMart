const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
    phoneno: { type: String, required: true },
    profilePic: { type: String},
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['Customer', 'Seller', 'Admin']
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;