// 1. Import the background image
import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/artistic_hand.jpg';

export default function Hero() {
  return (
    <section 
      className="hero-section px-6" 
      style={{ 
        // 2. Use the imported variable inside the linear gradient
        backgroundImage: `linear-gradient(rgba(42, 36, 32, 0.7), rgba(42, 36, 32, 0.5)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '85vh'
      }}
    >
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl md:text-8xl serif leading-tight mb-6 text-white">
          HERITAGE <br /> 
          <span className="italic font-light opacity-90 text-[#C5A059]">AND TRADITION</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-stone-200 text-sm md:text-base mb-10 uppercase tracking-[0.2em]">
          ঐতিহ্য এখন আপনার ঘরের দুয়ারে <br />
          Empowering the roots of Bangladesh through authentic commerce.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          {/* Changed to /products to show the full heritage range */}
          <Link 
            to="/products" 
            className="brand-bg text-white px-10 py-4 text-xs uppercase font-bold tracking-widest hover:opacity-90 transition inline-block text-center"
          >
            Explore Collection
          </Link>
          
          {/* Directed to the legacy/about section */}
          <Link 
            to="/about" 
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition inline-block text-center"
          >
            Our Legacy
          </Link>
        </div>
      </div>
    </section>
  );
}