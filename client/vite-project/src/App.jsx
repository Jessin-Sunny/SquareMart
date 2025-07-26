import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerSignup from "./pages/customerSignup";
import Login from "./pages/login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SellerSigup from "./pages/sellerSignup";
import Dashboard from "./pages/dashboard";
import HomePage from "./pages/home";
import ProductDetails from "./pages/productDetails";


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/customer/dashboard" element={<Dashboard />} />
        <Route path="/seller/signup" element={<SellerSigup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
      </Routes>
    </Router>
      <ToastContainer position="top-center" autoClose={3000}  />
    </>
  );
}

export default App
