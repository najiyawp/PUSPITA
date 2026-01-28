import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const snap = await getDocs(collection(db, "products"));
            const list = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setProducts(list);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm("Hapus produk ini?")) return;
        await deleteDoc(doc(db, "products", productId));
        setProducts(products.filter((p) => p.id !== productId));
        alert("Produk dihapus!");
    };

    const handleEdit = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };

    if (loading) return <p className="text-xl text-[#3e8440]">Memuat data...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EFACA5] to-[#F7EFDA] p-12 font-margarine text-[#3e8440]">

            {/* TITLE */}
            <h2 className="text-4xl font-bold mb-10 text-[#3e8440]">Kelola Produk</h2>

            {/* TABLE WRAPPER */}
            <div className="bg-[#f7efda] p-0 rounded-[40px] shadow-lg border border-[#3e8440] overflow-hidden">

                {/* HEADER */}
                <div className="grid grid-cols-6 text-center bg-[#3e8440] text-white py-4 text-xl font-bold border-b border-[#3e8440]">
                    <span>nama produk</span>
                    <span>Kategori</span>
                    <span>harga</span>
                    <span>stok</span>
                    <span>Tgl. masuk</span>
                    <span>Aksi</span>
                </div>

                {/* TABLE ROWS */}
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="grid grid-cols-6 text-center py-5 text-lg border-b border-[#3e8440]"
                    >
                        {/* nama produk */}
                        <span className="capitalize">{p.name}</span>

                        {/* kategori */}
                        <span className="capitalize">{p.category}</span>

                        {/* harga */}
                        <span>
                            Rp {p.price?.toLocaleString("id-ID")}
                        </span>

                        {/* stok */}
                        <span>{p.stock}</span>

                        {/* tanggal masuk */}
                        <span>
                            {p.createdAt?.toDate
                                ? p.createdAt.toDate().toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                  })
                                : "-"}
                        </span>

                        {/* aksi */}
                        <div className="flex justify-center gap-4 text-xl">
                            <button
                                onClick={() => handleEdit(p.id)}
                                className="text-[#3e8440] hover:text-[#A4C37A]"
                                title="Edit"
                            >
                                <FiEdit2 />
                            </button>

                            <button
                                onClick={() => handleDelete(p.id)}
                                className="text-[#3e8440] hover:text-red-500"
                                title="Hapus"
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

export default ManageProductsPage;
