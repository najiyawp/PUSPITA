import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { db } from '../firebase'; 
import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
import { auth } from '../firebase'; 

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const orderData = location.state?.orderData;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    if (!orderData) {
      alert('Data pesanan tidak ditemukan');
      navigate('/checkout');
    }
  }, [orderData, navigate]);

  const formatRupiah = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Silakan pilih metode pembayaran terlebih dahulu');
      return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        alert("Anda harus login untuk menyelesaikan pesanan.");
        navigate('/login');
        return;
    }
    
    const initialStatus = paymentMethod === 'COD' ? 'pending_delivery' : 'waiting_payment';
    
    const finalOrderData = {
        userId: user.uid, 
        items: orderData.items,
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee,
        grandTotal: orderData.grandTotal,
        formData: orderData.formData,
        paymentMethod: paymentMethod,
        status: initialStatus, 
        createdAt: Timestamp.now(), 
    };

    try {

        const docRef = await addDoc(collection(db, "orders"), finalOrderData);
        const orderId = docRef.id; 

        clearCart(); 

        const paymentInfoWithId = { ...finalOrderData, orderId };

        if (paymentMethod === 'QRIS') {
            navigate('/payment/qris', { state: { orderData: paymentInfoWithId } });
        } else if (paymentMethod === 'COD') {
            navigate('/payment/success', { state: { orderData: paymentInfoWithId } });
        }
    } catch (error) {
        console.error("Error creating order:", error);
        alert("Gagal membuat pesanan. Silakan coba lagi.");
    }
  };

  if (!orderData) {
    return null;
  }


  const orderDate = new Date();
  const formattedDate = orderDate.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const formattedTime = orderDate.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) + ' WIB';

  return (
    <div className="min-h-screen bg-[#f7efda] font-margarine">
      <header className="flex justify-between items-center px-10 py-6">
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 text-[#badd7f] text-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#badd7f] rounded-full flex items-center justify-center">
                <div className="text-white text-2xl">✿</div>
              </div>
              <div>
                <h2 className="text-[#3e8440] font-bold text-xl">Puspita, Co</h2>
                <p className="text-[#efaca5] text-sm">Semarang, Jawa Tengah</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mb-6">
              <div>
                <p className="text-[#3e8440] font-semibold">Nama</p>
                <p className="text-[#efaca5]">{orderData.formData.namaLengkap}</p>
              </div>
              <div>
                <p className="text-[#3e8440] font-semibold">Produk</p>
                {orderData.items.map((item, index) => (
                  <p key={index} className="text-[#efaca5] text-sm">
                    {item.name} ({item.quantity}x)
                  </p>
                ))}
              </div>
              <div>
                <p className="text-[#3e8440] font-semibold">Email</p>
                <p className="text-[#efaca5] text-sm">{orderData.formData.email}</p>
              </div>
              <div>
                <p className="text-[#3e8440] font-semibold">Telepon</p>
                <p className="text-[#efaca5]">{orderData.formData.nomorTelepon}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[#3e8440] font-semibold">Alamat</p>
                <p className="text-[#efaca5]">{orderData.formData.alamatLengkap}</p>
              </div>
              {orderData.formData.catatan && (
                <div className="col-span-2">
                  <p className="text-[#3e8440] font-semibold">Catatan</p>
                  <p className="text-[#efaca5]">{orderData.formData.catatan}</p>
                </div>
              )}
              <div>
                <p className="text-[#3e8440] font-semibold">Metode Pengiriman</p>
                <p className="text-[#efaca5] capitalize">
                  {orderData.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
                </p>
              </div>
              <div>
                <p className="text-[#3e8440] font-semibold">Total</p>
                <p className="text-[#efaca5] font-bold">Rp. {formatRupiah(orderData.grandTotal)}</p>
              </div>
            </div>

            <div className="bg-[#f7efda] rounded-2xl p-4 mb-4 border-2 border-[#badd7f]">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-[#3e8440] font-semibold"
              >
                <span>Rincian pembayaran</span>
                <FiChevronDown 
                  className={`transform transition ${showDetails ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {showDetails && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#3e8440]">Subtotal</span>
                    <span className="text-[#efaca5]">Rp. {formatRupiah(orderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3e8440]">Biaya pengantaran</span>
                    <span className="text-[#efaca5]">Rp. {formatRupiah(orderData.shippingFee)}</span>
                  </div>
                  <div className="border-t border-[#d4c9b3] pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#3e8440]">Total</span>
                      <span className="text-[#efaca5]">Rp. {formatRupiah(orderData.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-[#3e8440] font-semibold mb-3">Metode Bayar</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`flex-1 py-3 px-6 rounded-full border-2 transition font-bold ${
                    paymentMethod === 'QRIS'
                      ? 'bg-[#3e8440] text-[#efaca5] border-[#3e8440]'
                      : 'bg-[#f7efda] text-[#3e8440] border-[#3e8440]'
                  }`}
                >
                  QRIS
                </button>
                <button
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex-1 py-3 px-6 rounded-full border-2 transition font-bold ${
                    paymentMethod === 'COD'
                      ? 'bg-[#3e8440] text-[#efaca5] border-[#3e8440]'
                      : 'bg-[#f7efda] text-[#3e8440] border-[#3e8440]'
                  }`}
                >
                  COD
                </button>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-[#badd7f] text-[#3e8440] py-4 rounded-full font-bold text-lg hover:bg-[#3e8440] hover:text-[#efaca5] transition shadow-lg"
            >
              Bayar
            </button>
          </div>

          <div className="bg-[#f7efda] border-2 border-[#badd7f] rounded-[70px] p-8 h-fit sticky top-8">
            <h3 className="text-[#3e8440] font-bold text-3xl text-center mb-2">
              Ringkasan Pesanan
            </h3>
            {/* ⭐ Perubahan teks: Order ID akan dibuat setelah pembayaran */}
            <p className="text-[#efaca5] text-center mb-6">Order ID akan dibuat setelah pembayaran</p> 

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-[#3e8440] font-semibold">Tanggal</span>
                <span className="text-[#efaca5]">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3e8440] font-semibold">Waktu</span>
                <span className="text-[#efaca5]">{formattedTime}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[#3e8440] font-bold mb-3 text-lg">Produk</p>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-[#efaca5] capitalize font-semibold">{item.name}</p>
                      <p className="text-[#efaca5] text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#efaca5] font-bold">
                      Rp. {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-[#badd7f] pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#3e8440]">Subtotal</span>
                <span className="text-[#efaca5]">Rp. {formatRupiah(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3e8440]">Biaya pengantaran</span>
                <span className="text-[#efaca5]">Rp. {formatRupiah(orderData.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold  text-xl mt-4 pt-2 border-t-2 border-[#a4c37a]">
                <span className="text-[#3e8440]">Total</span>
                <span className="text-[#efaca5]">Rp. {formatRupiah(orderData.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;