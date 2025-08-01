import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserEdit, FaMapMarkerAlt, FaBoxOpen, FaPhone, FaSignOutAlt, FaSpinner } from "react-icons/fa";
import { MdEmail, MdEdit, MdPhone } from "react-icons/md";
import TopBar from "./topBar";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: '',
    gender: '',
  });
  const [addressForm, setAddressForm] = useState([
    {
      buildingNo: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
    }
  ]);
  const [isModified, setIsModified] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  //login status
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/customer/viewProfile`, {
        withCredentials: true, // sends cookies
      });
      setUser(res.data.profile); // store in React state or context
      setFormData({
        name: res.data.profile.userData.name,
        email: res.data.profile.userData.email,
        phoneno: res.data.profile.userData.phoneno,
        gender: res.data.profile.customerData.gender,
        address: [res.data.profile.customerData.addressID]
      });
      // Populate address as array
      setAddressForm([
        {
          buildingNo: res.data.profile.customerData.addressID.buildingNo,
          street: res.data.profile.customerData.addressID.street,
          city: res.data.profile.customerData.addressID.city,
          state: res.data.profile.customerData.addressID.state,
          pincode: res.data.profile.customerData.addressID.pincode,
          country: res.data.profile.customerData.addressID.country
        }
      ]);
    } catch (err) {
        console.error("Error fetching profile:", err);
        setUser(null); // not logged in
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      const changed =
        updated.name !== user.userData.name ||
        updated.phoneno !== user.userData.phoneno;

      setIsModified(changed);
      return updated;
    });
  };

  const handleAddressChange = (e, index = 0) => {
    const { name, value } = e.target;

    setAddressForm((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };

      // Compare to original
      const original = user.customerData.addressID || {};
      const changed = Object.keys(updated[index]).some(
        (key) => updated[index][key] !== original[key]
      );

      setIsModified(changed ||
        formData.name !== user.userData.name ||
        formData.phoneno !== user.userData.phoneno
      );

      return updated;
    });
  };

  return (
    <>
    <TopBar />
    {!user ? (
    <div className="flex items-center justify-center h-screen text-4xl animate-spin text-gray-600">
      <FaSpinner />
    </div>
    ) : (
    <div className="min-h-screen bg-white dark:bg-[#16141C] text-black dark:text-white flex">
      {/* Sidebar */}
      <div className="w-[200px] bg-gray-100 dark:bg-[#1F1D2B] p-4 space-y-4 shadow-md">
        <Link to="#" className="flex items-center space-x-2 hover:text-blue-500"
        onClick={() => setShowAddressForm(false)}
        >
          <FaUserEdit />
          <span>Edit Profile</span>
        </Link>
        <Link to="#" className="flex items-center space-x-2 hover:text-blue-500"
        onClick={() => setShowAddressForm(true)}
        >
          <FaMapMarkerAlt />
          <span>Delivery Address</span>
        </Link>
        <Link to="#" className="flex items-center space-x-2 hover:text-blue-500">
          <FaBoxOpen />
          <span>Orders</span>
        </Link>
        <Link to="#" className="flex items-center space-x-2 hover:text-blue-500">
          <FaPhone />
          <span>Contact Us</span>
        </Link>
        <Link to="#" className="flex items-center space-x-2 text-red-500 hover:text-red-600">
          <FaSignOutAlt />
          <span>Log Out</span>
        </Link>
      </div>


      {/* Profile Form */}
      <div className="flex-1 p-8">
        {!showAddressForm && (
          <div className="max-w-xl mx-auto bg-white dark:bg-[#16141C] shadow-md rounded-lg p-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block font-semibold mb-1">
                Full Name<MdEdit className="inline ml-1" />
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-[#1F1D2B] text-black dark:text-white"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className="block font-semibold mb-1">
                Email ID
              </label>
              <input
                type="email"
                defaultValue={formData.email}
                readOnly
                className="w-full p-2 border rounded bg-gray-50 dark:bg-[#1F1D2B] text-black dark:text-white"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-semibold mb-1">
                Phone No <MdEdit className="inline ml-1" />
              </label>
              <input
                type="tel"
                name="phoneno"
                value={formData.phoneno}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-[#1F1D2B] text-black dark:text-white"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold mb-1">Gender</label>
              <input
                type="tel"
                defaultValue={formData.gender}
                readOnly
                className="w-full p-2 border rounded bg-gray-50 dark:bg-[#1F1D2B] text-black dark:text-white"
              />
            </div>
          </div>
        )}
        {showAddressForm && addressForm.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-bold">Delivery Address</h3>
            {["buildingNo", "street", "city", "state", "pincode", "country"].map((field) => (
              <div key={field}>
                <label className="block font-semibold capitalize mb-1">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={addressForm[0][field] || ""}
                  onChange={(e) => handleAddressChange(e, 0)}
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-[#1F1D2B] text-black dark:text-white"
                />
              </div>
            ))}
          </div>
        )}
        {isModified && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                setFormData({
                  name: user.userData.name,
                  phoneno: user.userData.phoneno,
                  email: user.userData.email,
                  gender: user.customerData.gender,
                  address: [user.customerData.addressID],
                });
                setAddressForm([user.customerData.addressID]);
                setIsModified(false);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const updatedData = {
                    ...formData,
                    address: addressForm
                  };

                  await axios.put(`${API_BASE_URL}/customer/updateProfile`, updatedData, {
                    withCredentials: true
                  });

                  setIsModified(false);
                  // Optionally refetch user here
                } catch (error) {
                  console.error("Update failed:", error);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
    )}
    </>
  );
};

export default CustomerProfile;
