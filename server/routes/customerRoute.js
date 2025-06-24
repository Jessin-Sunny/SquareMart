const express = require('express')
const { register } = require('../controllers/customerController')
const customerRouter = express.Router()

//directing to register
customerRouter.post('/register', register)

module.exports = customerRouter