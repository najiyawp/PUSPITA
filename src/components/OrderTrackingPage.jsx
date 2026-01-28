import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiClock, FiCheckCircle, FiPackage, FiTruck, FiArchive } from 'react-icons/fi';
// ⭐ Imports Firebase
import { db } from '../firebase'; 
import { doc, onSnapshot } from 'firebase/firestore'; 

// Impor gambar bunga untuk status 'Selesai' (GANTI DENGAN LOKASI ASLI ANDA)
// Menggunakan Rose dari file yang Anda kirim
import Rose from '../assets/Rose.png'; 

// Definisi langkah-langkah pelacakan pesanan (TETAP)
const USER_TRACKING_STEPS = [
    { label: 'Menunggu pembayaran', statusKeys: ['waiting_payment'], icon: FiClock },
    { label: 'Diterima', statusKeys: ['confirmed', 'pending_delivery'], icon: FiCheckCircle }, 
    { label: 'Dikemas', statusKeys: ['packaged'], icon: FiPackage },
    { label: 'Dalam pengiriman', statusKeys: ['shipped'], icon: FiTruck },
    { label: 'Selesai', statusKeys: ['completed'], icon: FiArchive }, 
];

// Definisi Warna Sesuai Gambar UI (TETAP)
const COLORS = {
    BG_LIGHT: '#f7efda',      
    TEXT_GREEN: '#3e8440',    
    TEXT_PINK: '#efaca5',     
    ACCENT_GREEN: '#a4c37a',  
    BOX_GREEN: '#5a9b5c',     
    LINE_PINK: '#efaca5',     
    LINE_GREEN: '#a4c37a',    
};

// ⭐ FUNGSI BARU: FORMAT TANGGAL
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Asumsi: data dari Firestore adalah Firestore Timestamp atau Date Object
    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        // Jika hanya berupa string, coba konversi
        date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return 'N/A';
    
    // Format ke "30 Februari 2025" (gunakan ID untuk bahasa Indonesia)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};
// ⭐ AKHIR FUNGSI BARU

const OrderTrackingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Ambil orderData lengkap yang dikirim dari SuccessPage
    const passedOrderData = location.state?.orderData;
    
    const initialOrderId = passedOrderData?.id; 

    // Gunakan data yang dibawa dari SuccessPage sebagai state awal
    const [orderData, setOrderData] = useState(passedOrderData || null);
    const [loading, setLoading] = useState(!passedOrderData); 
    const [error, setError] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false); 

    // ⭐ LOGIKA REAL-TIME FETCH DARI FIRESTORE (TETAP)
    useEffect(() => {
        if (!initialOrderId) {
            if (!passedOrderData) {
                setError("ID Pesanan atau data tidak ditemukan.");
            }
            setLoading(false);
            return;
        }

        const orderRef = doc(db, 'orders', initialOrderId);

        const unsubscribe = onSnapshot(orderRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                
                setOrderData(data);
                setLoading(false);
                if (data.feedback) { setShowThankYou(true); }

            } else {
                setError("Pesanan tidak ditemukan di database.");
                setLoading(false);
            }
        }, (err) => {
            console.error("Error listening to order status:", err);
            setError("Gagal memuat status pesanan.");
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, [initialOrderId]);

    // Fungsionalitas menghitung langkah (TETAP)
    const getCurrentStepIndex = (currentStatus) => {
        let activeIndex = -1;
        for (let i = 0; i < USER_TRACKING_STEPS.length; i++) {
            if (USER_TRACKING_STEPS[i].statusKeys.includes(currentStatus)) {
                activeIndex = i;
                break;
            }
        }
        return activeIndex;
    };
    
    const currentStatus = orderData?.status || 'waiting_payment';
    const currentStepIndex = getCurrentStepIndex(currentStatus);
    const isCompleted = orderData?.status === 'completed';

    const formatRupiah = (number) => {
        if (typeof number !== 'number') return '0';
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.BG_LIGHT }}>
                 <div className="text-center text-green-600 text-xl font-margarine">Memuat status pesanan...</div>
            </div>
        );
    }

    if (error || !orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.BG_LIGHT }}>
                <div className="text-center">
                    <p style={{ color: COLORS.TEXT_GREEN }} className="mb-4">Error: {error || "Data pesanan tidak ditemukan"}</p>
                    <button
                        onClick={() => navigate('/')}
                        style={{ backgroundColor: COLORS.ACCENT_GREEN }}
                        className="text-white w-4 h-4 py-2 px-6 rounded-full"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // ⭐ Mengambil data Tanggal Pembelian yang diformat
    const purchaseDate = formatDate(orderData.createdAt); // Mengambil dari properti 'createdAt'
    
    const orderNumber = orderData.id?.substring(0, 8) || 'N/A';
    const grandTotal = orderData.grandTotal || 0;
    const products = orderData.products || orderData.items || []; 
    const shippingDetails = orderData.shippingDetails || orderData.formData || {}; 

    return (
        <div className="min-h-screen font-margarine" style={{ backgroundColor: COLORS.BG_LIGHT }}>
            {/* Header */}
            <header className="flex justify-between items-center px-6 pt-6 pb-2">
                 <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#badd7f] text-lg"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke keranjang
            </button>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate("/cart")}>
                      <FiShoppingCart className="w-6 h-6" style={{ color: COLORS.TEXT_PINK }} />
                    </button>
                    <button onClick={() => navigate("/profile")}>
                      <FiUser className="w-6 h-6" style={{ color: COLORS.TEXT_PINK }} />
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-4">
                
                {/* 1. Judul Utama */}
                <h2 className="text-4xl font-bold mb-6" style={{ color: COLORS.TEXT_GREEN }}>Tinjau pesanan mu</h2>

                {/* 2. ROSE ICON dan Teks Pesanan Selesai (Hanya Tampil jika isCompleted) */}
                {isCompleted && (
                    <div className="mt-4 mb-12 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 flex items-center justify-center mb-4 transform -rotate-45"
                            style={{
                                backgroundColor: COLORS.ACCENT_GREEN,
                                borderRadius: '50%',
                                boxShadow: `0 0 15px ${COLORS.ACCENT_GREEN}`,
                                position: 'relative',
                                zIndex: 10,
                            }}
                        >
                            <img 
                                src={Rose} 
                                alt="Pesanan Selesai" 
                                className="w-16 h-16 object-contain transform rotate-45"
                            />
                        </div>
                        
                        <p className={`text-2xl font-bold`} style={{ color: COLORS.TEXT_GREEN }}>
                            Pesanan selesai
                        </p>
                    </div>
                )}
                {/* End Rose Icon Section */}

                {/* 3. Tracking Stepper Area */}
{/* 3. Tracking Stepper Area */}
<div className="mb-12">
    <div className="grid grid-cols-5 gap-6">

        {USER_TRACKING_STEPS.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const IconComponent = step.icon;

            return (
                <div
                    key={index}
                    className="flex flex-col items-center text-center"
                >
                    {/* ICON */}
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all"
                        style={{
                            backgroundColor: isActive ? COLORS.ACCENT_GREEN : 'white',
                            borderColor: COLORS.ACCENT_GREEN,
                        }}
                    >
                        <IconComponent
                            className="w-6 h-6"
                            style={{
                                color: isActive ? 'white' : COLORS.ACCENT_GREEN,
                            }}
                        />
                    </div>

                    {/* LABEL */}
                    <span
                        className="mt-3 text-sm whitespace-nowrap"
                        style={{
                            color: isActive ? COLORS.TEXT_PINK : COLORS.TEXT_GREEN,
                        }}
                    >
                        {step.label}
                    </span>
                </div>
            );
        })}

    </div>
