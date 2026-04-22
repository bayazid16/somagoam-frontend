// src/services/payment.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your actual backend URL

export const initiatePayment = async (orderData) => {
  try {
    // This calls your backend, which then calls SSLCommerz
    const response = await axios.post(`${API_URL}/payment/init`, orderData);
    
    if (response.data && response.data.url) {
      // The backend returns the SSLCommerz Gateway URL
      window.location.replace(response.data.url);
    }
  } catch (error) {
    console.error("Payment Initialization Failed:", error);
    alert("Could not initialize payment. Please try again.");
  }
};