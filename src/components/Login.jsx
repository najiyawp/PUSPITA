import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import bungbung from "../assets/bungbung.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const userRole = userData.role;

                // ================================
                // ADMIN LOGIN → BUKA TAB BARU
                // ================================
                if (userRole === 'admin') {
                    console.log('Admin logged in');
                    alert('Selamat datang, Admin.');

                    // buka halaman admin di TAB BARU
                    window.open('/admin/dashboard', '_blank', 'noopener,noreferrer');

                    // tab lama diarahkan ke home user
                    navigate('/');
                    return;
                }

                // =================================
                // USER BIASA → MASUK KE /products
                // =================================
                console.log('User logged in');
                alert('Anda berhasil masuk.');
                navigate('/products');

            } else {
                setError("Data pengguna tidak ditemukan. Silahkan hubungi admin.");
            }

        } catch (error) {
            console.error('Error logging in:', error.message);
            setError('Gagal masuk. Periksa kembali Email dan Password Anda.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-[#EFACA5] to-[#F7EFDA] font-margarine">
            <div className="w-full max-w-4xl bg-[#f7efda] rounded-3xl shadow-2xl p-6 md:p-10 border-2 border-[#3e8440] flex">
                
                {/* Form Login */}
                <div className="w-full md:w-1/2 flex flex-col justify-center pr-0 md:pr-10">
                    <div className="flex space-x-4 mb-8 justify-center">
                        <span className="px-6 py-2 rounded-full bg-[#f7efda] text-[#efaca5] border-2 border-[#3e8440]">
                            Login
                        </span>
                        <Link to="/signup" className="px-6 py-2 rounded-full bg-[#3e8440] text-white hover:bg-[#f7efda] transition duration-300 shadow-md">
                            Signup
                        </Link>
                    </div>

                    <h2 className="text-4xl text-[#efaca5] mb-8 text-center">Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Masukkan email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-3 px-5 border-2 border-[#3e8440] rounded-full focus:outline-none focus:border-[#3e8440] text-[#efaca5]"
                                required
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#efaca5] text-lg">
                                <span><i className="fas fa-envelope"></i></span>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full py-3 px-5 border-2 border-[#3e8440] rounded-full focus:outline-none focus:border-[#3e8440] text-[#efaca5]"
                                required
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#efaca5] text-lg">
                                <span><i className="fas fa-lock"></i></span>
                            </div>
                        </div>

                        <div className="text-right text-sm pt-1">
                            <Link to="/forgot-password" className="text-[#efaca5] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-50 py-3 px-6 ml-22 bg-[#3e8440] text-[#efaca5] text-xl rounded-full hover:bg-[#f7efda] transition duration-300 shadow-lg mt-6"
                        >
                            Login
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-[#efaca5]">
                            Don't have an account?
                            <Link to="/signup" className="hover:underline text-[#3e8440] ml-1">
                                Signup
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Gambar Kanan */}
                <div className="hidden md:flex w-1/2 items-center justify-center p-4">
                    <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-[#3e8440]">
                        <img 
                            src={bungbung} 
                            alt="Bunga" 
                            className="w-full h-auto object-cover max-h-[450px]"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
