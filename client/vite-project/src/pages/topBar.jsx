import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import {
  FaShoppingCart,
  FaBars,
  FaCog,
  FaUserCircle,
  FaSearch,
  FaMoon, FaEnvelope, FaInfoCircle, FaSun,
  FaPhone
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TopBar = () => {
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const [showContactOptions, setShowContactOptions] = useState(false);
    const [user, setUser] = useState(null);
    
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

  //theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }, []);

  //login status
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/customer/viewProfile`, {
        withCredentials: true, // sends cookies
      });
      setUser(res.data.profile); // store in React state or context
    } catch (err) {
        setUser(null); // not logged in
      }
    };
    fetchUser();
  }, []);

  //view profile
  const handleUserClick = () => {
    if (user) {
      // Show user info
      console.log("User Info:", user);
      navigate("/customer/viewProfile");
      // or show modal / navigate to profile
    } else {
        toast.info(
          <div className="mt-7 text-gray-900 dark:text-white">
            Please log in to view your profile.
            <div className="mt-2 text-right">
              <button
                onClick={() => {
                  toast.dismiss();
                  navigate('/login');
                }}
                className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            pauseOnHover: true,
            className: 'bg-white dark:bg-[#16141C] border dark:border-gray-700 rounded shadow-md',
          }
        );
    }
  };
  return (
    <>
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
                <div className="flex flex-col items-center cursor-pointer"
                  onClick={handleUserClick}>
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
    </>
  )
}

export default TopBar