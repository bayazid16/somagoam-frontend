import React, { useState } from 'react';
import { NavLink, Link ,useNavigate} from 'react-router-dom';
import { Menu, X, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ setIsCartOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  
  const navigate = useNavigate();       
  const { cartItems } = useCart();

  // Dynamically calculate total quantities across all different items in the cart
  const totalCartQuantity = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Fashion', path: '/fashion' },
    { name: 'GI Food', path: '/food' },
    { name: 'Crafts', path: '/crafts' },
    { name: 'Producers', path: '/producers' },
    { name: 'Our Story', path: '/about' },
  ];

  return (
    <header className="bg-[#F9F7F2] border-b border-stone-200 w-full sticky top-0 z-[100]">
      {/* MAIN HEADER ROW 
      */}
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-24 flex justify-between items-center relative">
        
        {/* Left: Brand Logo (Desktop) / Hamburger (Mobile) */}
        <div className="flex-1 flex items-center">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="md:hidden p-1 text-stone-700 hover:text-[#A33B26]"
          >
            <Menu size={28} />
          </button>

          {/* Logo: Fixed border color to match text (#A33B26) */}
          <Link to="/" className="hidden md:block">
            <div className="border-[1.5px] border-[#A33B26] px-5 py-1.5">
              <h1 className="text-2xl font-serif tracking-[0.15em] text-[#A33B26] font-bold uppercase whitespace-nowrap">
                SOMAGOAM
              </h1>
            </div>
          </Link>
        </div>

        {/* Mobile Logo (Center on mobile only) */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <div className="border-[1.5px] border-[#A33B26] px-3 py-0.5">
            <h1 className="text-lg font-serif tracking-[0.1em] text-[#A33B26] font-bold uppercase">
              SOMAGOAM
            </h1>
          </div>
        </Link>

        {/* Center: Desktop Search Bar (Visible only on Desktop) */}
        <div className="hidden md:flex flex-[1.5] justify-center px-8">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search heritage fashion, food..." 
              className="w-full bg-white border border-stone-200 py-2.5 pl-10 pr-4 text-sm rounded-sm focus:outline-none focus:border-[#A33B26] placeholder:text-stone-400"
              value={searchQuery}                              
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleSearch}     
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex-1 flex justify-end items-center space-x-4 md:space-x-6 text-stone-700">
          <button className="hover:text-[#A33B26] transition-colors">
            <Heart size={22} />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-[#A33B26] transition-colors"
          >
            <ShoppingBag size={22} />
            {/* Show badge only when items exist */}
            {totalCartQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#A33B26] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalCartQuantity}
              </span>
            )}
          </button>
          <Link to="/dashboard" className="hover:text-[#A33B26] transition-colors">
            <User size={22} />
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar (Only visible on Mobile) */}
      <div className="px-4 pb-4 md:hidden">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search heritage fashion, food..." 
            className="w-full bg-white border border-stone-200 py-2.5 pl-10 pr-4 text-xs rounded-sm focus:outline-none focus:border-[#A33B26]"
            value={searchQuery}                              
            onChange={(e) => setSearchQuery(e.target.value)} 
            onKeyDown={handleSearch}     
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex justify-center border-t border-stone-100 bg-[#F9F7F2]">
        {links.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path} 
            className={({ isActive }) => 
              `px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive 
                  ? 'text-[#A33B26] border-b-2 border-[#A33B26]' 
                  : 'text-stone-500 border-b-2 border-transparent hover:text-[#A33B26]'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[120] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsMenuOpen(false)} 
      />
      
      <aside className={`
        fixed top-0 left-0 h-full w-[300px] bg-[#F9F7F2] z-[130] shadow-2xl transform transition-transform duration-500 ease-in-out md:hidden
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center border-b border-stone-200">
          <span className="font-bold text-[#A33B26] tracking-widest text-sm uppercase">Menu</span>
          <button onClick={() => setIsMenuOpen(false)} className="text-stone-800">
            <X size={28} />
          </button>
        </div>
        
        <div className="flex flex-col p-6 space-y-5">
          {links.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => 
                `text-lg font-serif tracking-wide border-b border-stone-200/50 pb-3 transition-colors ${
                  isActive ? 'text-[#A33B26]' : 'text-stone-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </aside>
    </header>
  );
}
