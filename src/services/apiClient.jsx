import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
export const BACKEND_HOST =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://giudeproject.runasp.net"
    : typeof window !== "undefined"
      ? window.location.origin
      : "http://giudeproject.runasp.net");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("tech3d_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
