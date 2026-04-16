import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/userService";
import {
  Users as UsersIcon,
  ShieldCheck,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === "Admin" ? "User" : "Admin";
    try {
      await updateUserRole(user.id, newRole);
      toast.success(`Đã chuyển ${user.username} thành ${newRole}`);
      loadUsers();
    } catch (err) {
      toast.error("Không thể cập nhật quyền hạn");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <UsersIcon className="text-blue-600" size={36} /> NGƯỜI DÙNG
          </h1>
          <p className="text-slate-500 font-medium italic">
            Quản lý cộng đồng thành viên hệ thống
          </p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 font-bold text-blue-600 text-sm">
          Tổng cộng: {users.length} thành viên
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse font-black text-slate-300 tracking-widest text-xl">
          ĐANG TRUY XUẤT THÀNH VIÊN...
        </div>
      ) : users.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
          <p className="text-2xl font-bold mb-4">Chưa có dữ liệu người dùng</p>
          <p className="max-w-xl mx-auto text-sm leading-6">
            Hiện tại frontend đã gọi trang quản trị người dùng, nhưng backend
            chưa có endpoint trả về danh sách người dùng. Vui lòng bổ sung API
            GET /Auth/users hoặc thay đổi service `getAllUsers` để sử dụng dữ
            liệu thực.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Verified
                </th>
                <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center text-white text-lg font-black shadow-sm">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          {user.username}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[220px]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {user.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-black uppercase tracking-[0.08em] text-slate-900">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs">
                        <CheckCircle2 size={12} /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs">
                        <XCircle size={12} /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
