const express = require('express')
const router = express.Router()
const customerRouter = require('./customerRoute')

//directing to customer
router.use('/customer', customerRouter)

module.exports = router