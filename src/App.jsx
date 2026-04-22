import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Fashion from "./pages/Fashion";
import Food from "./pages/Food";
import Crafts from "./pages/Crafts";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Checkout from './pages/Checkout';
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import UserDashboard from "./pages/UserDashboard";
import Reviews from "./pages/Reviews";
import SearchResults from './pages/SearchResults';
import SocialCallback from './components/SocialCallback';

import PrivateRoute from "./components/PrivateRoute"; // Import the gatekeeper

function App() {
  const location = useLocation();

  // Logic for hiding Layout (Navbar/Footer)
  const hideLayout = 
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname === '/payment/success' || 
    location.pathname === '/payment/fail' || 
    location.pathname === '/payment/cancel';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/social-callback" element={<SocialCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/food" element={<Food />} />
          <Route path="/crafts" element={<Crafts />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Protected Routes - Wrapped in PrivateRoute */}
          <Route 
            path="/checkout" 
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/reviews" 
            element={
              <PrivateRoute>
                <Reviews />
              </PrivateRoute>
            } 
          />

          {/* Payment Routes */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentCancel />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;