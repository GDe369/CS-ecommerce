import { Link } from "react-router-dom";
import { ShoppingCart, User as UserIcon, LogOut, UserPlus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_HOST } from "../../services/apiClient";

// Import ảnh mặc định
import defaultAvatar from "../../assets/avt.png";

export default function Header() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Đồng bộ Username (CamelCase từ JS/Google hoặc PascalCase từ C#)
  const displayName = user?.username || user?.Username || "User";

  // 2. Xử lý đường dẫn Avatar
  const getAvatarUrl = () => {
    const imgPath = user?.imageUrl || user?.ImageUrl;

    if (imgPath) {
      if (imgPath.startsWith("http")) return imgPath; // Ảnh từ Google/Facebook
      return `${BACKEND_HOST}${imgPath}`; // Ảnh từ Server C#
    }

    return defaultAvatar;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-black tracking-tighter text-blue-600 transition-transform active:scale-95"
        >
          <span>SHOPPE</span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-10 font-bold text-sm text-slate-600 uppercase tracking-widest">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">
            Shop
          </Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">
            Giới thiệu
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">
            kết nối
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {/* GIỎ HÀNG */}
          <Link
            to="/cart"
            className="relative p-3 bg-slate-50 rounded-2xl shadow-sm hover:bg-white hover:text-blue-600 transition-all border border-slate-100"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] flex items-center justify-center rounded-full font-black animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>

          {/* USER SECTION */}
          {user ? (
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100 shadow-sm">
              <Link
                to="/account"
                className="flex items-center gap-3 group hover:text-blue-600 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-2 ring-white bg-slate-200 flex-shrink-0 border border-slate-200">
                  <img
                    src={getAvatarUrl()}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff&bold=true`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
                    {(user.role || user.Role) === "Admin"
                      ? "Administrator"
                      : "Tài khoản"}
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[80px] sm:max-w-[120px] leading-none">
                    {displayName}
                  </span>
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg group"
                title="Đăng xuất"
              >
                <LogOut
                  size={18}
                  className="group-active:scale-90 transition-transform"
                />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/register"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all"
              >
                <UserPlus size={18} /> Đăng ký
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                <UserIcon size={18} /> ĐĂNG NHẬP
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
