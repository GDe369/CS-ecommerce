import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout"; // Bạn sẽ tạo file này

// Admin Pages
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Reviews from "./pages/admin/Reviews";

// Client Pages (Chúng ta sẽ tạo trong các bước tiếp theo)
import Home from "./pages/client/Home";
import Shop from "./pages/client/Shop";
import ProductDetail from "./pages/client/ProductDetail";
import Cart from "./pages/client/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/client/Checkout";
import PaymentReturn from "./pages/client/PaymentReturn";
import PaymentSuccess from "./pages/client/PaymentSuccess";
import PaymentFailed from "./pages/client/PaymentFailed";
import Account from "./pages/client/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <Routes>
        {/* ==========================================
            CỤM ROUTE CHO KHÁCH HÀNG (CLIENT)
        =========================================== */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-return" element={<PaymentReturn />} />{" "}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Trang hứng kết quả online */}
        </Route>

        {/* ==========================================
            CỤM ROUTE CHO QUẢN TRỊ (ADMIN)
            Lưu ý: Thêm tiền tố /admin để tách biệt hoàn toàn
        =========================================== */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Tự động chuyển hướng /admin sang /admin/products */}
          <Route index element={<Navigate to="/admin/products" />} />

          <Route path="products" element={<Products />} />
          <Route path="category" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="review" element={<Reviews />} />
        </Route>

        {/* Trang lỗi 404 */}
        <Route
          path="*"
          element={
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
              <h1 className="text-9xl font-black text-slate-200">404</h1>
              <p className="text-slate-500 font-bold -mt-8">
                Không tìm thấy trang này
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
              >
                Quay lại Trang chủ
              </button>
            </div>
          }
        />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "1rem",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </Router>
  );
}

export default App;
