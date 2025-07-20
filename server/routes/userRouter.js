const express = require('express')
const { login, logout, checkUser, topDeals } = require('../controllers/userController')
const authUser = require('../middlewares/authUser')
const authAdmin = require('../middlewares/authAdmin')
const authSeller = require('../middlewares/authSeller')
const authCustomer = require('../middlewares/authCustomer')
const userRouter = express.Router()

//directing to login
userRouter.post('/login', login)
//directing to logout
userRouter.post('/logout', logout)
//checking if authorized user
userRouter.get('/check-user', authUser, checkUser)
//checking if authorized admin
userRouter.get('/check-user/admin', authAdmin, checkUser)
//checking if authorized seller
userRouter.get('/check-user/seller', authSeller, checkUser)
//checking if authorized customer
userRouter.get('/check-user/customer', authCustomer, checkUser)
//fetch top 5 deals
userRouter.get('/topDeals', topDeals)

module.exports = userRouter