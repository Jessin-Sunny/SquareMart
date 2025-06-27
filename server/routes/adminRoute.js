const express = require('express')
const { signup } = require('../controllers/adminController')
const { login } = require('../controllers/userController')
const adminRouter = express.Router()

//directing to login
adminRouter.post('/login', login)
//directing to signup
adminRouter.post('/signup', signup)

module.exports = adminRouter