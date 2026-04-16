import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Parallax } from "swiper/modules";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const SLIDES = [
  {
    id: 1,
    subtitle: "PHANTOM SERIES 2026",
    title: "The New Era of 3D Printing",
    desc: "Định nghĩa lại sự chính xác. Tốc độ vượt trội 500mm/s. Khám phá dòng máy in công nghiệp thế hệ mới.",
    image:
      "https://images.unsplash.com/photo-1631553127988-3486004b3834?q=80&w=2070",
    link: "/shop",
    btnText: "Khám phá ngay",
  },
  {
    id: 2,
    subtitle: "PREMIUM MATERIALS",
    title: "Sáng Tạo Không Giới Hạn",
    desc: "Vật liệu in Pro-Resin và Carbon Fiber chính hãng. Độ bền cực cao, bề mặt hoàn hảo cho mọi mô hình.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070",
    link: "/shop?category=materials",
    btnText: "Xem bộ sưu tập",
  },
  {
    id: 3,
    subtitle: "EXCLUSIVE OFFERS",
    title: "Flash Sale: Up to 40% Off",
    desc: "Cơ hội sở hữu các dòng máy Ender và Bambu Lab với mức giá tốt nhất trong năm. Số lượng có hạn.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
    link: "/shop?isSale=true",
    btnText: "Săn deal ngay",
  },
  {
    id: 4,
    subtitle: "TECH ECOSYSTEM",
    title: "Phụ Kiện Thông Minh",
    desc: "Nâng cấp trải nghiệm in ấn với hệ thống sấy nhựa tự động và camera AI giám sát từ xa.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070",
    link: "/shop?category=accessories",
    btnText: "Nâng cấp ngay",
  },
  {
    id: 5,
    subtitle: "GLOBAL STANDARD",
    title: "Dịch Vụ In 3D Theo Yêu Cầu",
    desc: "Biến ý tưởng thành hiện thực chỉ trong 24h. Giao hàng toàn quốc với quy trình kiểm định nghiêm ngặt.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070",
    link: "/services",
    btnText: "Báo giá nhanh",
  },
  {
    id: 6,
    subtitle: "INNOVATION HUB",
    title: "Giải Pháp Doanh Nghiệp",
    desc: "Tối ưu hóa quy trình sản xuất thử nghiệm với hệ thống máy in 3D quy mô lớn cho nhà máy.",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2070",
    link: "/enterprise",
    btnText: "Xem giải pháp",
  },
  {
    id: 7,
    subtitle: "FUTURE TECH",
    title: "AI & Robotics Integration",
    desc: "Tích hợp trí tuệ nhân tạo vào thiết kế 3D. Tự động hóa hoàn toàn từ bản vẽ đến thành phẩm.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070",
    link: "/tech",
    btnText: "Tìm hiểu thêm",
  },
];

export default function MainSlider() {
  return (
    <section className="w-full h-[85vh] md:h-screen overflow-hidden bg-black relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Parallax]}
        effect="fade"
        parallax={true}
        loop={true}
        speed={2000}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet"><span class="progress-bar"></span></span>`;
          },
        }}
        className="h-full w-full custom-swiper-pagination"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
              />
              <div className="relative z-20 h-full max-w-7xl mx-auto px-8 flex flex-col justify-center text-white">
                <div className="max-w-2xl">
                  <p
                    data-swiper-parallax="-300"
                    className="text-xs md:text-sm font-light tracking-[0.5em] text-orange-400 uppercase mb-6"
                  >
                    {slide.subtitle}
                  </p>
                  <h1
                    data-swiper-parallax="-500"
                    className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
                  >
                    {slide.title}
                  </h1>
                  <p
                    data-swiper-parallax="-700"
                    className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-xl mb-10"
                  >
                    {slide.desc}
                  </p>
                  <div data-swiper-parallax="-900">
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-4 bg-white text-slate-900 px-10 py-4 rounded-full font-bold uppercase text-xs hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95 group"
                    >
                      {slide.btnText}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
