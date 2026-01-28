import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiUpload, FiX } from 'react-icons/fi';

const EditProductPage = () => {
    const { productId } = useParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(1);
    const [category, setCategory] = useState('');
    const [colors, setColors] = useState([]);
    const [newColorInput, setNewColorInput] = useState('');

    const [existingImageURL, setExistingImageURL] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const CLOUD_NAME = 'dcgu2uind';
    const UPLOAD_PRESET = 'puspita-db';

    const categories = ['bunga', 'dekorasi'];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const ref = doc(db, 'products', productId);
                const snap = await getDoc(ref);

                if (!snap.exists()) throw new Error('Produk tidak ditemukan');

                const data = snap.data();
                setName(data.name || '');
                setDescription(data.description || '');
                setSize(data.size || '');
                setPrice(String(data.price || ''));
                setStock(data.stock || 1);
                setCategory(data.category || '');
                setColors(data.colors || []);
                setExistingImageURL(data.imageURL || '');
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [productId]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) setImageFile(e.target.files[0]);
    };

    const handleAddColor = () => {
        const color = newColorInput.trim().toLowerCase();
        if (color && !colors.includes(color)) {
            setColors([...colors, color]);
        }
        setNewColorInput('');
    };

    const handleRemoveColor = (color) => {
        setColors(colors.filter((c) => c !== color));
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error('Gagal upload gambar');
        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            let imageURL = existingImageURL;
            if (imageFile) imageURL = await uploadToCloudinary(imageFile);

            const cleanedPrice = price.replace(/\./g, '');

            await updateDoc(doc(db, 'products', productId), {
                name,
                description,
                size,
                price: Number(cleanedPrice),
                stock: Number(stock),
                category,
                colors,
                imageURL,
                updatedAt: new Date(),
            });

            setSuccess('Produk berhasil diperbarui');
            setImageFile(null);
        } catch (err) {
            setError(err.message);
        }

        setSaving(false);
    };

    if (loading) return <p>Memuat...</p>;

    const previewImage = imageFile ? URL.createObjectURL(imageFile) : existingImageURL;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EFACA5] to-[#F7EFDA] p-12 font-margarine">

            {/* HEADER */}
            <header className="flex justify-between items-center mb-10">
                <h2 className="text-4xl text-[#3e8440] font-bold">Edit produk</h2>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-12 py-3 bg-[#efaca5] border border-[#3e8440] text-[#3e8440] text-2xl rounded-full"
                >
                    {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </header>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            {/* GRID ATAS */}
            <div className="grid grid-cols-2 gap-10">

                {/* UPLOAD GAMBAR */}
                <label className="bg-[#3e8440] h-[420px] rounded-[40px] text-[#f7efda] flex justify-center items-center cursor-pointer relative">
                    <div className="absolute inset-4 rounded-[30px] border-2 border-[#f7efda]" />

                    {previewImage ? (
                        <img src={previewImage} alt="preview" className="w-full h-full object-contain rounded-[30px] z-10" />
                    ) : (
                        <div className="flex flex-col items-center z-10">
                            <FiUpload className="w-14 h-14 mb-4" />
                            <p className="text-2xl">Upload gambar</p>
                        </div>
                    )}

                    <input type="file" onChange={handleImageChange} className="hidden" />
                </label>

                {/* FORM KANAN */}
                <div className="space-y-6">
                    <div className="bg-[#3e8440] text-[#f7efda] p-6 rounded-[35px]">
                        <label className="text-xl">Nama produk</label>
                        <input className="w-full mt-3 p-4 rounded-full bg-[#3e8440] border-2 border-[#f7efda] text-xl" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="bg-[#3e8440] text-white p-6 rounded-[35px]">
                        <label className="text-xl">Deskripsi produk</label>
                        <textarea className="w-full mt-3 p-4 h-32 rounded-3xl bg-[#3e8440] border-2 border-[#f7efda] text-xl" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* GRID BAWAH */}
            <div className="grid grid-cols-2 gap-10 mt-10">

                <div>
                    <div className="bg-[#3e8440] text-[#f7efda] p-6 rounded-[35px]">
                        <label className="text-xl">Pilihan warna</label>

                        <div className="flex gap-2 mt-3 mb-4 flex-wrap">
                            {colors.map((c) => (
                                <span key={c} className="px-4 py-1 bg-[#efaca5] text-[#3e8440] rounded-full flex items-center gap-2 text-lg">
                                    {c}
                                    <button onClick={() => handleRemoveColor(c)} className="text-red-600"><FiX /></button>
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <input value={newColorInput} onChange={(e) => setNewColorInput(e.target.value)} className="flex-grow p-3 rounded-full bg-[#3e8440] border-2 border-[#f7efda] text-xl" />
                            <button type="button" onClick={handleAddColor} className="px-6 py-2 bg-[#A4C37A] rounded-full text-xl">Tambah</button>
                        </div>
                    </div>

                    <div className="bg-[#3e8440] p-6 rounded-[35px] border-2 border-[#f7efda] mt-6">
                        <label className="text-xl text-[#f7efda] mb-3 block">Kategori produk</label>
                        <div className="flex gap-4">
                            {categories.map((cat) => (
                                <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-6 py-2 rounded-full text-xl ${category === cat ? 'bg-[#A4C37A] text-white' : 'bg-[#efaca5] text-[#3e8440]'}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#3e8440] p-6 rounded-[35px] text-[#f7efda]">
                        <label className="text-xl">Ukuran produk</label>
                        <input className="w-full mt-3 p-3 rounded-full bg-[#3e8440] border-2 border-[#f7efda] text-xl" value={size} onChange={(e) => setSize(e.target.value)} />
                    </div>

                    <div className="bg-[#3e8440] p-6 rounded-[35px] text-[#f7efda]">
                        <label className="text-xl">Harga produk</label>
                        <div className="flex items-center mt-3 text-xl">
                            <span className="mr-3">Rp.</span>
                            <input type="text" className="flex-grow p-3 rounded-full bg-[#3e8440] border-2 border-[#f7efda] text-xl" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                    </div>

                    <div className="bg-[#3e8440] p-6 rounded-[35px] text-[#f7efda]">
                        <label className="text-xl">Stok</label>
                        <input type="number" className="w-full mt-3 p-4 rounded-full border-2 border-[#f7efda] text-[#f7efda]" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;
