import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async(e) => {
    //console.log(API_BASE_URL);
    e.preventDefault();   //imp for login
    //check if all fields are given on previous page
    if(!email || !password) {
      alert("Please fill all the required fields");
      return;
    }

    //validate email
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const formData = { email, password}
      const response = await axios.post(`${API_BASE_URL}/user/login`, formData, ); //{withCredentials: true, // cookies for auth}
      console.log(response.data);

      const userObject  = response?.data?.userObject;
      const role  = userObject?.role;
      console.log("Login successful as", role);

      toast.success("Login successful!");
      if (role === 'Customer') {
        toast.success("Customer");
      }
      else if (role === 'Seller') {
        toast.success("Seller");
      }
      else if (role === 'Admin') {
        toast.success("Admin");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || error.response?.data?.message  || "Login failed. Please try again.");
    }
  }

  return (
    <div className="flex w-screen h-screen">
      {/* Left section */}
      <div
        className="flex-1 flex flex-col justify-center items-center text-white overflow-hidden"
        style={{ backgroundColor: "#16141C" }}
      >
        <img
          src="/images/logo.png"
          alt="SquareMart"
          className="w-40 h-40 rounded-xl mb-4"
        />
        <p className="italic text-lg text-center">
          "Everything You Want in One Square"
        </p>
        <p className="text-center text-lg mt-21">New Seller ?</p>
        <Link
          to="/seller/signup"
          className="text-blue-400 underline hover:text-white text-lg cursor-pointer"
        >
          Signup
        </Link>
        <p className="text-center text-lg mt-5">New Customer ?</p>
        <Link
          to="/customer/signup"
          className="text-blue-400 underline hover:text-white text-lg cursor-pointer"
        >
          Signup
        </Link>
      </div>

      {/* Right section */}
      <div className="flex-1 flex flex-col justify-center items-center px-12 bg-white overflow-y-auto">
        <div className='text-5xl text-black font-extrabold mb-4 flex items-center gap - 2'>
          <span className="text-5x1 rotate-330 mr-2">
            <FaShoppingCart />
          </span>
          LOGIN
        </div>
        <div className="h-1 bg-black w-97 rounded mb-6"></div>
      <form className="w-full max-w-sm space-y-7" onSubmit={handleLogin}>
          <div className="flex items-center border-2 p-2 text-black">
            <FaEnvelope className='mr-5'/>
            <input className='w-full outline-none' type='email' placeholder='Email ID' required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center border-2 p-2 text-black">
            <FaLock className='mr-5'/>
            <input className='w-full outline-none ' type={showPassword ? 'text' : 'password' } placeholder='Password' required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </button>
          </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-2 font-semibold rounded cursor-pointer"
            >
                Login
            </button>

      </form>
      </div>
    </div>
  );
};

export default Login;
