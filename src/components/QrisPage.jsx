import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiDownload, FiUpload } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { db } from '../firebase';
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import QRISSpuspita from '../assets/QRISSpuspita.png';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const QRISPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const orderData = location.state?.orderData;

  const [isApproved, setIsApproved] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!orderData || !orderData.orderId) {
      alert('Data pesanan tidak ditemukan');
      navigate('/payment');
      return;
    }

    const orderRef = doc(db, 'orders', orderData.orderId);
    const unsubscribe = onSnapshot(
      orderRef,
      (docSnap) => {
        if (!docSnap.exists()) return;
        const status = docSnap.data().status;
        if (['confirmed', 'packaged', 'shipped', 'completed'].includes(status)) {
          setIsApproved(true);
          clearCart();
          setTimeout(() => {
            navigate('/payment/success', {
              state: { orderData: { ...orderData, status } },
            });
          }, 1500);
        }
      },
      (err) => console.error('Listener error:', err)
    );
    return () => unsubscribe();
  }, [orderData, navigate, clearCart]);

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = QRISSpuspita;
    link.download = `QRIS-${orderData?.orderId || 'payment'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadProof = async () => {
    if (!proofFile) {
      alert('Silakan pilih gambar bukti transfer');
      return;
    }
    try {
      setUploading(true);
      const result = await uploadToCloudinary(proofFile);
      await updateDoc(doc(db, 'orders', orderData.orderId), {
        paymentProofUrl: result.secure_url,
        paymentProofPublicId: result.public_id,
        status: 'waiting_confirmation',
        updatedAt: serverTimestamp(),
      });
      alert('Bukti transfer berhasil dikirim, menunggu konfirmasi admin');
      setProofFile(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!orderData) return null;

  return (
    <>
      <style>
        {`
          @keyframes flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .moving-gradient {
            background: linear-gradient(-45deg, #f7efda, #efaca5, #f7efda, #efaca5);
            background-size: 400% 400%;
            animation: flow 10s ease infinite;
          }
        `}
      </style>

      <div className="min-h-screen moving-gradient font-margarine flex flex-col">
        {/* HEADER */}
        <header className="flex justify-between items-center px-8 py-6">
          <button
            onClick={() => navigate('/payment')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 text-[#3e8440] text-2xl hover:bg-white transition-all"
          >
            ←
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 text-[#efaca5] hover:bg-white transition-all"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </header>

        {/* CONTENT */}
        <div className="flex-1 flex items-center justify-center px-4 pb-10">
          <div className="w-full max-w-xl bg-white/80 backdrop-blur-md border-2 border-[#a4c37a] rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 md:p-10">
              
              {/* TITLE */}
              <div className="text-center mb-6">
                <h2 className="text-[#3e8440] text-4xl font-bold tracking-tight">QRIS</h2>
                <p className="text-[#efaca5] font-semibold text-lg">Puspita, Co</p>
              </div>

              {/* QR IMAGE */}
              <div className="relative group mx-auto w-fit mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#a4c37a] to-[#efaca5] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white p-4 rounded-xl border border-[#efaca5]/30">
                  <img
                    src={QRISSpuspita}
                    alt="QRIS Payment"
                    className="w-56 h-56 md:w-64 md:h-64 object-contain"
                  />
                </div>
              </div>

              {/* INFO HARGA */}
              <div className="bg-[#3e8440]/10 rounded-2xl p-4 text-center mb-8">
                <p className="text-[#3e8440] text-xs uppercase font-bold tracking-widest mb-1">Total yang harus dibayar</p>
                <p className="text-[#3e8440] text-3xl font-black">
                  Rp {orderData.grandTotal?.toLocaleString('id-ID')}
                </p>
              </div>

              {/* DOWNLOAD BUTTON */}
              <button
                onClick={downloadQRCode}
                className="w-full mb-8 bg-white border-2 border-[#3e8440] text-[#3e8440] py-3 rounded-2xl font-bold hover:bg-[#3e8440] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FiDownload />
                Simpan QR Code ke Galeri
              </button>

              {/* UPLOAD SECTION */}
              <div className="space-y-4 border-t border-[#a4c37a]/20 pt-6">
                <div className="text-center">
                  <span className="bg-[#efaca5] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Langkah Terakhir</span>
                  <h3 className="text-[#3e8440] font-bold mt-2">Kirim Bukti Pembayaran</h3>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    className="block w-full text-sm text-[#3e8440]
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-bold
                      file:bg-[#3e8440] file:text-white
                      hover:file:bg-[#efaca5] transition-all
                      cursor-pointer bg-white/50 rounded-xl p-1"
                  />
                </div>

                <button
                  onClick={handleUploadProof}
                  disabled={uploading}
                  className="w-full bg-[#efaca5] text-white py-4 rounded-2xl font-bold hover:bg-[#3e8440] transition-all disabled:bg-gray-300 shadow-lg flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sedang Mengirim...
                    </span>
                  ) : (
                    <>
                      <FiUpload />
                      Konfirmasi Saya Sudah Bayar
                    </>
                  )}
                </button>
              </div>

              {/* REALTIME STATUS FOOTER */}
              <div className="mt-8 pt-4 text-center">
                {isApproved ? (
                  <div className="flex items-center justify-center gap-2 text-[#3e8440] font-bold bg-green-100 py-2 rounded-lg">
                    <span>✅ Pembayaran Diterima!</span>
                  </div>
                ) : (
                  <p className="text-[#efaca5] text-xs font-medium animate-pulse">
                    Sistem sedang memantau pembayaranmu secara otomatis...
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRISPage;