import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // or use { children } if not using Outlet
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Cart from '../components/Cart';
import Footer from '../components/Footer';

export default function MainLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      {/* 1. The Top Tier (Logo, Search, Account) */}
      <Header setIsCartOpen={setIsCartOpen} />
      
      {/* 2. The Bottom Tier (Category Links - Sticky) */}
      <Navbar />

      {/* 3. The Page Content */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      {/* 4. Overlays & Footer */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  );
}