import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentPhotoURL, setCurrentPhotoURL] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    setNewName(user.displayName || user.email.split("@")[0]);
    setNewEmail(user.email);
    setCurrentPhotoURL(user.photoURL);
    setLoading(false);
  }, [navigate]);

  /* =========================
     CLOUDINARY UPLOAD
  ========================== */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "puspita-db");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dcgu2uind/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload ke Cloudinary gagal");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setAvatarFile(file);
    setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isUpdating) return;

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User tidak terautentikasi");

      let photoURL = currentPhotoURL;

      if (avatarFile) {
        photoURL = await uploadToCloudinary(avatarFile);
      }

      await updateProfile(user, {
        displayName: newName,
        photoURL: photoURL || null,
      });

      await updateDoc(doc(db, "users", user.uid), {
        username: newName,
        photoURL: photoURL || null,
      });

      setSuccess("Profil berhasil diperbarui!");
      setCurrentPhotoURL(photoURL);
      setAvatarFile(null);

      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.message || "Gagal memperbarui profil");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7efda] text-[#3e8440] font-margarine">
        Memuat...
      </div>
    );
  }

  const avatarSrc = avatarFile
    ? URL.createObjectURL(avatarFile)
    : currentPhotoURL;

  return (
    <div className="min-h-screen bg-[#f7efda] text-[#3e8440] font-margarine px-8 py-6">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-[#efaca5] hover:text-[#3e8440]"
        >
          <FiArrowLeft />
          Kembali
        </button>

        <div className="flex gap-6 text-[#efaca5]">
          <FiShoppingCart className="cursor-pointer hover:text-[#3e8440]" />
          <FiUser className="cursor-pointer hover:text-[#3e8440]" />
        </div>
      </header>

      {/* =====================
          CENTERED CONTENT
      ====================== */}
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleUpdateProfile}
          className="flex flex-col items-center space-y-8 w-full max-w-md"
        >
          {/* AVATAR */}
          <div className="relative w-44 h-44 rounded-full border-2 border-[#3e8440] overflow-hidden flex items-center justify-center">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="w-20 h-20 opacity-50" />
            )}
          </div>

          {/* UPLOAD */}
          <label className="cursor-pointer px-8 py-2 border-2 border-[#efaca5] text-[#efaca5] rounded-full hover:bg-[#3e8440] hover:text-[#f7efda] transition">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {avatarFile ? "Ganti Foto" : "Edit Profile"}
          </label>

          {avatarFile && (
            <div className="flex items-center gap-2 text-sm">
              {avatarFile.name}
              <button type="button" onClick={() => setAvatarFile(null)}>
                <FiX className="text-red-500" />
              </button>
            </div>
          )}

          {success && <p className="text-green-600 font-bold">{success}</p>}
          {error && <p className="text-red-500 font-bold">{error}</p>}

          {/* INPUT */}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Edit nama"
            required
            className="w-full py-3 px-5 border-2 border-[#efaca5] rounded-full text-center bg-transparent"
          />

          <input
            type="email"
            value={newEmail}
            disabled
            className="w-full py-3 px-5 border-2 border-[#efaca5] rounded-full text-center bg-transparent opacity-50"
          />

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full py-3 bg-[#3e8440] text-[#efaca5] rounded-full hover:bg-[#A4C37A] disabled:opacity-50"
          >
            {isUpdating ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
