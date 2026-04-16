import apiClient from "./apiClient";

/**
 * Lấy danh sách toàn bộ đơn hàng (Thường dùng cho trang Admin)
 */
export const getOrders = async () => {
  try {
    const response = await apiClient.get("/Orders");
    // Đảm bảo dữ liệu trả về luôn là mảng để tránh lỗi .map() ở giao diện
    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return [];
  }
};

/**
 * Lấy chi tiết một đơn hàng cụ thể
 * @param {number} id - ID của đơn hàng
 */
export const getOrderById = (id) =>
  apiClient.get(`/Orders/${id}`).then((res) => res.data);

/**
 * Cập nhật trạng thái đơn hàng (Dành cho Admin)
 * @param {number} id - ID đơn hàng
 * @param {string} status - Trạng thái mới (ví dụ: 'Shipped', 'Delivered')
 */
export const updateOrderStatus = (id, status) =>
  apiClient.put(`/Orders/${id}/status`, { status });

/**
 * Đặt hàng mới (Dành cho khách hàng)
 * @param {object} orderData - Thông tin đơn hàng và mảng OrderItems
 */
export const placeOrder = (orderData) =>
  apiClient.post("/Orders", orderData).then((res) => res.data);
