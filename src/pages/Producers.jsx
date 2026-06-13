// pages/Producers.jsx
// Sellers with category badge + product examples
// Click seller card or product → SellerStore page

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Package, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import NoProducts from '../components/NoProducts';

const DIVISIONS  = ["All Regions","Dhaka","Chattogram","Rajshahi","Khulna","Barishal","Sylhet","Rangpur","Mymensingh"];
const CATEGORIES = ["All","Food & GI Products","Fashion & Clothing","Handicrafts","Pottery & Ceramics"];

export default function Producers() {
  const [sellers,      setSellers]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [division,     setDivision]     = useState('');
  const [category,     setCategory]     = useState('');
  const [searchInput,  setSearchInput]  = useState('');
  const [search,       setSearch]       = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      try {
        let url = '/api/sellers/';
        const params = [];
        if (division && division !== 'All Regions') params.push(`division=${encodeURIComponent(division)}`);
        if (category && category !== 'All')         params.push(`category=${encodeURIComponent(category)}`);
        if (search)                                  params.push(`search=${encodeURIComponent(search)}`);
        if (params.length) url += '?' + params.join('&');
        const res = await axiosInstance.get(url);
        setSellers(res.data.results ?? res.data);
      } catch (err) {
        console.error('Failed to load producers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [division, category, search]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Finding our artisans...</div>
    </div>
  );

  return (
    <div className="bg-[#F9F7F2] min-h-screen">

      {/* Header */}
      <header className="px-6 md:px-10 py-12 md:py-20 text-center">
        <span className="brand-color text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 block font-bold">
          Authentic Artisans & Producers
        </span>
        <h1 className="text-4xl md:text-7xl serif mb-4 md:mb-6">
          Meet the <span className="italic font-light">Makers</span>
        </h1>
        <p className="max-w-2xl mx-auto text-stone-500 text-xs md:text-sm leading-relaxed italic px-4">
          "Every product tells the story of the hands that made it."
        </p>
      </header>

      {/* Search + Filters */}
      <div className="px-4 md:px-10 mb-8 border-b border-stone-200/50 pb-10">
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search producers, shops..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput.trim())}
              className="w-full bg-white border border-stone-200 py-2.5 px-5 text-sm rounded-sm focus:outline-none focus:border-[#A33B26]"
            />
            <button onClick={() => setSearch(searchInput.trim())}
              className="absolute right-0 top-0 h-full px-4 bg-[#A33B26] text-white text-[10px] font-bold uppercase tracking-widest">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 self-center">Region:</span>
            {DIVISIONS.map((d) => (
              <button key={d} onClick={() => setDivision(d === 'All Regions' ? '' : d)}
                className={`px-3 md:px-5 py-1.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  (division === d || (d === 'All Regions' && !division))
                    ? 'bg-[#A33B26] text-white border-[#A33B26]'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-[#A33B26]'
                }`}>
                {d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 self-center">Category:</span>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c === 'All' ? '' : c)}
                className={`px-3 md:px-5 py-1.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  (category === c || (c === 'All' && !category))
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sellers Grid */}
      {sellers.length === 0 ? (
        <NoProducts category={division || category || "Producers"} />
      ) : (
        <main className="px-4 md:px-10 py-6 pb-20">
          <div className="border-l-4 border-[#A33B26] pl-4 md:pl-6 mb-8">
            <h2 className="text-xl md:text-3xl serif">All Producers</h2>
            <p className="text-[8px] md:text-xs uppercase tracking-widest font-semibold text-stone-400">
              {sellers.length} verified seller{sellers.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => <SellerCard key={seller.id} seller={seller} />)}
          </div>
        </main>
      )}

      {/* Join CTA */}
      <section className="mx-4 md:mx-10 my-12 md:my-20 bg-white p-6 md:p-12 border border-stone-200 text-center shadow-sm">
        <h2 className="text-xl md:text-3xl serif mb-4">
          Are you an artisan or producer?
        </h2>
        <p className="text-stone-500 text-xs md:text-sm leading-loose max-w-xl mx-auto mb-6 italic">
          Join our platform and connect your authentic products with customers who truly appreciate Bangladesh's heritage.
        </p>
        <Link to="/seller/register"
          className="inline-block bg-[#A33B26] text-white px-10 py-3 text-[10px] md:text-xs uppercase font-bold tracking-widest hover:opacity-90 transition">
          Apply to Sell
        </Link>
      </section>
    </div>
  );
}

// ── Seller Card with product examples ─────────────────────────────────────────
function SellerCard({ seller }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch 3 sample products for this seller
    axiosInstance.get(`/api/sellers/${seller.slug}/products/?page_size=3`)
      .then(res => setProducts((res.data.products ?? res.data).slice(0, 3)))
      .catch(() => {});
  }, [seller.slug]);

  const rating = parseFloat(seller.rating || 0);

  return (
    <div className="bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-300 shadow-sm flex flex-col">

      {/* Banner + Logo */}
      <Link to={`/producers/${seller.slug}`} className="block">
        <div className="relative h-32 overflow-hidden bg-stone-100">
          {seller.banner ? (
            <img src={seller.banner} alt="banner"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#A33B26]/10 to-[#C5A059]/20" />
          )}
          {/* Category badge */}
          {seller.category && (
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-stone-600">
              {seller.category}
            </div>
          )}
          {/* Logo */}
          <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-full border-2 border-white bg-white overflow-hidden shadow">
            {seller.logo ? (
              <img src={seller.logo} alt={seller.company_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#A33B26] flex items-center justify-center text-white font-bold text-lg">
                {seller.company_name?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-8 px-4 pb-3">
        <Link to={`/producers/${seller.slug}`}>
          <h3 className="serif text-base font-bold hover:text-[#A33B26] transition-colors line-clamp-1">
            {seller.company_name}
          </h3>
        </Link>
        {seller.tagline && (
          <p className="text-[10px] text-stone-400 italic line-clamp-1 mt-0.5">{seller.tagline}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {seller.district && (
            <span className="flex items-center gap-0.5 text-[9px] text-stone-400 font-bold uppercase tracking-wider">
              <MapPin size={8} />{seller.district}
            </span>
          )}
          {rating > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#A33B26]">
              <Star size={9} fill="currentColor" />
              {rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-0.5 text-[9px] text-stone-400">
            <Package size={8} />{seller.total_products} products
          </span>
        </div>
      </div>

      {/* ── Product examples ──────────────────────────────────────────── */}
      {products.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2">Products</p>
          <div className="grid grid-cols-3 gap-1.5">
            {products.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`}
                className="aspect-square overflow-hidden bg-stone-100 hover:opacity-80 transition-opacity">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 text-xs">
                    No img
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* View store button */}
      <div className="px-4 pb-4 mt-auto">
        <Link to={`/producers/${seller.slug}`}
          className="flex items-center justify-between w-full border border-stone-200 hover:border-[#A33B26] hover:text-[#A33B26] px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-stone-500 transition-all group">
          View All Products
          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
