import { Edit3, Trash2 } from "lucide-react";

export default function ProductActions({ product, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => onEdit(product)}
        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group/edit"
        title="Chỉnh sửa"
      >
        <Edit3
          size={16}
          strokeWidth={2.5}
          className="group-hover/edit:rotate-12 transition-transform"
        />
      </button>

      <button
        onClick={() => onDelete(product.id)}
        className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm group/del"
        title="Xóa sản phẩm"
      >
        <Trash2
          size={16}
          strokeWidth={2.5}
          className="group-hover/del:scale-110 transition-transform"
        />
      </button>
    </div>
  );
}
