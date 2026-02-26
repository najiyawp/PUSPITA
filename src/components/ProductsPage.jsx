import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import bungbung from '../assets/bungbung.jpg';
import buketbunga from '../assets/buketbunga.jpg';
import potkecil from '../assets/potkecil.jpg';
import pernakpernik from "../assets/pernakpernik.png";
import puspitapink from '../assets/puspitapink.png';
import banner from '../assets/banner.png'; 

const ProductsPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { id: 1, image: bungbung }, 
        { id: 2, image: buketbunga },
        { id: 3, image: potkecil },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000); 
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    };

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
            className="w-full min-h-screen text-[#3e8440] font-margarine relative overflow-x-hidden"
            style={gradientStyle}
        >
            {/* 1. HEADER (Atas Sendiri) */}
            <div className="w-full flex justify-between items-center px-6 z-30 relative -bottom-2 -top-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1 text-[#3e8440] text-sm bg-white/40 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white transition-all shadow-sm"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to home
                </button>

                <img src={puspitapink} alt="Puspita Logo" className="w-44 mr-24 md:w-60" />

                <button
                    onClick={() => navigate("/profile")}
                    className="text-[#3e8440] bg-white/40 backdrop-blur-md p-3 rounded-full hover:scale-110 transition-transform shadow-sm"
                >
                    <FiUser className="w-6 h-6" />
                </button>
            </div>

            {/* 2. BANNER FULL WIDTH (Di Atas Gambar) */}
            <div className="w-full flex justify-center mb-0 mt-2">
                <img 
                    src={banner} 
                    alt="Mulai Abadi Banner" 
                    className="w-full object-contain" 
                />
            </div>

            {/* 3. SHOWCASE CAROUSEL FULL WIDTH (Gak ada putih-putih di pinggir) */}
            <div className="relative w-full h-[550px] overflow-hidden shadow-2xl mt-[-70px]">
                <div 
                    className="w-full h-full flex transition-transform duration-1000 ease-in-out" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className="w-full h-full flex-shrink-0">
                            <img 
                                src={slide.image} 
                                className="w-full h-full object-cover" 
                                alt="showcase" 
                            />
                        </div>
                    ))}
                </div>

                {/* Fade Transparan ke Background Bawah */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f7efda] to-transparent z-10"></div>

                {/* Navigasi Panah */}
                <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-4 rounded-full transition-all z-20">
                    <FiChevronLeft className="w-10 h-10 text-white" />
                </button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-4 rounded-full transition-all z-20">
                    <FiChevronRight className="w-10 h-10 text-white" />
                </button>

                {/* Indikator Dots */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {slides.map((_, index) => (
                        <div 
                            key={index}
                            className={`h-3 rounded-full transition-all duration-500 ${currentSlide === index ? "bg-[#3e8440] w-10" : "bg-white/50 w-3"}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* 4. LOGO PERNAK PERNIK */}
            <div className="flex justify-center mt-16 mb-8">
                <img
                    src={pernakpernik}
                    alt="pernak pernik"
                    className="w-64 hover:scale-105 transition-transform"
                />
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="flex justify-center gap-4 mb-12">
                {["all", "bunga", "dekoratif"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-base capitalize transition-all duration-300 ${
                            selectedCategory === cat
                                ? "bg-[#3e8440] text-[#badd7f] scale-110 shadow-lg"
                                : "border-2 border-[#badd7f] text-[#3e8440] hover:bg-[#badd7f]/30"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* PRODUCT GRID */}
            {loading ? (
                <div className="text-center text-2xl mt-24">Memuat produk...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-10 pb-40">
                    {filtered.map((item, index) => (
                        <div key={item.id} className="group flex flex-col transition-all duration-300 hover:-translate-y-2">
                            <div
                                onClick={() => navigate(`/product/${item.id}`)}
                                className="relative cursor-pointer overflow-hidden rounded-2xl shadow-md group-hover:shadow-2xl transition-all"
                            >
                                <img
                                    src={item.imageURL}
                                    alt={item.name}
                                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {index < 2 && (
                                    <span className="absolute top-4 left-4 bg-[#efaca5] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                        Best Seller
                                    </span>
                                )}
                                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-2xl text-[#3e8440] opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                                    +
                                </div>
                            </div>
                            <p className="mt-4 text-lg font-bold capitalize">{item.name}</p>
                            <p className="text-base font-medium opacity-80">Rp {item.price?.toLocaleString("id-ID")}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* FLOATING CART */}
            <button
                onClick={() => navigate("/cart")}
                className="fixed bottom-10 right-10 w-16 h-16 bg-[#f7efda] text-[#efaca5] border-2 border-[#3e8440] rounded-full shadow-2xl flex items-center justify-center hover:scale-125 transition-all z-50"
            >
                <FiShoppingCart className="w-8 h-8" />
            </button>
        </div>
    );
};

export default ProductsPage;