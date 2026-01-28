import React, { useState } from "react";
import lemaritext from "../assets/lemaritext.png";
import ganci from "../assets/ganci.jpg";
import custom from "../assets/custom.jpg";
import bungbung from "../assets/bungbung.jpg";

const LemariKarya = () => {
    const karyaItems = [ganci, custom, bungbung];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === karyaItems.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? karyaItems.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gradient-to-b from-[#EFACA5] to-[#F7EFDA] flex flex-col items-center justify-center p-6">
                
                <button
                    onClick={prevImage}
                    className="mb-3 hover:scale-110 transition"
                >
                    <div className="w-3 h-3 border-t-2 border-l-2 border-[#3E8440] rotate-45"></div>
                </button>


                {/* BOX GAMBAR */}
                <div className="w-[80%] max-w-md h-4/6 bg-[#F7EFDA] rounded-3xl border-3 border-[#3E8440] overflow-hidden shadow-lg flex items-center justify-center">
                    <img
                        src={karyaItems[currentIndex]}
                        className="w-full h-full object-cover transition-all duration-500"
                        alt="Karya"
                    />
                </div>

                <button
                    onClick={nextImage}
                    className="mt-3 hover:scale-110 transition"
                >
                    <div className="w-3 h-3 border-b-2 border-l-2 border-[#3E8440] -rotate-45"></div>
                </button>

            </div>

            {/* KANAN – BACKGROUND KREM + PNG */}
            <div className="relative bg-[#faf2dd]">
                <img
                    src={lemaritext}
                    className="absolute md:left-6 md:bottom-8 w-[70%] pointer-events-none"
                    alt="Lemari Karya Text"
                />
            </div>

        </div>
    );
};

export default LemariKarya;
