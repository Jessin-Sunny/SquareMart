const express = require('express')
const { signup, viewProfile, listProduct, checkSeller, deleteProduct, updateProduct, viewProducts, orderHistory } = require('../controllers/sellerController')
const authSeller = require('../middlewares/authSeller')
const sellerRouter = express.Router()
//directing to signup
sellerRouter.post('/signup', signup)
//viewprofile
sellerRouter.get('/viewprofile', authSeller ,viewProfile)
//listProduct
sellerRouter.post('/listProduct', authSeller , checkSeller, listProduct)
//deleteProduct
sellerRouter.delete("/deleteProduct/:id", authSeller, checkSeller, deleteProduct);
//updateProduct
sellerRouter.patch('/updateProduct/:id', authSeller, checkSeller, updateProduct);
//viewProducts
sellerRouter.get('/viewProducts', authSeller, checkSeller, viewProducts);
//orderHistory
sellerRouter.get('/orderHistory', authSeller, checkSeller, orderHistory);
module.exports = sellerRouter