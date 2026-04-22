import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Star, ShieldCheck } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/products/${slug}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        region: product.origin_district || product.region,
        quantity: quantity
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Authenticating Heritage Data...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-stone-400">Product not found in our heritage records.</div>
    </div>
  );

  return (
    <div className="bg-[#F9F7F2] min-h-screen pb-20">

      {/* Breadcrumb */}
      <nav className="px-6 md:px-10 py-6 text-[10px] uppercase tracking-widest text-stone-400">
        <span className="cursor-pointer hover:text-[#A33B26]" onClick={() => navigate('/')}>Home</span> /
        <span className="mx-2">{product.category_name || 'Heritage'}</span> /
        <span className="text-stone-900 ml-2 font-bold">{product.name}</span>
      </nav>

      <div className="px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">

        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-stone-200 overflow-hidden rounded-sm">
            <img
              src={product.image || `https://images.unsplash.com/photo-1615886753866-79396abc446e?q=80&w=687&auto=format&fit=crop`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product.gallery || [1, 2, 3, 4]).map((img, i) => (
              <div key={i} className="aspect-square bg-stone-300 cursor-pointer hover:opacity-80 overflow-hidden">
                {img.url && <img src={img.url} className="object-cover w-full h-full" alt="Gallery" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">

            <span className="brand-color text-[10px] font-bold uppercase tracking-[0.3em]">
              {product.category_name || 'Heritage'}
            </span>

            <h1 className="text-4xl md:text-5xl serif mt-2 mb-4">{product.name}</h1>

            {/* ✅ price */}
            <p className="text-2xl font-light mb-4">৳ {parseFloat(product.price).toLocaleString()}</p>

            {/* ✅ rating */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex text-[#A33B26]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.average_rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-stone-500">
                ({product.average_rating || 0}) · {product.reviews?.length || 0} reviews
              </span>
            </div>

            <div className="space-y-6 text-stone-600 text-sm leading-relaxed mb-10">
              <p>{product.description}</p>
              <ul className="grid grid-cols-2 gap-y-2 border-t border-stone-200 pt-6">
                {(product.specs || ["GI Certified", "Handmade"]).map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#A33B26] rounded-full"></span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ stock warning */}
            {product.stock <= 0 && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
                Out of Stock
              </p>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="flex items-center border border-stone-300 px-4 py-2 bg-white">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 hover:text-[#A33B26]">-</button>
                  <span className="px-4 font-bold min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-2 hover:text-[#A33B26]">+</button>
                </div>

                {/* ✅ disabled if out of stock */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-grow border border-stone-900 text-stone-900 font-bold uppercase tracking-widest text-xs py-4 hover:bg-stone-900 hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Bag
                </button>
              </div>

              {/* ✅ disabled if out of stock */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full brand-bg text-white font-bold uppercase tracking-widest text-xs py-5 hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-4 h-4" /> Buy Now & Support Heritage
              </button>
            </div>

            {/* Credibility Box */}
            <div className="bg-white border border-[#A33B26]/10 p-6 rounded-sm space-y-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-xl text-[#A33B26] pt-1">🔬</div>
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-wider mb-1">GI Verification</h4>
                  <p className="text-[12px] text-stone-500">
                    {product.gi_status || "Certified (GI-01)"} - Authenticated by Somagom Protocol.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-xl text-[#A33B26] pt-1">👨‍🎨</div>
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-wider mb-1">Meet the Artisan</h4>
                  <p className="text-[12px] text-stone-500">
                    {product.artisan_name || 'Master Artisan'}, from {product.origin_district || 'the heritage hub'}.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-xl text-[#A33B26] pt-1">🚚</div>
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-wider mb-1">Shipping Estimate</h4>
                  <p className="text-[12px] text-stone-500">
                    {product.shipping_time || '7-10 Days (Global Available)'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <hr className="border-stone-200 mx-6 md:mx-10" />

      {/* ✅ Reviews Section */}
      <div className="py-16 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl serif mb-4 text-stone-900">Heritage Voices</h2>
            <p className="text-[#A33B26] uppercase tracking-[0.2em] text-[10px] font-bold">
              Authentic Experiences
            </p>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex text-[#A33B26] mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <h4 className="font-bold text-stone-900">{rev.user}</h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                        {rev.created_at}
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-600 italic text-sm">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-400 border border-dashed border-stone-200 rounded-sm">
              <p className="italic">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}