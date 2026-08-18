import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { categoryService } from "../services/categoryService";
import { formatNaira } from "../utils/format";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProductGridSkeleton } from "../components/Skeleton";

const CATEGORIES_ALL = "All";

function PublicProductCard({ product, onBuy }) {
  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden flex flex-col">
      <div className="bg-border2" style={{ aspectRatio: "16 / 10" }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover block" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-faint text-[12px]">No image</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-wider text-muted">{product.vendor}</p>
        <h3 className="font-display font-semibold text-[15.5px] mt-0.5 text-text">{product.name}</h3>
        {product.description && (
          <p className="text-[12.5px] mt-1.5 text-muted leading-relaxed line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="font-mono font-semibold text-[16.5px] text-text">{formatNaira(product.price_kobo)}</span>
          <span
            className={`text-[11px] px-2 py-1 rounded-full font-medium ${
              product.stock_count < 6 ? "bg-[#3A241B] text-amber" : "bg-[#1E2A22] text-mint"
            }`}
          >
            {product.stock_count} left
          </span>
        </div>
        <button
          onClick={onBuy}
          className="mt-4 h-9 rounded-lg flex items-center justify-center gap-1.5 text-[13px] font-semibold bg-brass text-brassDark"
        >
          <ShoppingCart size={14} />
          Sign up to buy
        </button>
      </div>
    </div>
  );
}

export default function PublicProductsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES_ALL);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => {});
  }, []);

  const categoryId = category === CATEGORIES_ALL ? undefined : categories.find((c) => c.name === category)?.id;
  const { products, loading, error } = useProducts({ categoryId });

  return (
    <div className="w-full">
      <Navbar />

      <div className="px-6 md:px-10 py-14 bg-ink" style={{ minHeight: "60vh" }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-semibold text-[28px] text-text">Browse products</h1>
          <p className="text-[14px] mt-2 text-muted">
            Create a free account to buy &mdash; browsing is open to everyone.
          </p>

          <div className="flex flex-wrap gap-2 mt-6 mb-7">
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
              <p className="text-[13px] text-muted">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))" }}>
              {products.map((p) => (
                <PublicProductCard key={p.id} product={p} onBuy={() => navigate("/signup")} />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-border bg-panel p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[14px] font-semibold text-text">Ready to buy?</p>
              <p className="text-[12.5px] text-muted mt-0.5">Create an account to check out and manage your keys.</p>
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-2 bg-brass text-brassDark font-semibold"
            >
              Get started
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}