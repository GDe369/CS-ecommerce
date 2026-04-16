import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import {
  Package,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  Check,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import OrderDetailModal from "../../components/admin/OrderDetailModal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Cập nhật trạng thái đơn hàng (Duyệt nhanh)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`Đã cập nhật: ${newStatus}`);
      loadOrders(); // Tải lại danh sách
    } catch (err) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Helper hiển thị Badge trạng thái cho đẹp
  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-100 text-amber-600",
      Shipped: "bg-blue-100 text-blue-600",
      Delivered: "bg-emerald-100 text-emerald-600",
      Cancelled: "bg-rose-100 text-rose-600",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${styles[status] || "bg-slate-100 text-slate-500"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
          <Package className="text-blue-600" size={36} /> ĐƠN HÀNG
        </h1>
        <p className="text-slate-500 font-medium">
          Theo dõi và xử lý đơn hàng từ hệ thống
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse font-bold text-slate-400">
          Đang truy xuất dữ liệu...
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-6">Mã Đơn / Trạng thái</th>
                <th className="p-6">Khách hàng</th>
                <th className="p-6 text-center">PT Thanh toán</th>
                <th className="p-6">Tổng tiền</th>
                <th className="p-6">Ngày đặt</th>
                <th className="p-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-slate-50 transition-all"
                  >
                    <td className="p-6">
                      <div className="font-bold text-blue-600">
                        #ORD-{order.id}
                      </div>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-slate-800">
                        {order.customerName || "Khách lẻ"}
                      </div>
                      <div className="text-[11px] text-slate-400 italic">
                        {order.email}
                      </div>
                    </td>
                    <td className="p-6 text-center font-bold text-slate-600 text-xs">
                      {order.paymentMethod}
                    </td>
                    <td className="p-6 font-black text-slate-900">
                      {order.totalAmount?.toLocaleString()}đ
                    </td>
                    <td className="p-6 text-slate-500 text-sm">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        {/* Nút Xem Chi Tiết */}
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="p-3 bg-white text-slate-400 hover:text-blue-600 hover:shadow-md rounded-2xl border transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Nút Duyệt Nhanh (Đổi sang Shipped) */}
                        {order.status === "Pending" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order.id, "Shipped")
                            }
                            className="p-3 bg-white text-slate-400 hover:text-emerald-600 hover:shadow-md rounded-2xl border transition-all"
                            title="Xác nhận giao hàng"
                          >
                            <Truck size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-20 text-center text-slate-400 font-bold italic"
                  >
                    Chưa có đơn hàng nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal chi tiết */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
