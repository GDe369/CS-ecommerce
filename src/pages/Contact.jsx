import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-20">
        {/* Left Side: Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-6">
              Get in <br /> <span className="text-blue-600">Touch.</span>
            </h1>
            <p className="text-slate-500 text-lg font-light max-w-md">
              Bạn có dự án lớn hay chỉ đơn giản là muốn tìm hiểu thêm về in 3D?
              Đừng ngần ngại liên hệ với đội ngũ chuyên gia của chúng tôi.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="bg-slate-100 p-4 rounded-2xl text-slate-900">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-1">
                  Trụ sở chính
                </h4>
                <p className="text-slate-900 font-bold">
                  Quận 1, TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-slate-100 p-4 rounded-2xl text-slate-900">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-1">
                  Điện thoại
                </h4>
                <p className="text-slate-900 font-bold">+84 123 456 789</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-slate-100 p-4 rounded-2xl text-slate-900">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-1">
                  Email
                </h4>
                <p className="text-slate-900 font-bold">contact@tech3d.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-1 text-slate-400">
                  Họ tên
                </label>
                <input
                  type="text"
                  className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-1 text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest ml-1 text-slate-400">
                Chủ đề
              </label>
              <input
                type="text"
                className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="Tôi muốn báo giá..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest ml-1 text-slate-400">
                Lời nhắn
              </label>
              <textarea
                rows="4"
                className="w-full bg-white border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="Viết tin nhắn của bạn tại đây..."
              ></textarea>
            </div>
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95">
              Gửi yêu cầu ngay
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
