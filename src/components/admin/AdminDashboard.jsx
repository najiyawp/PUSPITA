import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiClock, FiCheckCircle } from 'react-icons/fi';
import { db } from '../../firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

// Komponen Card
const DashboardCard = ({ icon: Icon, title, value, bgColor }) => (
    <div className={`flex flex-col items-center justify-center p-6 rounded-3xl shadow-xl ${bgColor} w-72 h-40 text-[#3e8440]`}>
        {value === null ? (
            <div className="animate-pulse h-10 w-20 bg-gray-300 rounded"></div>
        ) : (
            <span className="text-4xl font-bold mb-1">{value}</span>
        )}
        <Icon className="w-10 h-10 mb-2" />
        <p className="text-xl">{title}</p>
    </div>
);

// Konstanta untuk pewarnaan status
const statusColors = {
    dikemas: 'bg-[#efaca5] text-[#3e8440]',
    dikirim: 'bg-[#A4C37A] text-white',
    selesai: 'bg-green-500 text-white',
    dibatalkan: 'bg-red-500 text-white',
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        baru: null,
        diproses: null,
        selesai: null,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi untuk mengambil data pesanan terbaru dengan fallback yang kuat
    const fetchRecentOrders = async () => {
        const q = query(
            collection(db, 'orders'),
            orderBy('createdAt', 'desc'), 
            limit(5)
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => {
            const data = doc.data();

            // Dapatkan Email Pelanggan (dengan fallback)
            const customerEmail = data.formData?.email || data.email || 'Email Tidak Tersedia'; 

            // Dapatkan Nama Produk (dengan fallback)
            const productNames = data.items 
                ? data.items.map(item => `${item.name || 'Produk'} (${item.quantity || 1}x)`).join(', ') 
                : data.productName || 'Tidak Ada Produk';

            // Dapatkan Total (pastikan angka, dengan fallback 0)
            const totalAmount = data.grandTotal ? parseFloat(data.grandTotal) : (data.total ? parseFloat(data.total) : 0);
            
            // Dapatkan Waktu
            const orderTime = data.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) || 'Tanggal Tidak Ada';

            return {
                id: doc.id,
                ...data,
                waktu: orderTime,
                email: customerEmail,
                product: productNames, 
                total: totalAmount, 
                uid: doc.id.substring(0, 6)
            };
        });
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const ordersCollection = collection(db, 'orders');
            const snapshot = await getDocs(ordersCollection);
            const allOrders = snapshot.docs.map(doc => doc.data());

            let baruCount = 0;
            let diprosesCount = 0;
            let selesaiCount = 0;
            
            const STATUS_MAP = {
                BARU: ['waiting_payment'], 
                DIPROSES: ['confirmed', 'pending_delivery', 'packaged', 'shipped'], 
                SELESAI: ['completed'],
            };

            allOrders.forEach(order => {
                const status = order.status;
                if (STATUS_MAP.BARU.includes(status)) {
                    baruCount++;
                } else if (STATUS_MAP.DIPROSES.includes(status)) {
                    diprosesCount++;
                } else if (STATUS_MAP.SELESAI.includes(status)) {
                    selesaiCount++;
                }
            });

            const latestOrders = await fetchRecentOrders();
            
            setStats({
                baru: baruCount,
                diproses: diprosesCount,
                selesai: selesaiCount,
            });
            setRecentOrders(latestOrders);

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Gagal memuat data dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []); 

    if (error) {
        return <div className="p-6 text-red-600 text-center text-2xl font-margarine">Error: {error}</div>;
    }

    return (
        // Asumsi div ini berada di dalam AdminLayout yang sudah dihapus p-6 nya
        <div className="min-h-screen bg-gradient-to-b from-[#EFACA5] to-[#F7EFDA] p-12 font-margarine">
            <header className="flex justify-between items-center mb-10">
                <h2 className="text-4xl text-[#3e8440]">Halo, Puspita!</h2>
                <div className="flex items-center bg-[#efaca5] border-2 border-[#3e8440] rounded-full p-2">
                    <FiSearch className="w-6 h-6 text-[#3e8440] ml-2" />
                    <input 
                        type="text" 
                        placeholder="Cari" 
                        className="bg-transparent focus:outline-none text-[#3e8440] p-1"
                    />
                </div>
            </header>

            {/* Statistik Pesanan */}
            <div className="flex justify-center gap-8 mb-12">
                <DashboardCard icon={FiShoppingCart} title="Pesanan baru" value={stats.baru} bgColor="bg-[#f7efda] text-[#efaca5]" />
                <DashboardCard icon={FiClock} title="Diproses" value={stats.diproses} bgColor="bg-[#f7efda] text-[#efaca5]" />
                <DashboardCard icon={FiCheckCircle} title="Selesai" value={stats.selesai} bgColor="bg-[#f7efda] text-[#efaca5]" />
            </div>

            {/* Aktivitas Terbaru */}
            <h3 className="text-3xl text-[#3e8440] font-bold mb-6">Aktivitas Terbaru (5 Pesanan Terakhir)</h3>

            {/* CONTAINER TABEL UTAMA (Putih, rounded-3xl) */}
            <div className="bg-[#f7efda] rounded-3xl shadow-xl">
                
                {/* Header Tabel */}
                {/* 6 Kolom: ID Order, Email, Produk, Total, Waktu, Status */}
                <div className="grid grid-cols-6 gap-4 px-6 pt-3 pb-3 rounded-t-3xl bg-[#3e8440] text-[#f7efda] font-bold text-lg">
                    <span>ID Order</span>
                    <span>Email</span>
                    <span>Produk</span>
                    <span>Total</span>
                    <span>Waktu</span>
                    <span>Status</span>
                </div>

                {/* Isi Tabel */}
                {loading ? (
                    <div className="px-6 pb-6 text-[#3e8440] text-center">Memuat pesanan terbaru...</div>
                ) : recentOrders.length === 0 ? (
                    <div className="px-6 pb-6 text-[#3e8440] text-center">Tidak ada pesanan terbaru.</div>
                ) : (
                    recentOrders.map((order, index) => (
                        <div 
                            key={order.id} 
                            className={`grid grid-cols-6 gap-4 px-6 py-3 text-[#3e8440] border-b border-gray-200 
                                ${index === recentOrders.length - 1 ? 'border-b-0 rounded-b-3xl' : ''}
                            `}
                        >
                            <span className="text-[#efaca5] font-bold">#{order.uid}</span>
                            
                            {/* Email: Truncate dan Tooltip */}
                            <span 
                                className="truncate" 
                                title={order.email} 
                            >
                                {order.email}
                            </span>

                            <span className="truncate">{order.product}</span>
                            <span>Rp. {order.total === 0 ? '0' : order.total?.toLocaleString('id-ID')}</span>
                            <span>{order.waktu}</span>
                            <div className="flex items-center">
                                <span className={`px-3 py-1 text-sm rounded-full capitalize ${statusColors[order.status?.toLowerCase()] || 'bg-gray-300'}`}>
                                    {order.status || 'Tidak Diketahui'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                {/* Jarak di bagian bawah untuk mendukung rounded-3xl */}
                {recentOrders.length > 0 && <div className="h-6"></div>}
            </div>
        </div>
    );
};

export default AdminDashboard;