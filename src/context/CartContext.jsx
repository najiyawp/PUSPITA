import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // 1. Ambil data awal dari LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('puspitaCart');
      return (storedCart && storedCart !== "undefined") ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // 2. Simpan ke LocalStorage setiap ada perubahan pada state cart
  useEffect(() => {
    localStorage.setItem('puspitaCart', JSON.stringify(cart));
  }, [cart]);

  // 3. Fungsi Tambah ke Keranjang
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, isSelected: true }];
    });
  };

  // 4. Fungsi Update Jumlah (+ / -)
  const updateQuantity = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  // 5. Fungsi Hapus Item Secara Manual (Tombol Trash)
  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // 6. Fungsi Centang/Pilih Item
  const toggleSelect = (id) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  /**
   * 7. FUNGSI KRUSIAL: clearCart (Hanya hapus yang dipilih)
   * Logika: Kita simpan (filter) item yang isSelected-nya FALSE.
   * Jadi barang yang tidak dicentang tidak akan hilang setelah checkout.
   */
  const clearCart = () => {
    setCart(prevCart => prevCart.filter(item => !item.isSelected));
  };

  // 8. Hitung Total Harga (Hanya untuk item yang isSelected: true)
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