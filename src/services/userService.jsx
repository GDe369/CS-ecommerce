import apiClient from "./apiClient";

/** =========================================
 * HỆ THỐNG XÁC THỰC & TÀI KHOẢN (AUTH)
 * ========================================= */

// 1. Gửi OTP
// Backend nhận [FromBody] string email, nên cần gửi đúng định dạng chuỗi
export const sendOtpApi = (email) => {
  return apiClient.post("/Auth/send-otp", JSON.stringify(email), {
    headers: { "Content-Type": "application/json" },
  });
};

// 2. Đăng ký với OTP
export const registerWithOtpApi = (userData, otp) =>
  apiClient
    .post(`/Auth/register-with-otp?otp=${otp}`, { ...userData, otp })
    .then((res) => res.data);

// 3. Đăng nhập truyền thống
// Trả về: { Token, Username, Role, ImageUrl, Email } (Theo Page 1)
export const loginApi = (credentials) =>
  apiClient.post("/Auth/login", credentials).then((res) => res.data);

// 4. Đăng nhập mạng xã hội (Google/Facebook)
// Trả về: { token, role } (Theo Page 1 hiện tại - Bạn nên sửa Backend để trả về thêm Username/ImageUrl)
export const socialLoginApi = (socialData) =>
  apiClient.post("/Auth/social-login", socialData).then((res) => res.data);

// 5. Lấy thông tin người dùng hiện tại
// Backend mới dùng UsersController => GET /Users/me.
export const getMeApi = () =>
  apiClient.get("/Users/me").then((res) => res.data);

// 6. Cập nhật Profile
// Backend khớp với [HttpPut("update-profile")]
export const updateProfileApi = (profileData) =>
  apiClient.put("/Auth/update-profile", profileData).then((res) => res.data);

/** =========================================
 * QUẢN LÝ ẢNH & FILE
 * ========================================= */

// 7. Upload Ảnh đại diện
// Backend Page 1 hiện chưa có [HttpPost("upload-avatar")].
export const uploadAvatarApi = (formData) => {
  return apiClient.post("/Auth/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/** =========================================
 * QUẢN TRỊ VIÊN (ADMIN)
 * ========================================= */

// Lấy danh sách toàn bộ người dùng
// Backend mới đã có endpoint GET /Users.
export const getAllUsers = () =>
  apiClient.get("/Users").then((res) => res.data);

// Cập nhật Role (ưu tiên /Users/{id}/role nếu backend mới đổi route)
export const updateUserRole = async (id, role) => {
  try {
    return (await apiClient.put(`/Users/${id}/role`, { role })).data;
  } catch (error) {
    if (error.response?.status === 404) {
      return (await apiClient.put(`/Auth/${id}/role`, { role })).data;
    }
    throw error;
  }
};

// Xóa người dùng (ưu tiên route Users nếu backend mới dùng controller đó)
export const deleteUser = async (id) => {
  try {
    return (await apiClient.delete(`/Users/${id}`)).data;
  } catch (error) {
    if (error.response?.status === 404) {
      return (await apiClient.delete(`/Auth/${id}`)).data;
    }
    throw error;
  }
};
