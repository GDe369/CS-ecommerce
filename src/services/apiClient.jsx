import axios from "axios";

// Đặt API_BASE_URL trực tiếp như page 1, có thể override bằng .env nếu cần
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://giudeproject.runasp.net/api";
export const BACKEND_HOST =
  import.meta.env.VITE_BACKEND_URL || "http://giudeproject.runasp.net";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("tech3d_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token hết hạn hoặc không hợp lệ!");
      // Nếu cần, bỏ comment dòng dưới để tự động về login
      // localStorage.removeItem("tech3d_token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
