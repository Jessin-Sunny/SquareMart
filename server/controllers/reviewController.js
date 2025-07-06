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
    try {
        const customerID = req.customerID
        const productID = req.params.id

        const reviewData = await Review.findOne({productID, customerID})
        if(!reviewData) {
            return res.status(400).json({ message: "Review doesn't exists"})
        }

        const removedReview = await Review.findByIdAndDelete(reviewData._id)
        if (!removedReview) {
            return res.status(500).json({ message: "Failed to remove review" });
        }
        return res.status(200).json({ message: "Review removed successfully", removedReview });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error"})
    }
}

//edit a review for a particular product[delivered in order] by a particular customer
const editReview = async(req, res) => {
    try {
        const customerID = req.customerID
        const productID = req.params.id
        const { title, image, comment, rating} = req.body
        // Check if nothing to update
        if (title === undefined && image === undefined && comment === undefined && rating === undefined) {
            return res.status(400).json({ message: "No fields provided to update" });
        }
        
        const reviewData = await Review.findOne({productID, customerID})
        if(!reviewData) {
            return res.status(400).json({ message: "Review doesn't exists, try to add a review"})
        }

        // Build updates dynamically
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (image !== undefined) updates.image = image;
        if (comment !== undefined) updates.comment = comment;
        if (rating !== undefined) updates.rating = rating;

        const updatedReview = await Review.findByIdAndUpdate(
            reviewData._id,
            { $set: updates },
            { new: true }
        );

        return res.status(200).json({ message: "Review updated successfully", updatedReview });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { addReview, editReview, removeReview }