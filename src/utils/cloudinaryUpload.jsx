// ⬇️ 1. IDENTITAS AKUN CLOUDINARY
const CLOUD_NAME = "dcgu2uind";
const UPLOAD_PRESET = "puspita-db";

// ⬇️ 2. FUNGSI UPLOAD (DIPAKAI DI MANA-MANA)
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  // ⬇️ 3. FILE GAMBAR DARI USER
  formData.append("file", file);

  // ⬇️ 4. PRESET (IZIN UPLOAD)
  formData.append("upload_preset", UPLOAD_PRESET);

  // ⬇️ 5. KIRIM KE CLOUDINARY
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  // ⬇️ 6. VALIDASI
  if (!data.secure_url) {
    throw new Error("Gagal upload ke Cloudinary");
  }

  // ⬇️ 7. BALIKKAN HASIL
  return data;
};
