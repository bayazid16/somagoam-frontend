// pages/seller/SellerProducts.jsx
// Product management tab for Seller Dashboard
// Replace the "Products Tab" section in SellerDashboard.jsx with this

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { Plus, Trash2, Package, X } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function SellerProducts() {
  const { seller, sellerAxios } = useSellerAuth();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState(null);
  const [success,     setSuccess]     = useState(null);

  const [form, setForm] = useState({
    name: '', price: '', stock: '', description: '', category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // ── Fetch seller's products ────────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await sellerAxios.get('/api/seller/products/');
      setProducts(res.data.products ?? res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/api/products/categories/');
      setCategories(res.data.results ?? res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Image preview ─────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Form change ───────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setFormErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name)     e.name     = 'Product name is required.';
    if (!form.price)    e.price    = 'Price is required.';
    if (!form.category) e.category = 'Category is required.';
    if (!imageFile)     e.image    = 'Product image is required.';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit new product ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', imageFile);

      const res = await sellerAxios.post('/api/seller/products/add/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Add to list immediately
      setProducts(prev => [res.data, ...prev]);
      setSuccess('Product added successfully! It will appear in the relevant category page.');
      setShowForm(false);
      setForm({ name: '', price: '', stock: '', description: '', category: '' });
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      const d = err.response?.data;
      if (typeof d === 'object') setFormErrors(d);
      else setError('Failed to add product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete product ────────────────────────────────────────────────────────
  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await sellerAxios.delete(`/api/seller/products/${productId}/`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">My Products</h2>
          <p className="text-sm text-gray-400">{products.length} products listed</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#A33B26] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#8B2F1D] transition rounded">
            <Plus size={14} /> Add Product
          </button>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ── Add Product Form ──────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800">Add New Product</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Image upload */}
            <div className="md:col-span-2">
              <label className={labelClass}>Product Image *</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="preview"
                      className="w-24 h-24 object-cover border border-gray-200 rounded" />
                    <button type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded flex flex-col items-center justify-center cursor-pointer hover:border-[#A33B26] transition">
                    <Plus size={20} className="text-gray-300" />
                    <span className="text-[10px] text-gray-300 mt-1">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
                {formErrors.image && <p className={errorClass}>{formErrors.image}</p>}
              </div>
            </div>

            {/* Product name */}
            <div className="md:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Cumilla Roshmalai (500g)"
                className={inputClass} />
              {formErrors.name && <p className={errorClass}>{formErrors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {formErrors.category && <p className={errorClass}>{formErrors.category}</p>}
              <p className="text-[10px] text-gray-400 mt-1">
                Product will appear in Fashion / Food / Crafts page based on category.
              </p>
            </div>

            {/* Price */}
            <div>
              <label className={labelClass}>Price (BDT) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange}
                placeholder="500" min="0" step="0.01" className={inputClass} />
              {formErrors.price && <p className={errorClass}>{formErrors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className={labelClass}>Stock Quantity</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange}
                placeholder="50" min="0" className={inputClass} />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="Describe your product..."
                className={`${inputClass} resize-none`} />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting}
                className="bg-[#A33B26] text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8B2F1D] disabled:opacity-60">
                {submitting ? 'Adding...' : 'Add Product'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-500 text-xs font-semibold rounded hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Product List ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 animate-pulse">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center shadow-sm">
          <Package size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No products yet.</p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 bg-[#A33B26] text-white px-6 py-2 text-xs font-bold uppercase tracking-widest rounded hover:opacity-90">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden md:table-cell">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 overflow-hidden rounded flex-shrink-0">
                        {product.image && (
                          <img src={product.image} alt={product.name}
                            className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                        <Link to={`/product/${product.slug}`} target="_blank"
                          className="text-[10px] text-[#A33B26] hover:underline">
                          View →
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                    {product.category_name}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">
                    ৳ {product.price}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
const inputClass  = "w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#A33B26]";
const errorClass  = "text-red-500 text-xs mt-1";
