import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaPhone, FaShoppingCart, FaUser, FaVenusMars, 
  FaHome, FaGlobe, FaMapMarkedAlt, FaMapPin, FaCity
} 
from "react-icons/fa";
import { Link } from "react-router-dom";

const CustomerSignup = () => {
  const [step, setStep] = useState(1); // two page sigup
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [gender, setGender] = useState("");
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
        <p className="text-center text-lg mt-40">Switch to Seller Page?</p>
        <Link
          to="/signup/seller"
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
          SIGN UP
        </div>
        <div className="h-1 bg-black w-97 rounded mb-6"></div>
      <form className="w-full max-w-sm space-y-7">
        {step === 1 && (
          <>
          <div className="flex items-center border-2 p-2 text-black">
            <FaUser className='mr-5'/>
            <input className='w-full outline-none' type='text' placeholder='Full Name' required
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
            <FaVenusMars className="mr-5 text-lg" />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full outline-none bg-white"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center border-2 p-2 text-black">
            <FaPhone className='mr-5 rotate-90'/>
            <input className='w-full outline-none' type='text' placeholder='Phone No' required
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
                  placeholder="Building No"
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
                  onChange={(e) => setCountry(e.target.value)}
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
          <button className="w-full !bg-black text-white py-2 cursor-pointer">Login</button>
      </div>
      </div>
    </div>
  );
};

export default CustomerSignup;
