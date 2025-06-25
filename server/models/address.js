const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  houseNo: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  country: String
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;