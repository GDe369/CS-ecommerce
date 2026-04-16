import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { sendOtpApi } from "../services/userService";

export default function RegisterForm({ formData, setFormData, onSuccess }) {
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    if (!formData.username || formData.username.trim().length < 3) {
      return "Username phải có ít nhất 3 ký tự.";
    }
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      return "Họ và tên phải có ít nhất 3 ký tự.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Email không hợp lệ.";
    }
    const phoneRegex = /^[0-9]{9,12}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      return "Số điện thoại phải gồm 9 - 12 chữ số.";
    }
    if (!formData.password || formData.password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Mật khẩu xác nhận không khớp!";
    }
    return null;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      return toast.error(validationError);
    }

    setLoading(true);
    try {
      await sendOtpApi(formData.email);
      toast.success("Mã OTP đã được gửi!");
      onSuccess();
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Lỗi gửi mã, vui lòng kiểm tra lại Email!"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Tiêu đề kiểu Facebook */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1c1e21] leading-8">
          Tạo tài khoản mới
        </h2>
        <div className="h-[1px] bg-[#dadde1] w-full mt-4"></div>
      </div>

      <form onSubmit={handleNext} className="w-full space-y-3">
        {/* Username & Phone - Hàng ngang */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Username"
            className="w-full px-3 py-2 bg-[#f5f6f7] border border-[#ccd0d5] rounded-md focus:border-[#1877f2] outline-none text-[15px]"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            value={formData.username}
          />
          <input
            type="text"
            required
            placeholder="Fullname"
            className="w-full px-3 py-2 bg-[#f5f6f7] border border-[#ccd0d5] rounded-md focus:border-[#1877f2] outline-none text-[15px]"
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            value={formData.fullName}
          />
        </div>
        {/* Email & Phone - Hàng ngang */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full px-3 py-2 bg-[#f5f6f7] border border-[#ccd0d5] rounded-md focus:border-[#1877f2] outline-none text-[15px]"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
          />
          <input
            type="tel"
            required
            placeholder="Số di động"
            className="w-full px-3 py-2 bg-[#f5f6f7] border border-[#ccd0d5] rounded-md focus:border-[#1877f2] outline-none text-[15px]"
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            value={formData.phoneNumber}
          />
        </div>

        <input
          type="password"
          required
          placeholder="Mật khẩu mới"
          className="w-full px-3 py-2 bg-[#f5f6f7] border border-[#ccd0d5] rounded-md focus:border-[#1877f2] outline-none text-[15px]"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* Confirm Password */}
        <input
          type="password"
          required
          placeholder="Xác nhận mật khẩu"
          className="w-full px-3 py-2 bg-[#f5f6f7] border border-[#ccd0d5] rounded-md focus:border-[#1877f2] outline-none text-[15px]"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />

        {/* Nút Đăng ký màu xanh đặc trưng */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-[194px] px-8 py-2 bg-[#00a400] hover:bg-[#008a00] text-white font-bold text-[18px] rounded-md shadow-sm transition-all active:scale-95"
          >
            {loading ? "Đang xử lý..." : "Tiếp tục"}
          </button>
        </div>

        {/* Link chuyển sang Login */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-[#1877f2] text-[15px] hover:underline font-medium"
          >
            Bạn đã có tài khoản?
          </Link>
        </div>
      </form>
    </div>
  );
}
