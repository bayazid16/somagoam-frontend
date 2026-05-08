import { NavLink } from 'react-router-dom';

export default function Navbar() {
  // Exact colors from your reference image
  const getNavLinkClass = ({ isActive }) =>
    `py-4 px-2 transition-all duration-300 border-b-2 font-bold uppercase text-[11px] tracking-[0.1em] whitespace-nowrap ${
      isActive 
        ? 'border-[#A33B26] text-[#A33B26]' 
        : 'border-transparent text-stone-500 hover:text-[#A33B26]'
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
    <nav className="bg-[#F9F7F2] border-b border-stone-200 w-full block">
      <div className="max-w-7xl mx-auto px-4">
        {/* flex ensures they sit in a row; justify-center centers them */}
        <div className="flex justify-center items-center space-x-6 md:space-x-12 overflow-x-auto no-scrollbar">
          {links.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              end={link.path === '/'} 
              className={getNavLinkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}