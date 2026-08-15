import React, { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatNaira } from "../utils/format";

export default function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1);

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

        <div className="flex items-center justify-between mt-2.5">
          <span className="font-mono font-semibold text-[16.5px] text-text">{formatNaira(product.price_kobo)}</span>
          <span
            className={`text-[11px] px-2 py-1 rounded-full font-medium ${
              product.stock_count < 6 ? "bg-[#3A241B] text-amber" : "bg-[#1E2A22] text-mint"
            }`}
          >
            {product.stock_count} left
          </span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-9 flex items-center justify-center text-muted"
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-[13px] font-mono text-text">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock_count, q + 1))}
              className="w-8 h-9 flex items-center justify-center text-muted"
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            onClick={() => onAddToCart(product, qty)}
            disabled={product.stock_count === 0}
            className="flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-[13px] font-semibold bg-brass text-brassDark disabled:opacity-40"
          >
            <ShoppingCart size={14} />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
