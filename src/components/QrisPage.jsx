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

  const qrCodeRef = useRef(null);

  // ========================================================
  // REALTIME LISTENER STATUS ORDER
  // ========================================================
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

        if (
          status === 'confirmed' ||
          status === 'packaged' ||
          status === 'shipped' ||
          status === 'completed'
        ) {
          setIsApproved(true);
          clearCart();

          setTimeout(() => {
            navigate('/payment/success', {
              state: {
                orderData: {
                  ...orderData,
                  status,
                },
              },
            });
          }, 1500);
        }
      },
      (err) => {
        console.error('Listener error:', err);
      }
    );

    return () => unsubscribe();
  }, [orderData, navigate, clearCart]);

  // ========================================================
  // DOWNLOAD QRIS
  // ========================================================
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = QRISSpuspita;
    link.download = `QRIS-${orderData?.orderId || 'payment'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================================
  // UPLOAD BUKTI TRANSFER
  // ========================================================
  const handleUploadProof = async () => {
    if (!proofFile) {
      alert('Silakan pilih gambar bukti transfer');
      return;
    }

    try {
      setUploading(true);

      // 1. Upload ke Cloudinary
      const result = await uploadToCloudinary(proofFile);

      // 2. Update Firestore
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

  // ========================================================
  // UI
  // ========================================================
  return (
    <div className="min-h-screen bg-[#f7efda] font-margarine flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-6">
        <button
          onClick={() => navigate('/payment')}
          className="text-[#badd7f] text-lg"
        >
          ←
        </button>

        <button onClick={() => navigate('/cart')}>
          <FiShoppingCart className="w-6 h-6 text-[#efaca5]" />
        </button>
      </header>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white border-4 border-[#a4c37a] rounded-[50px] p-12">
            {/* TITLE */}
            <div className="text-center mb-8">
              <h2 className="text-[#3e8440] text-4xl font-bold mb-2">QRIS</h2>
              <p className="text-[#efaca5]">Puspita, Co</p>
            </div>

            {/* QR IMAGE */}
            <div className="mx-auto bg-white p-6 rounded-2xl shadow-xl border border-[#EFACA5] w-fit mb-6">
              <img
                src={QRISSpuspita}
                alt="QRIS Payment"
                className="w-64 h-64 object-contain"
              />
            </div>

            {/* TOTAL */}
            <p className="text-[#efaca5] text-center mb-4 text-xl font-bold">
              Total Bayar:{' '}
              Rp. {orderData.grandTotal?.toLocaleString('id-ID')}
            </p>

            {/* DOWNLOAD */}
            <button
              onClick={downloadQRCode}
              className="w-full bg-[#3e8440] text-[#f7efda] py-4 rounded-full text-lg hover:bg-[#efaca5] transition flex items-center justify-center gap-2 mb-6"
            >
              <FiDownload />
              Download QRIS
            </button>

            {/* UPLOAD BUKTI */}
            <div className="mt-6">
              <label className="block mb-2 text-[#3e8440] font-semibold">
                Upload Bukti Transfer
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="w-full mb-4"
              />

              <button
                onClick={handleUploadProof}
                disabled={uploading}
                className="w-full bg-[#efaca5] text-white py-3 rounded-full hover:bg-[#3e8440] transition flex items-center justify-center gap-2"
              >
                <FiUpload />
                {uploading ? 'Mengupload...' : 'Kirim Bukti Transfer'}
              </button>
            </div>

            {/* STATUS */}
            <div className="mt-6 text-center">
              {isApproved ? (
                <p className="text-[#6b9654] font-semibold">
                  Pembayaran dikonfirmasi! Redirect...
                </p>
              ) : (
                <p className="text-[#efaca5] font-semibold">
                  Menunggu konfirmasi pembayaran admin...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRISPage;
