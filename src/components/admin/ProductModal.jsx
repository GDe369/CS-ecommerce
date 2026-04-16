import { X, Upload, ImagePlus, Layers, Tag, Percent } from "lucide-react";

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  categories,
  isEditing,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, imageUrl: reader.result, imageFile: file });
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-black text-slate-900">
            {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6"
        >
          {/* Cột trái: Ảnh & Danh mục */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-4 text-center bg-slate-50">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  className="h-40 w-full object-contain mb-2"
                  alt="Preview"
                />
              ) : (
                <ImagePlus className="mx-auto text-slate-300" size={48} />
              )}
              <label className="block cursor-pointer bg-white border py-2 rounded-xl text-xs font-bold shadow-sm">
                CHỌN ẢNH{" "}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">
                Danh mục
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cột phải: Thông tin chi tiết */}
          <div className="space-y-4">
            <input
              placeholder="Tên sản phẩm"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">
                  Giá gốc (đ)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-500">
                  Giảm giá (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formData.discountPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercent: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl outline-none font-bold"
                  />
                  <Percent
                    size={14}
                    className="absolute right-3 top-4 text-rose-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Số lượng kho"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <input
                placeholder="SKU"
                value={formData.sku || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <textarea
              placeholder="Mô tả"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
            />

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all"
            >
              {isEditing ? "LƯU THAY ĐỔI" : "TẠO SẢN PHẨM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
