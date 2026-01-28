import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import layout from "../assets/ragambg.jpg";
import mawar from "../assets/mawar.png";
import dekor from "../assets/dekor.png";

const Ragam = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const products = [
    { title: "BUNGA ABADi", img: mawar },
    { title: "DEKORATiF", img: dekor },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state with the authenticated user or null
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);


  const handleBuyClick = () => { // 👈 RENAME function for clarity
    if (user) {
      // User is logged in, navigate to products
      navigate("/products");
    } else {
      // User is NOT logged in, navigate to signup/login flow
      navigate("/signup");
    }
  };


  return (
    <section id="ragam">
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-start pt-40"
      style={{ backgroundImage: `url(${layout})` }}
    >
      <div className="flex gap-12 mt-52">
        {products.map((item, i) => (
          <div key={i}>
            <div className="w-64 h-80 font-margarine text-center bg-[#f9f0dd]/85 rounded-2xl border-2 border-[#3E8440] shadow-xl overflow-hidden mb-4">
              <div className="px-2 pt-4 pb-2">
                <p className="text-[#7bb06b] mb-1 text-xl font-bold">{item.title}</p>

                <div className="flex justify-center items-center h-56">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleBuyClick}
              className="w-64 bg-[#7bb06b] hover:bg-[#5f9c55] text-white py-3 rounded-full shadow-lg font-margarine"
            >
              BELI
            </button>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default Ragam;
