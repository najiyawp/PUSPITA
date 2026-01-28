import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"; // TAMBAHKAN INI
import puspitaputih from '../assets/puspitatih.png';
import { auth } from "../firebase"; // <-- PASTIKAN PATH BENAR
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state
        });
        return () => unsubscribe(); 
    }, []);

  const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const yOffset = -120; // sesuaikan dengan tinggi navbar
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

const handleArtworkClick = () => {
    scrollToSection("ragam");
  };

  // Fungsi untuk handle login button
  const handleLoginClick = async () => {
        if (user) {
            // KONDISI: User SUDAH login -> Lakukan Logout
            const confirmLogout = window.confirm("Anda sudah login. Ingin logout?");
            if (confirmLogout) {
                try {
                    await signOut(auth);
                    navigate('/'); 
                    // Tidak perlu menghapus localStorage karena kita pakai Firebase Auth state
                } catch (error) {
                    console.error("Error during sign out:", error);
                    alert("Gagal logout. Silakan coba lagi.");
                }
            }
        } else {
            // KONDISI: User BELUM login -> Arahkan ke Login
            navigate('/login');
        }
    };

  // Fungsi untuk handle cart button
  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
<nav className="fixed top-0 left-0 w-full flex justify-center z-50 bg-transparent">
  <div className="bg-[#EFACA5]/80 backdrop-blur-md px-12 py-4 rounded-full flex justify-between items-center w-full max-w-4xl text-[#3E8440] font-margarine tracking-wider shadow-lg mt-6">


        {/* Bagian Kiri - ABOUT & ARTWORK */}
        <div className="flex gap-12">
          
          
          
          <button 
            onClick={() => scrollToSection('about')}
            className="text-lg hover:text-[#2A5C2B] transition-colors"
          >
            ABOUT
          </button>
          
          <button 
            onClick={handleArtworkClick}
            className="text-lg hover:text-[#2A5C2B] transition-colors"
          >
            ARTWORK
          </button>
        </div>

        {/* Logo Puspita di Tengah */}
        <button 
          onClick={() => scrollToSection('home')}
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <img
            src={puspitaputih}
            alt="home"
            className="w-32 h-auto transform hover:scale-110 transition-transform" 
          />
        </button>

        {/* Bagian Kanan - LOGIN & CART */}
        <div className="flex gap-12">
          <button 
            onClick={handleLoginClick}
            className="text-lg hover:text-[#2A5C2B] transition-colors"
          >
            {user ? 'LOGOUT' : 'LOGIN'}
          </button>
          <button 
            onClick={handleCartClick}
            className="text-lg hover:text-[#2A5C2B] transition-colors"
          >
            CART
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;