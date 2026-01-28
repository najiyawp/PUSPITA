import React, {useState} from 'react';
import puspitapink from '../assets/puspitapink.png';

const Footer = () => {
    const [chatMessage, setChatMessage] = useState('');
    const whatsappNumber = '62882007026132';
    

    const contactData = [
        "808utterer@gmail.com",
        "0882007026132",
        "Jl. Murti Saphira Raya, No. 03"
    ];

    const sellData = [
        "Bunga artifisial",
        "Aksesoris",
        "Custom"
    ];

    const assistData = [
        "Delivery",
        "Terms & Coditions",
        "Payment method"
    ];

    const handleChatSubmit = (e) => {
        e.preventDefault();
        
        if (chatMessage.trim() === '') {
            alert('Silakan ketik pesan Anda terlebih dahulu.');
            return;
        }

        const encodedMessage = encodeURIComponent(chatMessage);
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        
        setChatMessage('');
    };


    return (
        // Container Utama (Background Krem/Beige)
        <footer className="relative font-margarine">
            <div className="bg-[#f7efda] relative pt-32">
            
            <div className="absolute bottom-52 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"> 
                <img src={puspitapink} alt="Puspita" className="h-80 w-auto" />
            </div>

            <div className="bg-[#efaca5] mx-auto pt-24 pb-6 px-12 rounded-t-[4rem] relative z-10 mt-[12rem]">
                
                {/* Bagian Kolom Teks (CONTACT, WHAT WE SELL, ASSIST) */}
                <div className="container mx-auto max-w-7xl flex justify-between font-margarine text-[#f7efda] mb-12">
                    
                    {/* Kolom CONTACT */}
                    <div className="w-1/3">
                        <h4 className="text-[#3e8440] font-bold text-lg mb-4">CONTACT</h4>
                        {contactData.map((item, index) => (
                            <p key={index} className="text-sm mb-2 text-[#f7efda]">{item}</p>
                        ))}
                    </div>

                    {/* Kolom WHAT WE SELL */}
                    <div className="w-1/3">
                        <h4 className="text-[#3e8440] font-bold text-lg mb-4">WHAT WE SELL</h4>
                        {sellData.map((item, index) => (
                            <p key={index} className="text-sm mb-2 text-[#f7efda]">{item}</p>
                        ))}
                    </div>

                    {/* Kolom ASSIST */}
                    <div className="w-1/3">
                        <h4 className="text-[#3e8440] font-bold text-lg mb-4">ASSIST</h4>
                        {assistData.map((item, index) => (
                            <p key={index} className="text-sm mb-2 text-[#f7efda]">
                                {item}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="bg-[#3e8440] py-4 rounded-full mx-auto shadow-xl relative z-10 w-full">
                    <form onSubmit={handleChatSubmit}>
                    <div className="container mx-auto max-4xl px-12 flex items-center justify-between">
                        <p className="text-[#f7efda] text-xl">Ready to assist you!</p>
                        
                        <div className="flex bg-[#f7efda] rounded-full overflow-hidden w-96">
                            <input 
                                type="text" 
                                placeholder="Type a message" 
                                value={chatMessage} 
                                onChange={(e) => setChatMessage(e.target.value)}
                                className="p-3 flex-grow border-none focus:outline-none text-gray-700"
                            />
                            <button
                                type='submit' 
                                className="bg-[#f7efda  ] text-[#789d6e] font-bold px-6 py-2"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    </form>
                </div>

                {/* CREDIT (Paling Bawah) - Di dalam kontainer Pink */}
                <div className="pt-8 text-center text-[#3e8440] text-sm"> {/* Menggunakan warna teks hijau (#3e8440) agar kontras dengan pink */}
                    <p>&copy; 2025 Puspita. All rights reserved.</p>
                </div>

            </div>
        
        </div>

        </footer>
    );
};

export default Footer;