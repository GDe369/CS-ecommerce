import {
  CheckCircle,
  XCircle,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";

export default function ProductInfo({
  product,
  avgRating,
  totalReviews,
  quantity,
  setQuantity,
  onAddToCart,
  getImageUrl,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-20 mb-32">
      {/* Image Gallery */}
      <div className="flex-1">
        <div className="bg-slate-50 rounded-[4rem] p-12 sticky top-32 group transition-all duration-500 hover:shadow-2xl border border-slate-100">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-auto object-contain drop-shadow-3xl group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </div>

      {/* Buying Actions */}
      <div className="flex-1 space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Tech3D Certified
            </span>
            {product.stock > 0 ? (
              <span className="text-green-500 text-xs font-black flex items-center gap-1 uppercase tracking-wider">
                <CheckCircle size={14} /> In Stock
              </span>
            ) : (
              <span className="text-red-500 text-xs font-black flex items-center gap-1 uppercase tracking-wider">
                <XCircle size={14} /> Sold Out
              </span>
            )}
          </div>

          <h1 className="text-6xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">
            {product.name}
          </h1>

          <div className="flex items-center gap-6">
            <p className="text-5xl font-black text-blue-600 tracking-tighter">
              {product.price?.toLocaleString("vi-VN")}₫
            </p>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-400" fill="currentColor" />
              <span className="font-black text-lg">
                {Number(avgRating).toFixed(1)}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase">
                ({totalReviews} reviews)
              </span>
            </div>
          </div>

          <p className="text-slate-500 text-xl font-light leading-relaxed italic">
            {product.description ||
              "Công nghệ in 3D đỉnh cao, mang lại độ chính xác tuyệt đối."}
          </p>
        </div>

        {/* Quick Benefits */}
        <div className="grid grid-cols-3 gap-4 py-8 border-y border-slate-100">
          <div className="text-center space-y-2">
            <Truck className="mx-auto text-slate-400" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              Free Shipping
            </p>
          </div>
          <div className="text-center space-y-2 border-x border-slate-100">
            <ShieldCheck className="mx-auto text-slate-400" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              2 Year Warranty
            </p>
          </div>
          <div className="text-center space-y-2">
            <RotateCcw className="mx-auto text-slate-400" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              30 Day Return
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <div className="flex items-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 font-black text-xl hover:text-blue-600 transition-colors"
            >
              -
            </button>
            <span className="w-12 text-center font-black text-lg">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(product.stock || 99, quantity + 1))
              }
              className="w-12 h-12 font-black text-xl hover:text-blue-600 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={onAddToCart}
            disabled={product.stock <= 0}
            className={`flex-1 h-20 font-black rounded-3xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl ${
              product.stock > 0
                ? "bg-slate-900 text-white hover:bg-orange-600"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={24} />
            <span className="uppercase tracking-widest text-sm">
              Add to Experience
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
