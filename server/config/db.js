const mongoose = require('mongoose');
require('dotenv').config();

connectDB().catch(err => console.log(err));

async function  connectDB() {
    try {
        console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL, {dbName: "SquareMart"});
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB