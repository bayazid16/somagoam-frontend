import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Search, Heart, User, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header({ setIsCartOpen, toggleMobileMenu }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    /* We keep this as part of the fixed group, but remove 'fixed' from here 
       and move it to the parent wrapper in App.jsx to avoid overlap */
    <header className="bg-[#F9F7F2] pt-4 pb-3 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          
          {/* 1. Three Bar Icon */}
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden text-stone-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* 2. Boxed Logo - Centered on Mobile, tight tracking */}
          <div 
            className="cursor-pointer flex-1 flex justify-center md:flex-none md:justify-start" 
            onClick={() => navigate('/')}
          >
            <div className="border-[1.5px] border-[#A33B26] px-3 py-1 md:px-5 md:py-1.5">
              <h1 className="text-xl md:text-2xl serif tracking-tight uppercase font-bold text-[#A33B26]">
                SOMAGOAM
              </h1>
            </div>
          </div>

          {/* 3. Search (Desktop Only) */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search heritage..."
              className="w-full bg-white border border-stone-200 py-1.5 px-10 rounded-full text-xs outline-none focus:border-[#A33B26]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
          </div>

          {/* 4. Actions */}
          <div className="flex items-center space-x-3 md:space-x-6">
            <Link to="/wishlist" className="text-stone-700 hover:text-[#A33B26]">
              <Heart size={20} strokeWidth={1.5} />
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="relative text-stone-700 hover:text-[#A33B26]">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A33B26] text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>

            <Link to={user ? "/dashboard" : "/login"} className="text-stone-700 hover:text-[#A33B26]">
              <User size={22} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* 5. Search Bar (Mobile View Only) */}
        <div className="mt-3 md:hidden relative">
          <input
            type="text"
            placeholder="Search heritage fashion, food..."
            className="w-full bg-white border border-stone-100 py-2 px-10 rounded-md text-sm outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
        </div>
      </div>
    </header>
  );
}