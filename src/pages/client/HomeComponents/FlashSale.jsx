import { useEffect, useState } from "react";
import { Zap, ChevronLeft, ChevronRight, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/client/ProductCard";
import { getProducts } from "../../../services/productService";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

export default function FlashSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ isSale: true, sortBy: "discount", pageSize: 12 })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    // Section giữ kích thước chuẩn max-w-7xl
    <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-red-50/50 to-orange-50/50 rounded-[3.5rem] border border-red-100 relative overflow-hidden">
      {/* Decor nền nội bộ */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-200/20 rounded-full blur-3xl"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-200 animate-bounce">
            <Zap size={28} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Flash Sale
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/shop?isSale=true"
            className="text-xs font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest border-b-2 border-red-200 pb-1"
          >
            Săn deal ngay
          </Link>

          <div className="flex gap-2 bg-white/80 p-1 rounded-xl shadow-3d-concave">
            <button className="flash-prev w-10 h-10 rounded-lg bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-red-600 transition-all active:scale-90">
              <ChevronLeft size={20} />
            </button>
            <button className="flash-next w-10 h-10 rounded-lg bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-red-600 transition-all active:scale-90">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Container xử lý tràn: overflow-hidden cắt slide thừa, -mx-4 & px-4 giữ bóng đổ */}
      <div className="relative overflow-hidden -mx-4 px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/60 h-[400px] rounded-[2.5rem] animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true} // Cuộn vô tận
            speed={1000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: ".flash-prev",
              nextEl: ".flash-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }, // Khớp 4 sp trong khung chuẩn
            }}
            className="pb-10 pt-2"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                {/* padding nhỏ để không cắt bóng đổ của Card khi hover */}
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
