import axios from 'axios';
const VITE_API_BASE_URL='https://somagoam-database-dlilb.ondigitalocean.app/backend'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

// process queued requests
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

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❗ if no response (network error)
    if (!error.response) {
      return Promise.reject(error);
    }

    const isAuthRoute =
      originalRequest.url.includes('/api/auth/login/') ||
      originalRequest.url.includes('/api/auth/registration/') ||
      originalRequest.url.includes('/api/auth/token/refresh/');

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {

      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');

        const res = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;

        localStorage.setItem('access_token', newAccess);

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        processQueue(err, null);

        // ❗ clear everything
        localStorage.clear();

        // ❗ redirect safely
        window.location.pathname = '/login';

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
