import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
    const navigate = useNavigate();

    const { 
        cart, 
        totalKeranjang, 
        updateQuantity, 
        removeItem, 
        toggleSelect 
    } = useCart();

    const formatRupiah = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleCheckout = () => {
        if (totalKeranjang > 0) {
            navigate("/checkout");
        }
    };

    // Filter hanya item yang dipilih
    const selectedItems = cart.filter(item => item.isSelected);
    const selectedTotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="w-full min-h-screen bg-[#f7efda] text-[#3e8440] font-margarine relative px-10 pb-20">

            {/* HEADER */}
            <div className="flex justify-between items-center py-6">
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 text-[#a4c37a] text-lg hover:text-[#3e8440]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke produk
                </button>

                <div className="flex items-center gap-6">
                    <button onClick={() => navigate("/cart")}>
                        <FiShoppingCart className="w-6 h-6 text-[#efaca5]" />
                    </button>
                    <button onClick={() => navigate("/profile")} >
                        <FiUser className="w-6 h-6 text-[#efaca5]" />
                    </button>
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-8">Keranjang kamu</h1>

            <div className="border-2 border-[#3e8440] rounded-[40px] p-10 bg-[#f7efda] shadow-lg">
                
                {cart.length === 0 ? (
                    <p className="text-center text-xl text-[#efaca5] py-10">Keranjang kamu kosong.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                            
                            <div className="flex items-center gap-6">
                                <input 
                                    type="checkbox" 
                                    checked={item.isSelected}
                                    onChange={() => toggleSelect(item.id)}
                                    className="w-4 h-4 text-[#efaca5] bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-[#3e8440] checked:bg-[#f7efda]"
                                    style={{ accentColor: '#3e8440' }}
                                />
                                <div className="w-20 h-20 bg-[#a4c37a] rounded-xl overflow-hidden">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <span className="text-xl text-[#efaca5] font-bold capitalize">{item.name}</span>
                            </div>

                            <div className="flex items-center gap-16">
                                <div className="flex items-center gap-4 text-xl">
                                    <button 
                                        onClick={() => updateQuantity(item.id, -1)} 
                                        className="text-2xl font-bold text-[#a4c37a] hover:text-green-700 disabled:opacity-50"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="text-xl">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, 1)} 
                                        className="text-2xl text-[#a4c37a] hover:text-green-700"
                                    >
                                        +
                                    </button>
                                </div>

                                <span className="text-xl font-bold text-[#efaca5] w-36 text-right">
                                    Rp. {formatRupiah(item.price * item.quantity)}
                                </span>

                                <button onClick={() => removeItem(item.id)} className="text-[#efaca5] hover:text-red-500">
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-between items-center mt-10">
                <h2 className="text-3xl font-bold">
                    Total Keranjang = <span className="text-[#efaca5]">Rp. {formatRupiah(totalKeranjang)}</span>
                </h2>
                
                <button
                    onClick={handleCheckout}
                    disabled={totalKeranjang === 0}
                    className={`px-12 py-4 rounded-full text-2xl text-[#f7efda] transition-all shadow-lg ${
                        totalKeranjang === 0 
                        ? 'bg-[#efaca5] cursor-not-allowed'
                        : 'bg-[#3e8440] transform hover:scale-105'
                    }`}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;