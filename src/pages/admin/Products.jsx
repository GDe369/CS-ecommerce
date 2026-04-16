import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../services/productService";
import ProductModal from "../../components/admin/ProductModal";
import ProductActions from "../../components/admin/ProductActions";
import { toast } from "react-hot-toast";
import { Plus, Box, Tag } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    imageFile: null,
    description: "",
    categoryId: "",
    discountPercent: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        getProducts({ page, pageSize: 10 }),
        getCategories(),
      ]);
      setProducts(prodRes?.data || []);
      setTotalPages(prodRes?.totalPages || 1);
      setCategories(catRes || []);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        imageFile: null,
        description: product.description,
        categoryId: product.categoryId,
        discountPercent: product.discountPercent || 0,
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        imageFile: null,
        description: "",
        categoryId: "",
        discountPercent: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        Id: selectedProduct?.id,
        Price: Number(formData.price),
        DiscountPercent: Number(formData.discountPercent),
      };

      let res;
      if (selectedProduct) {
        res = await updateProduct(selectedProduct.id, payload);
        toast.success("Cập nhật thành công!");
      } else {
        res = await createProduct(payload);
        toast.success("Thêm mới thành công!");
      }

      if (formData.imageFile) {
        await uploadProductImage(
          selectedProduct?.id || res.id,
          formData.imageFile,
        );
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Thao tác thất bại!");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Box className="text-blue-600" /> KHO HÀNG
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
        >
          <Plus size={20} /> THÊM MỚI
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-black text-slate-400 uppercase">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase">
                Giá bán
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase">
                Kho
              </th>
              <th className="px-8 py-4 text-right text-xs font-black text-slate-400 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4 flex items-center gap-4">
                  <img
                    src={p.imageUrl}
                    className="w-12 h-12 rounded-lg object-cover border"
                    alt={p.name}
                  />
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      {categories.find((c) => c.id === p.categoryId)?.name}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    {p.discountPercent > 0 ? (
                      <>
                        <span className="text-blue-600 font-black">
                          {(
                            (p.price * (100 - p.discountPercent)) /
                            100
                          ).toLocaleString()}
                          đ
                        </span>
                        <div className="flex items-center gap-2">
                          <del className="text-xs text-slate-400">
                            {p.price.toLocaleString()}đ
                          </del>
                          <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-md font-bold">
                            -{p.discountPercent}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-900 font-black">
                        {p.price.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold ${p.stock > 5 ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {p.stock} sản phẩm
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <ProductActions
                    product={p}
                    onEdit={handleOpenModal}
                    onDelete={() => {}}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        isEditing={!!selectedProduct}
      />
    </div>
  );
}
