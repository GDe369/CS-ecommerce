import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/client/ProductCard";
import { getProducts } from "../../../services/productService";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

export default function TopRated() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Gọi API lấy sản phẩm sắp xếp theo rating
    getProducts({ sortBy: "rating", pageSize: 20 }) // Lấy dư ra một chút để lọc
      .then((res) => {
        // 2. Lọc: Chỉ giữ lại sản phẩm có trung bình đánh giá > 0 hoặc có lượt review
        // Giả sử dữ liệu trả về có field averageRating hoặc reviewCount
        const filteredProducts = res.data.filter(
          (p) => p.averageRating > 0 || (p.reviews && p.reviews.length > 0),
        );

        // Chỉ lấy tối đa 12 sản phẩm sau khi lọc
        setProducts(filteredProducts.slice(0, 12));
      })
      .catch((err) => console.error("Lỗi lấy sản phẩm đánh giá cao:", err))
      .finally(() => setLoading(false));
  }, []);

  // Nếu không có sản phẩm nào có lượt rate, ẩn toàn bộ section
  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 rounded-[3.5rem] border border-yellow-100 relative overflow-hidden mt-12">
      {/* Decor nền */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500 p-3 rounded-2xl text-white shadow-lg shadow-yellow-200 animate-pulse">
            <Star size={28} fill="currentColor" />
          </div>
          <div>
            <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
              User Verified Excellence
            </p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Đánh giá cao nhất
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/shop?sortBy=rating"
            className="text-xs font-black text-yellow-600 hover:text-yellow-700 transition-colors uppercase tracking-widest border-b-2 border-yellow-200 pb-1 flex items-center gap-2"
          >
            <Award size={14} /> Xem tất cả
          </Link>

          <div className="flex gap-2 bg-white/80 p-1 rounded-xl shadow-3d-concave">
            <button className="rated-prev w-10 h-10 rounded-lg bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-yellow-600 transition-all active:scale-90">
              <ChevronLeft size={20} />
            </button>
            <button className="rated-next w-10 h-10 rounded-lg bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-yellow-600 transition-all active:scale-90">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden -mx-4 px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/60 h-[400px] rounded-[2.5rem] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={products.length > 4} // Chỉ loop nếu đủ số lượng slide để tránh lỗi hiển thị
            speed={1000}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: ".rated-prev",
              nextEl: ".rated-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-10 pt-2"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <div className="p-1 transition-transform duration-500 hover:-translate-y-2">
                  <ProductCard product={p} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
