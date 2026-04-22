import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState(null); // Bug 1 fixed

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products/products/', {
          signal: controller.signal
        });
        setProducts(response.data.results ?? response.data); //  Bug 3 fixed
      } catch (err) {
        if (err.name !== 'CanceledError') { //  Bug 2 fixed
          console.error("Error:", err);
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

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-stone-500">
      <p>{error}</p>
    </div>
  );

  const fashionProducts = products.filter(p => p.category_name === 'fashions' || p.category_name === 'clothing');
  const foodProducts = products.filter(p => p.category_name === 'foods' || p.category_name === 'food');
  const craftsProducts = products.filter(p => p.category_name === 'crafts' || p.category_name === 'handicraft');

  return (
    <div className="min-h-screen bg-[#F9F7F2] animate-in fade-in duration-1000">
      <Hero />
      <Features />
      {products.length > 0 && <Highlights items={products.slice(0, 3)} />}
      <section id="fashion-preview">
        {fashionProducts.length > 0 ? <Fashion products={fashionProducts} /> : <div className="py-20"><NoProducts category="Heritage Fashion" /></div>}
      </section>
      <section id="food-preview">
        {foodProducts.length > 0 ? <Food products={foodProducts} /> : <div className="py-20"><NoProducts category="GI Food" /></div>}
      </section>
      <section id="crafts-preview">
        {craftsProducts.length > 0 ? <Crafts products={craftsProducts} /> : <div className="py-20"><NoProducts category="Artisanal Crafts" /></div>}
      </section>
      <Stats />
      <About />
    </div>
  );
}