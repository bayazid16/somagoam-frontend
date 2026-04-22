import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axiosInstance from '../api/axiosInstance';
// Assets
import logo from '../assets/logo.png';
import mapBg from '../assets/map.png';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const fullName = formData.fullName.trim();
  const email = formData.email.trim();
  const password = formData.password.trim();
  const confirmPassword = formData.confirmPassword.trim();

  if (!fullName || !email || !password) {
    setError("All fields are required.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match!");
    return;
  }

  setLoading(true);
  setError('');

  const nameParts = fullName.split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    await axiosInstance.post('/api/auth/registration/', {
      username: email,
      email,
      password1: password,
      password2: confirmPassword,
      first_name: firstName,
      last_name: lastName,
    });

    navigate('/login', {
      state: {
        message: "🎉 Welcome to Somagom! Please check your email and verify your account before signing in."
      }
    });

  } catch (err) {
  if (!err.response) {
    setError("Network error. Check your connection.");
  } else {
    const data = err.response.data;

    if (typeof data === 'string') {
      setError(data);
    } else if (data?.email) {
      setError(`Email: ${Array.isArray(data.email) ? data.email[0] : data.email}`);
    } else if (data?.username) {
      // ✅ username error means email already registered
      setError("An account with this email already exists.");
    } else if (data?.password1) {
      setError(`Password: ${Array.isArray(data.password1) ? data.password1[0] : data.password1}`);
    } else if (data?.password2) {
      setError(`Password: ${Array.isArray(data.password2) ? data.password2[0] : data.password2}`);
    } else if (data?.non_field_errors) {
      setError(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
    } else if (data?.detail) {
      setError(data.detail);
    } else {
      // ✅ show all errors if nothing matched
      const allErrors = Object.entries(data)
        .map(([key, val]) => `${Array.isArray(val) ? val[0] : val}`)
        .join(' ');
      setError(allErrors || "Registration failed. Try again.");
    }
  }
}
};


  const handleSocialAuth = (provider) => {
  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  window.location.href = `${backendUrl}/accounts/${provider}/login/`;
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#fcf8f7] relative px-5 py-10">
      {/* Background Map Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0"
        style={{ 
          backgroundImage: `url(${mapBg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      ></div>

      <div className="bg-white w-full max-w-[500px] p-8 md:p-10 rounded-[24px] shadow-lg border border-[#A33B26]/10 z-10">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={logo} alt="Logo" className="w-[45px] h-auto" />
          <h1 className="font-['Great_Vibes'] text-[#A33B26] text-4xl leading-none">Somagom</h1>
        </div>

        <h2 className="font-['Great_Vibes'] text-3xl text-[#333] text-center mb-1">Join Us</h2>
        <p className="text-center text-[#888] text-[11px] tracking-widest uppercase mb-8">Create your account</p>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="relative mb-6">
            <label className="absolute -top-[9px] left-[15px] bg-white px-2 text-[11px] font-semibold text-[#A33B26] uppercase tracking-wider z-10">
              Full Name
            </label>
            <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#A33B26]">
              <i className="fa-regular fa-user"></i>
            </span>
            <input 
              type="text" 
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full py-4 pl-12 pr-4 border border-[#e0c8c4] rounded-xl outline-none focus:border-[#A33B26] transition-all"
              required 
            />
          </div>

          {/* Email Address */}
          <div className="relative mb-6">
            <label className="absolute -top-[9px] left-[15px] bg-white px-2 text-[11px] font-semibold text-[#A33B26] uppercase tracking-wider z-10">
              Email Address
            </label>
            <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#A33B26]">
              <i className="fa-regular fa-envelope"></i>
            </span>
            <input 
              type="email" 
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-4 pl-12 pr-4 border border-[#e0c8c4] rounded-xl outline-none focus:border-[#A33B26] transition-all"
              required 
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <label className="absolute -top-[9px] left-[15px] bg-white px-2 text-[11px] font-semibold text-[#A33B26] uppercase tracking-wider z-10">
              Password
            </label>
            <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#A33B26]">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-4 pl-12 pr-4 border border-[#e0c8c4] rounded-xl outline-none focus:border-[#A33B26] transition-all"
              required 
            />
          </div>

          {/* Confirm Password */}
          <div className="relative mb-6">
            <label className="absolute -top-[9px] left-[15px] bg-white px-2 text-[11px] font-semibold text-[#A33B26] uppercase tracking-wider z-10">
              Confirm Password
            </label>
            <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#A33B26]">
              <i className="fa-solid fa-shield-halved"></i>
            </span>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full py-4 pl-12 pr-4 border border-[#e0c8c4] rounded-xl outline-none focus:border-[#A33B26] transition-all"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 bg-[#A33B26] text-white rounded-xl font-bold tracking-widest transition-all active:scale-95 mb-6 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#802e1e]'}`}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-4 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
            Or continue with
          </span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => handleSocialAuth('google')}
            className="flex items-center justify-center gap-2 py-3 border border-[#e0c8c4] rounded-xl hover:bg-stone-50 transition-all active:scale-95 text-sm font-semibold text-stone-700"
          >
            <i className="fa-brands fa-google text-red-500"></i> Google
          </button>
          <button 
            onClick={() => handleSocialAuth('facebook')}
            className="flex items-center justify-center gap-2 py-3 border border-[#e0c8c4] rounded-xl hover:bg-stone-50 transition-all active:scale-95 text-sm font-semibold text-stone-700"
          >
            <i className="fa-brands fa-facebook text-blue-600"></i> Facebook
          </button>
        </div>

        <p className="text-center text-sm text-stone-500 mt-2">
          Already have an account? <Link to="/login" className="text-[#A33B26] font-bold">Login Now</Link>
        </p>
      </div>
    </div>
  );
}