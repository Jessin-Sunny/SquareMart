const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneno: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    dateOfCreation: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;