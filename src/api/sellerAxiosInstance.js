// src/api/sellerAxiosInstance.js

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const sellerAxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

// Process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Use seller_access_token
sellerAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('seller_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
sellerAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const isAuthRoute =
      originalRequest.url.includes('/api/seller/login/') ||
      originalRequest.url.includes('/api/seller/register/') ||
      originalRequest.url.includes('/api/auth/token/refresh/'); // আপনার ব্যাকএন্ড রাউট অনুযায়ী পরিবর্তন লাগতে পারে

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(sellerAxiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('seller_refresh_token');
        if (!refresh) throw new Error('No refresh token');

        // Note: Check if your backend uses a different endpoint for seller token refresh
        const res = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;

        localStorage.setItem('seller_access_token', newAccess);
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return sellerAxiosInstance(originalRequest);

      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem('seller_access_token');
        localStorage.removeItem('seller_refresh_token');
        localStorage.removeItem('seller');

        // Redirect to seller login
        window.location.pathname = '/seller/login';

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default sellerAxiosInstance;
