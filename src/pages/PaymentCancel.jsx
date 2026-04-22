import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCcw, ArrowLeft, MessageCircle } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Integration: Extracting any potential error message or transaction ID 
  // from the URL to help the user understand why it failed.
  const errorMessage = searchParams.get('message') || "The transaction was not completed.";

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-6">
      <div className="bg-white p-10 md:p-12 rounded-sm shadow-sm border border-stone-200 text-center max-w-lg w-full animate-in slide-in-from-bottom duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-red-600 w-12 h-12" />
        </div>
        
        <h1 className="serif text-4xl mb-2 text-stone-900">Payment Cancelled</h1>
        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
          Transaction Aborted
        </p>

        <div className="bg-red-50/50 border border-red-100 p-4 mb-8 text-left rounded-sm">
          <p className="text-[12px] text-red-800 leading-relaxed font-medium">
            {errorMessage} If your account was debited, please contact our support team immediately with your transaction details.
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full brand-bg text-white py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/')}
              className="border border-stone-900 text-stone-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} /> Home
            </button>
            <button 
              onClick={() => window.location.href = 'mailto:support@somagom.com'}
              className="border border-stone-200 text-stone-600 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} /> Support
            </button>
          </div>
        </div>

        <p className="mt-8 text-[9px] text-stone-400 uppercase tracking-widest leading-loose">
          Your cart is still saved. You won't lose your selected heritage items.
        </p>
      </div>
    </div>
  );
}