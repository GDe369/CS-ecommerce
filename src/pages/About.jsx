import { ShieldCheck, Target, Users, Zap } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Khách hàng tin dùng", value: "10,000+" },
    { label: "Sản phẩm hoàn thiện", value: "500+" },
    { label: "Năm kinh nghiệm", value: "8+" },
    { label: "Đối tác toàn cầu", value: "25+" },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 uppercase">
            We Build <br /> <span className="text-orange-500">The Future.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-light leading-relaxed">
            Chúng tôi không chỉ bán máy in 3D. Chúng tôi cung cấp giải pháp để
            biến những ý tưởng điên rồ nhất của bạn thành hiện thực vật lý.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <Zap className="text-orange-500" size={40} />
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              Tốc độ & Đột phá
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Dẫn đầu thị trường với những công nghệ in 3D nhanh nhất và chính
              xác nhất hiện nay.
            </p>
          </div>
          <div className="space-y-4">
            <ShieldCheck className="text-blue-500" size={40} />
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              Chất lượng cốt lõi
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Mọi linh kiện và vật liệu đều được kiểm định theo tiêu chuẩn công
              nghiệp quốc tế.
            </p>
          </div>
          <div className="space-y-4">
            <Users className="text-slate-900" size={40} />
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              Cộng đồng sáng tạo
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Hỗ trợ tối đa cho các Maker và Startup trong hành trình hiện thực
              hóa sản phẩm.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
