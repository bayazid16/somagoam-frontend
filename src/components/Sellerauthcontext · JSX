// context/SellerAuthContext.jsx
// Completely separate from AuthContext — uses seller_access_token

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const SellerAuthContext = createContext(null);

export function SellerAuthProvider({ children }) {
  const [seller,  setSeller]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('seller');
    const token  = localStorage.getItem('seller_access_token');
    if (stored && token) {
      setSeller(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // ── Axios instance with seller token ─────────────────────────────────────
  const sellerAxios = {
    get:  (url, config = {}) => axiosInstance.get(url, {
      ...config,
      headers: { Authorization: `Bearer ${localStorage.getItem('seller_access_token')}`, ...config.headers }
    }),
    post: (url, data, config = {}) => axiosInstance.post(url, data, {
      ...config,
      headers: { Authorization: `Bearer ${localStorage.getItem('seller_access_token')}`, ...config.headers }
    }),
    put:  (url, data, config = {}) => axiosInstance.put(url, data, {
      ...config,
      headers: { Authorization: `Bearer ${localStorage.getItem('seller_access_token')}`, ...config.headers }
    }),
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const res = await axiosInstance.post('/api/seller/register/', formData);
    const { seller, tokens } = res.data;
    localStorage.setItem('seller_access_token',  tokens.access);
    localStorage.setItem('seller_refresh_token', tokens.refresh);
    localStorage.setItem('seller', JSON.stringify(seller));
    setSeller(seller);
    return seller;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await axiosInstance.post('/api/seller/login/', { email, password });
    const { seller, tokens } = res.data;
    localStorage.setItem('seller_access_token',  tokens.access);
    localStorage.setItem('seller_refresh_token', tokens.refresh);
    localStorage.setItem('seller', JSON.stringify(seller));
    setSeller(seller);
    return res.data;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('seller_access_token');
    localStorage.removeItem('seller_refresh_token');
    localStorage.removeItem('seller');
    setSeller(null);
  }, []);

  // ── Refresh seller data ───────────────────────────────────────────────────
  const refreshSeller = useCallback(async () => {
    try {
      const res = await sellerAxios.get('/api/seller/me/');
      localStorage.setItem('seller', JSON.stringify(res.data));
      setSeller(res.data);
    } catch { logout(); }
  }, [logout]);

  const isApproved = seller?.status === 'approved';
  const isPending  = seller?.status === 'pending';
  const isRejected = seller?.status === 'rejected';

  return (
    <SellerAuthContext.Provider value={{
      seller, loading, isApproved, isPending, isRejected,
      register, login, logout, refreshSeller, sellerAxios,
    }}>
      {children}
    </SellerAuthContext.Provider>
  );
}

export const useSellerAuth = () => {
  const ctx = useContext(SellerAuthContext);
  if (!ctx) throw new Error('useSellerAuth must be inside SellerAuthProvider');
  return ctx;
};
