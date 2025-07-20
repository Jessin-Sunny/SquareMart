import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaCog,
  FaUserCircle,
  FaSearch,
  FaMoon, FaEnvelope, FaInfoCircle, FaSun,
  FaPhone
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const categories = [
  { name: "Mobile Phones", image: "/images/Phones.png" },
  { name: "Electronics and Appliances", image: "/images/TV.png" },
  { name: "Home and Furniture", image: "/images/Furniture.jpeg" },
  { name: "Sports and Fitness", image: "/images/Jersey.jpg" },
  { name: "Fashion", image: "/images/skirtandpant.jpg" },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topDeals, setTopDeals] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  useEffect(() => {
    const fetchTopDeals = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user/topDeals`); // Adjust route as needed
        setTopDeals(res.data.result || []);
      } catch (error) {
        console.error("Failed to fetch top deals:", error);
      }
    };

    fetchTopDeals();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topDeals.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + topDeals.length) % topDeals.length);
  };

  const applyTheme = (mode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }, []);

  if (topDeals.length === 0) return null;

  const currentItem = topDeals[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Top Bar */}
      <div className="bg-black shadow p-2 flex items-center gap-x-10 px-4">
        <img src="/images/logo.png" alt="squaremart" className="w-20 h-20 object-contain rounded-full ml-10" />
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700  px-4 py-2 shadow-sm w-1/2 ml-10">
        {/* Leading hamburger icon */}
        <button className="text-black dark:text-gray-300 mr-3 cursor-pointer">
            <FaBars />
        </button>
            <input
                type="text"
                placeholder="Search for products, categories..."
                className="flex-grow bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button className="text-black dark:text-gray-300 cursor-pointer">
                <FaSearch />
            </button>
        </div>
        {/* Right Icons */}
        <div className="flex items-center ml-60 space-x-6 gap-10 text-white">
            {/* User */}
            <div className="flex flex-col items-center cursor-pointer">
                <FaUserCircle size={30} />
                <p className="text-s mt-1">User</p>
            </div>

            {/* Cart */}
            <div className="flex flex-col items-center cursor-pointer">
                <FaShoppingCart size={30} />
                <p className="text-s mt-1">Cart</p>
            </div>

            {/* Settings */}
            <div className="relative flex flex-col items-center cursor-pointer">
              <div className="flex flex-col items-center cursor-pointer"
                onClick={() => setShowSettings((prev) => !prev)}>
                <FaCog size={30} />
                <p className="text-s mt-1">Settings</p>
              </div>

              {showSettings && (
                <div className="absolute top-19 right-0 bg-white dark:bg-[#16141C] border border-gray-300 dark:border-gray-600 shadow-lg rounded-md w-56 z-50">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-100">

                    {/* Theme */}
                    <li
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setShowThemeOptions(prev => !prev);
                        setShowContactOptions(false); // hide others
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaMoon /> Theme
                      </div>

                      {showThemeOptions && (
                        <div className="mt-2 ml-6 flex flex-col gap-1">
                          <button
                            onClick={() => applyTheme("light")}
                            className="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                          >
                          <FaSun/> Light
                          </button>
                          <button
                            onClick={() => applyTheme("dark")}
                            className="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                          >
                          <FaMoon/> Dark
                          </button>
                        </div>
                      )}
                    </li>

                    {/* Contact Us */}
                    <li
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setShowContactOptions(prev => !prev);
                        setShowThemeOptions(false); // hide others
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaEnvelope /> Contact Us
                      </div>

                      {showContactOptions && (
                        <div className="mt-2 ml-6 flex flex-col gap-2">
                          <a
                            href="https://mail.google.com/mail/?view=cm&to=jessinsunny04@gmail.com"
                            target="_blank"
                            className="flex items-center gap-2 text-left hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            <FaEnvelope />
                            Email
                          </a>
                          <a
                            href="tel:7736194025"
                            className="flex items-center gap-2 text-left  hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            <FaPhone className="rotate-90" />
                            Phone No
                          </a>
                        </div>
                      )}
                    </li>

                    {/* About Us */}
                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <a
                        href="https://github.com/Jessin-Sunny"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FaInfoCircle /> About Us
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-[#16141C] mt-1 shadow p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center text-black dark:text-white">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            <img src={cat.image} alt={cat.name} className="w-30 h-30 mb-2 object-contain" />
            <p className="font-medium">{cat.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-1 bg-white dark:bg-[#16141C] shadow-md p-4 w-full mx-auto flex justify-center text-gray-900 dark:text-white">
        {/* Inner Content Wrapper */}
        <div className="relative flex flex-col items-center w-full max-w-4xl">
          {/* Big Deals Badge */}
          <div className="absolute left-0 top-0 bg-[#16141C] dark:bg-white text-white dark:text-black rounded-full w-40 h-40 flex flex-col justify-center items-center text-3xl font-extrabold z-10">
            <span>Top</span>
            <span>Deals</span>
          </div>

          {/* Carousel Content */}
          <div className="flex items-center justify-center gap-40 mt-4">
            {/* Left Arrow */}
            <button className="p-3 rounded-full border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-[#16141C] text-black dark:text-white"
            onClick={handlePrev}>
              <FaArrowLeft size={24} />
            </button>

            {/* Product Image */}
          <div className="flex flex-col items-center text-center">
            <img
              src={currentItem.image[0]}
              alt={currentItem.title}
              className="w-100 h-100 object-contain cursor-pointer"
            />
            <p className="text-xl font-medium mt-4">{currentItem.title}</p>
          </div>

            {/* Right Arrow + Price */}
            <div className="flex flex-col items-center">
              <button className="mt-35 p-3 rounded-full border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-[#16141C] text-black dark:text-white"
              onClick={handleNext}>
                <FaArrowRight size={24} />
              </button>
              <div className="text-right mt-20">
                <p className="text-3xl line-through text-gray-500 dark:text-gray-400">
                  ₹{currentItem.price}
                </p>
                <p className="text-3xl font-semibold text-black dark:text-white">
                  ₹{currentItem.costPrice}
                </p>
              </div>

            </div>
          </div>
          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {topDeals.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index
                    ? "bg-black dark:bg-white"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
