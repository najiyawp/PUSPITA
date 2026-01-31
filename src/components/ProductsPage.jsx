import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiShoppingCart } from "react-icons/fi";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import pernakpernik from "../assets/pernakpernik.png";

const ProductsPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const snap = await getDocs(collection(db, "products"));
            const items = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered =
        selectedCategory === "all"
            ? products
            : products.filter(
                  (p) =>
                      p.category?.toLowerCase() ===
                      selectedCategory.toLowerCase()
              );

    const gradientStyle = {
        background:
            "linear-gradient(0deg, hsla(6,70%,79%,1) 0%, hsla(39,67%,91%,1) 45%, hsla(43,64%,91%,1) 100%)",
    };

    return (
        <div
            className="w-full min-h-screen text-[#3e8440] font-margarine relative"
            style={gradientStyle}
        >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1 text-[#badd7f] text-sm hover:text-[#3e8440] transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <button
                    onClick={() => navigate("/profile")}
                    className="text-[#3e8440] hover:scale-110 transition-transform"
                >
                    <FiUser className="w-6 h-6" />
                </button>
            </div>

            {/* LOGO */}
            <div className="flex justify-center mt-6 mb-8">
                <img
                    src={pernakpernik}
                    alt="header"
                    className="w-56 hover:scale-105 transition-transform"
                />
            </div>

            {/* CATEGORY */}
            <div className="flex justify-center gap-4 mb-8">
                {["all", "bunga", "dekoratif"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1 rounded-full text-sm capitalize transition-all duration-300 ${
                            selectedCategory === cat
                                ? "bg-[#3e8440] text-[#badd7f] scale-105 shadow-md"
                                : "border border-[#badd7f] text-[#3e8440] hover:bg-[#badd7f]/30 hover:scale-105"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-center text-xl mt-24">
                    Memuat produk...
                </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && (
                <div className="grid grid-cols-4 gap-8 px-10 pb-32">
                    {filtered.map((item, index) => (
                        <div
                            key={item.id}
                            className="group flex flex-col transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* IMAGE */}
                            <div
                                onClick={() =>
                                    navigate(`/product/${item.id}`)
                                }
                                className="relative cursor-pointer overflow-hidden rounded-xl shadow-sm group-hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={item.imageURL}
                                    alt={item.name}
                                    className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* BEST SELLER */}
                                {index < 2 && (
                                    <span className="absolute top-2 left-2 bg-[#efaca5] text-white text-xs px-3 py-1 rounded-full shadow">
                                        Best Seller
                                    </span>
                                )}

                                {/* QUICK ACTION */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/product/${item.id}`);
                                    }}
                                    className="absolute bottom-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                >
                                    +
                                </button>
                            </div>

                            {/* INFO */}
                            <p className="mt-3 text-sm font-semibold capitalize">
                                {item.name}
                            </p>
                            <p className="text-sm">
                                Rp{" "}
                                {item.price?.toLocaleString("id-ID")}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* FLOATING CART */}
            <button
                onClick={() => navigate("/cart")}
                className="fixed bottom-8 right-8 w-14 h-14 bg-[#f7efda] text-[#efaca5] border-2 border-[#3e8440] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
                <FiShoppingCart className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ProductsPage;
