import apiClient from "./apiClient";

// Lấy toàn bộ đánh giá kèm thông tin User và Product (Backend nên Join bảng)
export const getReviews = () =>
  apiClient.get("/Reviews").then((res) => res.data);

// Xóa hoặc ẩn đánh giá (nếu có trường IsHidden trong DB)
export const deleteReview = (id) => apiClient.delete(`/Reviews/${id}`);
export const getProductReviews = async (productId) => {
  try {
    const response = await apiClient.get(`/Reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá:", error);
    throw error;
  }
};

// Hàm lấy điểm trung bình (nếu bạn cần dùng sau này)
export const getAverageRating = async (productId) => {
  const response = await apiClient.get(
    `/Reviews/product/${productId}/average-rating`,
  );
  return response.data;
};
