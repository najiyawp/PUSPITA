import React, {useState, useEffect} from 'react';
import Navbar from './NavbarPublik';
import hero from '../assets/heropage.png';
import puspitapink from '../assets/puspitapink.png';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Homepage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    <div 
      id="home" 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage:`url(${hero})` }}
      >

      <Navbar />
      
      <div className='container mx-auto px-6 py-26 flex flex-col md:flex-row items-center min-h-screen relative'>
        <div className='md:w-1/2 flex justify-center md:justify-start relative order-2 md:order-1 mt-4 md:mt-0'></div>

        <div className='md:w-1/2 text-center md:text-left order-1 md:order-2 relative -mt-16 md:-mt-20 md:ml-12 lg:ml-20'>
        
        <div className='transform scale-125 md:scale-150 -mt-8 md:-mt-12 md:ml-8 lg:ml-36'>
          <img
            src={puspitapink}
            alt='Puspita'
            className='h-40 md:h-48 mx-auto md:mx-0 mb-2'
          />
        </div>

        <div className='mt-12 md:-mt-4 transform scale-105 md:ml-2'>
          <p className='text-[#F7EFDA] max-w-md font-margarine text-[15px] text-justify leading-relaxed mx-auto md:mx-0'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <button 
          onClick={handleBuyClick}
          className='mt-10  border-2 border-[#3e8440] text-[#f7efda] px-12 py-3 rounded-full font-margarine text-xl hover:border-[#3e8440] hover:bg-[#3e8440] hover:text-[#efaca5]'
        >
            Explore with us 
        </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;