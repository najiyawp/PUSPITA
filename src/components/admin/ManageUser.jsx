import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { db, auth } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const usersCollectionRef = collection(db, "users");
            const querySnapshot = await getDocs(usersCollectionRef);
            
            const usersList = querySnapshot.docs
                .map(document => ({
                    id: document.id,
                    ...document.data()
                }))
                .filter(user => user.id !== auth.currentUser?.uid); 

            setUsers(usersList);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Gagal memuat data pengguna.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm(`Yakin ingin menghapus user ID: ${userId}? Ini akan menghapus akun Auth mereka juga.`)) {
            try {
                await deleteDoc(doc(db, "users", userId));
                setUsers(users.filter(u => u.id !== userId));
                alert(`Pengguna ID ${userId} berhasil dihapus dari Firestore.`);
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Gagal menghapus data pengguna di Firestore.");
            }
        }
    };

    if (loading) return <div className="text-xl text-[#3e8440]">Memuat data pengguna...</div>;
    if (error) return <div className="text-xl text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EFACA5] to-[#F7EFDA] p-12 font-margarine text-[#3e8440]">

            {/* TITLE */}
            <h2 className="text-4xl font-bold mb-10 text-[#3e8440]">Kelola pengguna</h2>

            {/* SEARCH BAR */}
            <div className="flex mb-10">
                <div className="flex items-center w-80 bg-transparent text-[#f7efda] px-5 py-3 rounded-full border-2 border-[#f7efda]">
                    <FiSearch className="mr-3" />
                <input  
                    type="text"
                    className="bg-transparent w-full focus:outline-none placeholder-[#f7efda]"
                    placeholder="Cari"
                />
                </div>
            </div>

            {/* TABLE WRAPPER */}
            <div className="bg-[#f7efda] p-0 rounded-[40px] shadow-lg border border-[#3e8440] overflow-hidden">

                {/* TABLE HEADER */}
                <div className="grid grid-cols-6 text-center bg-[#3e8440] text-white py-4 text-xl font-bold border-b border-[#3e8440]">
                    <span>username</span>
                    <span>email</span>
                    <span>status</span>
                    <span>role</span>
                    <span>joined at</span>
                    <span>action</span>
                </div>

                {/* TABLE ROWS */}
                {users.map((user, index) => (
                    <div 
                        key={user.id}
                        className="grid grid-cols-6 text-center py-5 text-lg border-b border-[#3e8440]"
                    >
                        <span className="capitalize">{user.username || 'N/A'}</span>
                        <span>{user.email}</span>

                        {/* status */}
                        <span className="capitalize">
                            {user.status || 'active'}
                        </span>

                        {/* role */}
                        <span className={`${user.role === "admin" ? "text-pink-500 font-bold" : ""}`}>
                            {user.role}
                        </span>

                        {/* JOINED DATE */}
                        <span>
                            {user.createdAt?.toDate ? 
                                user.createdAt.toDate().toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) 
                                : 'N/A'}
                        </span>

                        {/* ACTION ICONS */}
                        <div className="flex justify-center gap-4">
                            <button 
                                title="Hapus" 
                                onClick={() => handleDelete(user.id)} 
                                className="text-[#3e8440] hover:text-red-500 text-xl"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ManageUsersPage;
