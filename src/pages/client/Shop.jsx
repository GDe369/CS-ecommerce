import { useEffect, useState, useCallback } from "react";
import { getProducts, getCategories } from "../../services/productService";
import { toast } from "react-hot-toast";
import ProductCard from "../../components/client/ProductCard";

// Import các component con đã tách

import ShopSidebar from "./ShopComponents/ShopSidebar";
import ShopSearch from "./ShopComponents/ShopSearch";
import Pagination from "./ShopComponents/Pagination";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Không thể tải danh mục"));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery || undefined,
        categoryId: filterCategory === "all" ? undefined : filterCategory,
        sortBy: sortBy,
        page: page,
        pageSize: 9,
      };
      const response = await getProducts(params);
      setProducts(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCategory, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (type, value) => {
    if (type === "category") setFilterCategory(value);
    if (type === "sort") setSortBy(value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <ShopSearch
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
      />

      <div className="flex flex-col lg:flex-row gap-10">
        <ShopSidebar
          categories={categories}
          filterCategory={filterCategory}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1">
          <div className="mb-8 bg-white/30 p-4 rounded-2xl border border-white/50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tìm thấy: <span className="text-blue-600">{totalItems}</span> sản
              phẩm
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-white rounded-[2.5rem] shadow-3d-convex animate-pulse"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-3d-convex">
              <p className="font-black text-slate-400 uppercase">
                Không tìm thấy sản phẩm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
