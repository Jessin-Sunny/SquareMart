const Order = require('../models/order');
const Review = require('../models/review');

//add a review for a particular product[delivered in order] by a particular customer
const addReview = async(req, res) => {
    try {
        const { image, rating, title, comment} = req.body;
        const productID = req.params.id
        const customerID = req.customerID
        if(!productID || !customerID || !rating || !title) {
            return res.status(400).json({ message: "All mandatory fields are not filled" })
        }

        //check if ordered and delivered
        const deliveredOrder = await Order.find({
            customerID,
            status: "Delivered",
            'products.productID': productID
        });
        //console.log(deliveredOrder)
        if (!deliveredOrder) {
            return res.status(403).json({ message: "Review can only be submitted for delivered products" });
        }

        //writing to Review schema
        const reviewData = await Review.findOne({ customerID, productID })
        if(reviewData) {
            return res.status(400).json({ message: "Review exists already, try to edit the review"})
        }

        const newReview = new Review({
            productID,
            customerID,
            image,
            rating,
            title,
            comment
        })
        const savedData = await newReview.save()
        const returnData = savedData.toObject()

        return res.status(201).json({ message: "Review added successfully", returnData})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error"})
    }
    
}

//remove a review for a particular product[delivered in order] by a particular customer
const removeReview = async(req, res) => {

}

//edit a review for a particular product[delivered in order] by a particular customer
const editReview = async(req, res) => {

}

module.exports = { addReview }