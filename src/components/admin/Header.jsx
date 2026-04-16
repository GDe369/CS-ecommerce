import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
      {/* Tiêu đề tối giản */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>{" "}
        {/* Điểm nhấn nhỏ */}
        <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">
          Trang Quản Trị
        </h1>
      </div>

      {/* Nút Logout thiết kế gọn gàng */}
      <button
        type="button"
        onClick={handleLogout}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
      >
        <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">
          Đăng xuất
        </span>
        <div className="p-2 rounded-lg group-hover:bg-red-100 transition-colors">
          <LogOut size={18} strokeWidth={2.5} />
        </div>
      </button>
    </header>
  );
}
