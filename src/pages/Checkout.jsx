import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, CheckCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step,          setStep]          = useState(1);
  const [loading,       setLoading]       = useState(false);
  const [paymentError,  setPaymentError]  = useState('');
  const [orderSuccess,  setOrderSuccess]  = useState(false);
  const [orderId,       setOrderId]       = useState(null);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', city: '', address: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) navigate('/');
  }, [cartItems, navigate, orderSuccess]);

  const deliveryGroups = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      let group = "Global Express";
      if (item.category === 'food' || item.type === 'food')
        group = "Heritage Fresh Delivery";
      else if (item.category === 'crafts' || item.category === 'fashion')
        group = "Artisan Direct (Tracked)";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [cartItems]);

  const subtotal    = cartTotal;
  const shippingFees = Object.keys(deliveryGroups).length * 120;
  const total       = subtotal + shippingFees;

  // ── Place COD order ───────────────────────────────────────────────────────
  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    setPaymentError('');

    try {
      // ── FIX: send cartItems to backend so it doesn't rely on Django Cart ──
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity:   item.qty || item.quantity || 1,
      }));

      const res = await axiosInstance.post('/api/cart/checkout/', {
        address:        `${formData.fullName}, ${formData.phone}, ${formData.address}, ${formData.city}`,
        payment_method: 'cod',
        items,                    // ← send items explicitly
      });

      setOrderId(res.data.order_id);
      setOrderSuccess(true);
      clearCart?.();              // clear local cart

    } catch (error) {
      const msg = error.response?.data?.error;
      setPaymentError(msg || "Checkout failed. Please try again.");
      console.error("Checkout Error:", error.response?.data);
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

  // ── Order success screen ──────────────────────────────────────────────────
  if (orderSuccess) return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6">
      <div className="bg-white border border-stone-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl serif font-bold text-stone-800 mb-2">Order Placed!</h2>
        <p className="text-stone-500 text-sm mb-1">
          Thank you. Please have cash ready on delivery.
        </p>
        {orderId && (
          <p className="text-xs text-stone-400 mt-1 mb-6">
            Order ID: <span className="font-bold text-stone-600">#{orderId}</span>
          </p>
        )}
        <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs text-amber-800 text-left mb-6">
          <p className="font-bold mb-1">Cash on Delivery</p>
          <p>Pay <span className="font-bold">৳{total.toLocaleString()}</span> to the delivery agent when your order arrives.</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => navigate('/dashboard')}
            className="w-full brand-bg text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition">
            View My Orders
          </button>
          <button onClick={() => navigate('/')}
            className="w-full border border-stone-200 text-stone-600 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-8">

          {/* Step tabs */}
          <div className="flex gap-8 mb-10 border-b border-stone-200 pb-4">
            <button type="button" onClick={() => setStep(1)}
              className={`text-xs font-bold uppercase tracking-widest ${step === 1 ? 'brand-color border-b-2 border-[#A33B26]' : 'text-stone-400'}`}>
              01 Shipping
            </button>
            <button type="button" disabled={step < 2}
              className={`text-xs font-bold uppercase tracking-widest ${step === 2 ? 'brand-color border-b-2 border-[#A33B26]' : 'text-stone-400'}`}>
              02 Confirm Order
            </button>
          </div>

          {/* ── Step 1: Shipping form ─────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="serif text-3xl">Shipping Address</h2>
              <form className="grid grid-cols-2 gap-4" onSubmit={nextStep}>
                <input required
                  className="col-span-2 p-4 border border-stone-200 focus:outline-none focus:border-[#A33B26] bg-white"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                <input required
                  className="p-4 border border-stone-200 focus:outline-none focus:border-[#A33B26] bg-white"
                  placeholder="Mobile (+880)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input required
                  className="p-4 border border-stone-200 focus:outline-none focus:border-[#A33B26] bg-white"
                  placeholder="City / District"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <textarea required
                  className="col-span-2 p-4 border border-stone-200 h-32 focus:outline-none focus:border-[#A33B26] bg-white resize-none"
                  placeholder="Street Address / Village / Area Details"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <button type="submit"
                  className="col-span-2 brand-bg text-white py-4 text-xs font-bold uppercase tracking-widest mt-2 shadow-lg hover:opacity-90 transition">
                  Continue to Confirm →
                </button>
              </form>
            </div>
          )}

          {/* ── Step 2: COD Confirm ───────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="serif text-3xl">Confirm Your Order</h2>

              {/* Address summary */}
              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Delivering To
                  </p>
                  <button onClick={() => setStep(1)}
                    className="text-[10px] text-[#A33B26] font-bold uppercase tracking-wider hover:underline">
                    Edit
                  </button>
                </div>
                <p className="text-sm font-bold text-stone-800">{formData.fullName}</p>
                <p className="text-sm text-stone-500">{formData.phone}</p>
                <p className="text-sm text-stone-500">{formData.address}, {formData.city}</p>
              </div>

              {/* COD info */}
              <div className="bg-white border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#A33B26]/10 rounded-full flex items-center justify-center">
                    <Truck size={18} className="text-[#A33B26]" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-stone-400">Pay when your order arrives</p>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-100 rounded p-4 text-xs text-stone-500 leading-relaxed mb-5 space-y-1.5">
                  <p>✅ No advance payment needed</p>
                  <p>✅ Pay <strong className="text-stone-700">৳{total.toLocaleString()}</strong> to the delivery agent</p>
                  <p>✅ Estimated delivery: 3–7 business days</p>
                  <p>⚠️ Please have exact change ready</p>
                </div>

                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold">
                    {paymentError}
                  </div>
                )}

                <button type="button" onClick={handlePayment} disabled={loading}
                  className="w-full brand-bg text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50 transition">
                  {loading
                    ? <span className="animate-pulse">Placing Order...</span>
                    : <><ShieldCheck size={16} /> Place Order — ৳{total.toLocaleString()}</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
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
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Payment</span>
                  <span className="font-bold text-stone-700">Cash on Delivery</span>
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
