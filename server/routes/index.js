const express = require('express')
const router = express.Router()
const customerRouter = require('./customerRoute')
const sellerRouter = require('./sellerRoute')

//directing to customer
router.use('/customer', customerRouter)
//directing to seller
router.use('/seller', sellerRouter)

module.exports = router