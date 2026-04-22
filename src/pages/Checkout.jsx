import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: ''
  });

  // ✅ simple auth check — no redirect loop
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login'); // ✅ no state.from — always go home after login
    }
  }, [navigate]);

  // ✅ redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const deliveryGroups = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      let group = "Global Express";
      if (item.category === 'food' || item.type === 'food') group = "Heritage Fresh Delivery";
      else if (item.category === 'crafts' || item.category === 'fashion') group = "Artisan Direct (Tracked)";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [cartItems]);

  const subtotal = cartTotal;
  const shippingFees = Object.keys(deliveryGroups).length * 120;
  const total = subtotal + shippingFees;

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setPaymentError('');

    try {
      const checkoutRes = await axiosInstance.post('/api/cart/checkout/', {
        address: `${formData.fullName}, ${formData.phone}, ${formData.address}, ${formData.city}`,
      });
      const orderId = checkoutRes.data.order_id;

      const paymentRes = await axiosInstance.post('/api/payment/initiate-payment/', {
        order_id: orderId,
      });

      const redirectUrl = paymentRes.data.payment_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setPaymentError("Payment gateway did not return a URL. Please try again.");
      }

    } catch (error) {
      const serverError = error.response?.data?.error;
      setPaymentError(serverError || "Checkout failed. Please try again.");
      console.error("Checkout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.phone && formData.address && formData.city) {
      setStep(2);
    } else {
      alert("Please fill in all shipping details.");
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8">
          <div className="flex gap-8 mb-10 border-b border-stone-200 pb-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`text-xs font-bold uppercase tracking-widest ${step === 1 ? 'brand-color border-b-2 border-[#A33B26]' : 'text-stone-400'}`}
            >
              01 Shipping
            </button>
            <button
              type="button"
              disabled={step < 2}
              className={`text-xs font-bold uppercase tracking-widest ${step === 2 ? 'brand-color border-b-2 border-[#A33B26]' : 'text-stone-400'}`}
            >
              02 Payment
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="serif text-3xl">Shipping Address</h2>
              <form className="grid grid-cols-2 gap-4" onSubmit={nextStep}>
                <input
                  required
                  className="col-span-2 p-4 border border-stone-200 focus:outline-none focus:border-[#A33B26] bg-white"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
                <input
                  required
                  className="p-4 border border-stone-200 focus:outline-none focus:border-[#A33B26] bg-white"
                  placeholder="Mobile (+880)"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <input
                  required
                  className="p-4 border border-stone-200 focus:outline-none focus:border-[#A33B26] bg-white"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <textarea
                  required
                  className="col-span-2 p-4 border border-stone-200 h-32 focus:outline-none focus:border-[#A33B26] bg-white"
                  placeholder="Street Address / Village Details"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
                <button
                  type="submit"
                  className="col-span-2 brand-bg text-white py-4 text-xs font-bold uppercase tracking-widest mt-4 shadow-lg hover:opacity-90 transition"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="serif text-3xl">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['bkash', 'nagad', 'card'].map((method) => (
                  <div
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-6 border cursor-pointer transition-all ${paymentMethod === method ? 'border-[#A33B26] bg-white shadow-md' : 'border-stone-200 grayscale opacity-60'}`}
                  >
                    <div className="h-8 mb-4 flex items-center justify-center">
                      {method === 'bkash' && <span className="font-bold text-pink-600">bKash</span>}
                      {method === 'nagad' && <span className="font-bold text-orange-500">Nagad</span>}
                      {method === 'card' && <CreditCard className="text-stone-600" />}
                    </div>
                    <p className="text-[10px] uppercase tracking-tighter text-center font-bold">{method}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 border border-stone-200 shadow-sm">
                <h4 className="font-bold text-sm mb-4">Pay via {paymentMethod.toUpperCase()}</h4>
                <p className="text-stone-500 text-xs mb-6 leading-relaxed">
                  Upon clicking the button below, you will be redirected to the secure{' '}
                  <span className="font-bold text-stone-700">SSLCommerz</span> gateway to complete
                  your transaction of{' '}
                  <span className="font-bold text-stone-700">৳{total.toLocaleString()}</span>.
                </p>

                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold uppercase">
                    {paymentError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full brand-bg text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Redirecting to Secure Gateway...</span>
                  ) : (
                    <><ShieldCheck size={16} /> Pay ৳{total.toLocaleString()}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className="bg-white border border-stone-200 p-8 shadow-sm rounded-sm">
              <h3 className="serif text-xl mb-6">Your Heritage Box</h3>

              {Object.entries(deliveryGroups).map(([groupName, items]) => (
                <div key={groupName} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-4 h-4 brand-color" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A33B26]">
                      {groupName}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id || item.name} className="flex justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="text-stone-800 font-medium">
                            {item.name}{' '}
                            <span className="text-stone-400 text-xs ml-1">x{item.qty}</span>
                          </span>
                          <span className="text-[10px] text-stone-400 italic">
                            From {item.region || item.origin_district || 'Bangladesh'}
                          </span>
                        </div>
                        <span className="font-bold text-stone-900">
                          ৳{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-stone-100 mt-8 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span className="flex items-center gap-1">
                    Logistics Fee{' '}
                    <span className="text-[9px] bg-stone-100 px-1">
                      x{Object.keys(deliveryGroups).length} tracks
                    </span>
                  </span>
                  <span>৳{shippingFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-stone-900 mt-4">
                  <span>Final Total</span>
                  <span className="brand-color">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white border border-[#A33B26]/10 text-[10px] text-stone-500 uppercase tracking-widest font-bold">
              <ShieldCheck className="w-5 h-5 text-[#A33B26]" />
              Authenticity & GI Protection Guaranteed
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}