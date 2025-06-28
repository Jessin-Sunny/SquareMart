const express = require('express')
const { signup } = require('../controllers/customerController')
const { login, logout } = require('../controllers/userController')
const customerRouter = express.Router()

//directing to signup
customerRouter.post('/signup', signup)

module.exports = customerRouter