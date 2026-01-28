    import React from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { signOut } from 'firebase/auth';
    import { auth } from '../../firebase';
    import { FiLayout, FiUsers, FiPlusCircle, FiList, FiTruck, FiLogOut } from 'react-icons/fi';

    const AdminSidebar = () => {
        const location = useLocation();
        const navigate = useNavigate();

        const navItems = [
            { path: '/admin/dashboard', icon: FiLayout, label: 'Dashboard' },
            { path: '/admin/users', icon: FiUsers, label: 'Pengguna' },
            { path: '/admin/products/new', icon: FiPlusCircle, label: 'Produk Baru' },
            { path: '/admin/products/manage', icon: FiList, label: 'Kelola Produk' },
            { path: '/admin/orders', icon: FiTruck, label: 'Pesanan' },
        ];

        const handleLogout = async () => {
            if (window.confirm("Apakah Anda yakin ingin logout?")) {
                await signOut(auth);
                navigate('/login');
            }
        };

        return (
            <div className="w-72 bg-[#3e8440] min-h-screen text-[#f7efda] font-margarine p-6 rounded-r-3xl shadow-2xl fixed top-0 left-0 z-10">
                
                {/* Logo Puspita */}
                <h1 className="text-4xl text-[#efaca5] mb-12 border-b border-[#A4C37A] pb-4">PUSPiTA</h1>

                {/* Menu Navigasi */}
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 p-3 rounded-full transition-colors ${
                                location.pathname === item.path 
                                    ? 'bg-[#A4C37A] text-[#3e8440] shadow-md' 
                                    : 'hover:bg-[#A4C37A]/50'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-lg">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Puspita Admin Footer/Logout */}
                <div className="absolute bottom-6 w-[80%]">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 w-full rounded-full bg-[#efaca5] text-[#3e8440] text-lg hover:bg-[#D79A9E] transition-colors shadow-lg"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        );
    };

    export default AdminSidebar;