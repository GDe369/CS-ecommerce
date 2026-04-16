import { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const vnpCode = searchParams.get("vnp_ResponseCode");
  const isSuccess = vnpCode === "00";

  useEffect(() => {
    toast.dismiss(); // Tắt các thông báo loading cũ
    if (isSuccess) {
      clearCart();
      toast.success("Thanh toán thành công!");
    } else if (vnpCode) {
      toast.error("Giao dịch thất bại hoặc đã bị hủy.");
    }
  }, [isSuccess, vnpCode, clearCart]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-3d-convex border border-white text-center space-y-8">
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
          ) : (
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
              <XCircle size={48} strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            {isSuccess ? "Thành Công!" : "Thất Bại"}
          </h1>
          <p className="text-slate-500 font-medium">
            {isSuccess
              ? "Cảm ơn bạn đã tin tưởng Tech3D. Đơn hàng của bạn sẽ sớm được vận chuyển."
              : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Mã giao dịch
          </p>
          <p className="font-mono font-bold text-slate-700">
            {searchParams.get("vnp_TransactionNo") || "---"}
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all"
          >
            Về Trang Chủ <ArrowRight size={18} />
          </Link>

          {!isSuccess && (
            <button
              onClick={() => navigate("/cart")}
              className="text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors"
            >
              THỬ THANH TOÁN LẠI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
