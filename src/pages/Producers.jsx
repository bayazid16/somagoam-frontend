import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, ShoppingBag, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function ProducerShop() {
  const { slug } = useParams();
  const collectionRef = useRef(null);
  
  const [producer, setProducer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducerShop = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetching profile metadata and products from your backend server
        const response = await axiosInstance.get(`/api/producers/${slug}/`, {
          signal: controller.signal
        });
        
        setProducer(response.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError("This artisan profile or shop collection could not be found.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProducerShop();
    }

    return () => controller.abort();
  }, [slug]);

  const handleShopNowClick = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. LOADING SKELETON STATE
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F7F2] py-16 px-4 sm:px-6 lg:px-8 animate-pulse space-y-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="h-4 w-32 bg-stone-200 rounded" />
          <div className="h-48 bg-white border border-stone-200 rounded-xl w-full" />
          <div className="space-y-4">
            <div className="h-6 w-48 bg-stone-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-80 bg-white border border-stone-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error || !producer) {
    return (
      <div className="w-full min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-serif text-stone-800 mb-2">Shop Directory Offline</h2>
        <p className="text-stone-500 text-sm mb-6 max-w-sm">{error || "The requested artisan shop does not exist."}</p>
        <Link to="/producers" className="text-sm font-medium text-[#A33B26] flex items-center gap-2 border border-[#A33B26]/20 bg-white px-4 py-2 rounded-md hover:bg-[#A33B26] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to All Producers
        </Link>
      </div>
    );
  }

  // Fallback safe defaults if backend missing properties
  const productList = Array.isArray(producer.products) ? producer.products : [];

  return (
    <div className="w-full min-h-screen bg-[#F9F7F2] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <Link to="/producers" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-[#A33B26] transition-colors">
          <ArrowLeft size={14} /> Back to Producers
        </Link>

        {/* Dynamic Individual Profile Header */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-xs">
          <div className="w-36 h-36 rounded-full overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 shadow-inner">
            <img 
              src={producer.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"} 
              alt={producer.name} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left w-full">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-serif text-stone-900">{producer.name}</h1>
                
                {producer.is_verified !== false && (
                  <span className="inline-flex items-center gap-1 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-sans uppercase font-medium tracking-wider px-2 py-0.5 rounded-full mx-auto md:mx-0 w-max">
                    <ShieldCheck size={12} /> Somagom Verified Artisan
                  </span>
                )}
              </div>
              <p className="text-stone-400 font-sans tracking-wide text-xs mt-1">
                {producer.role || "Master Artisan"} {producer.started && `• Started ${producer.started}`}
              </p>
            </div>

            {producer.bio && (
              <p className="text-stone-600 text-sm max-w-2xl font-light leading-relaxed">
                "{producer.bio}"
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-center md:justify-start gap-6 text-xs font-medium text-stone-700">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-stone-400" /> {producer.district || "Bangladesh"} District
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag size={13} className="text-stone-400" /> {producer.products_count || productList.length} Total Items
                </span>
              </div>

              {productList.length > 0 && (
                <button 
                  onClick={handleShopNowClick}
                  className="inline-flex items-center justify-center gap-2 bg-[#A33B26] text-white px-5 py-2.5 text-xs font-semibold tracking-wider uppercase hover:bg-[#8B3220] transition-colors rounded-md shadow-xs"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Catalog Grid */}
        <div ref={collectionRef} className="space-y-6 scroll-mt-6">
          <h2 className="text-lg font-serif text-stone-800 border-b border-stone-200 pb-2 flex items-center justify-between">
            <span>Exclusive Collection</span>
            <span className="text-xs font-sans text-stone-400 font-normal">Showing {productList.length} Products</span>
          </h2>

          {productList.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200/60 rounded-xl">
              <ShoppingBag className="mx-auto text-stone-300 mb-3" size={32} />
              <p className="text-stone-500 font-serif text-sm">No products listed in this shop collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productList.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="group bg-white border border-stone-200/60 rounded-lg overflow-hidden flex flex-col shadow-xs"
                >
                  <div className="aspect-square w-full bg-stone-100 overflow-hidden relative">
                    <img 
                      src={product.image || "/api-placeholder-image.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-xs text-stone-900 px-3 py-1.5 rounded text-[11px] font-medium tracking-wider uppercase shadow-xs flex items-center gap-1">
                        <Eye size={12} /> View Details
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <h3 className="font-sans text-sm text-stone-800 font-medium line-clamp-2 group-hover:text-[#A33B26] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <span className="text-stone-900 font-semibold text-sm">
                        {typeof product.price === 'number' ? `৳${product.price}` : product.price}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-[#A33B26] transition-colors">
                        {product.is_available !== false ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
