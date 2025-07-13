import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerSignup from "./pages/customerSignup";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: show CustomerSignup when visiting "/" */}
        <Route path="/" element={<CustomerSignup />} />
      </Routes>
    </Router>
  );
}

export default App
