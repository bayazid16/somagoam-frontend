import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import MobileBottomNav from "./components/MobileBottomNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Fashion from "./pages/Fashion";
import Food from "./pages/Food";
import Crafts from "./pages/Crafts";
import Producers from "./pages/Producers";
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
import Cart from "./components/Cart";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hideLayout = 
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname === '/payment/success' || 
    location.pathname === '/payment/fail' || 
    location.pathname === '/payment/cancel';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      
      {/* 
          NAVIGATION AREA
          'sticky top-0' is better than 'fixed' here because it stays at the top 
          but still occupies space in the layout, preventing the "Hero sliding under" issue.
      */}
      {!hideLayout && (
        <div className="sticky top-0 left-0 w-full z-[100] bg-[#F9F7F2] border-b border-stone-200">
          <Header 
            setIsCartOpen={setIsCartOpen} 
            toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
          <Navbar />
        </div>
      )}
      
      {/* 
          MAIN CONTENT
          No extra padding-top needed because 'sticky' keeps the nav in the document flow.
          pb-16 ensures content doesn't get hidden by the mobile bottom nav.
      */}
      <div className="flex-grow pb-16 md:pb-0">
        <Routes>
          <Route path="/social-callback" element={<SocialCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/food" element={<Food />} />
          <Route path="/crafts" element={<Crafts />} />
          <Route path="/producers" element={<Producers />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          
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

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentCancel />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!hideLayout && (
        <>
          <Footer />
          <MobileBottomNav setIsCartOpen={setIsCartOpen} />
        </>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default App;