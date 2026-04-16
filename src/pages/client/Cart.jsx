import { useCart } from "../../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BACKEND_HOST } from "../../services/apiClient";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  // CẬP NHẬT: Hàm lấy ảnh chuẩn từ Page 1
  const getImageUrl = (path) => {
    if (!path || path === "string")
      return "https://placehold.co/600x600?text=Tech3D";
    if (path.startsWith("http")) return path;
    return `${BACKEND_HOST}${path.startsWith("/") ? path : "/" + path}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center shadow-3d-convex">
          <ShoppingBag size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">
          Giỏ hàng trống
        </h2>
        <Link
          to="/shop"
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-black shadow-lg hover:scale-105 transition-all"
        >
          MUA SẮM NGAY
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-slate-900 mb-12 tracking-tighter">
        GIỎ HÀNG CỦA BẠN
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-[2.5rem] shadow-3d-convex border border-white/50 flex items-center gap-6 group hover:shadow-3d-convex-lg transition-all duration-500"
            >
              {/* PHẦN ẢNH ĐÃ CẬP NHẬT ĐỒNG BỘ VỚI PAGE 1 */}
              <div className="relative w-28 h-28 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                {/* Lớp nền tạo khối 3D */}
                <div className="absolute inset-0 bg-slate-100 rounded-[2rem] shadow-3d-concave transform -rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>

                {/* Khung chứa ảnh sử dụng getImageUrl và logic xử lý lỗi */}
                <div className="relative w-full h-full bg-white rounded-[1.8rem] shadow-sm border border-slate-50 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={getImageUrl(item.imageUrl || item.image)} // Sử dụng imageUrl từ data hoặc fallback image
                    alt={item.name}
                    className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.1) group-hover:drop-shadow-[0_20px_25px_rgba(59,130,246,0.2)] transition-all duration-500"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x600?text=Tech3D";
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight leading-tight">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                    Tech3D Verified
                  </span>
                </div>
                <p className="text-blue-600 font-black text-lg mt-1">
                  {item.price?.toLocaleString()}đ
                </p>
              </div>

              <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 shadow-3d-concave p-1">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-blue-600 rounded-xl transition-all"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span className="w-8 text-center font-black text-sm text-slate-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-blue-600 rounded-xl transition-all"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[3rem] shadow-3d-convex border border-white/50 sticky top-32">
            <h3 className="text-xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-50">
              THANH TOÁN
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500 font-bold text-sm">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold text-sm">
                <span>Vận chuyển</span>
                <span className="text-green-500 font-black">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="font-black text-slate-900">TỔNG CỘNG</span>
                <span className="text-2xl font-black text-blue-600">
                  {totalPrice.toLocaleString()}đ
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:shadow-3d-concave"
            >
              Đặt hàng ngay <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
