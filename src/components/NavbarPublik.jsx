import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import puspitaputih from '../assets/puspitatih.png';
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); 
    }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleArtworkClick = () => {
    scrollToSection("ragam");
  };

  const handleLoginClick = () => {
    if (user) {
      setShowLogoutModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex justify-center z-50 bg-transparent">
        <div className="bg-[#EFACA5]/72 backdrop-blur-md px-12 py-4 rounded-full flex justify-between items-center w-full max-w-4xl text-[#3E8440] font-margarine tracking-wider shadow-lg mt-6">

          {/* Bagian Kiri */}
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

          {/* Logo Tengah */}
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

          {/* Bagian Kanan */}
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

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          {/* Modal Box */}
          <div className="relative bg-[#f7efda] border-2 border-[#3e8440] rounded-3xl p-10 shadow-2xl font-margarine text-center max-w-sm w-full mx-4 z-10">
            <p className="text-[#3e8440] text-2xl mb-2">Yakin mau keluar?</p>
            <p className="text-[#efaca5] text-sm mb-8">Kamu harus login lagi untuk belanja.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-8 py-2 border-2 border-[#3e8440] text-[#3e8440] rounded-full hover:bg-[#3e8440] hover:text-white transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-8 py-2 bg-[#efaca5] text-white rounded-full hover:bg-[#d9908a] transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;