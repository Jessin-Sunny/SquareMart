const Order = require("../models/order");
const Product = require("../models/product");
const Review = require("../models/review");
const Seller = require("../models/seller")

//future
//for simplicity, if state is kerala -> within 2days
//else -> within 5 days
const estimatedDelivery = (state) => {
    const today = new Date();
    const daysToAdd = state === 'Kerala' ? 2 : 5;

    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);

    return deliveryDate.toDateString();
};

//average rating calculator and total reviews by productID
const averageProductRating = async (productID) => {
    try {
        //find all ratings of the given productID
        const reviewData = await Review.find({ productID: productID });
        if (reviewData.length === 0) {
            return {
                message: "No reviews yet",
                averageRating: 0,
                totalReviews: 0
            };
        }
        // Calculate average rating
        const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviewData.length;
        return {
            message: "Reviews fetched successfully",
            averageRating: averageRating.toFixed(1), // round to 1 decimal place
            totalReviews: reviewData.length,
            reviews: reviewData
        };
    }
    catch(error) {
        console.error("Error in averageProductRating:", error);
        return {
            message: "Error fetching reviews",
            averageRating: 0,
            totalReviews: 0
        };
    }
}

//count of broughts of a particular product
const countBroughts = async (productID) => {
    try {
        // Find all orders where the product exists and is delivered
        const orders = await Order.find({
            status: 'Delivered',
            'products.productID': productID
        });

        // Sum up the quantity of this product from each order
        let totalCount = 0;
        //console.log(orders)
        for (const order of orders) {
            for (const item of order.products) {
                if (item.productID.toString() === productID.toString()) {
                    totalCount += item.quantity;
                }
            }
        }

        return {
            message: "Product brought count calculated successfully",
            totalCount
        };

    } catch (error) {
        console.error(error);
        return {
            message: "Error counting broughts",
            totalCount: 0
        };
    }
};

// calculate order details
//input ->  products: {productID, quantity}, state
//returns total items, total actual price, total discount amount, shipping charge[fixed], total amount to be paid
const orderDetails = async(products, state) =>{
    const shippingAddresses = [];
    try {
        //calculating shipping charge based on location
        //for kerala, Rs 30 and others Rs 60
        const shippingFee = state.toLowerCase() === 'kerala' ? 30 : 60

        //calculating total items, total actual price, total discount amount, total amount to be paid
        let totalItems = 0;
        let totalActualPrice = 0;
        let totalDiscount = 0;

        for (const item of products) {
            const { productID, quantity } = item
            console.log(item)
            const product = await Product.findById(productID)
            
            if(!product) {
                return res.status(404).json({ message: "Product not found"})
            };  //skip if product not found

            const { price, discount, sellerID} = product

            //finding seller addressID
            const seller = await Seller.findById(sellerID).populate('addressIDs');
            console.log(seller)
            const shippingAddress = seller?.addressIDs?.[0] || null;

            // store per-product shipping address
            shippingAddresses.push({
                productID,
                shippingAddress: shippingAddress || "Not Available"
            });
            
            totalItems += quantity
            totalActualPrice += price * quantity
            totalDiscount += (price * discount)/100 * quantity
        }

        const totalAmount = totalActualPrice - totalDiscount + shippingFee

        return {
            totalItems,
            totalActualPrice,
            totalDiscount: Math.round(totalDiscount),
            shippingFee,
            totalAmount: Math.round(totalAmount),
            shippingAddresses
        };

    } catch (error) {
        console.log("Error in calculating order details:", error);
        return {
            totalItems: 0,
            totalActualPrice: 0,
            totalDiscount: 0,
            shippingFee: 0,
            totalAmount: 0,
            shippingAddresses,
            error: "Failed to calculate order details"
        };
    } 
}

//place an order
const placeOrder = async(req, res) => {
    let deductedProducts = [];  // To rollback stock if needed
    let savedOrder = null
    try {
        //decoding all details from request
        // products: {productIDs, quantity}
        const {products, state, deliveryAddressID, paymentID} = req.body
        const customerID = req.customerID
        if (!products || !state || !customerID || !deliveryAddressID) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        //console.log(products)
        const { totalItems, totalActualPrice, totalDiscount, shippingFee, totalAmount, shippingAddresses} = await orderDetails(products, state)

        //format product details for order
        const formattedProducts = [];

        for (const item of products) {
            const { productID, quantity} = item;
            //console.log(item)

            const product = await Product.findById(productID);
            if(!product) continue;

            //checking stock availability
            if (product.quantity < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${product.title}. Only ${product.quantity} left.`,
                });
            }

            // Deduct stock
            product.quantity -= quantity;
            await product.save();

            // Track for rollback
            deductedProducts.push({ productID, quantity });

            const { price, discount, costPrice } = product;
            const { profit, gst, platformFee } = calculateProfit(price, costPrice, discount)
            // Find matching shipping address for this product
            const matched = shippingAddresses.find(
            p => p.productID.toString() === productID.toString()
            );
            const shippingAddressID = typeof matched?.shippingAddress === 'object' ? matched.shippingAddress?._id : null;

            formattedProducts.push({
                productID,
                quantity,
                price,
                discount,
                profit,
                gst,
                platformFee,
                shippingAddressID
            });
        }

        //writing order
        const newOrder =  new Order({
            products: formattedProducts,
            customerID,
            deliveryAddressID,
            otherFees: shippingFee,
            orderAt: new Date(),
            status: 'Ordered',
            paymentID: paymentID
        })

        savedOrder = await newOrder.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder,
            summary: {
                totalItems,
                totalActualPrice,
                totalDiscount,
                shippingFee,
                totalAmount
            }
        });
        
    } catch (error) {
        // Manual rollback logic
        for (const { productID, quantity } of deductedProducts) {
            try {
                const product = await Product.findById(productID);
                if (product) {
                    product.quantity += quantity;
                    await product.save();
                }
            } catch (rollbackError) {
                console.error(`Rollback failed for product ${productID}:`, rollbackError);
            }
        }

        // Delete order if created
        if (savedOrder) {
            try {
                await Order.findByIdAndDelete(savedOrder._id);
            } catch (rollbackError) {
                console.error("Failed to delete partially saved order:", rollbackError);
            }
        }

        console.error("Error placing order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const calculateProfit = (sellingPrice, costPrice, discount) => {
    const gstPercentage = 18;
    const platformPercentage = 10;

    //calculating gst
    // Extract GST from selling price (SP is GST inclusive)
    const gst = sellingPrice * (gstPercentage / (100 + gstPercentage));
    //calculating platform fee
    const platformFee = (platformPercentage / 100) * sellingPrice;

    //calculating seller's profit
    const profit = sellingPrice - costPrice - discount - gst - platformFee;

    return {profit, gst, platformFee};
}

module.exports = { estimatedDelivery, averageProductRating, countBroughts, placeOrder, orderDetails }