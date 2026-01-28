import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";

// Komponen Umum
import Homepage from "./components/Homepage";
import Lemarikarya from "./components/Lemarikarya";
import About from "./components/AboutUs";
import Ragam from "./components/Ragam";
import Footer from "./components/Footer";
import ProductsPage from "./components/ProductsPage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import QRISPage from "./components/QrisPage.jsx";
import SuccessPage from "./components/SuccessPage.jsx";
import OrderTrackingPage from "./components/OrderTrackingPage.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import EditProfilePage from "./components/EditProfilePage.jsx";

// Komponen Admin
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AddProduct from "./components/admin/AddProduct.jsx";
import ManageProducts from "./components/admin/ManageProducts.jsx";
import EditProductPage from "./components/admin/EditProduct.jsx";
import ManageOrders from "./components/admin/ManageOrders.jsx";
import ManageUser from "./components/admin/ManageUser.jsx";

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* --- RUTE PELANGGAN (USER) --- */}
        <Route
          path="/"
          element={
            <>
              <Homepage />
              <Lemarikarya />
              <About />
              <Ragam />
              <Footer />
            </>
          }
        />
        
        <Route path="/ragam" element={<Ragam />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />

        {/* Rute Produk & Keranjang */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Rute Pembayaran */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/qris" element={<QRISPage />} />
        <Route path="/payment/success" element={<SuccessPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />

        {/* --- RUTE ADMIN (NESTED ROUTES) --- */}
        {/* Kita tidak menggunakan '/' di depan path anak agar otomatis mengikuti parent-nya (/admin) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUser />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/manage" element={<ManageProducts />} />
          <Route path="products/edit/:productId" element={<EditProductPage />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
        
      </Routes>
    </CartProvider>
  );
}

export default App;