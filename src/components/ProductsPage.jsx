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

    // ============================
    // FIRESTORE FETCH
    // ============================
    const fetchProducts = async () => {
        try {
            const snap = await getDocs(collection(db, "products"));
            const items = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProducts(items);
        } catch (err) {
            console.error("Error get products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ============================
    // FILTER CATEGORY
    // ============================
    const filtered =
        selectedCategory === "all"
            ? products
            : products.filter(
                  (p) =>
                      p.category?.toLowerCase() === selectedCategory.toLowerCase()
              );

    const handleNavigateToDetail = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="w-full min-h-screen bg-[url('data:image/svg+xml,<svg id=%27patternId%27 width=%27100%25%27 height=%27100%25%27 xmlns=%27http://www.w3.org/2000/svg%27><defs><pattern id=%27a%27 patternUnits=%27userSpaceOnUse%27 width=%2720%27 height=%2720%27 patternTransform=%27scale(2)rotate(0)%27><rect x=%270%27 y=%270%27 width=%27100%25%27 height=%27100%25%27 fill=%27%23f7efdaff%27/><path d=%27M0 0h10v10H0z%27 stroke-width=%271%27 stroke=%27none%27 fill=%27%23badd7fff%27/><path d=%27M10 10h10v10H10z%27 stroke-width=%271%27 stroke=%27none%27 fill=%27%23badd7fff%27/></pattern></defs><rect width=%27800%25%27 height=%27800%25%27 fill=%27url(%23a)%27/></svg>')] text-[#3e8440] font-margarine relative">
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1 text-[#badd7f] text-sm"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <button
                    onClick={() => navigate("/profile")}
                    className="text-[#3e8440] hover:text-green-700"
                >
                    <FiUser className="w-6 h-6" />
                </button>
            </div>

            {/* HEADER IMAGE */}
            <div className="flex justify-center mt-6">
                <img src={pernakpernik} alt="header" className="w-56" />
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex justify-center gap-4 mt-4">
                {["all", "bunga", "dekoratif"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1 rounded-full text-sm capitalize ${
                            selectedCategory === cat
                                ? "bg-[#A4C37A] text-white"
                                : "border border-[#A4C37A]"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-center text-xl mt-20">Memuat produk...</div>
            )}

            {/* LIST PRODUK */}
            {!loading && (
                <div className="grid grid-cols-4 gap-6 px-10 mt-10 pb-20">
                    {filtered.map((item) => (
                        <div key={item.id} className="flex flex-col">
                            <div
                                onClick={() => handleNavigateToDetail(item.id)}
                                className="cursor-pointer"
                            >
                                <img
                                    src={item.imageURL}
                                    alt={item.name}
                                    className="w-80 h-62 object-cover rounded-lg"
                                />
                            </div>

                            <p className="mt-2 text-sm font-bold capitalize">
                                {item.name}
                            </p>
                            <p className="text-sm">
                                Rp {item.price?.toLocaleString("id-ID")}
                            </p>

                            <button
                                onClick={() => handleNavigateToDetail(item.id)}
                                className="mt-[-24px] ml-72 w-7 h-7 border border-[#D79A9E] text-[#D79A9E] rounded-full flex items-center justify-center text-xl font-bold hover:bg-[#D79A9E] hover:text-white transition-colors"
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* CART BUTTON */}
            <button
                onClick={() => navigate("/cart")}
                className="fixed bottom-8 right-8 w-16 h-16 bg-[#f7efda] text-[#efaca5] border-2 border-[#3e8440] rounded-full shadow-lg flex items-center justify-center hover:scale-105"
            >
                <FiShoppingCart className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ProductsPage;
