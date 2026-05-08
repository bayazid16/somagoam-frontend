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
  const [selectedDistrict, setSelectedDistrict] = useState(''); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Optimized for grid filling

  // Available Districts
  const districts = ["All Regions", "Rangpur", "Jessore", "Sylhet", "Jamalpur", "Rajshahi"];

  useEffect(() => {
    const fetchCrafts = async () => {
      setLoading(true);
      try {
        let url = '/api/products/products/?category=4'; 
        if (selectedDistrict && selectedDistrict !== "All Regions") {
          url += `&origin_district=${selectedDistrict.toLowerCase()}`;
        }

        const response = await axiosInstance.get(url);
        setProducts(response.data.results ?? response.data); 
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
    <div className="bg-[#F9F7F2] min-h-screen">
      {/* Header */}
      <header className="px-6 md:px-10 py-12 md:py-20 text-center">
        <span className="brand-color text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 block font-bold">Handmade in Bangladesh</span>
        <h1 className="text-4xl md:text-7xl serif mb-4 md:mb-6">Artisanal <span className="italic font-light">Crafts</span></h1>
        <p className="max-w-2xl mx-auto text-stone-500 text-xs md:text-sm leading-relaxed italic px-4">
          "Preserving the soul of rural artistry through authentic, Geographical Indication (GI) certified handiwork."
        </p>
      </header>

      {/* DISTRICT FILTER AREA */}
      <div className="px-4 md:px-10 mb-8 flex flex-col items-center gap-6 border-b border-stone-200 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Craft Regions:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {districts.map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist === "All Regions" ? "" : dist)}
                className={`px-3 md:px-5 py-1.5 md:py-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all border ${
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
      <main className="px-4 md:px-10 py-6 md:py-12 min-h-[400px]">
        {products.length > 0 ? (
          <>
            {/* GRID FIX: grid-cols-2 for mobile, grid-cols-3/4 for desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
              {currentCrafts.map((item, index) => (
                <div key={index} className="bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-500 transform md:hover:-translate-y-2 flex flex-col group shadow-sm">
                  
                  {/* Image Section */}
                  <Link to={`/product/${item.slug}`} className="relative h-44 md:h-72 overflow-hidden block">
                    <img 
                      src={item.image || item.img || shataranji} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={item.name} 
                    />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 px-2 py-0.5 md:px-3 md:py-1 text-[7px] md:text-[10px] font-bold tracking-widest uppercase">
                      {item.region || item.origin_district || "Bangladesh"}
                    </div>
                  </Link>

                  <div className="p-3 md:p-8 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-2 md:mb-4">
                      <span className={`text-[7px] md:text-[8px] font-extrabold px-1.5 py-0.5 md:px-2 md:py-1 rounded uppercase tracking-wider ${item.is_gi ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'}`}>
                        {item.is_gi ? "GI Status" : "Authentic"}
                      </span>
                      <span className="brand-color font-bold italic serif text-[8px] md:text-[11px]">{item.type || 'Handicraft'}</span>
                    </div>
                    
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="text-sm md:text-2xl serif mb-1 hover:text-[#A33B26] transition-colors line-clamp-1">{item.name}</h3>
                    </Link>

                    {/* Rating Display */}
                    <div className="flex items-center gap-1 mb-2 md:mb-4">
                      <div className="flex text-[#A33B26]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={8} className="md:w-[10px]" fill={i < (item.rating || 5) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-[8px] md:text-[10px] text-stone-400 font-bold">
                        ({item.rating || 5}.0)
                      </span>
                    </div>
                    
                    <p className="text-stone-500 text-[10px] md:text-xs leading-relaxed flex-grow line-clamp-2 hidden xs:block">{item.desc || item.description}</p>
                    
                    {/* Action Section */}
                    <div className="pt-2 md:pt-6 border-t border-stone-100 flex flex-col xs:flex-row justify-between items-start xs:items-center mt-2 md:mt-4 gap-2">
                      <span className="text-sm md:text-lg font-light text-stone-900">৳ {parseFloat(item.price).toLocaleString()}</span>
                      <button 
                        onClick={() => addToCart({ ...item, price: parseFloat(item.price) })}
                        className="brand-bg text-white w-full xs:w-auto px-3 md:px-4 py-1.5 md:py-2 text-[8px] md:text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-opacity"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 md:mt-20 flex justify-center items-center gap-2 md:gap-4">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 md:p-3 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-stone-100 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-1 md:gap-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-8 h-8 md:w-10 md:h-10 text-[9px] md:text-[11px] font-bold rounded-full transition-all ${
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
                  className="p-1.5 md:p-3 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <NoProducts category={selectedDistrict ? `${selectedDistrict} Crafts` : "Artisanal Crafts"} />
        )}
      </main>

      {/* Artisan Spotlight */}
      <section className="mx-4 md:mx-10 my-12 md:my-20 bg-white p-6 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-stone-200 rounded-sm shadow-sm">
        <div className="w-full md:w-1/3">
          <img src={craftStory} className="w-full grayscale rounded-sm shadow-xl hover:grayscale-0 transition-all duration-700 aspect-square md:aspect-auto object-cover" alt="Artisan hands" />
        </div>
        <div className="w-full md:w-2/3 text-center md:text-left">
          <span className="brand-color text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">Artisan Spotlight</span>
          <h2 className="text-2xl md:text-4xl serif mt-2 mb-4 md:mb-6 text-stone-900">The Hands Behind the Craft</h2>
          <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-6 italic px-2 md:px-0">
            From Jessore’s Shotoronji looms to Sylhet’s Shital Pati mats, every craft is shaped by skilled hands and inherited knowledge.
          </p>
          <button className="brand-bg text-white px-6 md:px-8 py-2.5 md:py-3 text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition hover:opacity-90 shadow-md">
            Read Their Stories
          </button>
        </div>
      </section>
    </div>
  );
}