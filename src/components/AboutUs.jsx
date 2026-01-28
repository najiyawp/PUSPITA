import React from "react";
import tentangkami from '../assets/tentangkami.png';
import bungabg from '../assets/bungabg.jpg';

const AboutUs = () => {
    return (
        <section id="about" className="bg-[#f7efda] min-h-screen flex flex-col items-center justify-center px-6 py-16">

            <img
                src={tentangkami}
                alt="Tentang Kami"
                className="w-[450px] md:w-[650px] mb-6 -mt-10"
            />

            <div
                className="relative w-full max-w-7xl rounded-2xl overflow-hidden h-[550px]"
                style={{
                    backgroundImage: `url(${bungabg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >

                <div className="absolute inset-0 bg-[#f7efda] opacity-30"></div>

                <div className="relative grid grid-cols-3 gap-8 p-12 text-[#efaca5] font-margarine">
                    <div className="bg-[#f7efda] rounded-3xl p-4 shadow-md flex items-center justify-center text-center w-[180px] h-[180px] transform -rotate-6">
                        <p>Mencintai lingkungan dengan cara yang unik</p>
                    </div>

                    <div className="bg-[#f7efda] rounded-3xl p-4 shadow-md flex items-center justify-center text-center w-[180px] h-[180px] transform rotate-3 mt-8">
                        <p>Memanfaatkan material bekas menjadi barang yang unik</p>
                    </div>
                    <div className="bg-[#f7efda] rounded-3xl p-4 shadow-md flex items-center justify-center text-center w-[180px] h-[180px] transform -rotate-12 ml-auto">
                        <p>Menggabungkan kreativitas dengan pelestarian lingkungan</p>
                    </div>
                    <div className="bg-[#f7efda] rounded-3xl p-4 shadow-md flex items-center justify-center text-center w-[180px] h-[180px] transform rotate-6 col-start-2 mt-[-2px] ml-[-180px]">
                        <p>Memberikan kesempatan kedua untuk barang bekas</p>
                    </div>
                    <div className="bg-[#f7efda] rounded-3xl p-4 shadow-md flex items-center justify-center text-center w-[180px] h-[180px] transform -rotate-3 col-start-3 mt-[-40px] ml-[-120px]">
                        <p>Membuktikan bahwa segala hal dapat menjadi indah</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default  AboutUs;