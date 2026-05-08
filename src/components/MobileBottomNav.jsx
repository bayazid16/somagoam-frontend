import { Home, Package, Users, ShoppingCart, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function MobileBottomNav({ setIsCartOpen }) {
  // Logic for active state colors
  const getNavClass = ({ isActive }) => 
    `flex flex-col items-center justify-center gap-1 transition-colors ${
      isActive ? 'text-[#A33B26]' : 'text-stone-400 hover:text-stone-600'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 py-2 px-4 flex justify-between items-center z-[60] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <NavLink to="/" className={getNavClass}>
        <Home size={20} strokeWidth={1.5} />
        <span className="text-[8px] uppercase font-bold tracking-widest">Home</span>
      </NavLink>
      
      <NavLink to="/fashion" className={getNavClass}>
        <Package size={20} strokeWidth={1.5} />
        <span className="text-[8px] uppercase font-bold tracking-widest">Product</span>
      </NavLink>

      <NavLink to="/producers" className={getNavClass}>
        <Users size={20} strokeWidth={1.5} />
        <span className="text-[8px] uppercase font-bold tracking-widest">Producer</span>
      </NavLink>

      <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center justify-center gap-1 text-stone-400">
        <ShoppingCart size={20} strokeWidth={1.5} />
        <span className="text-[8px] uppercase font-bold tracking-widest">Cart</span>
      </button>

      <NavLink to="/about" className={getNavClass}>
        <Mail size={20} strokeWidth={1.5} />
        <span className="text-[8px] uppercase font-bold tracking-widest">Contact</span>
      </NavLink>
    </nav>
  );
}