</div>
                {/* --- Detail Pesanan --- */}

                {/* Bagian Tanggal dan Nomor Pesanan */}
                <div className="mb-10 text-lg">
                    <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${COLORS.LINE_GREEN}` }}>
                        <p className={`font-medium`} style={{ color: COLORS.TEXT_GREEN }}>Tanggal pembelian</p>
                        <p className={`font-bold`} style={{ color: COLORS.TEXT_PINK }}>{purchaseDate}</p>
                    </div>
                    <div className="flex justify-between py-2">
                        <p className={`font-medium`} style={{ color: COLORS.TEXT_GREEN }}>Nomor pesanan</p>
                        <p className={`font-bold`} style={{ color: COLORS.TEXT_PINK }}>{orderNumber}</p>
                    </div>
                </div>

                {/* Bagian Produk */}
                <div className="mb-10 text-lg">
                    <h3 className={`text-2xl font-bold mb-4`} style={{ color: COLORS.TEXT_GREEN }}>Produk</h3>
                    <div className="flex items-start justify-between pt-4 pb-2" style={{ borderTop: `1px solid ${COLORS.LINE_GREEN}` }}>
                        {/* Ikon Kotak Hijau (Simulasi gambar produk) */}
                        <div className={`w-16 h-16 mr-4 rounded-lg flex-shrink-0`} style={{ backgroundColor: COLORS.BOX_GREEN }}></div> 
                        
                        <div className="flex-grow">
                            {products.length > 0 ? (
                                products.map((item, index) => (
                                    <div key={index} className="flex flex-col">
                                        <p className={`font-medium`} style={{ color: COLORS.TEXT_GREEN }}>{item.name || 'Produk'}</p>
                                        <p className={`text-base`} style={{ color: COLORS.TEXT_GREEN }}>Rp. {formatRupiah(item.price || 0)}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: COLORS.TEXT_GREEN }}>Tidak ada produk.</p>
                            )}
                        </div>
                        
                        <div className="text-right flex flex-col pt-1">
                            <p className={`font-medium text-sm`} style={{ color: COLORS.TEXT_GREEN }}>Total produk</p>
                            <p className={`font-bold text-xl`} style={{ color: COLORS.TEXT_PINK }}>Rp. {formatRupiah(grandTotal)}</p>
                        </div>
                    </div>
                </div>

                {/* Bagian Pengiriman */}
                <div className="mb-10 text-lg">
                    <h3 className={`text-2xl font-bold mb-4`} style={{ color: COLORS.TEXT_GREEN }}>Pengiriman</h3>
                    <div className="flex justify-between py-2" style={{ borderTop: `1px solid ${COLORS.LINE_PINK}` }}>
                        <div className="flex flex-col items-start">
                            <p className={`font-medium`} style={{ color: COLORS.TEXT_GREEN }}>Alamat</p>
                            <p className={`text-base`} style={{ color: COLORS.TEXT_PINK }}>{shippingDetails.alamat || shippingDetails.alamatLengkap || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${COLORS.LINE_PINK}` }}>
                        <div className="flex flex-col items-start">
                            <p className={`font-medium`} style={{ color: COLORS.TEXT_GREEN }}>Pengiriman</p>
                            <p className={`text-base`} style={{ color: COLORS.TEXT_PINK }}>{shippingDetails.courier || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className={`font-medium`} style={{ color: COLORS.TEXT_GREEN }}>Resi</p>
                            <p className={`text-base font-bold`} style={{ color: COLORS.TEXT_PINK }}>{shippingDetails.resi || 'N/A'}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderTrackingPage;