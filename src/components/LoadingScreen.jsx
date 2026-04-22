import React from 'react';
import logo from '../assets/logo.png';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F9F7F2]">
      <div className="flex flex-col items-center">
        
        {/* Large, Clean Logo Container */}
        <div className="mb-8">
          {/* Main Logo - Sized at h-48 for a bold presence */}
          <img 
            src={logo} 
            alt="Somagom Logo" 
            className="h-48 w-auto object-contain animate-pulse duration-[3000ms]"
          />
        </div>

        {/* Minimalist Branded Text */}
        <div className="flex flex-col items-center">
          <span className="brand-color text-[11px] uppercase tracking-[0.7em] font-bold">
            Somagom
          </span>
          <p className="text-stone-400 serif italic text-sm mt-3 tracking-wide">
            Gathering Heritage...
          </p>
        </div>
      </div>
    </div>
  );
}