import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
// ⭐ Import Framer Motion
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialOrderId = location.state?.orderData?.orderId;
  
  const [orderData, setOrderData] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async (orderId) => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        try {
            const orderRef = doc(db, 'orders', orderId);
            const docSnap = await getDoc(orderRef);

            if (docSnap.exists()) {
                setOrderData({ id: docSnap.id, ...docSnap.data() }); 
            }
        } catch (error) {
            console.error("Gagal mengambil data pesanan:", error);
        } finally {
            setLoading(false);
        }
    };

    if (initialOrderId) {
        fetchOrder(initialOrderId);
    } else {
        setLoading(false); 
    }
  }, [initialOrderId]);

  const handleTrackOrder = () => {
    navigate('/order-tracking', { 
      state: { orderData } 
    });
  };

  const formatRupiah = (number) => {
    if (typeof number !== 'number') return '0';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#f7efda] flex items-center justify-center">
             <div className="text-center text-[#3e8440] text-xl font-margarine">Memuat data pesanan...</div>
        </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#f7efda] flex items-center justify-center font-margarine">
        <div className="text-center">
          <p className="text-[#3e8440] mb-4">Data pesanan tidak ditemukan. Silakan cek riwayat pesanan.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#a4c37a] text-white py-2 px-6 rounded-full"
          > Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const orderId = orderData.id || `N/A`;

  return (
    <div className="min-h-screen bg-[#f7efda] font-margarine flex flex-col items-center">
        <header className="w-full flex justify-between items-center py-6 px-8 max-w-7xl">
            <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 text-[#badd7f] text-lg"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke keranjang
            </button>
            <div className="flex items-center gap-6">
                <button onClick={() => navigate("/cart")}>
                    <FiShoppingCart className="w-6 h-6 text-[#efaca5]" />
                </button>
                <button onClick={() => navigate("/profile")} >
                    <FiUser className="w-6 h-6 text-[#efaca5]" />
                </button>
            </div>
        </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full px-6 py-8"
      >
        <div className="p-12 text-center">
          
          {/* ⭐ ANIMASI LINGKARAN & CENTANG */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 bg-[#a4c37a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeInOut", 
                  delay: 0.5 // Muncul setelah lingkaran selesai pop-up
                }}
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[#3e8440] font-bold text-4xl mb-2"
          >
            Pesanan anda telah dibuat
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[#efaca5] text-lg mb-8"
          >
            Selamat. Pesanan kamu telah kami terima, terima kasih sudah memesan 
          </motion.p>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-[#f7efda] rounded-xl p-6 text-center mb-8 border border-[#e5dec9]"
          > 
            <p className="text-[#3e8440] font-semibold text-lg mb-2">Order ID</p>
            <p className="text-[#efaca5] font-bold text-2xl">{orderId}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="grid grid-cols-2 gap-4 text-sm mb-10"
          >
            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Status Pembayaran</p>
              <p className="text-[#efaca5] text-lg capitalize">
                {orderData.paymentMethod === 'COD' ? 'Bayar di Tempat' : 'Lunas'}
              </p>
            </div>
            
            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Produk</p>
              <div className="text-[#efaca5] text-sm">
                {orderData.items.map((item, index) => (
                  <span key={index}>
                    {item.name} ({item.quantity}x)
                    {index < orderData.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Tujuan</p>
              <p className="text-[#efaca5] text-sm">{orderData.formData?.alamatLengkap || '-'}</p>
            </div>

            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Total</p>
              <p className="text-[#efaca5] font-bold text-xl">Rp. {formatRupiah(orderData.grandTotal)}</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            onClick={handleTrackOrder}
            className="w-full mt-4 bg-[#efaca5] text-[#3e8440] py-3 rounded-full font-bold text-lg hover:bg-[#D79A9E] transition-colors shadow-md"
          >
            Lacak Pesanan
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;