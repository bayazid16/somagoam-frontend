import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import Highlights from "../sections/Highlights";
import Stats from "../sections/Stats";
import About from "../sections/About";
import NoProducts from "../components/NoProducts";
import LoadingScreen from "../components/LoadingScreen";
import defaultImage from '../assets/cumilla_roshmalai.png';

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

  // 1. Group & slice data to show a maximum of 4 items per line on Home page
  const fashionPreview = products.filter(p => p.category_name?.toLowerCase().includes('fashion')).slice(0, 4);
  const foodPreview = products.filter(p => p.category_name?.toLowerCase().includes('food')).slice(0, 4);
  const craftsPreview = products.filter(p => p.category_name?.toLowerCase().includes('craft')).slice(0, 4);

  // 2. Reusable Header Component with "See More" redirection
  const SectionHeader = ({ title, highlight, linkTo }) => (
    <div className="mb-6 border-b border-stone-200 pb-2 flex justify-between items-end">
      <h2 className="text-2xl md:text-3xl serif tracking-tight text-stone-800">
        {title} <span className="text-[#A33B26]">{highlight}</span>
      </h2>
      <Link to={linkTo} className="text-sm font-medium text-stone-600 hover:text-[#A33B26] transition-colors">
        See More &rarr;
      </Link>
    </div>
  );

  // 3. Reusable Product Card to keep layout consistent across sections
  const ProductCard = ({ item }) => (
    <div className="bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-300 group flex flex-col shadow-sm">
      <Link to={`/product/${item.slug}`} className="relative h-40 md:h-60 overflow-hidden block">
        <img 
          src={item.image || item.img || defaultImage} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={item.name} 
        />
        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold tracking-widest uppercase">
          {item.region || item.origin_district}
        </div>
      </Link>
      <div className="p-3 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2 md:mb-3">
          <span className="bg-green-50 text-green-700 text-[7px] md:text-[9px] font-extrabold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
            {item.is_gi ? "GI CERTIFIED" : "AUTHENTIC"}
          </span>
        </div>
        <Link to={`/product/${item.slug}`}>
          <h3 className="serif text-sm md:text-xl mb-1 md:mb-2 hover:text-[#A33B26] transition-colors line-clamp-1">{item.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-[#A33B26]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={8} className="md:w-[10px]" fill={i < (item.rating || 5) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-[8px] md:text-[10px] text-stone-400 font-bold">({item.rating || 5}.0)</span>
        </div>
        <p className="text-stone-500 text-[10px] md:text-xs flex-grow mb-3 md:mb-4 line-clamp-2 hidden sm:block">
          {item.description || item.desc}
        </p>
        <div className="pt-2 md:pt-4 mt-auto border-t border-stone-100 flex justify-between items-center">
          <span className="font-bold font-sans text-[10px] md:text-sm text-stone-900">৳ {item.price}</span>
          <Link to={`/product/${item.slug}`} className="brand-bg text-white px-2 md:px-3 py-1.5 md:py-2 text-[8px] md:text-[9px] uppercase font-bold tracking-widest">
            View
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-20">
        {/* FASHION SECTION */}
        <section id="fashion-preview">
          <SectionHeader title="Traditional" highlight="Heritage Fashion" linkTo="/fashion" />
          {fashionPreview.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {fashionPreview.map(item => <ProductCard key={item.id} item={item} />)}
            </div>
          ) : <NoProducts category="Fashion" />}
        </section>

        {/* FOOD SECTION */}
        <section id="food-preview">
          <SectionHeader title="Traditional" highlight="GI Food" linkTo="/gi-food" />
          {foodPreview.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {foodPreview.map(item => <ProductCard key={item.id} item={item} />)}
            </div>
          ) : <NoProducts category="Food" />}
        </section>

        {/* CRAFTS SECTION */}
        <section id="crafts-preview">
          <SectionHeader title="Handmade" highlight="Artisanal Crafts" linkTo="/crafts" />
          {craftsPreview.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {craftsPreview.map(item => <ProductCard key={item.id} item={item} />)}
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
