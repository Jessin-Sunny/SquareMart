const express = require('express')
const { signup } = require('../controllers/sellerController')
const { login } = require('../controllers/userController')
const sellerRouter = express.Router()

//directing to signup
sellerRouter.post('/signup', signup)
//directing to login
sellerRouter.post('/login', login)

module.exports = sellerRouter