import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const clearCart = () => {
  setCart(prevCart => prevCart.filter(item => !item.isSelected));
};

export const CartProvider = ({ children }) => {
  // Mengambil state awal keranjang dari LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('puspitaCart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Efek samping untuk menyimpan keranjang ke LocalStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem('puspitaCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Jika produk sudah ada, tingkatkan kuantitas
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Jika produk baru, tambahkan ke keranjang
        return [
          ...prevCart,
          {
            ...product,
            quantity: quantity,
            isSelected: true, // Default: terpilih
          },
        ];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.quantity + delta >= 1
          ? { ...item, quantity: item.quantity + delta }
          : item
      ).filter(item => item.quantity > 0) // Hapus jika kuantitas jadi 0
    );
  };

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const toggleSelect = (id) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id 
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalKeranjang = cart.reduce((total, item) => {
    if (item.isSelected) {
        return total + item.price * item.quantity;
    }
    return total;
  }, 0);

  const value = {
    cart,
    totalKeranjang,
    addToCart,
    updateQuantity,
    removeItem,
    toggleSelect,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};