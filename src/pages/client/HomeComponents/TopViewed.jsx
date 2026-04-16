import { useEffect, useState } from "react";
import { Eye, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/client/ProductCard";
import { getProducts } from "../../../services/productService";

// Import Swiper React components & styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

export default function TopViewed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy 10-12 sản phẩm để đảm bảo vòng lặp mượt mà
    getProducts({ sortBy: "top_view", pageSize: 12 })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    // Giữ max-w-7xl để đồng bộ toàn trang
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-[0.2em]">
            <TrendingUp size={14} /> Trending Now
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
            <Eye className="text-orange-500" size={32} /> Xu hướng tìm kiếm
          </h2>
        </div>

        {/* Nút điều hướng phong cách Glassmorphism */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[1.25rem] shadow-3d-concave">
            <button className="viewed-prev w-10 h-10 rounded-xl bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-orange-500 transition-all active:scale-90">
              <ChevronLeft size={20} />
            </button>
            <button className="viewed-next w-10 h-10 rounded-xl bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-orange-500 transition-all active:scale-90">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Lớp bọc bảo vệ: Chống tràn lề nhưng giữ được bóng đổ (Shadow) */}
      <div className="relative overflow-hidden -mx-4 px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-50 h-[400px] rounded-[2.5rem] animate-pulse border border-slate-100"
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true} // Cuộn vô tận
            speed={1000} // Trượt mượt
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: ".viewed-prev",
              nextEl: ".viewed-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }, // Khớp đúng 4 card trong khung 7xl
            }}
            className="pb-10 pt-2"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                {/* Padding nhỏ để Card khi hover hoặc đổ bóng không bị cắt */}
                <div className="p-1 transition-transform duration-500 hover:-translate-y-2">
                  <ProductCard product={p} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Footer link */}
    </section>
  );
}
