import apiClient from "./apiClient";

/** =========================================
 * QUẢN LÝ SẢN PHẨM (PRODUCTS)
 * ========================================= */

// 1. Lấy danh sách sản phẩm có phân trang & lọc
export const getProducts = (params = {}) => {
  return apiClient.get("/Products", { params }).then((res) => res.data);
};

// 2. Lấy TOÀN BỘ danh sách không phân trang (Admin)
export const getAllProducts = () => {
  return apiClient.get("/Products/all").then((res) => res.data);
};

// 3. Lấy sản phẩm liên quan (Ưu tiên sản phẩm tốt dựa trên Backend mới)
export const getRelatedProducts = (categoryId, excludeId, limit = 4) => {
  return apiClient
    .get(`/Products/related/${categoryId}`, {
      params: { excludeId, limit },
    })
    .then((res) => res.data);
};

// 4. Các hàm nhanh dành cho UI Sections
export const getFlashSaleProducts = () =>
  getProducts({ isSale: true, sortBy: "discount", pageSize: 10 }).then(
    (res) => res.data,
  );

export const getBestSellerProducts = () =>
  getProducts({ sortBy: "top_sell", pageSize: 8 }).then((res) => res.data);

export const getMostViewedProducts = () =>
  getProducts({ sortBy: "top_view", pageSize: 8 }).then((res) => res.data);

// MỚI: Lấy sản phẩm đánh giá cao nhất (Top Rated)
export const getTopRatedProducts = (limit = 8) =>
  getProducts({ sortBy: "rating", pageSize: limit }).then((res) => res.data);

// 5. Lấy chi tiết (Backend mới trả về kèm Rating và 5 Reviews mới nhất)
export const getProductById = (id) =>
  apiClient.get(`/Products/${id}`).then((res) => res.data);

// 6. Thêm, sửa, xóa
export const createProduct = (data) =>
  apiClient.post("/Products", data).then((res) => res.data.data);

export const updateProduct = (id, data) =>
  apiClient.put(`/Products/${id}`, data).then((res) => res.data);

export const deleteProduct = (id) => apiClient.delete(`/Products/${id}`);

// 7. Upload ảnh
export const uploadProductImage = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/Products/${id}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/** =========================================
 * XÁC THỰC & NGƯỜI DÙNG
 * ========================================= */
export const loginApi = (credentials) =>
  apiClient.post("/Auth/login", credentials).then((res) => res.data);

export const socialLoginApi = (socialData) =>
  apiClient.post("/Auth/social-login", socialData).then((res) => res.data);

export const getMeApi = () => apiClient.get("/Auth/me").then((res) => res.data);

export const updateProfileApi = (profileData) =>
  apiClient.put("/Auth/update-profile", profileData).then((res) => res.data);

/** =========================================
 * DANH MỤC & ĐÁNH GIÁ (CẬP NHẬT THEO BACKEND MỚI)
 * ========================================= */
export const getCategories = () =>
  apiClient.get("/Categories").then((res) => res.data);

// CẬP NHẬT: Không cần gọi riêng lẻ quá nhiều nếu đã dùng getProductById
// Nhưng vẫn giữ lại để dùng cho các logic chuyên sâu về Review
export const getAverageRating = async (productId) => {
  try {
    const response = await apiClient.get(
      `/Reviews/product/${productId}/average-rating`,
    );
    return response.data?.average || response.data || 0;
  } catch {
    return 0;
  }
};

export const getProductReviews = (productId) =>
  apiClient.get(`/Reviews/product/${productId}`).then((res) => res.data);

export const createReview = (reviewData) => {
  // reviewData bao gồm: productId, rating, content (Backend đổi từ comment thành content)
  return apiClient.post("/Reviews", reviewData).then((res) => res.data);
};
