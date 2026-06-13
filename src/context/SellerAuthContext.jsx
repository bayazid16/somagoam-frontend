// context/SellerAuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance'; // সাধারণ ইউজারের জন্য (যেখানে দরকার)
import sellerAxiosInstance from '../api/sellerAxiosInstance'; // নতুন তৈরি করা সেলার ইনস্ট্যান্স

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

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const res = await sellerAxiosInstance.post('/api/seller/register/', formData);
    const { seller, tokens } = res.data;
    localStorage.setItem('seller_access_token',  tokens.access);
    localStorage.setItem('seller_refresh_token', tokens.refresh);
    localStorage.setItem('seller', JSON.stringify(seller));
    setSeller(seller);
    return seller;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await sellerAxiosInstance.post('/api/seller/login/', { email, password });
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
      const res = await sellerAxiosInstance.get('/api/seller/me/');
      localStorage.setItem('seller', JSON.stringify(res.data));
      setSeller(res.data);
    } catch { 
      logout(); 
    }
  }, [logout]);

  const isApproved = seller?.status === 'approved';
  const isPending  = seller?.status === 'pending';
  const isRejected = seller?.status === 'rejected';

  return (
    <SellerAuthContext.Provider value={{
      seller, loading, isApproved, isPending, isRejected,
      register, login, logout, refreshSeller, 
      sellerAxios: sellerAxiosInstance, // এখানে সরাসরি ইনস্ট্যান্স পাস করে দিলাম
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
