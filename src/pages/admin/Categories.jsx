import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import CategoryModal from "../../components/admin/CategoryModal";
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, FolderTree, ChevronRight } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCate, setSelectedCate] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    parentId: null,
  });

  // Giả định lấy từ Auth Context hoặc LocalStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = true;

  const loadData = async () => {
    try {
      const data = await getCategories();
      const normalized = data.map((item) => ({
        id: item.id ?? item.Id,
        name: item.name ?? item.Name,
        parentId: item.parentId ?? item.ParentId ?? null,
        parentName: item.parentName ?? item.ParentName ?? null,
      }));
      // Sắp xếp: Đưa danh mục gốc và danh mục con về gần cha của nó
      const sorted = [...normalized].sort(
        (a, b) => (a.parentId || 0) - (b.parentId || 0),
      );
      setCategories(sorted);
    } catch (err) {
      toast.error("Lỗi tải danh mục");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (cate = null) => {
    if (cate) {
      setSelectedCate(cate);
      setFormData({ id: cate.id, name: cate.name, parentId: cate.parentId });
    } else {
      setSelectedCate(null);
      setFormData({ id: null, name: "", parentId: null });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        Name: formData.name.trim(),
        ParentId: formData.parentId || null,
      };

      if (selectedCate) {
        payload.Id = selectedCate.id;
        if (payload.ParentId === selectedCate.id) {
          return toast.error("Danh mục không thể là cha của chính nó.");
        }
        await updateCategory(selectedCate.id, payload);
        toast.success("Đã cập nhật!");
      } else {
        await createCategory(payload);
        toast.success("Đã thêm mới!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data || "Thao tác thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      toast.success("Xóa thành công!");
      loadData();
    } catch (err) {
      toast.error(err.response?.data || "Không thể xóa danh mục này");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <FolderTree className="text-blue-600" size={36} /> DANH MỤC
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Quản lý phân cấp sản phẩm hệ thống
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <Plus size={20} /> THÊM MỚI
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-[0.2em]">
              <th className="p-6 font-black">Cấu trúc tên</th>
              <th className="p-6 font-black">Danh mục cha</th>
              <th className="p-6 font-black text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="group hover:bg-blue-50/20 transition-all"
              >
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    {cat.parentId && (
                      <ChevronRight size={16} className="text-blue-300 ml-6" />
                    )}
                    <span
                      className={`text-lg ${cat.parentId ? "font-semibold text-slate-600" : "font-black text-slate-800"}`}
                    >
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  {cat.parentName ? (
                    <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-xl font-bold border border-blue-100">
                      {cat.parentName}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">
                      Gốc
                    </span>
                  )}
                </td>
                <td className="p-6">
                  {isAdmin && (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        allCategories={categories.filter((c) => !c.parentId)}
        isEditing={!!selectedCate}
      />
    </div>
  );
}
