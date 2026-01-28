import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiUser, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);

    // ============================
    // FETCH DATA PRODUK DARI FIRESTORE
    // ============================
    const fetchProduct = async () => {
        try {
            const docRef = doc(db, "products", id);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                const data = snap.data();
                setProduct({
                    id: snap.id,
                    ...data,
                });

                // Set warna default ke warna pertama
                setSelectedColor(data.colors ? data.colors[0] : null);
            } else {
                console.error("Produk tidak ditemukan.");
            }
        } catch (err) {
            console.error("Error load product:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="p-10 text-xl text-[#3e8440]">Memuat detail produk...</div>
        );
    }

    if (!product) {
        return (
            <div className="p-10 text-xl text-red-500">Produk tidak ditemukan.</div>
        );
    }

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        if (quantity < product.stock) setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const productToAdd = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageURL,
            selectedColor: selectedColor,
        };

        addToCart(productToAdd, quantity);

        alert(
            `${quantity}x ${product.name} (${selectedColor}) ditambahkan ke keranjang!`
        );

        navigate("/cart");
    };

    return (
        <div className="w-full min-h-screen bg-[#f7efda] text-[#3e8440] font-margarine relative px-10 pb-10">

            {/* HEADER */}
            <div className="flex justify-between items-center py-6">
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-1 text-[#badd7f]"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate("/cart")}
                        className="text-[#3e8440]"
                    >
                        <FiShoppingCart className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => navigate("/profile")} 
                        className="text-[#3e8440]">
                        <FiUser className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* DETAIL PRODUK */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                max-w-[1000px] w-full border-2 border-[#3e8440] rounded-[70px] p-10 bg-[#f7efda] shadow-xl
                flex gap-10">

                {/* GAMBAR PRODUK */}
                <div className="w-[480px] h-[480px] bg-[#f7efda] rounded-[40px] overflow-hidden">
                    <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* DETAIL */}
                <div className="flex flex-col justify-start pt-4">
                    <h1 className="text-4xl font-bold mb-2 uppercase">{product.name}</h1>
                    <p className="text-[#efaca5] text-2xl mb-2">
                        Rp. {product.price?.toLocaleString("id-ID")}
                    </p>

                    {/* WARNA */}
                    <div className="flex gap-2 mb-4">
                        {product.colors?.map((color) => (
                            <div
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                style={{ backgroundColor: color }}
                                className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all duration-150 ${
                                    selectedColor === color
                                        ? "border-white ring-2 ring-offset-1 ring-white"
                                        : "border-transparent hover:ring-2 hover:ring-offset-1 hover:ring-white"
                                }`}
                            ></div>
                        ))}
                    </div>

                    <p className="text-[#efaca5] w-[450px] mb-8 leading-relaxed text-sm">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-3 gap-10 text-lg mb-10">
                        <div>
                            <p className="font-bold text-sm">Ukuran</p>
                            <p className="text-[#efaca5] text-sm">{product.size || "-"}</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm">Kategori</p>
                            <p className="text-[#efaca5] text-sm capitalize">{product.category}</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm">Stok</p>
                            <p className="text-[#efaca5] text-sm">{product.stock}</p>
                        </div>
                    </div>

                    {/* QUANTITY + ADD TO CART */}
                    <div className="flex items-center gap-4 text-2xl">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={handleDecrease} 
                                className="text-3xl font-bold hover:text-green-700"
                            >
                                -
                            </button>
                            <span className="text-2xl font-bold">{quantity}</span>
                            <button 
                                onClick={handleIncrease} 
                                className="text-3xl font-bold hover:text-[#3e8440]"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="ml-6 px-10 py-3 bg-[#efaca5] text-white rounded-full shadow-lg text-xl transition-opacity hover:opacity-90"
                        >
                            Tambah ke keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
