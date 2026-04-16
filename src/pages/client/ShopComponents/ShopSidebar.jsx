import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function ShopSidebar({
  categories = [],
  filterCategory,
  onFilterChange,
  sortBy,
}) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const normalizedCategories = useMemo(() => {
    return Array.isArray(categories)
      ? categories.map((cat) => ({
          id: cat.id ?? cat.Id,
          name: cat.name ?? cat.Name,
          parentId: cat.parentId ?? cat.ParentId ?? null,
        }))
      : [];
  }, [categories]);

  const categoryTree = useMemo(() => {
    const tree = {
      roots: [],
      childrenByParent: {},
    };

    normalizedCategories.forEach((cat) => {
      if (cat.parentId) {
        tree.childrenByParent[cat.parentId] = [
          ...(tree.childrenByParent[cat.parentId] || []),
          cat,
        ];
      } else {
        tree.roots.push(cat);
      }
    });

    tree.roots.sort((a, b) => a.name.localeCompare(b.name));
    Object.values(tree.childrenByParent).forEach((children) =>
      children.sort((a, b) => a.name.localeCompare(b.name)),
    );

    return tree;
  }, [normalizedCategories]);

  const isSelected = (id) => String(filterCategory) === String(id);

  const isExpanded = (parentId) => {
    if (String(expandedCategory) === String(parentId)) return true;
    const children = categoryTree.childrenByParent[parentId] || [];
    return children.some((child) => isSelected(child.id));
  };

  const handleParentClick = (parentId) => {
    const nextExpanded =
      String(expandedCategory) === String(parentId) ? null : parentId;
    setExpandedCategory(nextExpanded);
    onFilterChange("category", String(parentId));
  };

  const handleChildClick = (childId, parentId) => {
    setExpandedCategory(parentId);
    onFilterChange("category", String(childId));
  };

  return (
    <aside className="lg:w-64 space-y-8">
      <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] shadow-3d-convex border border-white/40 sticky top-24">
        {/* Category Section */}
        <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-[11px] tracking-widest uppercase">
          <SlidersHorizontal size={16} /> Danh mục
        </h4>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setExpandedCategory(null);
              onFilterChange("category", "all");
            }}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
              filterCategory === "all"
                ? "bg-blue-600 text-white shadow-lg"
                : "hover:bg-white text-slate-500"
            }`}
          >
            Tất cả sản phẩm
          </button>

          {categoryTree.roots.map((parent) => {
            const children = categoryTree.childrenByParent[parent.id] || [];
            const parentActive = isSelected(parent.id);
            const expanded = isExpanded(parent.id);

            return (
              <div key={parent.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleParentClick(parent.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    parentActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-white text-slate-500"
                  }`}
                >
                  {parent.name}
                </button>

                {expanded && children.length > 0 && (
                  <div className="space-y-2 pl-6">
                    {children.map((child) => (
                      <button
                        type="button"
                        key={child.id}
                        onClick={() => handleChildClick(child.id, parent.id)}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                          isSelected(child.id)
                            ? "bg-blue-500 text-white shadow-lg"
                            : "hover:bg-white text-slate-600"
                        }`}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sort Section */}
        <div className="mt-10 pt-10 border-t border-slate-100">
          <h4 className="font-black text-slate-900 mb-4 text-[11px] tracking-widest uppercase">
            Sắp xếp theo
          </h4>
          <select
            className="w-full bg-white border-none rounded-xl p-3 text-xs font-bold shadow-sm focus:ring-2 ring-blue-500 outline-none"
            value={sortBy}
            onChange={(e) => onFilterChange("sort", e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="top_sell">Bán chạy nhất</option>
            <option value="top_view">Xem nhiều nhất</option>
            <option value="discount">Giảm giá sốc</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
