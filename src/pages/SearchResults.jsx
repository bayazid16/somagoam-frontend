import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';
import { Star } from 'lucide-react';
import NoProducts from '../components/NoProducts';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axiosInstance.get(`/api/products/products/?search=${encodeURIComponent(query)}`)
      .then(res => setResults(res.data.results ?? res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
      <div className="text-[#A33B26] serif animate-pulse">Searching heritage records...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] px-10 py-16">
      <h1 className="serif text-4xl mb-2">
        Results for <span className="italic text-[#A33B26]">"{query}"</span>
      </h1>
      <p className="text-stone-400 text-xs uppercase tracking-widest mb-12">
        {results.length} heritage items found
      </p>

      {results.length === 0 ? (
        <NoProducts category={`"${query}"`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map(item => (
            <div key={item.id} className="bg-white border border-stone-100 hover:border-[#A33B26] transition-all duration-300 group flex flex-col shadow-sm">
              <Link to={`/product/${item.slug}`} className="relative h-64 overflow-hidden block">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                  {item.origin_district || 'Bangladesh'}
                </div>
              </Link>

              <div className="p-6 flex flex-col flex-grow">
                <span className={`text-[8px] font-extrabold px-2 py-1 rounded uppercase tracking-wider w-fit mb-3 ${item.is_gi ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'}`}>
                  {item.is_gi ? 'GI Certified' : 'Heritage Authentic'}
                </span>

                <Link to={`/product/${item.slug}`}>
                  <h3 className="serif text-xl mb-2 hover:text-[#A33B26] transition-colors">{item.name}</h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  <div className="flex text-[#A33B26]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < (item.rating || 5) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400">({item.rating || 5}.0)</span>
                </div>

                <p className="text-stone-500 text-xs flex-grow mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-stone-100 flex justify-between items-center mt-auto">
                  <span className="font-bold text-sm text-stone-900">
                    ৳ {parseFloat(item.price).toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart({ ...item, price: parseFloat(item.price) })}
                    className="brand-bg text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}