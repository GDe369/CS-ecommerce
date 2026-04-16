import { useEffect, useState } from "react";
import { getReviews, deleteReview } from "../../services/reviewService";
import { Star, MessageCircle, Trash2, User, Box, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await deleteReview(id);
      toast.success("Đã xóa đánh giá");
      loadReviews();
    } catch (err) {
      toast.error("Lỗi khi xóa");
    }
  };

  const reviewedProducts = reviews
    .filter((rev) => Number(rev.rating) > 0)
    .sort((a, b) => Number(b.rating) - Number(a.rating));

  // Hàm hiển thị sao vàng
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
        }
      />
    ));
  };

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
          <MessageCircle className="text-blue-600" size={36} /> ĐÁNH GIÁ
        </h1>
        <p className="text-slate-500 font-medium">
          Lắng nghe phản hồi từ khách hàng về sản phẩm
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Hiển thị các đánh giá đã có rating, sắp xếp từ cao xuống thấp.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-slate-400 animate-pulse">
          Đang tải phản hồi...
        </div>
      ) : reviewedProducts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          Chưa có đánh giá hợp lệ nào để hiển thị.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviewedProducts.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-8 group"
            >
              {/* Cột trái: Thông tin User & Sản phẩm */}
              <div className="md:w-1/4 border-r border-slate-50 pr-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      User ID: {rev.userId}
                    </p>
                    <div className="flex mt-1">{renderStars(rev.rating)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Box size={12} /> Product ID: {rev.productId}
                </div>
              </div>

              {/* Cột giữa: Nội dung đánh giá */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">
                    {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium italic text-lg">
                  "{rev.content}"
                </p>
              </div>

              {/* Cột phải: Hành động */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-4 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
