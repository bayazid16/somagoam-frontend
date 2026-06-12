import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// Header is removed because the new Navbar handles everything
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

// new
import { SellerAuthProvider }  from './context/SellerAuthContext';
import SellerPrivateRoute      from './components/SellerPrivateRoute';
import SellerLogin             from './pages/seller/SellerLogin';
import SellerRegister          from './pages/seller/SellerRegister';
import SellerDashboard         from './pages/seller/SellerDashboard';
 

function App() {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Define pages where we don't want the Navbar or Footer to show
  const hideLayout = 
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname.startsWith('/seller') || // new
    location.pathname === '/payment/success' || 
    location.pathname === '/payment/fail' || 
    location.pathname === '/payment/cancel';

  return (
    <SellerAuthProvider> 
      <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
        
        {/* 
            FIX 1: REMOVED <Header />
            The new Navbar.jsx now contains the Logo, Hamburger, and Search.
            Rendering both was causing the "double header" in your screenshot.
        */}
        {!hideLayout && (
          <Navbar setIsCartOpen={setIsCartOpen} />
        )}
        
        {/* 
            FIX 2: REMOVED EXTRA PADDING/MARGIN
            The flex-grow div handles the main content area.
            The 'pb-16' ensures content isn't covered by the mobile bottom navigation.
        */}
        <main className="flex-grow pb-16 md:pb-0">
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

            {/* ── Seller portal (completely separate layout) ────────────────────────── */}
            <Route path="/seller/login"    element={<SellerLogin />} />
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/seller/dashboard"
              element={<SellerPrivateRoute><SellerDashboard /></SellerPrivateRoute>} />
            <Route path="/seller/products"
              element={<SellerPrivateRoute><SellerDashboard /></SellerPrivateRoute>} />
            <Route path="/seller/orders"
              element={<SellerPrivateRoute><SellerDashboard /></SellerPrivateRoute>} />
            <Route path="/seller/store"
              element={<SellerPrivateRoute><SellerDashboard /></SellerPrivateRoute>} />

            {/* MOVED TO BOTTOM: Catch-all route for handling 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!hideLayout && (
          <>
            <Footer />
            <MobileBottomNav setIsCartOpen={setIsCartOpen} />
          </>
        )}

        {/* Side drawer cart component */}
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </SellerAuthProvider>
  );
}

export default App;
