// pages/SellerStore.jsx
// Shows seller profile + all products + overall rating
// Route: /producers/:slug

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Package, ShoppingBag, ExternalLink, ArrowLeft } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import NoProducts from '../components/NoProducts';

const CATEGORIES = ['All', 'Fashion', 'Food', 'Crafts'];

export default function SellerStore() {
  const { slug }       = useParams();
  const navigate       = useNavigate();
  const { addToCart }  = useCart();

  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        let url = `/api/sellers/${slug}/products/`;
        if (category !== 'All') url += `?category=${category}`;
        const res = await axiosInstance.get(url);
        setData(res.data);
      } catch (err) {
        setError('Seller not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug, category]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Loading seller store...</div>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-center">
        <p className="text-stone-400 mb-4">{error}</p>
        <Link to="/producers" className="text-[#A33B26] font-bold text-sm">← All Producers</Link>
      </div>
    </div>
  );

  const { seller, products } = data;
  const rating = parseFloat(seller.rating || 0);

  return (
    <div className="bg-[#F9F7F2] min-h-screen">

      {/* ── Banner ─────────────────────────────────────────────────────── */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-stone-200">
        {seller.banner ? (
          <img src={seller.banner} alt="banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#A33B26]/20 to-[#C5A059]/30" />
        )}
        <div className="absolute inset-0 bg-black/25" />

        {/* Back button */}
        <button
          onClick={() => navigate('/producers')}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-white/30 transition"
        >
          <ArrowLeft size={12} /> All Producers
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10">

        {/* ── Profile header ──────────────────────────────────────────── */}
        <div className="relative -mt-14 mb-8 flex flex-col md:flex-row items-start md:items-end gap-4">

          {/* Logo */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg flex-shrink-0">
            {seller.logo ? (
              <img src={seller.logo} alt={seller.company_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#A33B26] flex items-center justify-center text-white text-4xl font-bold">
                {seller.company_name?.charAt(0)}
              </div>
            )}
          </div>

          {/* Seller name + info */}
          <div className="flex-1 pb-1">
            <h1 className="text-2xl md:text-4xl serif font-bold text-stone-800">
              {seller.company_name}
            </h1>
            {seller.tagline && (
              <p className="text-stone-500 italic text-sm mt-1">{seller.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {seller.district && (
                <span className="flex items-center gap-1 text-xs text-stone-400 font-bold uppercase tracking-wider">
                  <MapPin size={10} /> {seller.district}, {seller.division}
                </span>
              )}
              {seller.category && (
                <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 font-bold uppercase tracking-widest">
                  {seller.category}
                </span>
              )}
            </div>
          </div>

          {/* Stats box */}
          <div className="flex gap-5 bg-white border border-stone-100 px-6 py-4 shadow-sm">
            <StatBox label="Products" value={seller.total_products} />
            <StatBox label="Sales"    value={seller.total_sales} />
            <div className="text-center">
              <div className="flex justify-center text-[#A33B26] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12}
                    fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <div className="text-sm font-bold text-stone-800">{rating.toFixed(1)}</div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400">Rating</div>
            </div>
          </div>
        </div>

        {/* ── Bio ─────────────────────────────────────────────────────── */}
        {seller.bio && (
          <div className="bg-white border border-stone-100 p-5 mb-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">About</p>
            <p className="text-stone-600 text-sm leading-relaxed">{seller.bio}</p>
          </div>
        )}

        {/* ── Overall Rating Bar ───────────────────────────────────────── */}
        {rating > 0 && (
          <div className="bg-white border border-stone-100 p-5 mb-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-4">Overall Rating</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-stone-800">{rating.toFixed(1)}</div>
                <div className="flex justify-center text-[#A33B26] my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <div className="text-xs text-stone-400">{seller.total_sales} sales</div>
              </div>

              {/* Rating bars */}
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 w-4">{star}</span>
                    <Star size={9} className="text-[#A33B26]" fill="currentColor" />
                    <div className="flex-1 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#A33B26] h-full rounded-full"
                        style={{ width: star === Math.round(rating) ? '65%' : `${Math.max(5, (star / 5) * 40)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Products ─────────────────────────────────────────────────── */}
        <div className="mb-16">
          <div className="border-l-4 border-[#A33B26] pl-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl serif">
                Products by <span className="text-[#A33B26]">{seller.company_name}</span>
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                {data.total_count} item{data.total_count !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all ${
                    category === c
                      ? 'bg-[#A33B26] text-white border-[#A33B26]'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-[#A33B26]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <NoProducts category={`${seller.company_name} — ${category}`} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((item) => (
                <ProductCard key={item.id} item={item} addToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub components ────────────────────────────────────────────────────────────

function StatBox({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-stone-800">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-stone-400">{label}</div>
    </div>
  );
}

function ProductCard({ item, addToCart }) {
  return (
    <div className="bg-white border border-stone-100 hover:border-[#A33B26] transition-all group shadow-sm flex flex-col">
      <Link to={`/product/${item.slug}`} className="block h-44 md:h-52 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 mb-1">
          {item.category_name}
        </span>
        <Link to={`/product/${item.slug}`}>
          <h3 className="serif text-sm font-bold line-clamp-1 hover:text-[#A33B26] transition-colors">
            {item.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <span className="font-bold text-sm text-stone-900">৳ {item.price}</span>
          <button
            onClick={() => addToCart({ ...item, price: parseFloat(item.price) })}
            className="brand-bg text-white px-2 md:px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
