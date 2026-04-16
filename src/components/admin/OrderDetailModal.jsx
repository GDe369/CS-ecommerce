import { X, ShoppingBag, MapPin, User, Mail, CreditCard } from "lucide-react";

export default function OrderDetailModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-center gap-2 tracking-tight">
          <ShoppingBag className="text-blue-600" size={32} /> ĐƠN HÀNG #ORD-
          {order.id}
        </h2>

        {/* Thông tin khách hàng & Giao nhận */}
        <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600">
              <User size={18} className="text-slate-400" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Người nhận:
              </span>
              <span className="text-sm text-slate-900 font-black">
                {order.customerName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Mail size={18} className="text-slate-400" />
              <span className="text-sm">{order.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <CreditCard size={18} className="text-slate-400" />
              <span className="text-sm font-bold">{order.paymentMethod}</span>
            </div>
          </div>
          <div className="flex gap-3 text-slate-600 border-l border-slate-200 pl-6">
            <MapPin size={24} className="text-rose-500 shrink-0" />
            <div>
              <span className="text-sm font-bold uppercase tracking-wider">
                Địa chỉ giao hàng:
              </span>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {order.shippingAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black">
              <tr>
                <th className="pb-4">Sản phẩm</th>
                <th className="pb-4 text-center">Số lượng</th>
                <th className="pb-4 text-right">Đơn giá</th>
                <th className="pb-4 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.orderItems?.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 flex items-center gap-4">
                    <img
                      src={
                        item.product?.imageUrl ||
                        "https://via.placeholder.com/50"
                      }
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100"
                      alt={item.product?.name}
                    />
                    <div>
                      <p className="font-black text-slate-800 leading-none">
                        {item.product?.name || "Sản phẩm đã xóa"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        ID: #{item.productId}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 text-center font-black text-slate-600">
                    x{item.quantity}
                  </td>
                  <td className="py-4 text-right text-slate-500 font-medium">
                    {item.unitPrice?.toLocaleString()}đ
                  </td>
                  <td className="py-4 text-right font-black text-blue-600">
                    {(item.quantity * item.unitPrice).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chân trang - Tổng tiền */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase font-black tracking-widest">
              Trạng thái hiện tại
            </p>
            <p className="font-bold text-slate-700">{order.status}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">
              Tổng thanh toán
            </p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">
              {order.totalAmount?.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
