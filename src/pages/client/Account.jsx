import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfileApi } from "../../services/userService";
import { toast } from "react-hot-toast";
import { User, Pencil, CheckCircle } from "lucide-react";

export default function Account() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || user?.Username || "",
    email: user?.email || user?.Email || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        Username: formData.username,
        Email: formData.email,
      };
      const result = await updateProfileApi(payload);
      const updatedUser = {
        ...user,
        username: result?.username || result?.Username || formData.username,
        email: result?.email || result?.Email || formData.email,
      };
      updateUser(updatedUser);
      toast.success("Cập nhật profile thành công");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật profile thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xl font-bold">
          Vui lòng đăng nhập để xem trang tài khoản.
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
            <User className="text-blue-600" size={36} /> Tài khoản của tôi
          </h1>
          <p className="text-slate-500 mt-2">
            Cập nhật thông tin cá nhân.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-3xl bg-blue-50 p-4 text-blue-600">
            <Pencil size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Chỉnh sửa hồ sơ
            </h2>
            <p className="text-slate-500 mt-1">
              Cập nhật thông tin cá nhân và email.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="grid gap-6">
          <label className="grid gap-2 text-slate-700">
            Tên đăng nhập
            <input
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-blue-500"
            />
          </label>
          <label className="grid gap-2 text-slate-700">
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-blue-500"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-[2rem] bg-slate-900 px-8 py-4 text-white font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition"
          >
            <CheckCircle size={18} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}
