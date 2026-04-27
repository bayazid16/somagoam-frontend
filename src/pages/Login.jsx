import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import logo from '../assets/logo.png';
import mapBg from '../assets/map.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const successMessage = location.state?.message;

  // auto show resend if coming from registration
  const [showResend, setShowResend] = useState(!!location.state?.message);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleResend = async () => {
    if (!resendEmail) {
      setError("Please enter your email to resend verification.");
      return;
    }
    setResendLoading(true);
    setError('');
    try {
      await axiosInstance.post('/api/auth/registration/resend-email/', {
        email: resendEmail,
      });
      setResendSuccess("Verification email resent! Check your inbox.");
    } catch (err) {
      setError("Failed to resend. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // helper to check if message is about email verification
  const isEmailError = (msg) => {
    if (!msg) return false;
    const lower = msg.toLowerCase();
    return lower.includes('verify') ||
           lower.includes('verified') ||
           lower.includes('confirmed') ||
           lower.includes('e-mail') ||
           lower.includes('email');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/api/auth/login/', {
        email: credentials.email.trim(),
        password: credentials.password.trim(),
      });

      if (!response.data.access || !response.data.refresh) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      navigate('/dashboard');

    } catch (err) {
      if (!err.response) {
        setError("Network error. Please check your connection.");
      } else {
        const data = err.response.data;

        if (data?.non_field_errors) {
          setError(data.non_field_errors[0]);
          if (isEmailError(data.non_field_errors[0])) {
            setShowResend(true);
          }
        } else if (data?.detail) {
          setError(data.detail);
          // also check detail for email errors
          if (isEmailError(data.detail)) {
            setShowResend(true);
          }
        } else {
          setError("Invalid email or password.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${backendUrl}/api/accounts/${provider}/login/`;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#fcf8f7] relative px-5">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0"
        style={{ backgroundImage: `url(${mapBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="bg-white w-full max-w-[450px] p-10 md:p-12 rounded-[24px] shadow-lg border border-[#A33B26]/10 z-10">
        <div className="flex items-center justify-center gap-1 mb-2">
          <img src={logo} alt="Logo" className="w-[50px] h-auto" />
          <h1 className="font-['Great_Vibes'] text-[#A33B26] text-4xl leading-none">Somagom</h1>
        </div>

        <h2 className="font-['Great_Vibes'] text-3xl text-[#333] text-center mb-1">Welcome</h2>
        <p className="text-center text-[#888] text-[11px] tracking-widest uppercase mb-8">Secure Login</p>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-[11px] font-bold uppercase">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold uppercase">
            {error}
          </div>
        )}

        {/* shows when coming from register OR when email not verified error */}
        {showResend && (
          <div className="mb-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <p className="text-[11px] text-stone-500 uppercase tracking-widest mb-3">
              Didn't receive verification email?
            </p>
            {resendSuccess && (
              <p className="text-[11px] text-green-600 font-bold mb-2">
                {resendSuccess}
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="flex-1 py-2 px-3 border border-[#e0c8c4] rounded-lg outline-none focus:border-[#A33B26] text-sm"
              />
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="px-4 py-2 bg-[#A33B26] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {resendLoading ? '...' : 'Resend'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              value={credentials.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full py-4 pl-12 pr-4 border border-[#e0c8c4] rounded-xl outline-none focus:border-[#A33B26] focus:ring-4 focus:ring-[#A33B26]/5 transition-all"
              required
            />
          </div>

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
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full py-4 pl-12 pr-4 border border-[#e0c8c4] rounded-xl outline-none focus:border-[#A33B26] focus:ring-4 focus:ring-[#A33B26]/5 transition-all"
              required
            />
          </div>

          <div className="flex justify-end mb-6">
            <button type="button" className="text-[12px] text-stone-400 hover:text-[#A33B26] transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-[#A33B26] text-white rounded-xl font-bold tracking-widest transition-transform active:scale-95 shadow-md ${loading ? 'opacity-50' : 'hover:bg-[#802e1e]'}`}
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-1 border-b border-stone-100"></div>
          <span className="px-3 text-[10px] text-stone-400 font-bold uppercase tracking-widest">Or continue with</span>
          <div className="flex-1 border-b border-stone-100"></div>
        </div>
        
        {/* Corrected Social Buttons - Only one block now */}
        <div className="flex gap-4 mb-8">
          <button 
            type="button" 
            onClick={() => handleSocialLogin('google')} 
            className="flex-1 h-12 border border-stone-100 rounded-xl flex items-center justify-center hover:bg-stone-50 transition-colors gap-2"
          >
            <i className="fab fa-google text-[#DB4437]"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Google</span>
          </button>
  
          <button 
            type="button" 
            onClick={() => handleSocialLogin('facebook')} 
            className="flex-1 h-12 border border-stone-100 rounded-xl flex items-center justify-center hover:bg-stone-50 transition-colors gap-2"
          >
            <i className="fab fa-facebook-f text-[#4267B2]"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Facebook</span>
          </button>
        </div>

        <p className="text-center text-sm text-stone-500">
          New here? <Link to="/register" className="text-[#A33B26] font-bold">Create an Account</Link>
        </p>
      </div>
    </div>
  );
}
