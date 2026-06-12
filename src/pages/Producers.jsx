import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Package, ShoppingBag, ExternalLink } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import NoProducts from '../components/NoProducts';

const DIVISIONS = [
  "All Regions", "Dhaka", "Chattogram", "Rajshahi",
  "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"
];

const CATEGORIES = [
  "All", "Food & GI Products", "Fashion & Clothing",
  "Handicrafts", "Pottery & Ceramics", "Leather Goods", "Jewelry"
];

export default function Producers() {
  const [sellers,   setSellers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [division,  setDivision]  = useState('');
  const [category,  setCategory]  = useState('');
  const [search,    setSearch]    = useState('');
  const [searchInput, setSearchInput] = useState('');

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

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') setSearch(searchInput.trim());
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Finding our artisans...</div>
    </div>
  );

  return (
    <div className="bg-[#F9F7F2] min-h-screen">

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <header className="px-6 md:px-10 py-12 md:py-20 text-center">
        <span className="brand-color text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 block font-bold">
          Authentic Artisans & Producers
        </span>
        <h1 className="text-4xl md:text-7xl serif mb-4 md:mb-6">
          Meet the <span className="italic font-light">Makers</span>
        </h1>
        <p className="max-w-2xl mx-auto text-stone-500 text-xs md:text-sm leading-relaxed italic px-4">
          "Every product tells the story of the hands that made it —
          directly from the heart of Bangladesh."
        </p>
      </header>

      {/* ── Search + Filters ─────────────────────────────────────────────── */}
      <div className="px-4 md:px-10 mb-8 border-b border-stone-200/50 pb-10">

        {/* Search bar */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search producers, shops..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="w-full bg-white border border-stone-200 py-2.5 px-5 text-sm rounded-sm focus:outline-none focus:border-[#A33B26] placeholder:text-stone-300"
            />
            <button
              onClick={() => setSearch(searchInput.trim())}
              className="absolute right-0 top-0 h-full px-4 bg-[#A33B26] text-white text-[10px] font-bold uppercase tracking-widest"
            >
              Search
            </button>
          </div>
        </div>

        {/* Division filter */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mr-1">
              Region:
            </span>
            {DIVISIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDivision(d === 'All Regions' ? '' : d)}
                className={`px-3 md:px-5 py-1.5 md:py-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  (division === d || (d === 'All Regions' && !division))
                    ? 'bg-[#A33B26] text-white border-[#A33B26] shadow-sm'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-[#A33B26]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mr-1">
              Category:
            </span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === 'All' ? '' : c)}
                className={`px-3 md:px-5 py-1.5 md:py-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  (category === c || (c === 'All' && !category))
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sellers Grid ─────────────────────────────────────────────────── */}
      {sellers.length === 0 ? (
        <NoProducts category={division || category || "Producers"} />
      ) : (
        <main className="px-4 md:px-10 py-6 pb-20">

          {/* Count */}
          <div className="border-l-4 border-[#A33B26] pl-4 md:pl-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl serif">
              All Producers
              <span className="text-[10px] md:text-sm font-sans font-light text-stone-400 ml-3">
                {division || category ? `— ${division || category}` : ''}
              </span>
            </h2>
            <p className="text-[8px] md:text-xs uppercase tracking-widest font-semibold text-stone-400">
              {sellers.length} verified seller{sellers.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </main>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="mx-4 md:mx-10 my-12 md:my-20 bg-white p-6 md:p-12 border border-stone-200 text-center shadow-sm">
        <h2 className="text-xl md:text-3xl serif mb-4">
          Are you an artisan or producer?
        </h2>
        <p className="text-stone-600 text-xs md:text-sm leading-loose max-w-2xl mx-auto mb-8 italic">
          Join our platform and connect your authentic products with customers
          who truly appreciate Bangladesh's heritage.
        </p>
        <Link
          to="/seller/register"
          className="inline-block bg-[#A33B26] text-white px-10 py-3 text-[10px] md:text-xs uppercase font-bold tracking-widest hover:opacity-90 transition"
        >
          Apply to Sell
        </Link>
      </section>
    </div>
  );
}


// ── Seller Card ────────────────────────────────────────────────────────────────

function SellerCard({ seller }) {
  return (
    <div className="bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-300 group flex flex-col shadow-sm">

      {/* Banner */}
      <div className="relative h-28 md:h-36 overflow-hidden bg-stone-100">
        {seller.banner ? (
          <img
            src={seller.banner}
            alt={`${seller.company_name} banner`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#A33B26]/10 via-stone-100 to-[#C5A059]/20" />
        )}

        {/* Category badge */}
        {seller.category && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-stone-600">
            {seller.category}
          </div>
        )}

        {/* Logo — overlaps banner bottom */}
        <div className="absolute -bottom-5 left-4 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white overflow-hidden bg-white shadow-md">
          {seller.logo ? (
            <img
              src={seller.logo}
              alt={seller.company_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#A33B26] flex items-center justify-center text-white font-bold text-xl">
              {seller.company_name?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="pt-8 px-4 pb-4 flex flex-col flex-grow">

        {/* Name */}
        <Link to={`/producers/${seller.slug}`}>
          <h3 className="serif text-sm md:text-base font-bold text-stone-800 hover:text-[#A33B26] transition-colors line-clamp-1 mb-1">
            {seller.company_name}
          </h3>
        </Link>

        {/* Tagline */}
        {seller.tagline && (
          <p className="text-[10px] md:text-xs text-stone-400 italic line-clamp-1 mb-2">
            {seller.tagline}
          </p>
        )}

        {/* Location */}
        {(seller.district || seller.division) && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={10} className="text-stone-400 flex-shrink-0" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {[seller.district, seller.division].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Rating */}
        {seller.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-[#A33B26]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={9}
                  fill={i < Math.round(seller.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-[9px] text-stone-400 font-bold">
              ({parseFloat(seller.rating).toFixed(1)})
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Package size={10} className="text-stone-400" />
              <span className="text-[9px] md:text-[10px] font-bold text-stone-500">
                {seller.total_products} Products
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag size={10} className="text-stone-400" />
              <span className="text-[9px] md:text-[10px] font-bold text-stone-500">
                {seller.total_sales} Sales
              </span>
            </div>
          </div>

          {/* View button */}
          <Link
            to={`/producers/${seller.slug}`}
            className="flex items-center gap-1 brand-bg text-white px-2 md:px-3 py-1.5 text-[8px] md:text-[9px] uppercase font-bold tracking-widest hover:opacity-90 transition"
          >
            View
            <ExternalLink size={8} />
          </Link>
        </div>
      </div>
    </div>
  );
}
