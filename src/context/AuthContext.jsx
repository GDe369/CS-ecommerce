import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Kiểm tra LocalStorage khi khởi tạo app
  useEffect(() => {
    const savedUser = localStorage.getItem("tech3d_user");
    const savedToken = localStorage.getItem("tech3d_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Lỗi parse user từ LocalStorage", e);
        localStorage.removeItem("tech3d_user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * 2. HÀM LOGIN (CẬP NHẬT QUAN TRỌNG)
   * Xử lý dữ liệu trả về từ Page 1 (loginApi và socialLoginApi)
   */
  const login = (data) => {
    // Backend trả về Token (PascalCase) ở loginApi và token (camelCase) ở socialLoginApi
    // Chúng ta lấy cái nào tồn tại
    const accessToken = data.Token || data.token;

    // Lọc ra các thông tin user, loại bỏ token để lưu vào userInfo
    // Chúng ta chuẩn hóa lại key để Header dễ dùng (id, Username/username, ImageUrl/imageUrl...)
    const userInfo = {
      id: data.Id || data.id,
      username: data.Username || data.username,
      role: data.Role || data.role,
      imageUrl: data.ImageUrl || data.imageUrl,
      email: data.Email || data.email,
    };

    // Cập nhật State
    setUser(userInfo);

    // Lưu vào LocalStorage
    localStorage.setItem("tech3d_token", accessToken);
    localStorage.setItem("tech3d_user", JSON.stringify(userInfo));
  };

  // 3. HÀM LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("tech3d_user");
    localStorage.removeItem("tech3d_token");
    // Có thể thêm điều hướng về trang chủ nếu cần
  };

  const updateUser = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("tech3d_user", JSON.stringify(userInfo));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
