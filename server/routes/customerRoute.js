const express = require('express')
const { signup } = require('../controllers/customerController')
const { login } = require('../controllers/userController')
const customerRouter = express.Router()

//directing to signup
customerRouter.post('/signup', signup)
//directing to login
customerRouter.post('/login', login)

module.exports = customerRouter