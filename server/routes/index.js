const express = require('express')
const router = express.Router()
const customerRouter = require('./customerRoute')
const sellerRouter = require('./sellerRoute')
const adminRouter = require('./adminRoute')
const userRouter = require('./userRouter')

//directing to user[login, logout]
router.use('/user', userRouter)
//directing to customer
router.use('/customer', customerRouter)
//directing to seller
router.use('/seller', sellerRouter)
//directing to admin
router.use('/admin', adminRouter)

module.exports = router