import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle, RefreshCcw } from "lucide-react";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-3d-convex border border-white text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
            <XCircle size={48} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Thanh Toán Thất Bại
          </h1>
          <p className="text-slate-500 font-medium">
            Rất tiếc, giao dịch đã bị hủy hoặc có lỗi xảy ra từ phía ngân hàng.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center justify-center gap-2 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all"
          >
            Thử Thanh Toán Lại <RefreshCcw size={18} />
          </button>

          <Link
            to="/"
            className="block text-slate-400 font-bold text-sm uppercase tracking-widest"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
