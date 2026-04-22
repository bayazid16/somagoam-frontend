import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

// Import images
import dhakaJamdani from '../assets/dhaka_jamdani.jpg';
import sareeStory from '../assets/saree_story.jpg';
import NoProducts from "../components/NoProducts";

export default function Fashion() {
  const { addToCart } = useCart();
  
  // Integration State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState(''); // New Filter State
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Available Districts for Somagom
  const districts = ["All Regions", "Tangail", "Narayanganj", "Rajshahi", "Sirajganj", "Cumilla"];

  useEffect(() => {
  const fetchFashion = async () => {
    setLoading(true);
    try {
      let url = '/api/products/products/?category=3';
      if (selectedDistrict && selectedDistrict !== "All Regions") {
        url += `&origin_district=${selectedDistrict.toLowerCase()}`;
      }
      const response = await axiosInstance.get(url);
      setProducts(response.data.results ?? response.data); // ✅ handles pagination
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching fashion products:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchFashion();
}, [selectedDistrict]);
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Unfolding Heritage Weaves...</div>
    </div>
  );

  return (
    <div className="bg-[#F9F7F2]">
      {/* Header */}
      <header className="px-10 py-16 text-center border-b border-stone-200">
        <span className="brand-color text-xs uppercase tracking-[0.4em] mb-4 block font-bold">Threads of History</span>
        <h1 className="text-5xl md:text-7xl serif mb-6">Heritage <span className="italic font-light">Fashion</span></h1>
        <p className="max-w-2xl mx-auto text-stone-500 text-sm leading-relaxed italic">
          "Certified authentic weaves directly from the looms of master artisans."
        </p>
      </header>

      {/* Product Grid */}
      <main className="px-10 py-16 min-h-[400px]">
        
        {/* DISTRICT FILTER SIDEBAR/HEADER */}
        <div className="mb-12 flex flex-col md:flex-row items-center gap-6 border-b border-stone-100 pb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Filter By District:</span>
            <div className="flex flex-wrap gap-2">
              {districts.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist === "All Regions" ? "" : dist)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    (selectedDistrict === dist || (dist === "All Regions" && !selectedDistrict))
                      ? 'bg-[#A33B26] text-white border-[#A33B26] shadow-md'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-[#A33B26]'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentProducts.map((item, index) => {
                

                return (
                  <div key={index} className="product-card flex flex-col bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-300 group shadow-sm">
                    
                    {/* Clickable Image Area */}
                    <Link to={`/product/${item.slug}`} className="relative h-80 overflow-hidden block">
                      <img 
                        src={item.image || item.img || dhakaJamdani} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                        {item.region || item.origin_district || "Bangladesh"}
                      </div>
                    </Link>

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[8px] font-extrabold px-2 py-1 rounded uppercase tracking-wider ${item.is_gi ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'}`}>
                          {item.is_gi ? "GI Certified" : "Heritage Authentic"}
                        </span>
                        <span className="brand-color font-bold italic serif text-[10px]">{item.type || 'Fashion'}</span>
                      </div>
                      
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="serif text-xl mb-1 hover:text-[#A33B26] transition-colors">{item.name}</h3>
                      </Link>

                      {/* Rating Section */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-[#A33B26]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < (item.rating || 5) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400 font-bold">
                          ({item.rating || 5}.0) <span className="ml-1 font-normal italic">from {item.review_count || 0} reviews</span>
                        </span>
                      </div>
                      
                      <p className="text-stone-500 text-xs flex-grow mb-4 line-clamp-2">{item.desc || item.description}</p>
                      
                      <div className="pt-4 mt-auto border-t border-stone-100 flex justify-between items-center">
                        <span className="font-bold text-sm text-stone-900">৳ {parseFloat(item.price).toLocaleString()}</span>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => addToCart({ ...item, price: parseFloat(item.price) })}
                            className="brand-bg text-white px-3 py-2 text-[9px] uppercase font-bold tracking-widest hover:opacity-90 transition-opacity"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-stone-100 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-8 h-8 text-[10px] font-bold rounded-full transition-all ${
                        currentPage === i + 1 
                        ? 'brand-bg text-white shadow-md' 
                        : 'border border-stone-200 text-stone-400 hover:border-[#A33B26]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* INTEGRATED EMPTY STATE */
          <NoProducts category={selectedDistrict ? `${selectedDistrict} Fashion` : "Heritage Fashion"} />
        )}
      </main>

      {/* Artisan Spotlight */}
      <section className="mx-6 md:mx-10 my-20 bg-white p-12 flex flex-col md:flex-row items-center gap-12 border border-stone-200 rounded-sm shadow-sm">
        <div className="md:w-1/3">
          <img src={sareeStory} className="w-full grayscale rounded-sm shadow-lg hover:grayscale-0 transition-all duration-700" alt="Artisan Spotlight" />
        </div>
        <div className="md:w-2/3">
          <span className="brand-color text-xs uppercase tracking-[0.3em] font-bold">Artisan Spotlight</span>
          <h2 className="text-4xl serif mt-2 mb-6 text-stone-900">The Hands Behind the Loom</h2>
          <p className="text-stone-600 leading-relaxed mb-6 italic">
            Each thread is hand-spun and every motif is manually woven by master weavers who have kept this heritage alive for over 400 years. We visit every loom personally to ensure the Somagom promise.
          </p>
          <button className="brand-bg text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest transition hover:opacity-90 shadow-md">
            Read Their Stories
          </button>
        </div>
      </section>
    </div>
  );
}