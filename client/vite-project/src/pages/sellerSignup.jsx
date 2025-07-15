import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaPhone, FaShoppingCart, FaUser, FaVenusMars, 
  FaHome, FaGlobe, FaMapMarkedAlt, FaMapPin, FaCity, FaIdCard
} 
from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const SellerSigup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // two page sigup
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [GSTIN, setGSTIN] = useState("");
  const [buildingNo, setBuildingNo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');  //only supported now
  const indianStatesAndUTs = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleSignup = async(e) => {
  //console.log(API_BASE_URL);
  e.preventDefault();
  //check if all fields are given on previous page
  if(!name || !email || !phoneno || !password || !confirm || !GSTIN) {
    toast.error("Please fill all the required fields");
    return;
  }

  //validate email
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail) {
    toast.error("Please enter a valid email address.");
    return;
  }

  //validate GSTIN
  // Basic regex for 15-digit GSTIN format (alphanumeric)
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(GSTIN)
  if(!gstinRegex) {
    toast.error("Please enter a valid GSTIN.");
    return;
  }

  //check if password and confirm are not same
  if( password !== confirm) {
    toast.error("Passwords and Confirm Password do not match");
    return;
  }

  //length of password minimum 6
  if (password.length <= 5) {
    toast.error("Password must be at least 6 characters long.");
    return;
  }

  //check valid phone no
  const isValidPhone = /^[6-9]\d{9}$/.test(phoneno);
  if (!isValidPhone) {
    toast.error("Please enter a valid Indian phone number.");
    return;
  }

  // Validate pincode (6 digits, not starting with 0)
  const isValidPincode = /^[1-9][0-9]{5}$/.test(pincode);
  if (!isValidPincode) {
    toast.error("Please enter a valid 6-digit Indian pincode.");
    return;
  }

  //currently supporting only one address

  try {
    const fullPhoneNumber = `+91${phoneno}`;
    const formData = {
      name, email, GSTIN, phoneno: fullPhoneNumber, password, profilepic: "",
      buildingNo, street, city, state, pincode, country
    };
    const response = await axios.post(`${API_BASE_URL}/seller/signup`, formData);
    console.log("Signup successful:", response.data);
    toast.success("Account Created Successfully");
    navigate("/");
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Signup failed. Please try again.");
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
        <p className="text-center text-lg mt-40">New Customer ?</p>
        <Link
          to="/customer/signup"
          className="text-blue-400 underline hover:text-white text-lg cursor-pointer"
        >
          Signup
        </Link>
      </div>

      {/* Right section */}
      <div className="flex-1 flex flex-col justify-center items-center px-12 bg-white overflow-y-auto">
        <div className='text-4xl text-black font-extrabold mb-4 flex items-center gap - 2'>
          <span className="text-5x1 rotate-330 mr-2">
            <FaShoppingCart />
          </span>
          SELLER SIGN UP
        </div>
        <div className="h-1 bg-black w-97 rounded mb-6"></div>
      <form className="w-full max-w-sm space-y-7" onSubmit={handleSignup}>
        {step === 1 && (
          <>
          <div className="flex items-center border-2 p-2 text-black">
            <FaUser className='mr-5'/>
            <input className='w-full outline-none' type='text' placeholder='Name' required
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center border-2 p-2 text-black">
            <FaEnvelope className='mr-5'/>
            <input className='w-full outline-none' type='email' placeholder='Email ID' required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center border-2 p-2 text-black">
            <FaIdCard className='mr-5'/>
            <input className='w-full outline-none' type='text' placeholder='GSTIN' required
            value={GSTIN}
            onChange={(e) => setGSTIN(e.target.value)}
            />
          </div>
          <div className="flex items-center border-2 p-2 text-black">
            <FaPhone className="mr-2 rotate-90" />
            <span className=" font-semibold text-black-600 mr-2">+91</span>
            <input
              className="w-full outline-none"
              type="text"
              placeholder="Phone No"
              required
              maxLength={10}
              value={phoneno}
              onChange={(e) => setPhoneno(e.target.value)}
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
          <div className="flex items-center border-2 p-2 text-black" >
            <FaLock className='mr-5'/>
            <input className='w-full outline-none' type='password' placeholder='Confirm Password' required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          
          
          <button 
          type='button'
          className="w-full !bg-black text-white py-2 font-semibold cursor-pointer" 
          onClick={() => setStep(2)}>
            Next
          </button>
          </>
        )}
        {step === 2 && (
            <>
              {/* Address Fields */}
              <div className="flex items-center border-2 p-2 text-black">
                <FaHome className="mr-5" />
                <input
                  className="w-full outline-none"
                  type="text"
                  placeholder="Building No / House Name"
                  required
                  value={buildingNo}
                  onChange={(e) => setBuildingNo(e.target.value)}
                />
              </div>
              <div className="flex items-center border-2 p-2 text-black">
                <FaMapMarkedAlt className="mr-5" />
                <input
                  className="w-full outline-none"
                  type="text"
                  placeholder="Street"
                  value={street}
                  required
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div className="flex items-center border-2 p-2 text-black">
                <FaCity className="mr-5" />
                <input
                  className="w-full outline-none"
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex items-center border-2 p-2 text-black">
                <FaMapMarkedAlt className="mr-5" />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full outline-none bg-white cursor-pointer"
                  required
                >
                  <option value="">Select State</option>
                  {indianStatesAndUTs.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center border-2 p-2 text-black">
                <FaMapPin className="mr-5" />
                <input
                  className="w-full outline-none"
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  required
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
              <div className="flex items-center border-2 p-2 text-black">
                <FaGlobe className="mr-5" />
                <input
                  className="w-full outline-none"
                  type="text"
                  placeholder="Country"
                  value={country}
                  required
                  readOnly
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-black text-white py-2 font-semibold rounded cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 font-semibold rounded cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
      </form>
      <div className="flex flex-col gap-y-2 mt-4 w-full max-w-sm">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-grow h-0.5 bg-black"></div>
            <span className="text-sm text-black">or</span>
            <div className="flex-grow h-0.5 bg-black"></div>
          </div>
          <p className="text-center text-sm">Already to SquareMart?</p>
          <Link to="/" className="w-full">
          <button className="w-full !bg-black text-white py-2 cursor-pointer">
            Login
          </button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default SellerSigup;