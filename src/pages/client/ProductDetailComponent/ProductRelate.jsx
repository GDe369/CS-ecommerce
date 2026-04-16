import { useEffect, useState } from "react";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../../components/client/ProductCard";
// Cập nhật: Sử dụng getRelatedProducts + fallback getProducts để lấy sản phẩm cùng category
import {
  getProducts,
  getRelatedProducts,
} from "../../../services/productService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

export default function ProductRelate({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const normalizeProducts = (data) => {
      if (Array.isArray(data)) return data;
      return data?.data ?? data?.items ?? data?.results ?? [];
    };

    getRelatedProducts(categoryId, currentProductId, 10)
      .then((data) => {
        const relatedData = normalizeProducts(data);
        const filtered = relatedData.filter(
          (p) => String(p.id) !== String(currentProductId),
        );

        if (filtered.length > 0) {
          setProducts(filtered);
          return;
        }

        // Fallback: nếu endpoint related trả về rỗng, lấy cùng category bằng query chung
        return getProducts({ categoryId, pageSize: 10 }).then(
          (fallbackData) => {
            const fallbackArray = normalizeProducts(fallbackData);
            setProducts(
              fallbackArray.filter(
                (p) => String(p.id) !== String(currentProductId),
              ),
            );
          },
        );
      })
      .catch((error) => {
        console.error("Lỗi lấy sản phẩm liên quan:", error);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [categoryId, currentProductId]);

  // 3. Nếu không có dữ liệu liên quan, hiển thị thông báo rõ ràng
  if (!loading && products.length === 0)
    return (
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-100">
        <div className="text-center text-slate-500 py-20">
          <p className="text-xl font-bold">Không có sản phẩm liên quan.</p>
          <p className="text-sm mt-2">
            Sản phẩm chi tiết hiện tại chưa có mặt hàng cùng danh mục.
          </p>
        </div>
      </section>
    );

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
            Gợi ý cho bạn
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
            <Layers className="text-blue-500" size={28} /> Sản phẩm tương tự
          </h2>
        </div>

        {/* Điều hướng Slider */}
        <div className="flex gap-2">
          <button className="rel-prev w-10 h-10 rounded-xl bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-blue-600 active:scale-90 transition-all border border-slate-50">
            <ChevronLeft size={20} />
          </button>
          <button className="rel-next w-10 h-10 rounded-xl bg-white shadow-3d-convex flex items-center justify-center text-slate-600 hover:text-blue-600 active:scale-90 transition-all border border-slate-50">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden -mx-4 px-4">
        {loading ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-100 h-[380px] rounded-[2rem] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Swiper
            // Ép Swiper render lại khi categoryId thay đổi để tránh lỗi layout
            key={categoryId}
            modules={[Autoplay, Navigation]}
            spaceBetween={25}
            slidesPerView={1}
            speed={800}
            // Chỉ loop khi có đủ số lượng sản phẩm (ví dụ > 4)
            loop={products.length > 4}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{
              prevEl: ".rel-prev",
              nextEl: ".rel-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12 pt-4"
          >
            {products.map((p, index) => (
              <SwiperSlide key={`${p.id ?? index}-${index}`}>
                <div className="p-1 h-full">
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
