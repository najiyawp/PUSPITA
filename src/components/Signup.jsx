import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import bungbung from '../assets/bungbung.jpg';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const db = getFirestore();

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: 'user',
                createdAt: new Date(),
            });

            console.log('User created succesfully');
            alert('Anda telah terdaftar')
            navigate('/login')
        } catch (error) {
            console.error('Error signing up:', error.message)
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-[#f7efda] to-[#efaca5] font-margarine">
                <div className="w-full max-w-4xl bg-[#f7efda] rounded-3xl shadow-2xl p-6 md:p-10 border-2 border-[#3e8440] flex">
                    <div className="w-full md:w-1/2 flex flex-col justify-center pr-0 md:pr-10">
                        <div className="flex space-x-4 mb-8 justify-center">
                            <Link to="/login" className="px-6 py-2 rounded-full bg-[#3e8440] text-[#f7efda] hover:bg-[#f7efda] transition duration-300 shadow-md">
                                Login
                            </Link>

                            <span className="px-6 py-2 rounded-full bg-[#f7efda] text-[#efaca5] border-2 border-[#3e8440]">
                                Signup
                            </span>
                        </div>

                        <h2 className="text-4xl text-[#efaca5] mb-8 text-center md:text-center">Signup</h2>

                        <form onSubmit={handleSignup} className="space-y-6">

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Masukkan email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-3 px-5 border-2 border-[#3e8440] rounded-full focus:outline-none focus:border-[#C56B83] text-[#efaca5]"
                                    required
                                />

                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A9D18E] text-lg">
                                    <span><i className="fas fa-envelope"></i></span>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full py-3 px-5 border-2 border-[#3e8440] rounded-full focus:outline-none focus:border-[#C56B83] text-[#efaca5]"
                                    required
                                />

                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A9D18E] text-lg">
                                    <span><i className="fas fa-lock"></i></span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-50 py-3 px-6 ml-22 bg-[#3e8440] text-[#efaca5] text-xl rounded-full hover:bg-[#f7efda] hover:border-[#3e8440] transition duration-300 shadow-lg mt-6"
                            >
                                Signup
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="text-sm text-[#efaca5]">
                                Have an account? 
                                <Link to="/login" className="hover:underline text-[#3e8440] ml-1">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex w-1/2 items-center justify-center p-4">
                        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-[#3e8440]">
                            <img 
                                src={bungbung} 
                                alt="Bunga Pompom" 
                                className="w-full h-auto object-cover max-h-[450px]"
                            />
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Signup;