import { Link, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  LogOut,
  History,
  Star,
} from "lucide-react";

const MENU_ITEMS = [
  { to: "products", icon: <Package size={20} />, label: "Sản phẩm" },
  { to: "category", icon: <Package size={20} />, label: "Danh mục" },
  { to: "orders", icon: <ShoppingCart size={20} />, label: "Đơn hàng" },
  { to: "users", icon: <Users size={20} />, label: "Người dùng" },
  { to: "review", icon: <Star size={20} />, label: "Đánh giá" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const activeRoute = pathname.replace(/^\/admin\/?/, "");

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-black tracking-tighter border-b border-slate-800 italic">
        🚀 MY SHOP
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {" "}
        {/* Thêm overflow để scroll nếu menu dài */}
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
              activeRoute === item.to
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.icon} <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
