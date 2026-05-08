import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    `py-3 px-2 transition-all duration-300 border-b-2 ${
      isActive ? 'border-[#A33B26] text-[#A33B26]' : 'border-transparent text-stone-600 hover:text-[#A33B26]'
    }`;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Fashion', path: '/fashion' },
    { name: 'GI Food', path: '/food' },
    { name: 'Crafts', path: '/crafts' },
    { name: 'Producers', path: '/producers' },
    { name: 'Our Story', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto flex justify-center items-center px-6">
        
        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden py-4 text-stone-800">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-[12px] uppercase tracking-[0.15em] font-bold">
          {links.map((link) => (
            <NavLink key={link.name} to={link.path} end={link.path === '/'} className={getNavLinkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F9F7F2] border-b border-stone-200 flex flex-col items-center py-6 space-y-4 font-bold uppercase text-xs">
          {links.map((link) => (
            <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-stone-600">
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}