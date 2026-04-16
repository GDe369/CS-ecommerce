import {
  Search,
  ShoppingBag,
  Zap,
  Flame,
  Eye,
  Percent,
  Star,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { BACKEND_HOST } from "../../services/apiClient";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const getProductImage = (imagePath) => {
    if (!imagePath || imagePath === "" || imagePath === "string") {
      return "https://placehold.co/300x300?text=No+Image";
    }
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BACKEND_HOST}${cleanPath}`;
  };

  // Logic render sao thông minh
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <Star
          key={i}
          size={12}
          // Nếu starValue <= rating thì fill đầy,
          // Nếu starValue - 0.5 <= rating thì coi như là sao nửa (đơn giản hóa bằng opacity hoặc fill)
          className={starValue <= rating ? "text-yellow-500" : "text-slate-200"}
          fill="currentColor"
        />
      );
    });
  };

  return (
    <div className="bg-white p-5 rounded-[2.5rem] shadow-3d-convex hover:shadow-2xl transition-all duration-500 group border border-white/50 relative flex flex-col h-full">
      {/* --- BADGES --- */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {product.discountPercent > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
            <Percent size={10} fill="currentColor" /> -{product.discountPercent}
            %
          </span>
        )}
        {(product.isHot || product.soldCount > 50) && (
          <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Flame size={10} fill="currentColor" /> HOT
          </span>
        )}
      </div>

      {/* --- ẢNH SẢN PHẨM --- */}
      <Link
        to={`/product/${product.id}`}
        className="block overflow-hidden relative"
      >
        <div className="aspect-square bg-slate-50 rounded-[2rem] mb-4 flex items-center justify-center p-6 relative overflow-hidden">
          <img
            src={getProductImage(product.imageUrl || product.image)}
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="px-2 flex flex-col flex-1">
        {/* Category & Lượt xem */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">
            {product.category?.name || product.categoryName || "Tech Device"}
          </p>
          {product.viewCount > 0 && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
              <Eye size={10} /> {product.viewCount}
            </span>
          )}
        </div>

        {/* --- PHẦN RATING (5 SAO & THỐNG KÊ) --- */}
        {/* --- PHẦN RATING (Sửa lại chỗ này) --- */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {/* Thay đổi: || 5 thành || 0 */}
              {renderStars(product.averageRating || 0)}
            </div>
            <span className="text-[11px] font-black text-slate-700 ml-1">
              {/* Thay đổi: || 5 thành || 0 */}
              {(product.averageRating || 0).toFixed(1)}
            </span>
          </div>

          {/* Hiển thị thông báo nếu chưa có đánh giá */}
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            {product.totalReviews > 0
              ? `${product.totalReviews} lượt đánh giá`
              : "Chưa có đánh giá"}
          </span>
        </div>

        {/* Tên sản phẩm */}
        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-3 hover:text-blue-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Giá & Nút mua hàng */}
        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900">
              {(product.salePrice || product.price).toLocaleString("vi-VN")}đ
            </span>
            {product.discountPercent > 0 && (
              <span className="text-[10px] text-slate-400 line-through font-bold">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all active:scale-90 group/btn"
          >
            <ShoppingBag size={20} className="group-hover/btn:animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
}
