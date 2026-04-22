import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function SocialCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const completeSocialLogin = async () => {
      try {
        // We call the 'user' endpoint. 
        // Because 'withCredentials: true' is set in axiosInstance, 
        // it will send the Django Session cookie automatically.
        const response = await axiosInstance.get('/api/auth/user/');
        
        // Save user info so the rest of your app knows you're logged in
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('access_token', 'social_authenticated');
        
        // Success! Go to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error("Social auth failed:", err);
        navigate('/login');
      }
    };

    completeSocialLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf8f7]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33B26] mx-auto mb-4"></div>
        <h2 className="text-[#A33B26] font-bold">Completing Somagom Sign-in...</h2>
      </div>
    </div>
  );
}