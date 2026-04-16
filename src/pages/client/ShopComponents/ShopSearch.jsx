import { Search } from "lucide-react";

export default function ShopSearch({ onSearchChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
        Cửa hàng
      </h1>

      <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-3xl shadow-3d-convex border border-white/20 w-full md:w-96">
        <Search size={20} className="text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 bg-transparent outline-none font-medium"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
