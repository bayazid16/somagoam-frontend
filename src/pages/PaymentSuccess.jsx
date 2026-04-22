import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Integration for cleanup

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  
  // Integration: Get the transaction ID from the URL (provided by SSLCommerz)
  const transactionId = searchParams.get('id') || "SOMAGOM-" + Math.floor(Math.random() * 100000);

  useEffect(() => {
    // Integration: Crucial step - wipe the local storage and state cart 
    // so the user starts fresh for their next heritage discovery.
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-6">
      <div className="bg-white p-10 md:p-12 rounded-sm shadow-sm border border-stone-200 text-center max-w-lg w-full animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600 w-12 h-12" />
        </div>
        
        <h1 className="serif text-4xl mb-2 text-stone-900">Payment Successful!</h1>
        <p className="text-[#A33B26] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
          Order Authenticated via Somagom Protocol
        </p>
        
        <div className="bg-stone-50 border border-stone-100 p-4 mb-8 text-left rounded-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Transaction ID</span>
            <span className="text-xs font-mono text-stone-700">{transactionId}</span>
          </div>
          <p className="text-[12px] text-stone-500 leading-relaxed">
            Your support directly benefits the artisans in our network. A confirmation email and digital heritage certificate have been sent to your registered address.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="brand-bg text-white py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg"
          >
            Track My Order <ArrowRight size={14} />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="border border-stone-900 text-stone-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-stone-100 flex items-center justify-center gap-2 text-stone-400">
          <ShoppingBag size={14} />
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Thank you for choosing Somagom</span>
        </div>
      </div>
    </div>
  );
}