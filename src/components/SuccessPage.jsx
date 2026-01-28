import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
// ⭐ BARU: Imports Firebase
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
// ===================================

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil orderId dari state (jika ada)
  const initialOrderId = location.state?.orderData?.orderId;
  
  // State untuk menyimpan data yang sudah di-fetch
  const [orderData, setOrderData] = useState(null); 
  const [loading, setLoading] = useState(true);

  // ⭐ LOGIKA FETCH DARI FIRESTORE
  useEffect(() => {
    const fetchOrder = async (orderId) => {
        if (!orderId) {
            setLoading(false);
            return; // Order ID tidak ada, biarkan error message default muncul
        }

        try {
            const orderRef = doc(db, 'orders', orderId);
            const docSnap = await getDoc(orderRef);

            if (docSnap.exists()) {
                // Set data yang diambil dari database
                setOrderData({ id: docSnap.id, ...docSnap.data() }); 
            }
        } catch (error) {
            console.error("Gagal mengambil data pesanan:", error);
        } finally {
            setLoading(false);
        }
    };

    if (initialOrderId) {
        // Jika ada ID dari navigation state, langsung fetch
        fetchOrder(initialOrderId);
    } else {
        // ⚠️ Peringatan: Jika state hilang (refresh) dan orderId tidak ada di URL, 
        // kita tidak bisa fetch. Untuk solusi paling ideal, orderId harusnya ada di URL parameter.
        setLoading(false); 
    }
  }, [initialOrderId]); // Hanya fetch ketika initialOrderId berubah

  const handleTrackOrder = () => {
    navigate('/order-tracking', { 
      state: { orderData } // Pass data yang sudah di-fetch ke tracking page
    });
  };

  const formatRupiah = (number) => {
    // Memastikan input adalah number sebelum format
    if (typeof number !== 'number') return '0';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Tampilkan loading saat proses fetch
  if (loading) {
    return (
        <div className="min-h-screen bg-[#f7efda] flex items-center justify-center">
             <div className="text-center text-[#3e8440] text-xl font-margarine">Memuat data pesanan...</div>
        </div>
    );
  }

  // Tampilkan error jika data tidak ditemukan (misal: setelah refresh tanpa orderId di URL)
  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#f7efda] flex items-center justify-center">
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

  const orderId = orderData.id || `N/A`; // Gunakan ID dari dokumen Firestore

  return (
    <div className="min-h-screen bg-[#f7efda] font-margarine flex flex-col items-center">
        {/* Header, dll. */}
        <header className="w-full flex justify-between items-center py-6 max-w-7xl">
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

      <div className="max-w-xl w-full px-6 py-8">
        {/* ⭐ KONTEN SEKARANG LANGSUNG DI SINI (container putih dihapus) */}
        <div className="p-12 text-center"> {/* Menggantikan container putih, hanya mempertahankan padding dan text-center */}
          <div className="w-20 h-20 bg-[#a4c37a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-[#3e8440] font-bold text-4xl mb-2">Pesanan anda telah di buat</h3>
          
          <p className="text-[#efaca5] text-lg mb-8">
            Selamat. Pesanan kamu telah kami terima, terima kasih sudah memesan 
          </p>

          <div className="bg-[#f7efda] rounded-xl p-6 text-center mb-8"> 
            <p className="text-[#3e8440] font-semibold text-lg mb-2">Order ID</p>
            <p className="text-[#efaca5] font-bold text-2xl">{orderId}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-10">
            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Status Pembayaran</p>
              <p className="text-[#efaca5] text-lg capitalize">
                {orderData.paymentMethod === 'COD' ? 'Bayar di Tempat' : 'Lunas'}
              </p>
            </div>
            
            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Produk</p>
              <p className="text-[#efaca5] text-sm">
                {orderData.items.map((item, index) => (
                  <span key={index}>
                    {item.name} ({item.quantity}x)
                    {index < orderData.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>

            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Tujuan</p>
              <p className="text-[#efaca5] text-sm">{orderData.formData.alamatLengkap}</p>
            </div>

            <div className="text-left">
              <p className="text-[#3e8440] font-semibold mb-1">Total</p>
              <p className="text-[#efaca5] font-bold text-xl">Rp. {formatRupiah(orderData.grandTotal)}</p>
            </div>
          </div>

          <button
            onClick={handleTrackOrder}
            className="w-full mt-4 bg-[#efaca5] text-[#3e8440] py-3 rounded-full font-bold text-lg hover:bg-[#D79A9E] transition-colors shadow-md"
          >
            Lacak Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;