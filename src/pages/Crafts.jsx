import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

// Import images (Keep for fallback and Spotlight)
import shataranji from '../assets/shataranji.png';
import craftStory from '../assets/craft_story.jpg';
import NoProducts from "../components/NoProducts";

export default function Crafts() {
  const { addToCart } = useCart();
  
  // Integration State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState(''); // New Filter State

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Available Districts for Somagom Crafts
  const districts = ["All Regions", "Rangpur", "Jessore", "Sylhet", "Jamalpur", "Rajshahi"];

  useEffect(() => {
  const fetchCrafts = async () => {
    setLoading(true);
    try {
      let url = '/api/products/products/?category=4'; //  no hardcoded URL
      if (selectedDistrict && selectedDistrict !== "All Regions") {
        url += `&origin_district=${selectedDistrict.toLowerCase()}`;
      }

      const response = await axiosInstance.get(url);
      setProducts(response.data.results ?? response.data); //  handles pagination
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching artisanal crafts:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchCrafts();
}, [selectedDistrict]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCrafts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Gathering hand-carved heritage...</div>
    </div>
  );

  return (
    <div className="bg-[#F9F7F2]">
      {/* Header */}
      <header className="px-10 py-20 text-center">
        <span className="brand-color text-xs uppercase tracking-[0.4em] mb-4 block font-bold">Handmade in Bangladesh</span>
        <h1 className="text-5xl md:text-7xl serif mb-6">Artisanal <span className="italic font-light">Crafts</span></h1>
        <p className="max-w-2xl mx-auto text-stone-500 text-sm leading-relaxed italic">
          "Preserving the soul of rural artistry through authentic, Geographical Indication (GI) certified handiwork."
        </p>
      </header>

      {/* DISTRICT FILTER AREA */}
      <div className="px-10 mb-12 flex flex-col md:flex-row items-center gap-6 border-b border-stone-200 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Craft Regions:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {districts.map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist === "All Regions" ? "" : dist)}
                className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  (selectedDistrict === dist || (dist === "All Regions" && !selectedDistrict))
                    ? 'bg-[#A33B26] text-white border-[#A33B26] shadow-sm'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-[#A33B26]'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="px-10 py-12 min-h-[400px]">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {currentCrafts.map((item, index) => {
                

                return (
                  <div key={index} className="bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-500 transform hover:-translate-y-2 flex flex-col group shadow-sm">
                    
                    {/* Image Section */}
                    <Link to={`/product/${item.slug}`} className="relative h-72 overflow-hidden block">
                      <img 
                        src={item.image || item.img || shataranji} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={item.name} 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                        {item.region || item.origin_district || "Bangladesh"}
                      </div>
                    </Link>

                    <div className="p-8 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-[8px] font-extrabold px-2 py-1 rounded uppercase tracking-wider ${item.is_gi ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'}`}>
                          {item.is_gi ? "GI Status" : "Heritage Authentic"}
                        </span>
                        <span className="brand-color font-bold italic serif text-[11px]">{item.type || 'Handicraft'}</span>
                      </div>
                      
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="text-2xl serif mb-1 hover:text-[#A33B26] transition-colors">{item.name}</h3>
                      </Link>

                      {/* Rating Display */}
                      <div className="flex items-center gap-1 mb-4">
                        <div className="flex text-[#A33B26]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < (item.rating || 5) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400 font-bold">
                          ({item.rating || 5}.0) <span className="ml-1 font-normal italic">by {item.review_count || 0} collectors</span>
                        </span>
                      </div>
                      
                      <p className="text-stone-500 text-xs leading-relaxed flex-grow line-clamp-2">{item.desc || item.description}</p>
                      
                      {/* Action Section */}
                      <div className="pt-6 border-t border-stone-100 flex justify-between items-center mt-4">
                        <span className="text-lg font-light text-stone-900">৳ {parseFloat(item.price).toLocaleString()}</span>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => addToCart({ ...item, price: parseFloat(item.price) })}
                            className="brand-bg text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-opacity"
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
              <div className="mt-20 flex justify-center items-center gap-4">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-stone-100 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="flex gap-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-10 h-10 text-[11px] font-bold rounded-full transition-all ${
                        currentPage === i + 1 
                        ? 'brand-bg text-white shadow-lg' 
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
                  className="p-3 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* INTEGRATED EMPTY STATE */
          <NoProducts category={selectedDistrict ? `${selectedDistrict} Crafts` : "Artisanal Crafts"} />
        )}
      </main>

      {/* Artisan Spotlight */}
      <section className="mx-10 my-20 bg-white p-12 flex flex-col md:flex-row items-center gap-12 border border-stone-200 rounded-sm shadow-sm">
        <div className="md:w-1/3">
          <img src={craftStory} className="w-full grayscale rounded-sm shadow-xl hover:grayscale-0 transition-all duration-700" alt="Artisan hands" />
        </div>
        <div className="md:w-2/3">
          <span className="brand-color text-xs uppercase tracking-[0.3em] font-bold">Artisan Spotlight</span>
          <h2 className="text-4xl serif mt-2 mb-6 text-stone-900">The Hands Behind the Craft</h2>
          <p className="text-stone-600 leading-relaxed mb-6 italic">
            From Jessore’s Shotoronji looms to Sylhet’s Shital Pati mats, every craft is shaped by skilled hands and inherited knowledge.
          </p>
          <button className="brand-bg text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest transition hover:opacity-90 shadow-md">
            Read Their Stories
          </button>
        </div>
      </section>
    </div>
  );
}