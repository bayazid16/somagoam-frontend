import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance'; 

import roshmalai from '../assets/cumilla_roshmalai.png';
import NoProducts from '../components/NoProducts';

export default function Food() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState(''); 

  const districts = ["All Regions", "Cumilla", "Natore", "Bogura", "Rajshahi", "Sylhet", "Barishal"];

  useEffect(() => {
  const fetchFood = async () => {
    setLoading(true);
    try {
      let url = '/api/products/products/?category=2'; 
      if (selectedDistrict && selectedDistrict !== "All Regions") {
        url += `&origin_district=${selectedDistrict.toLowerCase()}`;
      }

      const response = await axiosInstance.get(url);
      setProducts(response.data.results ?? response.data); 
    } catch (error) {
      console.error("Error loading heritage food:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchFood();
}, [selectedDistrict]);

  const sections = [
    {
    title: "All Heritage Food",
    subtitle: "",
    warning: "GI Certified Products",
    items: products  
  }
  ];

  const getProductImage = (item) => item.image || item.img || roshmalai;

  const PaginatedFoodGrid = ({ sectionItems }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sectionItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sectionItems.length / itemsPerPage);

    return (
      <>
        {/* FIXED: Changed grid-cols-1 to grid-cols-2 for mobile view */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {currentItems.map((item, iIdx) => {
            return (
              <div key={iIdx} className="food-card bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-300 group flex flex-col shadow-sm">
                <Link to={`/product/${item.slug}`} className="relative h-40 md:h-60 overflow-hidden block">
                  <img src={getProductImage(item)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold tracking-widest uppercase">{item.region || item.origin_district}</div>
                </Link>

                <div className="p-3 md:p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-2 md:mb-3">
                    <span className="bg-green-50 text-green-700 text-[7px] md:text-[9px] font-extrabold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                      {item.is_gi ? "GI CERTIFIED" : (item.badge || "AUTHENTIC")}
                    </span>
                    <span className="brand-color font-bold italic serif text-[8px] md:text-[10px] hidden xs:block">Heritage Food</span>
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
                    <span className="text-[8px] md:text-[10px] text-stone-400 font-bold">
                      ({item.rating || 5}.0)
                    </span>
                  </div>

                  <p className="text-stone-500 text-[10px] md:text-xs flex-grow mb-3 md:mb-4 line-clamp-2 hidden sm:block">{item.description || item.desc}</p>
                  
                  <div className="pt-2 md:pt-4 mt-auto border-t border-stone-100 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
                    <span className="font-bold font-sans text-[10px] md:text-sm text-stone-900 whitespace-nowrap">৳ {item.price}{item.unit || '/ kg'}</span>
                    <button 
                      onClick={() => addToCart({ ...item, price: parseFloat(item.price) })}
                      className="brand-bg text-white w-full xs:w-auto px-2 md:px-3 py-1.5 md:py-2 text-[8px] md:text-[9px] uppercase font-bold tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 border border-stone-200 rounded-full disabled:opacity-20 hover:bg-stone-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
              Page {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 border border-stone-200 rounded-full disabled:opacity-20 hover:bg-stone-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Gathering fresh heritage delicacies...</div>
    </div>
  );

  return (
    <div className="bg-[#F9F7F2] min-h-screen">
      <header className="px-6 md:px-10 py-12 md:py-20 text-center">
        <span className="brand-color text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 block font-bold">The Taste of Tradition</span>
        <h1 className="text-4xl md:text-7xl serif mb-4 md:mb-6">GI <span className="italic font-light">Food</span></h1>
        <p className="max-w-2xl mx-auto text-stone-500 text-xs md:text-sm leading-relaxed italic px-4">
          "Authentic flavors from the specific regions of Bangladesh, verified for purity."
        </p>
      </header>

      <div className="px-4 md:px-10 mb-8 flex flex-col md:flex-row items-center gap-6 border-b border-stone-200/50 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Regional Varieties:</span>
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

      {products.length > 0 ? (
        <>
          {sections.map((section, sIdx) => (
            section.items.length > 0 && (
              <main key={sIdx} className="px-4 md:px-10 py-6">
                <div className="cat-header border-l-4 border-[#A33B26] pl-4 md:pl-6 mb-6 md:mb-8 mt-4 md:mt-12">
                  <h2 className="text-xl md:text-3xl serif">{section.title} <span className="text-[10px] md:text-sm font-sans font-light text-stone-400 ml-2">{section.subtitle}</span></h2>
                  <p className="text-[8px] md:text-xs uppercase tracking-widest font-semibold text-stone-500">
                    {section.warning}
                  </p>
                </div>
                <PaginatedFoodGrid sectionItems={section.items} />
              </main>
            )
          ))}
        </>
      ) : (
        <NoProducts category={selectedDistrict ? `${selectedDistrict} Delicacies` : "GI Food Delicacies"} />
      )}

      <section className="mx-4 md:mx-10 my-12 md:my-20 bg-white p-6 md:p-12 border border-stone-200 text-center rounded-sm shadow-sm">
        <h2 className="text-xl md:text-3xl serif mb-4 md:mb-6">Your Safety is Our <span className="brand-color">Heritage</span></h2>
        <p className="text-stone-600 text-xs md:text-sm leading-loose max-w-2xl mx-auto mb-8 italic">
          We eliminate fake products by connecting you directly to the original sweetsmiths (Moyras) and artisans. Every box is tracked from source to doorstep.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {['🔬 Lab Verified', '📦 Vacuum Sealed', '🌍 Global Express'].map((trait, tIdx) => (
            <div key={tIdx} className="flex items-center space-x-3">
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-[#A33B26] pb-1">{trait}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
