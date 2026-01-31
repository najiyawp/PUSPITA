import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart, FiUser } from "react-icons/fi";
import { auth, db } from "../firebase"; 
import { 
    doc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs 
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useCart } from "../context/CartContext";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("Pengguna");
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [photoURL, setPhotoURL] = useState(null);
    const { addToCart } = useCart();

    const formatRupiah = (number) => {
        if (!number) return "0";
        return number.toLocaleString("id-ID");
    };

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate("/login");
                return;
            }

            // 🔹 USER DATA
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setUserName(data.username || user.email.split("@")[0]);
                setPhotoURL(data.photoURL || user.photoURL);
            } else {
                setUserName(user.email.split("@")[0]);
                setPhotoURL(user.photoURL);
            }

            // 🔹 ORDER HISTORY
            const q = query(
                collection(db, "orders"),
                where("userId", "==", user.uid)
            );
            const snap = await getDocs(q);

            const orders = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || null
            })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

            setOrderHistory(orders);
            setLoading(false);
        };

        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const handleBeliLagi = (order)  => {
        order.items.forEach(item => {
            addToCart({
                ...item,
                quantity: item.quantity
            });
        });

        navigate("/cart");
    }

    

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7efda] text-[#3e8440] font-margarine">
                Memuat profil...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7efda] font-margarine text-[#3e8440] px-10 py-8">
            
            {/* HEADER */}
            <header className="flex justify-between items-center mb-16">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#a4c37a] hover:text-[#3e8440]"
                >
                    <FiArrowLeft /> Kembali
                </button>

                <div className="flex gap-6 text-[#efaca5]">
                    <FiShoppingCart
                        className="w-6 h-6 cursor-pointer hover:text-[#3e8440]"
                        onClick={() => navigate("/cart")}
                    />
                    <FiUser className="w-6 h-6" />
                </div>
            </header>

            {/* PROFILE */}
            <section className="flex flex-col items-center md:items-start md:ml-40 mb-24">
                <div className="w-44 h-44 rounded-full border-2 border-[#3e8440] overflow-hidden mb-6 flex items-center justify-center">
                    {photoURL ? (
                        <img
                            src={photoURL}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FiUser className="w-20 h-20 opacity-40" />
                    )}
                </div>

                <h1 className="text-4xl mb-6">{userName}</h1>

                <div className="flex gap-8">
                    <button
                        onClick={() => navigate("/profile/edit")}
                        className="px-8 py-2 border-2 border-[#3e8440] rounded-full text-xl hover:bg-[#efaca5]"
                    >
                        edit profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-8 py-2 border-2 border-[#efaca5] text-[#efaca5] rounded-full text-xl hover:bg-[#3e8440] hover:text-[#f7efda]"
                    >
                        Log out
                    </button>
                </div>
            </section>

            {/* RIWAYAT PESANAN */}
            <section className="md:ml-40 max-w-3xl">
                <h2 className="text-3xl mb-16">Riwayat Pesanan</h2>

                {orderHistory.length === 0 && (
                    <p className="text-xl">Belum ada riwayat pesanan.</p>
                )}

                <div className="space-y-10">
                    {orderHistory.map(order => (
                        <div
                            key={order.id}
                            className="border border-[#a4c37a] rounded-3xl p-6 shadow-md"
                        >
                            {/* HEADER ORDER */}
                            <div className="flex justify-between mb-6">
                                <div>
                                    <p className="text-lg font-bold">
                                        Pesanan #{order.id.slice(-6)}
                                    </p>
                                    <p className="text-sm text-[#efaca5]">
                                        {order.createdAt?.toLocaleDateString("id-ID")}
                                    </p>
                                </div>

                                <span className="px-4 py-4 rounded-full text-[#3e8440] text-sm bg-[#badd7f]">
                                    {order.status || "Selesai"}
                                </span>
                            </div>

                            {/* PRODUK */}
                            <div className="space-y-4 mb-6">
                                {order.items?.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-6"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-xl object-cover border"
                                        />

                                        <div>
                                            <p className="text-lg">{item.name}</p>
                                            <p className="text-sm text-[#efaca5]">
                                                {item.quantity} item
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* TOTAL */}
                            <p className="text-lg font-semibold">
                                Total Pembayaran: Rp {formatRupiah(order.grandTotal)}
                            </p>

                            <button
                                onClick={() => handleBeliLagi(order)}
                                className="mt-6 px-8 py-2 border-2 border-[#badd7f] bg-[#f7efda] text-[#3e8440] text-semibold hover:bg-[#3e8440] hover:text-[#badd7f] hover:border-[#3e8440] rounded-full"
                            >
                                BELi LAGi
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
