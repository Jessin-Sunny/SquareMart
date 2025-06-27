const express = require('express')
const { login } = require('../controllers/userController')
const adminRouter = express.Router()

//directing to login
sellerRouter.post('/login', login)

module.exports = adminRouter