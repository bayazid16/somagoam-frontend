import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('somagom_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartTotal, setCartTotal] = useState(0);

  // helper — check login status
  const isLoggedIn = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now(); // check expiry
  } catch {
    return false;
  }
};

  useEffect(() => {
    localStorage.setItem('somagom_cart', JSON.stringify(cartItems));
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    setCartTotal(newTotal);
  }, [cartItems]);

  const getId = (item) => item.id || item.name;

  const addToCart = async (product) => {
  setCartItems((prev) => {
    const productId = getId(product);
    const exists = prev.find((item) => getId(item) === productId);

    if (exists) {
      return prev.map((item) =>
        getId(item) === productId
          ? { ...item, qty: item.qty + (product.quantity || 1) }
          : item
      );
    }

    return [...prev, { ...product, qty: product.quantity || 1 }];
  });

  if (product.id && isLoggedIn()) {
    try {
      await axiosInstance.post('/api/cart/', {
        product_id: product.id,
        action: 'add', // REQUIRED
      });
    } catch (err) {
      console.error('Cart add sync failed:', err.response?.data);
    }
  }
};

  const removeFromCart = async (idOrName) => {
  const item = cartItems.find((i) => getId(i) === idOrName);

  setCartItems((prev) => prev.filter((i) => getId(i) !== idOrName));

  if (item?.id && isLoggedIn()) {
    try {
      for (let i = 0; i < item.qty; i++) {
        await axiosInstance.post('/api/cart/', {
          product_id: item.id,
          action: 'remove',
        });
      }
    } catch (err) {
      console.error('Cart remove sync failed:', err.response?.data);
    }
  }
};

  const updateQuantity = async (idOrName, newQty) => {
  if (newQty < 1) {
    removeFromCart(idOrName);
    return;
  }

  const item = cartItems.find((i) => getId(i) === idOrName);
  const delta = newQty - (item?.qty || 1);

  setCartItems((prev) =>
    prev.map((i) =>
      getId(i) === idOrName ? { ...i, qty: newQty } : i
    )
  );

  // 🔥 FIX: send MULTIPLE requests (your backend requires it)
  if (item?.id && delta !== 0 && isLoggedIn()) {
    try {
      const action = delta > 0 ? 'add' : 'remove';

      for (let i = 0; i < Math.abs(delta); i++) {
        await axiosInstance.post('/api/cart/', {
          product_id: item.id,
          action: action,
        });
      }

    } catch (err) {
      console.error('Cart quantity sync failed:', err.response?.data);
    }
  }
};

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('somagom_cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);