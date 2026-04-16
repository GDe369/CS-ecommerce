import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Thuật toán để hiển thị danh sách trang: [1, ..., 4, 5, 6, ..., 10]
  const getPageNumbers = () => {
    const pages = [];
    const step = 2; // Số lượng trang hiển thị xung quanh trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - step && i <= currentPage + step)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-16 select-none">
      {/* Nút Back */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-3d-convex disabled:opacity-30 disabled:cursor-not-allowed hover:text-blue-600 transition-all active:scale-90 group"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
      </button>

      {/* Danh sách các con số */}
      <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-[1.5rem] shadow-3d-concave border border-white/40">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`dots-${index}`}
                className="w-10 h-10 flex items-center justify-center text-slate-400"
              >
                <MoreHorizontal size={16} />
              </div>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                  : "hover:bg-white text-slate-500 hover:text-blue-600"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Nút Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-3d-convex disabled:opacity-30 disabled:cursor-not-allowed hover:text-blue-600 transition-all active:scale-90 group"
      >
        <ChevronRight
          size={20}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </button>
    </div>
  );
}
