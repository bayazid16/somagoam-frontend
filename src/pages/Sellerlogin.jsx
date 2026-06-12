// pages/seller/SellerLogin.jsx
// Completely separate seller login page — /seller/login

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function SellerLogin() {
  const { login }    = useSellerAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(form.email, form.password);

      if (data.seller.status === 'banned' || data.seller.status === 'rejected') {
        setError(data.message);
        return;
      }
      navigate('/seller/dashboard');
    } catch (err) {
      const d = err.response?.data;
      if (d?.email)    setError(d.email);
      else if (d?.password) setError(d.password);
      else if (d?.error)    setError(d.error);
      else setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#A33B26] flex-col justify-between p-12">
        <div>
          <div className="border-[1.5px] border-white/40 inline-block px-4 py-1.5 mb-12">
            <span className="text-white text-xl font-bold tracking-[0.2em] uppercase">SOMAGOAM</span>
          </div>
          <h1 className="text-4xl font-serif text-white leading-snug mb-4">
            Grow your business <br />
            <span className="italic font-light opacity-80">with Bangladesh's</span><br />
            heritage marketplace.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Join thousands of artisans and producers selling authentic GI-certified
            products to customers across the country and beyond.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Sellers', value: '2,400+' },
            { label: 'Monthly Orders', value: '18,000+' },
            { label: 'Districts Covered', value: '64' },
          ].map(s => (
            <div key={s.label} className="border border-white/20 p-4 rounded">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-white/60 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="border-[1.5px] border-[#A33B26] inline-block px-4 py-1.5">
              <span className="text-[#A33B26] text-xl font-bold tracking-[0.2em] uppercase">SOMAGOAM</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Seller Login</h2>
          <p className="text-gray-500 text-sm mb-8">
            Access your seller dashboard
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required
                placeholder="seller@example.com"
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#A33B26]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/seller/forgot-password" className="text-xs text-[#A33B26] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} required
                placeholder="Enter your password"
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#A33B26]"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#A33B26] text-white py-3 text-sm font-bold uppercase tracking-widest rounded hover:bg-[#8B2F1D] disabled:opacity-60 transition"
            >
              {loading ? 'Signing in...' : 'Login to Seller Center'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              New seller?{' '}
              <Link to="/seller/register" className="text-[#A33B26] font-bold hover:underline">
                Apply to sell on Somagoam
              </Link>
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Regular customer?{' '}
              <Link to="/login" className="hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
