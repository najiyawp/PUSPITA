import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // 1. Inisialisasi State dari LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('puspitaCart');
      // Pastikan data ada dan tidak kosong
      return (storedCart && storedCart !== "undefined") ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // 2. Simpan ke LocalStorage otomatis saat state 'cart' berubah
  useEffect(() => {
    try {
      localStorage.setItem('puspitaCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // 3. Fungsi Tambah Barang
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity: quantity,
            isSelected: true,
          },
        ];
      }
    });
  };

  // 4. Fungsi Update Jumlah (+ / -)
  const updateQuantity = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // 5. Fungsi Hapus Per Item
  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // 6. Fungsi Centang/Pilih Barang
  const toggleSelect = (id) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id 
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  // 7. Fungsi Kosongkan Keranjang (Setelah Checkout/Manual)
  const clearCart = () => {
    setCart([]);
  };

  // 8. Hitung Total Harga Otomatis (Hanya yang dicentang)
  const totalKeranjang = cart.reduce((total, item) => {
    return item.isSelected ? total + (item.price * item.quantity) : total;
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