const express = require('express')
const { signup, viewProfile, checkAdmin, deleteUser } = require('../controllers/adminController')
const authAdmin = require('../middlewares/authAdmin')
const adminRouter = express.Router()

//directing to signup
adminRouter.post('/signup', signup)
//directing to view profile
adminRouter.get('/viewProfile', authAdmin, viewProfile)
//directing to deleteUser CAREFULL OPERATION
adminRouter.delete('/deleteUser/:id/:role', authAdmin, deleteUser)

module.exports = adminRouter