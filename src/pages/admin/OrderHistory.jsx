import { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";
import { History, Search, Eye, Download } from "lucide-react";
import { toast } from "react-hot-toast";

// QUAN TRỌNG: Phải có chữ "export default" ở đây
export default function OrderHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getOrders();
        // Lọc các đơn hàng đã hoàn tất hoặc đã hủy
        const filtered = data.filter(
          (order) =>
            order.status === "Completed" || order.status === "Cancelled",
        );
        setHistory(filtered);
      } catch (err) {
        toast.error("Không thể tải lịch sử đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <History className="text-slate-400" size={36} /> LỊCH SỬ GIAO DỊCH
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Xem lại các đơn hàng cũ đã xử lý
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-100 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all">
          <Download size={18} /> Xuất báo cáo
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-widest font-black">
            <tr>
              <th className="p-6">Mã Đơn</th>
              <th className="p-6">Khách hàng</th>
              <th className="p-6">Tổng tiền</th>
              <th className="p-6">Trạng thái</th>
              <th className="p-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history.length > 0 ? (
              history.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-all"
                >
                  <td className="p-6 font-bold text-slate-400">
                    #ORD-{order.id}
                  </td>
                  <td className="p-6 font-bold text-slate-800">
                    {order.customerName}
                  </td>
                  <td className="p-6 font-black text-slate-900">
                    {order.totalAmount?.toLocaleString()}đ
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status === "Completed" ? "Thành công" : "Đã hủy"}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button className="p-3 text-slate-400 hover:text-blue-600 transition-all">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-20 text-center text-slate-300 font-bold italic"
                >
                  Chưa có dữ liệu lịch sử
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
