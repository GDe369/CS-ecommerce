import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { loginApi, socialLoginApi, getMeApi } from "../services/userService";
import { GoogleLogin } from "@react-oauth/google";

// ... các import giữ nguyên

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Hàm helper để xử lý lưu trữ tập trung
  const processLoginSuccess = async (token, message) => {
    // Bước 1: Lưu token vào local ngay để getMeApi có thể dùng Header Authorization
    localStorage.setItem("tech3d_token", token);

    try {
      // Bước 2: Lấy thông tin chi tiết từ server
      const fullInfo = await getMeApi();

      // Bước 3: Gửi dữ liệu đã chuẩn hóa vào Context
      // Chúng ta bọc lại các key để Header luôn nhận được chữ thường (camelCase)
      const normalizedRole = fullInfo.role || fullInfo.Role;
      login({
        id: fullInfo.id || fullInfo.Id,
        token: token,
        username: fullInfo.username || fullInfo.Username,
        role: normalizedRole,
        imageUrl: fullInfo.imageUrl || fullInfo.ImageUrl,
        email: fullInfo.email || fullInfo.Email,
      });

      toast.success(message);

      // Chuyển hướng theo role
      const lowerRole = String(normalizedRole || "").toLowerCase();
      if (lowerRole === "admin" || lowerRole === "administrator") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin chi tiết:", error);
      toast.error("Đăng nhập thành công nhưng không lấy được profile.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setIsSubmitting(true);
    try {
      const loginRes = await socialLoginApi({
        Token: credentialResponse.credential,
        Provider: "Google",
      });
      // Token từ Social Login có thể là loginRes.token hoặc loginRes.Token
      await processLoginSuccess(
        loginRes.token || loginRes.Token,
        "Đăng nhập Google thành công!",
      );
    } catch (error) {
      toast.error("Lỗi xác thực Google!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const loginRes = await loginApi({ username, password });
      await processLoginSuccess(
        loginRes.Token || loginRes.token,
        "Chào mừng trở lại!",
      );
    } catch (error) {
      toast.error(error.response?.data || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-10">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white w-full max-w-md">
        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase tracking-tighter">
          Đăng Nhập
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold transition-all"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold transition-all"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all disabled:bg-slate-400"
          >
            {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <span className="bg-white px-4 text-slate-400 text-[10px] font-black uppercase relative z-10">
            Hoặc kết nối qua
          </span>
          <div className="absolute inset-y-1/2 w-full border-t border-slate-100"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            theme="filled_blue"
            shape="pill"
          />
        </div>

        <p className="mt-8 text-center text-slate-500 font-bold text-sm">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
