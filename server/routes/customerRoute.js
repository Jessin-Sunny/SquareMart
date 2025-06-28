const express = require('express')
const { signup, viewProfile } = require('../controllers/customerController')
const authCustomer = require('../middlewares/authCustomer')
const customerRouter = express.Router()

//directing to signup
customerRouter.post('/signup', signup)
//directing to viewprofile
customerRouter.get('/viewProfile', authCustomer, viewProfile)

module.exports = customerRouter