const express = require('express')
const router = express.Router()
const customerRouter = require('./customerRoute')
const sellerRouter = require('./sellerRoute')
const adminRouter = require('./adminRoute')

//directing to customer
router.use('/customer', customerRouter)
//directing to seller
router.use('/seller', sellerRouter)
//directing to admin
router.use('/admin', adminRouter)

module.exports = router