import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Vùng nội dung bên phải */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Vùng thay đổi nội dung theo URL */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
