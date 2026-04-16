import { Star, User, ThumbsUp } from "lucide-react";

export default function ProductReviews({
  reviews,
  avgRating,
  ratingForm,
  setRatingForm,
  hoverRating,
  setHoverRating,
  commentForm,
  setCommentForm,
  onSubmit,
  isSubmitting,
  productName,
}) {
  return (
    <div
      id="reviews"
      className="bg-slate-50 rounded-[3.5rem] p-8 md:p-16 border border-slate-100"
    >
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
            Đánh giá khách hàng
          </h2>
          <p className="text-slate-500 font-medium">
            Trải nghiệm chân thực về {productName}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white flex items-center gap-10">
          <div className="text-center">
            <div className="text-6xl font-black text-slate-900">
              {Number(avgRating).toFixed(1)}
            </div>
            <div className="flex text-yellow-400 justify-center mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= Math.round(avgRating) ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
          <div className="h-12 w-[1px] bg-slate-100"></div>
          <div className="hidden md:block">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Đánh giá cộng đồng
            </p>
            <p className="text-xs font-bold text-slate-800 uppercase italic">
              Authentic Experience
            </p>
          </div>
        </div>
      </div>

      {/* --- USER REVIEW FORM --- */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-white shadow-xl mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-slate-800">
            <Star className="text-blue-600" size={20} fill="currentColor" />
            Viết đánh giá của bạn
          </h3>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Mức độ hài lòng
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRatingForm(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || ratingForm)
                          ? "text-yellow-400"
                          : "text-slate-200"
                      } transition-colors`}
                      fill={
                        star <= (hoverRating || ratingForm)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Chia sẻ ý kiến
              </p>
              <textarea
                value={commentForm}
                onChange={(e) => setCommentForm(e.target.value)}
                placeholder="Sản phẩm tuyệt vời, dịch vụ tốt... (Tùy chọn)"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá ngay"}
            </button>
          </div>
        </div>
      </div>

      {/* --- REVIEWS LIST --- */}
      <div className="grid gap-8">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-10 rounded-[2.5rem] border border-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* HIỂN THỊ AVATAR USER */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-50 shadow-inner">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          review.userName || "U",
                        )}&background=f1f5f9&color=64748b&bold=true`;
                      }}
                    />
                  ) : (
                    <div className="text-slate-400">
                      <User size={28} />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">
                        {review.userName || "Tech3D Explorer"}
                      </h4>
                      {review.rating > 0 && (
                        <div className="flex text-yellow-400 mt-1 gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              fill={
                                s <= review.rating ? "currentColor" : "none"
                              }
                              className={
                                s <= review.rating
                                  ? "text-yellow-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                      {review.comment}
                    </p>
                  )}

                  <div className="flex items-center gap-6 pt-2">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors group">
                      <ThumbsUp
                        size={14}
                        className="group-hover:scale-110 transition-transform"
                      />{" "}
                      Hữu ích
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-black uppercase tracking-widest">
              Chưa có đánh giá nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
