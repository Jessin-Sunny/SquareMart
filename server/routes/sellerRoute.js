const express = require('express')
const { signup } = require('../controllers/sellerController')
const sellerRouter = express.Router()

//directing to signup
sellerRouter.post('/signup', signup)

module.exports = sellerRouter