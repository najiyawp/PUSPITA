import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';

// ⭐ DAFTAR STATUS
const statusOptions = [
  'waiting_payment',
  'confirmed',
  'pending_delivery',
  'packaged',
  'shipped',
  'completed',
  'cancelled'
];

const getStatusClasses = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case 'waiting_payment':
      return 'bg-red-500 text-white';
    case 'confirmed':
    case 'pending_delivery':
    case 'packaged':
      return 'bg-[#f7efda] text-[#3e8440] border border-[#A4C37A]';
    case 'shipped':
      return 'bg-[#A4C37A] text-white';
    case 'completed':
      return 'bg-green-500 text-white';
    case 'cancelled':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
};

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 FETCH ORDERS
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      const fetchedOrders = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          ...data,
          date: data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : 'N/A',
          price: data.grandTotal || 0,
          status: data.status || 'waiting_payment',
          imageURL: data.items?.[0]?.image || '' // ⬅️ CLOUDINARY
        };
      });

      setOrders(fetchedOrders);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 UPDATE STATUS
  const handleStatusChange = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Ubah status pesanan ${orderId.slice(-6)} ke ${newStatus.replace(
          /_/g,
          ' '
        )}?`
      )
    )
      return;

    try {
      const ref = doc(db, 'orders', orderId);
      await updateDoc(ref, {
        status: newStatus,
        updatedAt: new Date()
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
      setError('Gagal mengubah status');
      fetchOrders();
    }
  };

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 text-xl font-margarine">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFACA5] to-[#F7EFDA] p-12 font-margarine">
      <h2 className="text-4xl text-[#3e8440] font-bold mb-10">
        Daftar Pesanan
      </h2>

      <div className="bg-[#f7efda] p-10 rounded-3xl shadow-xl border-2 border-[#3e8440]">

        {/* HEADER */}
        <div className="grid grid-cols-4 py-4 px-4 text-[#3e8440] font-bold text-xl border-b border-[#3e8440]">
          <span>Pesanan</span>
          <span>Dibuat</span>
          <span>Harga</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-[#3e8440]">
            Memuat pesanan...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-[#3e8440]">
            Belum ada pesanan
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-4 items-center py-6 px-4 border-b border-[#3e8440] text-[#3e8440] gap-4"
            >
              {/* PRODUK */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border bg-[#3e8440]">
                  {order.imageURL ? (
                    <img
                      src={order.imageURL}
                      alt="produk"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#f7efda]">
                      No Image
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-bold capitalize">
                    {order.items?.[0]?.name || 'Produk'}
                  </p>
                  <p className="text-sm text-[#efaca5]">
                    x {order.items?.[0]?.quantity || 1}
                  </p>
                </div>
              </div>

              {/* TANGGAL */}
              <span>{order.date}</span>

              {/* HARGA */}
              <span className="font-bold">
                Rp {order.price.toLocaleString('id-ID')}
              </span>

              {/* STATUS */}
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value)
                }
                className={`px-4 py-2 ml-6 rounded-full text-sm font-bold outline-none cursor-pointer ${getStatusClasses(
                  order.status
                )}`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOrdersPage;
