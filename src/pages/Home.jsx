import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added for "See More" navigation
import axiosInstance from '../api/axiosInstance';
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import Highlights from "../sections/Highlights";
import Fashion from "../sections/Fashion";
import Food from "../sections/Food";
import Crafts from "../sections/Crafts";
import Stats from "../sections/Stats";
import About from "../sections/About";
import NoProducts from "../components/NoProducts";
import LoadingScreen from "../components/LoadingScreen";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products/products/', {
          signal: controller.signal
        });
        setProducts(response.data.results ?? response.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError("Failed to load products.");
        }
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingScreen />;

  // Categorization Logic - SLICED to max 4 products per line
  const fashionProducts = products.filter(p => p.category_name?.toLowerCase().includes('fashion')).slice(0, 4);
  const foodProducts = products.filter(p => p.category_name?.toLowerCase().includes('food')).slice(0, 4);
  const craftsProducts = products.filter(p => p.category_name?.toLowerCase().includes('craft')).slice(0, 4);

  // Updated Header Component with a "See More" link
  const SectionHeader = ({ title, highlight, linkTo }) => (
    <div className="mb-6 border-b border-stone-200 pb-2 flex justify-between items-end">
      <h2 className="text-2xl md:text-3xl serif tracking-tight text-stone-800">
        {title} <span className="text-[#A33B26]">{highlight}</span>
      </h2>
      {linkTo && (
        <Link 
          to={linkTo} 
          className="text-sm font-medium text-stone-600 hover:text-[#A33B26] transition-colors whitespace-nowrap ml-4"
        >
          See More &rarr;
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] animate-in fade-in duration-1000">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-20">
        
        {/* FASHION */}
        <section id="fashion-preview">
          <SectionHeader title="Traditional" highlight="Heritage Fashion" linkTo="/category/2" />
          {fashionProducts.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {/* Ensure your <Fashion /> component maps over the props! */}
                <Fashion products={fashionProducts} />
             </div>
          ) : <NoProducts category="Fashion" />}
        </section>

        {/* FOOD */}
        <section id="food-preview">
          <SectionHeader title="Traditional" highlight="GI Food" linkTo="/category/3" />
          {foodProducts.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <Food products={foodProducts} />
             </div>
          ) : <NoProducts category="Food" />}
        </section>

        {/* CRAFTS */}
        <section id="crafts-preview">
          <SectionHeader title="Handmade" highlight="Artisanal Crafts" linkTo="/category/4" />
          {craftsProducts.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <Crafts products={craftsProducts} />
             </div>
          ) : <NoProducts category="Crafts" />}
        </section>

      </div>

      <div className="border-t border-stone-200">
        <Features />
        <Stats />
        <About />
        <Highlights />
      </div>
    </div>
  );
}
