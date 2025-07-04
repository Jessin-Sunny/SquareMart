const express = require('express')
const { signup, viewProfile, checkCustomer } = require('../controllers/customerController')
const authCustomer = require('../middlewares/authCustomer')
const { addToCart } = require('../controllers/cartController')
const customerRouter = express.Router()

//directing to signup
customerRouter.post('/signup', signup)
//directing to viewprofile
customerRouter.get('/viewProfile', authCustomer, viewProfile)
//add to cart
customerRouter.post('/addToCart/:id', authCustomer, checkCustomer, addToCart)
module.exports = customerRouter