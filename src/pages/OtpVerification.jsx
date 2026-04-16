import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  registerWithOtpApi,
  sendOtpApi,
  loginApi,
  getMeApi,
} from "../services/userService";

export default function OtpVerification({ formData, setFormData, onBack }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const getErrorMessage = (error, defaultMessage) => {
    const data = error?.response?.data;
    if (!data) return defaultMessage;
    if (typeof data === "string") return data;
    if (data.errors) {
      return Object.values(data.errors).flat().join(" ");
    }
    if (data.title) return data.title;
    return JSON.stringify(data);
  };

  const processLoginSuccess = async (token, message) => {
    localStorage.setItem("tech3d_token", token);

    try {
      const fullInfo = await getMeApi();
      const normalizedRole = fullInfo.role || fullInfo.Role;
      login({
        token,
        username: fullInfo.username || fullInfo.Username,
        role: normalizedRole,
        imageUrl: fullInfo.imageUrl || fullInfo.ImageUrl,
        email: fullInfo.email || fullInfo.Email,
      });
      toast.success(message);
      const lowerRole = String(normalizedRole || "").toLowerCase();
      if (lowerRole === "admin" || lowerRole === "administrator") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin chi tiết sau đăng ký:", error);
      toast.error("Đăng ký thành công nhưng không lấy được profile.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (formData.otp.length < 6) return toast.error("Vui lòng nhập đủ 6 số!");

    setLoading(true);
    // Chuẩn hóa dữ liệu gửi lên C# PascalCase
    const dataToPost = {
      Username: formData.username,
      FullName: formData.fullName,
      Email: formData.email,
      PhoneNumber: formData.phoneNumber,
      Password: formData.password,
    };

    try {
      const registerRes = await registerWithOtpApi(dataToPost, formData.otp);
      const token = registerRes?.Token || registerRes?.token;
      if (token) {
        await processLoginSuccess(token, "Đăng ký và đăng nhập thành công!");
      } else {
        const loginRes = await loginApi({
          username: formData.username,
          password: formData.password,
        });
        await processLoginSuccess(
          loginRes.Token || loginRes.token,
          "Đăng ký và đăng nhập thành công!",
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Mã OTP sai hoặc đã hết hạn!"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    toast.loading("Đang gửi lại mã...");
    try {
      await sendOtpApi(formData.email);
      toast.dismiss();
      toast.success("Mã mới đã được gửi!");
    } catch (error) {
      toast.dismiss();
      toast.error("Gửi lại thất bại!");
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="text-center">
        <p className="text-slate-500 font-bold">Mã xác thực gửi tới:</p>
        <p className="text-blue-600 font-black">{formData.email}</p>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-400 underline mt-2"
        >
          Thay đổi email?
        </button>
      </div>

      <input
        type="text"
        required
        maxLength={6}
        autoFocus
        className="w-full px-6 py-4 bg-blue-50 border-2 border-blue-100 rounded-2xl outline-none text-center text-3xl font-black tracking-[0.5em] focus:border-blue-500"
        placeholder="000000"
        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full h-16 bg-blue-600 text-white font-black rounded-2xl shadow-lg hover:bg-slate-900 transition-all"
      >
        {loading ? "ĐANG XÁC MINH..." : "HOÀN TẤT ĐĂNG KÝ"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        className="w-full text-slate-400 font-bold text-sm hover:text-blue-600"
      >
        Gửi lại mã OTP
      </button>
    </form>
  );
}
