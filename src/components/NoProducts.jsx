import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, Bell, ArrowLeft, MailCheck } from 'lucide-react';

export default function NoProducts({ category = "Heritage Items" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email) {
      // Integration: You can push this email to a 'waiting_list' collection in your backend
      console.log(`Subscribed ${email} for category: ${category}`);
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F9F7F2] px-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        
        {/* Icon & Message */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto border border-stone-200">
            <PackageSearch size={40} className="text-stone-300" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#A33B26] text-white p-2 rounded-full shadow-lg">
            <Bell size={16} className="animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="serif text-3xl text-stone-900">Vault Currently Empty</h2>
          <p className="text-sm text-stone-500 leading-relaxed italic">
            Our artisans are currently crafting fresh {category} batches. 
            Because we prioritize GI-certified quality, production takes time.
          </p>
        </div>

        {/* Integration: Newsletter/Notification Form */}
        {!subscribed ? (
          <form onSubmit={handleNotify} className="bg-white p-6 border border-stone-200 shadow-sm rounded-sm space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A33B26]">
              Get Notified on Restock
            </p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                required
                placeholder="Enter your email address"
                className="w-full p-4 border border-stone-200 focus:border-[#A33B26] outline-none text-sm italic bg-stone-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit"
                className="brand-bg text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Join the Waiting List
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-100 p-6 rounded-sm flex flex-col items-center gap-3">
            <MailCheck className="text-green-600" size={24} />
            <p className="text-xs font-bold text-green-800 uppercase tracking-widest">You're on the list!</p>
            <p className="text-[11px] text-green-700">We'll email you the moment these heritage pieces arrive.</p>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 border border-stone-900 text-stone-900 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-900 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-stone-100 text-stone-600 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition"
          >
            Explore Other Categories
          </button>
        </div>

        <div className="pt-10 border-t border-stone-200">
          <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400">
            Somagom Protocol: Authenticity Guaranteed
          </p>
        </div>
      </div>
    </div>
  );
}