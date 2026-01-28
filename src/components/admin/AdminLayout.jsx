import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        // ⭐ REVISI 1: Tambahkan min-h-screen ke container utama
        <div className="flex min-h-screen">
            {/* Sidebar selalu tampil */}
            <AdminSidebar />

            {/* Konten halaman */}
            {/* ⭐ REVISI 2: Hapus p-6 dari sini jika Anda ingin AdminDashboard yang mengatur padding-nya sendiri */}
            <div className="flex-1 ml-64"> 
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;