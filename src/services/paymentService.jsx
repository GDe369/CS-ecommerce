import apiClient from "./apiClient";
import { getOrders } from "./orderService";

/** =========================================
 * HỆ THỐNG THANH TOÁN (VNPAY)
 * ========================================= */

/**
 * 1. Lấy URL thanh toán từ Backend
 * @param {Object} paymentData - Dữ liệu đơn hàng đã được lưu thành công
 */
export const createPaymentUrlApi = (paymentData) => {
  return apiClient
    .post("/Payment/create-payment-url", {
      // Viết chính xác theo tên biến trong class C# (nhưng viết thường chữ cái đầu)
      orderType: paymentData.orderType || "Topup",
      amount: Number(paymentData.amount),
      orderDescription:
        paymentData.orderDescription ||
        `Thanh toan don hang #${paymentData.orderId}`,
      name: paymentData.name,
      orderId: String(paymentData.orderId),
      email: paymentData.email || "",
    })
    .then((res) => res.data);
};

/**
 * Lưu ý:
 * Backend sẽ redirect về http://localhost:5173 (hoặc 5174)
 * dựa trên cấu hình trong PaymentCallback của Controller.
 */

/** =========================================
 * QUẢN LÝ ĐƠN HÀNG (ORDERS)
 * ========================================= */

/**
 * 2. Tạo đơn hàng mới
 * Bước này phải chạy TRƯỚC khi gọi createPaymentUrlApi
 */
export const placeOrderApi = async (orderData) => {
  // Nếu apiClient của bạn chưa có interceptor để đính kèm Token,
  // và bạn đã bỏ [Authorize] ở Backend (dùng [AllowAnonymous]),
  // thì request này sẽ chạy bình thường.
  const response = await apiClient.post("/Orders", orderData);
  return response.data; // Thường trả về đối tượng Order vừa tạo (bao gồm Id)
};

/**
 * 3. Lấy lịch sử mua hàng
 */
export const getMyOrdersApi = async () => {
  try {
    const response = await apiClient.get("/Orders/my-orders");
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 400 || status === 404) {
      console.warn(
        "GET /Orders/my-orders failed, fallback to /Orders:",
        status,
        error.response?.data,
      );
      return getOrders();
    }
    throw error;
  }
};
