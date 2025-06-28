const express = require('express')
const { signup, viewProfile } = require('../controllers/sellerController')
const authSeller = require('../middlewares/authSeller')
const sellerRouter = express.Router()

//directing to signup
sellerRouter.post('/signup', signup)
sellerRouter.get('/viewprofile', authSeller ,viewProfile)

module.exports = sellerRouter