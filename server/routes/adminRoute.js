const express = require('express')
const { signup } = require('../controllers/adminController')
const { login, logout } = require('../controllers/userController')
const adminRouter = express.Router()

//directing to signup
adminRouter.post('/signup', signup)

module.exports = adminRouter