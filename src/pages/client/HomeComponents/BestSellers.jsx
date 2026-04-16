import { useEffect, useState } from "react";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/client/ProductCard";
import { getProducts } from "../../../services/productService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ sortBy: "top_sell", pageSize: 10 })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
            <Package className="text-blue-500" size={28} /> Bán chạy nhất
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/shop?sort=top_sell"
            className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
          >
            Xem tất cả
          </Link>
          <div className="flex gap-2">
            <button className="best-prev w-10 h-10 rounded-xl bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-blue-600 active:scale-90 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="best-next w-10 h-10 rounded-xl bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-blue-600 active:scale-90 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Lớp bọc bảo vệ: overflow-hidden để cắt phần tràn lề trái/phải */}
      {/* Thêm -mx-4 và px-4 (hoặc lớn hơn) để trừ hao không gian cho bóng đổ không bị cắt */}
      <div className="relative overflow-hidden -mx-4 px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-100 h-[400px] rounded-[2.5rem] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{
              prevEl: ".best-prev",
              nextEl: ".best-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            // Không dùng !overflow-visible nữa vì đã có lớp bọc phía trên xử lý
            className="pb-10 pt-4"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <div className="p-1">
                  {" "}
                  {/* Thêm padding nhỏ để bóng đổ hiện ra đủ */}
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
