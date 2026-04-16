import { useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const { clearCart, cartItems } = useCart();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";
  const hasCleared = useRef(false);

  useEffect(() => {
    if (cartItems.length > 0 && !hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [cartItems, clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon đơn giản */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        {/* Nội dung chính */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-slate-500 mb-8">
          Cảm ơn bạn. Chúng tôi đã nhận được đơn hàng và sẽ sớm liên hệ để xác
          nhận việc giao hàng.
        </p>

        {/* Thông tin đơn hàng (Box đơn giản) */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-slate-900">
              #{orderId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Trạng thái:</span>
            <span className="text-green-600 font-medium text-sm">
              Đang xử lý
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all"
          >
            <ShoppingBag size={18} />
            Tiếp tục mua sắm
          </Link>

          <Link
            to="/account/orders"
            className="flex items-center justify-center gap-2 w-full text-slate-600 hover:text-blue-600 py-2 rounded-xl font-medium transition-all text-sm"
          >
            Xem lịch sử đơn hàng
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Chân trang hỗ trợ */}
        <div className="mt-12 text-sm text-slate-400">
          Bạn cần hỗ trợ?{" "}
          <Link to="/contact" className="text-blue-500 hover:underline">
            Liên hệ ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
