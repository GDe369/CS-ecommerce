import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-20 rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Cột 1: Thương hiệu & Giới thiệu */}
        <div className="md:col-span-5">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">
            TECH<span className="text-blue-500">3D</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-sm font-medium mb-8">
            Tiên phong trong việc kết hợp thương mại điện tử và công nghệ 3D
            tương tác. Chúng tôi mang đến trải nghiệm mua sắm chân thực nhất
            ngay tại không gian của bạn.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4">
            {["facebook", "instagram", "youtube", "twitter"].map((social) => (
              <div
                key={social}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-black uppercase">
                  {social.slice(0, 2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div className="md:col-span-2">
          <h4 className="font-black text-white mb-6 text-xs uppercase tracking-[0.2em]">
            Khám phá
          </h4>
          <ul className="space-y-4 text-sm font-bold">
            <li>
              <Link
                to="/products"
                className="hover:text-blue-500 transition-colors"
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="hover:text-blue-500 transition-colors"
              >
                Danh mục
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-blue-500 transition-colors"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="hover:text-blue-500 transition-colors"
              >
                Tin tức
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ khách hàng */}
        <div className="md:col-span-2">
          <h4 className="font-black text-white mb-6 text-xs uppercase tracking-[0.2em]">
            Hỗ trợ
          </h4>
          <ul className="space-y-4 text-sm font-bold">
            <li className="hover:text-blue-500 cursor-pointer transition-colors">
              Chính sách bảo hành
            </li>
            <li className="hover:text-blue-500 cursor-pointer transition-colors">
              Vận chuyển
            </li>
            <li className="hover:text-blue-500 cursor-pointer transition-colors">
              Câu hỏi thường gặp
            </li>
            <li className="hover:text-blue-500 cursor-pointer transition-colors">
              Bảo mật
            </li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận tin */}
        <div className="md:col-span-3">
          <h4 className="font-black text-white mb-6 text-xs uppercase tracking-[0.2em]">
            Bản tin
          </h4>
          <p className="text-[12px] mb-4 font-bold">
            Cập nhật công nghệ mới nhất từ TECH3D.
          </p>
          <div className="relative">
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 ring-blue-500 outline-none transition-all"
            />
            <button className="absolute right-2 top-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-blue-500 transition-all">
              GỬI
            </button>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
          © 2026 Tech3D Studio. All rights reserved.
        </p>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">Cookies</span>
        </div>
      </div>
    </footer>
  );
}
