import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerSignup from "./pages/customerSignup";
import Login from "./pages/login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SellerSigup from "./pages/sellerSignup";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/seller/signup" element={<SellerSigup />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App
