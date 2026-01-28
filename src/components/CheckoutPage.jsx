import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiTruck, FiPackage } from "react-icons/fi";
import { useCart } from '../context/CartContext.jsx';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, totalKeranjang, clearCart } = useCart();
    
    const [deliveryMethod, setDeliveryMethod] = useState("delivery");
    const [formData, setFormData] = useState({
        namaLengkap: "",
        email: "",
        nomorTelepon: "",
        alamatLengkap: "",
        catatan: ""
    });

    const shippingFee = deliveryMethod === "delivery" ? 10000 : 0;
    const grandTotal = totalKeranjang + shippingFee;

    const formatRupiah = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        
        // Validasi form
        if (!formData.namaLengkap || !formData.email || !formData.nomorTelepon || !formData.alamatLengkap) {
            alert("Mohon lengkapi semua data pengiriman!");
            return;
        }

        // Siapkan data untuk halaman pembayaran
        const orderData = {
            formData,
            items: selectedItems,
            deliveryMethod,
            subtotal: totalKeranjang,
            shippingFee,
            grandTotal
        };

        // Navigate ke halaman pembayaran dengan data
        navigate('/payment', { state: { orderData } });
    };

    // Filter hanya item yang dipilih
    const selectedItems = cart.filter(item => item.isSelected);

    return (
        <div className="w-full min-h-screen bg-[#f7efda] text-[#3e8440] font-margarine">
            {/* Header */}
            <header className="flex justify-between items-center px-10 py-6">
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

            {/* Main Content */}
            <div className="flex gap-10 px-10 pb-20">
                {/* Left Side - Form */}
                <div className="w-1/2">
                    <h2 className="text-5xl mb-6">Checkout</h2>
                    
                    <form onSubmit={handleCheckout}>
                        {/* Informasi Pengantaran */}
                        <h3 className="text-2xl text-[#efaca5] mb-4">informasi pengantaran</h3>
                        
                        {/* Delivery Method */}
                        <div className="flex gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setDeliveryMethod("delivery")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${
                                    deliveryMethod === "delivery" 
                                    ? "bg-[#a4c37a] text-[#f7efda] border-[#3e8440]" 
                                    : "border-[#3e8440] text-[#3e8440]"
                                }`}
                            >
                                <FiTruck className="w-5 h-5" />
                                <span>Delivery</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setDeliveryMethod("pickup")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${
                                    deliveryMethod === "pickup" 
                                    ? "bg-[#efaca5] text-white border-[#efaca5]" 
                                    : "border-[#efaca5] text-[#efaca5]"
                                }`}
                            >
                                <FiPackage className="w-5 h-5" />
                                <span>Pickup</span>
                            </button>
                        </div>

                        {/* Nama Lengkap */}
                        <label className="block mb-4">
                            <span className="text-lg text-[#efaca5]">Nama lengkap</span>
                            <input
                                type="text"
                                name="namaLengkap"
                                value={formData.namaLengkap}
                                onChange={handleInputChange}
                                placeholder="masukan nama lengkap"
                                className="w-full mt-2 px-4 py-3 rounded-full border-2 border-[#a4c37a] bg-transparent focus:outline-none focus:border-[#86a65e]"
                                required
                            />
                        </label>

                        {/* Alamat Email */}
                        <label className="block mb-4">
                            <span className="text-lg text-[#efaca5]">Alamat email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="masukan alamat email"
                                className="w-full mt-2 px-4 py-3 rounded-full border-2 border-[#a4c37a] bg-transparent focus:outline-none focus:border-[#86a65e]"
                                required
                            />
                        </label>

                        {/* Nomor Telepon */}
                        <label className="block mb-4">
                            <span className="text-lg text-[#efaca5]">Nomor telepon</span>
                            <input
                                type="tel"
                                name="nomorTelepon"
                                value={formData.nomorTelepon}
                                onChange={handleInputChange}
                                placeholder="masukan nomor telepon"
                                className="w-full mt-2 px-4 py-3 rounded-full border-2 border-[#a4c37a] bg-transparent focus:outline-none focus:border-[#86a65e]"
                                required
                            />
                        </label>

                        {/* Alamat Lengkap */}
                        <label className="block mb-4">
                            <span className="text-lg text-[#efaca5]">Alamat lengkap</span>
                            <input
                                type="text"
                                name="alamatLengkap"
                                value={formData.alamatLengkap}
                                onChange={handleInputChange}
                                placeholder="masukan alamat"
                                className="w-full mt-2 px-4 py-3 rounded-full border-2 border-[#a4c37a] bg-transparent focus:outline-none focus:border-[#86a65e]"
                                required
                            />
                        </label>

                        {/* Catatan */}
                        <label className="block mb-4">
                            <span className="text-lg text-[#efaca5]">Catatan</span>
                            <textarea
                                name="catatan"
                                value={formData.catatan}
                                onChange={handleInputChange}
                                placeholder=""
                                rows="5"
                                className="w-full mt-2 px-4 py-3 rounded-3xl border-2 border-[#a4c37a] bg-transparent focus:outline-none focus:border-[#86a65e] resize-none"
                            />
                        </label>
                    </form>
                </div>

                {/* Right Side - Cart Review */}
                <div className="w-1/2">
                    <div className="border-4 border-[#a4c37a] rounded-[50px] p-8 bg-white shadow-lg sticky top-10">
                        <h3 className="text-4xl font-bold text-[#a4c37a] mb-6">Review your cart</h3>
                        
                        {/* Cart Items */}
                        <div className="space-y-4 mb-8">
                            {selectedItems.map((item) => (
                                <div key={item.id} className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-[#a4c37a] rounded-2xl overflow-hidden flex-shrink-0">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-[#a4c37a] capitalize">{item.name}</h4>
                                        <p className="text-sm text-[#efaca5]">{item.quantity}x</p>
                                        <p className="text-lg text-[#efaca5] font-bold">Rp. {formatRupiah(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Summary */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xl">
                                <span className="text-[#a4c37a]">Subtotal</span>
                                <span className="text-[#efaca5] font-bold">Rp. {formatRupiah(totalKeranjang)}</span>
                            </div>
                            <div className="flex justify-between text-xl">
                                <span className="text-[#a4c37a]">Shipping fee</span>
                                <span className="text-[#efaca5] font-bold">Rp. {formatRupiah(shippingFee)}</span>
                            </div>
                            <div className="border-t-2 border-[#a4c37a] pt-3 flex justify-between text-2xl">
                                <span className="text-[#a4c37a] font-bold">Total</span>
                                <span className="text-[#efaca5] font-bold">Rp. {formatRupiah(grandTotal)}</span>
                            </div>
                        </div>

                        {/* Bayar Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-[#a4c37a] text-white text-2xl font-bold rounded-full hover:bg-[#86a65e] transition-all shadow-lg"
                        >
                            Lanjut ke Pembayaran
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;