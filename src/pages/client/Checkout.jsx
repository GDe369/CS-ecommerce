import { useCart } from "../../context/CartContext";
import { useState } from "react";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BACKEND_HOST } from "../../services/apiClient";
// Import các hàm API từ service
import {
  createPaymentUrlApi,
  placeOrderApi,
} from "../../services/paymentService";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const getImageUrl = (path) => {
    if (!path || path === "string")
      return "https://placehold.co/600x600?text=Tech3D";
    if (path.startsWith("http")) return path;
    return `${BACKEND_HOST}${path.startsWith("/") ? path : "/" + path}`;
  };

  const paymentOptions = [
    {
      id: "COD",
      name: "Thanh toán khi nhận hàng",
      icon: <CreditCard size={20} />,
      color: "bg-blue-600",
    },
    {
      id: "VNPAY",
      name: "Thanh toán qua VNPAY",
      icon: <Globe size={20} />,
      color: "bg-red-600",
    },
  ];

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    // 1. Chuẩn bị dữ liệu khớp với Model Order ở Backend
    const orderObj = {
      customerName: formData.get("fullName"),
      email: formData.get("email"),
      shippingAddress: formData.get("address"),
      phoneNumber: formData.get("phone"), // Đảm bảo khớp với DB
      paymentMethod: paymentMethod,
      orderItems: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price, // Nên gửi kèm giá tại thời điểm mua
      })),
      totalAmount: totalPrice,
    };

    try {
      // 2. Gọi API tạo đơn hàng (placeOrderApi đã cập nhật ở Page 2)
      const orderResponse = await placeOrderApi(orderObj);

      // Giả sử Backend trả về Object chứa ID đơn hàng vừa tạo
      const orderId = orderResponse.id || orderResponse.orderId;

      if (paymentMethod === "VNPAY") {
        // 3. Nếu là VNPAY -> Gọi API lấy link thanh toán (Page 1 Controller)
        const paymentData = await createPaymentUrlApi({
          amount: totalPrice,
          name: orderObj.customerName,
          orderId: orderId,
        });

        if (paymentData && paymentData.paymentUrl) {
          toast.loading("Đang chuyển hướng đến cổng VNPAY...");
          // Chuyển hướng sang trang thanh toán của VNPAY
          window.location.href = paymentData.paymentUrl;
        } else {
          throw new Error("Không lấy được link thanh toán VNPAY");
        }
      } else {
        // 4. Nếu là COD -> Thông báo và dọn giỏ hàng
        toast.success("Đặt hàng thành công! Vui lòng kiểm tra email xác nhận.");
        clearCart();
        // Chuyển về trang thành công (Backend Page 1 cũng redirect về đây)
        navigate(`/payment-success?orderId=${orderId}`);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Lỗi hệ thống";
      toast.error("Lỗi đặt hàng: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link
        to="/cart"
        className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-blue-600 transition-all"
      >
        <ArrowLeft size={16} /> QUAY LẠI GIỎ HÀNG
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 uppercase">
            Thông tin giao hàng
          </h2>

          <form onSubmit={handleOrder} className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-4">
              <input
                required
                name="fullName"
                type="text"
                placeholder="Họ và tên"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 font-medium"
              />
              <input
                required
                name="email"
                type="email"
                placeholder="Email nhận thông báo đơn hàng"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 font-medium"
              />
              <input
                required
                name="phone"
                type="text"
                placeholder="Số điện thoại"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 font-medium"
              />
              <div className="relative">
                <textarea
                  required
                  name="address"
                  placeholder="Địa chỉ giao hàng chi tiết (Số nhà, đường, phường/xã...)"
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 font-medium h-32"
                ></textarea>
                <MapPin
                  size={20}
                  className="absolute right-5 top-5 text-slate-300"
                />
              </div>
            </div>

            <h2 className="text-3xl font-black text-slate-900 uppercase pt-4">
              Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setPaymentMethod(option.id)}
                  className={`group cursor-pointer flex items-center gap-4 p-4 rounded-[1.8rem] border-2 transition-all ${
                    paymentMethod === option.id
                      ? "bg-white border-blue-600 shadow-lg"
                      : "bg-transparent border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-black uppercase text-[10px] tracking-widest ${paymentMethod === option.id ? "text-blue-600" : "text-slate-400"}`}
                    >
                      {option.id}
                    </p>
                    <p className="font-bold text-slate-700 text-sm">
                      {option.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={loading || cartItems.length === 0}
              type="submit"
              className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-white shadow-xl transition-all ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-blue-600"
              }`}
            >
              {loading
                ? "ĐANG XỬ LÝ ĐƠN HÀNG..."
                : `XÁC NHẬN THANH TOÁN (${totalPrice.toLocaleString()}đ)`}
            </button>
          </form>
        </div>

        {/* Cột Tóm tắt đơn hàng giữ nguyên UI của bạn */}
        <div className="bg-slate-900 rounded-[4rem] p-10 text-white h-fit sticky top-32">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <ShoppingBag /> ĐƠN HÀNG CỦA BẠN
          </h3>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl"
              >
                <img
                  src={getImageUrl(item.imageUrl || item.image)}
                  className="w-16 h-16 object-contain rounded-xl bg-white"
                  alt={item.name}
                />
                <div className="flex-1">
                  <p className="font-bold text-sm uppercase line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-blue-400 font-bold">
                    x{item.quantity}
                  </p>
                </div>
                <p className="font-black">
                  {(item.price * item.quantity).toLocaleString()}đ
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-10 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-black text-xl uppercase">Tổng cộng</span>
              <span className="text-3xl font-black text-blue-400">
                {totalPrice.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
