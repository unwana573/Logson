import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CATEGORIES_ALL } from "../utils/constants";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart.jsx";
import { categoryService } from "../services/categoryService";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";

export default function ProductsPage() {
  const { searchQuery } = useOutletContext();
  const { addItem } = useCart();
  const [category, setCategory] = useState(CATEGORIES_ALL);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => {});
  }, []);

  const categoryId = category === CATEGORIES_ALL ? undefined : categories.find((c) => c.name === category)?.id;
  const { products, loading, error } = useProducts({ search: searchQuery, categoryId });

  return (
    <>
      <div className="flex items-baseline justify-between mb-1">
        <h1 className="font-display font-semibold text-[22px] text-text">
          {searchQuery ? `Results for "${searchQuery}"` : "Browse products"}
        </h1>
        <span className="text-[12.5px] hidden sm:inline text-faint">{products.length} products</span>
      </div>
      <p className="text-[13px] mb-5 text-muted">Instant delivery to your dashboard on purchase.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {[CATEGORIES_ALL, ...categories.map((c) => c.name)].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="text-[12.5px] px-3.5 py-1.5 rounded-full transition-colors"
            style={{
              background: category === c ? "#C6A15B" : "#171B24",
              color: category === c ? "#1A140B" : "#9AA1B4",
              border: category === c ? "none" : "1px solid #262C3A",
              fontWeight: category === c ? 600 : 400,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <p className="text-[13px] text-muted">Couldn't load products: {error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <p className="text-[13px] text-muted">
            {searchQuery ? `No products match "${searchQuery}".` : "No products in this category yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addItem} />
          ))}
        </div>
      )}
    </>
  );
}
