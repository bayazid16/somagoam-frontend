import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('access_token');
  
  if (storedUser && token) {
    try {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  } else {
    setUser(null);
    setIsLoggedIn(false);
  }
}, [navigate]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    `transition-colors duration-300 ${
      isActive ? 'brand-color' : 'text-stone-500 hover:brand-color'
    }`;

  return (
    <>
      {/* Search Overlay */}
      <div className={`fixed top-0 left-0 w-full bg-[#F9F7F2] z-[60] border-b border-stone-200 transition-all duration-500 ease-in-out ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center space-x-4">
          <Search size={24} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search heritage fashion, food, or crafts..."
            className="w-full bg-transparent border-none outline-none text-xl serif placeholder:text-stone-300"
            autoFocus={isSearchOpen}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:rotate-90 transition-transform duration-300">
            <X size={30} className="text-stone-500" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-[#F9F7F2] p-10 flex flex-col space-y-8 text-2xl serif transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <button onClick={toggleMenu} className="absolute top-8 right-10 text-stone-500">
          <X size={40} />
        </button>
        <NavLink to="/" end className={getNavLinkClass} onClick={toggleMenu}>Home</NavLink>
        <NavLink to="/fashion" className={getNavLinkClass} onClick={toggleMenu}>Fashion</NavLink>
        <NavLink to="/food" className={getNavLinkClass} onClick={toggleMenu}>GI Food</NavLink>
        <NavLink to="/crafts" className={getNavLinkClass} onClick={toggleMenu}>Crafts</NavLink>
        <NavLink to="/about" className={getNavLinkClass} onClick={toggleMenu}>Our Story</NavLink>
        <hr className="border-stone-200" />
        <NavLink
          to={isLoggedIn ? '/dashboard' : '/login'}
          className="text-sm uppercase tracking-widest font-bold"
          onClick={toggleMenu}
        >
          {isLoggedIn ? 'Dashboard' : 'Login / Account'}
        </NavLink>
      </div>

      {/* Main Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-6 sticky top-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-stone-200">
        <div className="logo-box brand-color cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-xl serif tracking-tighter uppercase font-bold">SOMAGOM</div>
        </div>

        <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-widest font-bold">
          <NavLink to="/" end className={getNavLinkClass}>Home</NavLink>
          <NavLink to="/fashion" className={getNavLinkClass}>Fashion</NavLink>
          <NavLink to="/food" className={getNavLinkClass}>GI Food</NavLink>
          <NavLink to="/crafts" className={getNavLinkClass}>Crafts</NavLink>
          <NavLink to="/about" className={getNavLinkClass}>Our Story</NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-stone-800 hover:brand-color transition"
            aria-label="Open search"
          >
            <Search size={22} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-stone-800 hover:brand-color transition relative"
            aria-label="Open cart"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#A33B26] text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>

      
  {isLoggedIn ? (
    <div 
     className="hidden md:flex items-center gap-3 pl-4 border-l border-stone-200 cursor-pointer group"
     onClick={() => navigate('/dashboard')}
   >
     <div className="w-8 h-8 rounded-full bg-[#A33B26] flex items-center justify-center text-white text-xs font-bold uppercase transition-transform group-hover:scale-105">
        {user.first_name ? user.first_name[0] : (user.username ? user.username[0] : 'A')}
      </div>
      <div className="flex flex-col text-left">
       <span className="text-[9px] text-stone-400 uppercase tracking-tighter leading-none">Account</span>
       <span className="text-xs font-bold text-stone-800 group-hover:text-[#A33B26] transition-colors">
         {user?.first_name || user?.username || user?.email || 'U'}
       </span>
      </div>
    </div>
  ) : (
    <NavLink
     to="/login"
     className="hidden md:block brand-bg px-6 py-2 text-xs uppercase font-bold text-white hover:opacity-90 transition"
   >
      Login
   </NavLink>
  )}

          <button onClick={toggleMenu} className="md:hidden text-stone-800 p-2">
            <Menu size={32} />
          </button>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}