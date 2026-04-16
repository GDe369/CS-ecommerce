import { X } from "lucide-react";

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  allCategories,
  isEditing,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-6 text-slate-800 tracking-tight">
          {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tên danh mục
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              placeholder="Ví dụ: Điện thoại, Laptop..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Danh mục cha
            </label>
            <select
              value={formData.parentId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentId: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
              <option value="">-- Là danh mục gốc (Cấp 1) --</option>
              {allCategories
                .filter((cat) => !isEditing || cat.id !== formData.id) // Không cho chọn chính nó làm cha
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
          >
            {isEditing ? "Lưu thay đổi" : "Tạo danh mục ngay"}
          </button>
        </form>
      </div>
    </div>
  );
}
