const express = require('express')
const { signup, viewProfile } = require('../controllers/adminController')
const authAdmin = require('../middlewares/authAdmin')
const adminRouter = express.Router()

//directing to signup
adminRouter.post('/signup', signup)
//directing to view profile
adminRouter.get('/viewProfile', authAdmin, viewProfile)

module.exports = adminRouter