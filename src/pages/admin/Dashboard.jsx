import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        if (data.errors.orders || data.errors.users || data.errors.reviews) {
          setError(
            "Một số dữ liệu thống kê chưa thể tải. Vui lòng kiểm tra lại endpoint backend.",
          );
        }
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-slate-400 animate-pulse">
        Đang tổng hợp dữ liệu...
      </div>
    );

  if (error && !stats)
    return (
      <div className="p-20 text-center font-bold text-red-500">{error}</div>
    );

  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;
  const totalUsers = stats?.totalUsers ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;
  const recentOrders = stats?.recentOrders ?? [];

  const cardData = [
    {
      label: "Doanh thu",
      value: `${totalRevenue.toLocaleString()}đ`,
      icon: <DollarSign />,
      color: "bg-blue-600 shadow-blue-200",
    },
    {
      label: "Đơn hàng",
      value: totalOrders,
      icon: <ShoppingBag />,
      color: "bg-orange-500 shadow-orange-200",
    },
    {
      label: "Thành viên",
      value: totalUsers,
      icon: <Users />,
      color: "bg-purple-600 shadow-purple-200",
    },
    {
      label: "Đánh giá",
      value: totalReviews,
      icon: <Star />,
      color: "bg-green-600 shadow-green-200",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-slate-900 mb-10">
        TỔNG QUAN HỆ THỐNG
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:scale-105 transition-all"
          >
            <div
              className={`absolute top-0 right-0 p-6 text-white rounded-bl-[2rem] ${card.color} shadow-lg`}
            >
              {card.icon}
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">
              {card.label}
            </p>
            <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 italic">
              Đơn hàng mới nhất
            </h3>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
              Xem tất cả <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                    #{order.id}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right font-black text-slate-900">
                  {order.totalAmount?.toLocaleString()}đ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl">
          <h3 className="text-xl font-black mb-6">Lối tắt Admin</h3>
          <div className="space-y-3">
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all text-left px-6">
              + Thêm sản phẩm mới
            </button>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all text-left px-6">
              Duyệt đơn hàng chờ
            </button>
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black transition-all shadow-lg shadow-blue-900/50 mt-4">
              XUẤT BÁO CÁO DOANH THU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
