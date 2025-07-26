import React, { useState, useEffect } from "react";
import { FaRegStar, FaTimesCircle, FaSpinner, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TopBar from "./topBar";
import ReactImageMagnify from 'react-image-magnify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductDetails = () => {
    const {id} = useParams();    //fetch from request
    const [product, setProduct] = useState(null);
    const [notFound, setNotFound] = useState(false);    //check if details are in database
    const isKeralaPincode = (pin) => /^[1-9][0-9]{5}$/.test(pin) && /^(67|68|69)/.test(pin);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    //fetching product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
            const res = await axios.get(`${API_BASE_URL}/customer/productInfo/${id}`);
            if (res.data?.result) {
                setProduct(res.data.result); // flattening structure for ease
            } else {
                setNotFound(true);
            }
            } catch (error) {
            if (error.response?.status === 404) {
                console.log(error)
                setNotFound(true);
            } else {
                toast.error("Error fetching product data...");
            }
            }
        };
        fetchProduct();
    }, [id]);

  const [pincode, setPincode] = useState("");
  const [pinValid, setPinValid] = useState(null);

  const checkPincode = () => {
    if(!pincode) {
      toast.error("Please enter a pincode")
    }
    else if (isKeralaPincode(pincode)) {
      setPinValid(true);
      toast.success("Delivery available in Kerala!");
    } else {
      setPinValid(false);
      toast.error("We currently only deliver in Kerala.");
    }
  };

  if (notFound)
  return (
      <div className="bg-white dark:bg-[#16141C] text-center text-red-600 dark:text-red-400 text-xl min-h-screen px-6 py-10 flex flex-col items-center justify-center gap-4">
      <FaTimesCircle className="text-4xl" />
      Product Not Found
      </div>
  );

  if (!product)
  return (
      <div className="bg-white dark:bg-[#16141C] text-center text-gray-500 dark:text-gray-400 min-h-screen px-6 py-10 flex flex-col items-center justify-center gap-4">
      <FaSpinner className="animate-spin text-3xl" />
      Loading product details...
      </div>
  );

  
  const totalImages = product.product.image.length;

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <TopBar />
      <main className="bg-white dark:bg-[#16141C] text-black dark:text-white min-h-screen px-6 py-10">
        <div className="container mx-auto flex gap-10 items-stretch">


          {/* LEFT COLUMN - Images & Reviews */}
          <section className="w-1/2">
          {/* Image Carousel */}
          <div className="relative flex items-center justify-center">
            <div className="w-250">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: product.product.title,
                    isFluidWidth: true,
                    src: product.product.image[currentImageIndex],
                  },
                  largeImage: {
                    src: product.product.image[currentImageIndex],
                    width: 1000,
                    height: 1000
                  },
                  isHintEnabled: true,
                  shouldUsePositiveSpaceLens: true,
                  enlargedImagePosition: 'over'
                }}
              />
            </div>

            {/* Left Arrow */}
            <button
              onClick={prevImage}
              className="absolute left-0 text-xl p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <FaArrowLeft />
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextImage}
              className="absolute right-0 text-xl p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Image Dots */}
          <div className="flex justify-center mt-2 space-x-1">
            {product.product.image.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full cursor-pointer ${
                  i === currentImageIndex
                    ? "bg-black dark:bg-white"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => setCurrentImageIndex(i)}
              />
            ))}
          </div>


            {/* horizontal line */}
          <div className="mt-5 h-px bg-gray-300 dark:bg-gray-600" />

            {/* Review Summary */}
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-semibold">Ratings and Reviews</h3>
              <div className="flex justify-center space-x-4 text-l text-gray-600 dark:text-gray-400 mt-2 ">
                <span className="text-yellow-500 font-bold">{product.reviews.avgRating.averageRating} ★</span>
                <span>{product.reviews.totalReviews} Ratings</span>
                <span>{product.order.broughtCount.totalCount} Bought</span>
              </div>

              {/* Rate the Product */}
              <div className="flex mt-4 justify-center gap-3">
                <p>Rate this Product</p>
                {[1, 2, 3, 4, 5].map(i => (
                  <FaRegStar key={i} className="text-gray-400 dark:text-gray-500 text-2xl" />
                ))}
              </div>
              {/* Reviews Section */}
              <div className="mt-8">

                {product.reviews.reviews.length > 0 ? (
                  <ul className="space-y-4">
                    {product.reviews.reviews.map((review, index) => (
                      <li
                        key={index}
                        className="p-4 border rounded-md shadow-sm bg-gray-100 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-black dark:text-white">
                            {review.userName || "Anonymous"}
                          </span>
                          <span className="text-yellow-500">⭐ {review.rating}/5</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">No reviews yet</p>
                )}
              </div>
            </div>
          </section>

          {/* vertical line */}
          <div className="w-px bg-gray-300 dark:bg-gray-600" />
          
          {/* RIGHT COLUMN - Product Info */}
          <section className="w-1/2">
            <h2 className="text-3xl font-bold ">{product.product.title}</h2>

            <div className="flex items-baseline gap-5 mt-2">
              <div className="mt-4 text-3xl  font-bold">
                ₹{product.product.costPrice?.toLocaleString()}
              </div>
              <div className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                ₹{product.product.price?.toLocaleString()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex mt-4 gap-10 text-lg">
              <button className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-4xl font-semibold cursor-pointer">
                Add to Cart
              </button>
              <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-4xl font-semibold cursor-pointer">
                Buy Now
              </button>
            </div>

            {/* Delivery */}
            <div className="mt-6">
              <p className="text-l font-bold">Delivery</p>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="border px-2 py-1 text-l w-32 bg-white dark:bg-[#1f1d2a] dark:border-gray-700"
                />
                <button
                  onClick={checkPincode}
                  className="text-blue-600 dark:text-blue-400 text-l underline cursor-pointer"
                >
                  Check
                </button>
              </div>

              {!pincode && (
                <p className="text-red-500 text-lg mt-1">Please enter a pincode</p>
              )} 

              {pinValid === false && pincode &&(
                <p className="text-red-500 text-lg mt-1">Delivery is only available in Kerala</p>
              )}
              {pinValid === true && (
                <p className="text-green-600 dark:text-green-400 text-lg mt-1"> Delivery by <strong>{product.order.eDelivery}</strong></p>
              )}
            </div>

            {/* Seller & Payment Options */}
            <div className="mt-4 text-lg">
              <p><strong>Seller:</strong> {product.product.sellerID.userID.name || "Unknown"}</p>
              <p className="mt-2"><strong>Payment Options</strong></p>
              <ul className="list-disc list-inside ">
                  <li>Cash on Delivery</li>
                  <li>Net Banking</li>
                  <li>Credit/ Debit/ ATM Card</li>
              </ul>
            </div>

            {/* Specifications */}
            <div className="mt-4 text-lg">
              <p className="font-bold">Specification</p>
              {product.product.specification && Object.keys(product.product.specification).length > 0 ? (
                <ul className="list-disc list-inside font-normal">
                  {Object.entries(product.product.specification).map(([key, value], i) => (
                    <li key={i}>
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-normal">Not Available</p>
              )}
            </div>

            {/* Description */}
            <div className="mt-4 text-lg">
              <p className="font-bold">Description</p>
              {Array.isArray(product.product.description) && product.product.description.length > 0 ? (
                <ul className="list-disc list-inside font-normal">
                  {product.product.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              ) : (
                <p className="font-normal">Not Available</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default ProductDetails