import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getProductById,
  getProductReviews,
  getAverageRating,
  createReview,
  getCategories,
} from "../../services/productService";
import { BACKEND_HOST } from "../../services/apiClient";
import { useCart } from "../../context/CartContext";

import ProductInfo from "./ProductDetailComponent/ProductInfo";
import ProductReviews from "./ProductDetailComponent/ProductReviews";
import ProductRelate from "./ProductDetailComponent/ProductRelate";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [ratingForm, setRatingForm] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentForm, setCommentForm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cuộn lên đầu trang khi đổi ID sản phẩm (khi click vào sản phẩm liên quan)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    fetchFullData();
    // Reset quantity về 1 khi đổi sản phẩm
    setQuantity(1);
  }, [id]);

  const fetchFullData = async () => {
    setLoading(true);
    try {
      const [prodData, reviewData, ratingData, categoryData] =
        await Promise.all([
          getProductById(id),
          getProductReviews(id),
          getAverageRating(id),
          getCategories(),
        ]);
      setProduct(prodData);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
      setAvgRating(
        typeof ratingData === "object" ? ratingData?.average : ratingData || 0,
      );
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      toast.error("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path || path === "string")
      return "https://placehold.co/600x600?text=Tech3D";
    if (path.startsWith("http")) return path;
    return `${BACKEND_HOST}${path.startsWith("/") ? path : "/" + path}`;
  };

  const handleReviewSubmit = async () => {
    if (ratingForm === 0 && !commentForm.trim()) {
      toast.error("Vui lòng nhập sao hoặc bình luận");
      return;
    }
    setIsSubmitting(true);
    try {
      await createReview({
        productId: id,
        rating: ratingForm,
        content: commentForm.trim(), // Backend dùng content thay vì comment
      });
      toast.success("Đã gửi đánh giá!");
      setRatingForm(0);
      setCommentForm("");
      fetchFullData();
    } catch {
      toast.error("Lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black text-slate-300 animate-pulse text-2xl uppercase tracking-widest">
        Loading Experience...
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-40 font-black text-2xl text-slate-400 uppercase tracking-tighter">
        Sản phẩm không tồn tại
      </div>
    );

  // Lấy CategoryId an toàn dựa trên các cấu trúc dữ liệu khác nhau
  const targetCategoryId =
    product?.categoryId ??
    product?.CategoryId ??
    product?.category_id ??
    product?.category?.id ??
    product?.category?.CategoryId ??
    product?.category?.categoryId ??
    product?.category?.category_id ??
    categories.find(
      (c) =>
        c.id === product?.categoryId ||
        c.id === product?.CategoryId ||
        c.name === product?.CategoryName ||
        c.Name === product?.CategoryName,
    )?.id;

  return (
    <div className="bg-white min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ProductInfo
          product={product}
          avgRating={avgRating}
          totalReviews={reviews.length}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={() => addToCart(product, quantity)}
          getImageUrl={getImageUrl}
        />

        {/* Cập nhật phần Related: Truyền ID đã xử lý */}
        <ProductRelate
          categoryId={targetCategoryId}
          currentProductId={product?.id || id}
        />

        <ProductReviews
          reviews={reviews}
          avgRating={avgRating}
          ratingForm={ratingForm}
          setRatingForm={setRatingForm}
          hoverRating={hoverRating}
          setHoverRating={setHoverRating}
          commentForm={commentForm}
          setCommentForm={setCommentForm}
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmitting}
          productName={product.name || product.Name}
        />
      </div>
    </div>
  );
}
