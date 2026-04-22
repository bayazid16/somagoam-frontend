import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleCheckout = () => {
    onClose();
    if (!isLoggedIn) {
      //  redirect to login if not logged in
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Cart Sidebar */}
      <div className="relative w-full max-w-md bg-[#F9F7F2] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
          <h2 className="serif text-2xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 brand-color" />
            Your Collection
            {cartItems.length > 0 && (
              <span className="text-sm font-sans text-stone-400 font-normal">
                ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="serif text-xl mb-2">Your box is empty</p>
              <p className="text-xs uppercase tracking-widest">Add some heritage items to start</p>
              <button
                onClick={() => { onClose(); navigate('/'); }}
                className="mt-6 brand-bg text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition"
              >
                Explore Heritage
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id || item.name} className="flex gap-4 border-b border-stone-100 pb-4">
                
                {/* Product Image */}
                <div className="w-20 h-20 bg-stone-200 flex-shrink-0 overflow-hidden rounded-sm">
                  {item.image || item.img ? (
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} // hide broken images
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-stone-800 pr-2">{item.name}</h4>
                    {/* remove entire item from cart */}
                    <button
                      onClick={() => removeFromCart(item.id || item.name)}
                      className="text-stone-300 hover:text-red-500 transition flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                    {item.region || item.origin_district || 'Bangladesh'}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-stone-200 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id || item.name, item.qty - 1)}
                        className="px-3 py-1 text-sm hover:text-[#A33B26] hover:bg-stone-50 transition"
                      >
                        −
                      </button>
                      <span className="px-3 text-xs font-bold border-x border-stone-200 py-1">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id || item.name, item.qty + 1)}
                        className="px-3 py-1 text-sm hover:text-[#A33B26] hover:bg-stone-50 transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold text-stone-900">
                      ৳ {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm italic">Subtotal</span>
              <span className="text-xl font-bold brand-color">
                ৳ {cartTotal.toLocaleString()}
              </span>
            </div>

            <p className="text-[10px] text-stone-400 uppercase tracking-widest text-center">
              Shipping calculated at checkout
            </p>

            {/*  show login prompt if not logged in */}
            {!isLoggedIn ? (
              <div className="space-y-2">
                <p className="text-[10px] text-center text-amber-600 font-bold uppercase tracking-widest">
                  ⚠ Login required to checkout
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-stone-800 text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition"
                >
                  Login to Checkout
                </button>
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                className="w-full brand-bg text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}