const express = require('express')
const { signup, viewProfile, checkCustomer, productPage } = require('../controllers/customerController')
const authCustomer = require('../middlewares/authCustomer')
const { addToCart, viewCart, removeCartProduct, incQuantity, decQuantity } = require('../controllers/cartController')
const { placeOrder } = require('../controllers/orderController')
const { addReview } = require('../controllers/reviewController')
const customerRouter = express.Router()

//directing to signup
customerRouter.post('/signup', signup)
//directing to viewprofile
customerRouter.get('/viewProfile', authCustomer, viewProfile)
//add to cart
customerRouter.post('/addToCart/:id', authCustomer, checkCustomer, addToCart)
//view cart
customerRouter.get('/viewCart', authCustomer, checkCustomer, viewCart)
//remove product from cart
customerRouter.patch('/removeCartProduct/:id', authCustomer, checkCustomer, removeCartProduct)
//increment quantity of product from cart
customerRouter.patch('/incrementCartProduct/:id', authCustomer, checkCustomer, incQuantity)
//decrement quantity of product from cart
customerRouter.patch('/decrementCartProduct/:id', authCustomer, checkCustomer, decQuantity)
//product page
customerRouter.get('/productInfo/:id',productPage)
//placing an order
customerRouter.post('/placeOrder', authCustomer, checkCustomer, placeOrder)
//adding a review for ordered product
customerRouter.post('/addReview/:id', authCustomer, checkCustomer, addReview)
module.exports = customerRouter