import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Receipt, ShoppingCart, Menu } from "lucide-react";
import { formatNaira } from "../utils/format";
import { useCart } from "../hooks/useCart.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function TopBar({ searchQuery, onSearchChange, onOpenNav }) {
  const navigate = useNavigate();
  const { count } = useCart();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between px-6 md:px-8 py-4 gap-3 md:gap-4 border-b border-border2">
      <div className="flex items-center gap-2.5 flex-1 min-w-0 max-w-sm">
        <button onClick={onOpenNav} aria-label="Open menu" className="md:hidden shrink-0 text-text">
          <Menu size={20} />
        </button>
        <Search size={16} className="text-faint shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => {
            onSearchChange?.(e.target.value);
            navigate("/dashboard/products");
          }}
          placeholder="Search products, vendors&hellip;"
          className="w-full bg-transparent outline-none text-[13px] text-text"
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="rounded-full pl-3.5 pr-3.5 py-1.5 flex items-center gap-2 bg-panel border border-border">
          <Receipt size={14} className="text-brass" />
          <span className="text-[11px] text-muted hidden sm:inline">Amount spent</span>
          <span className="text-[13.5px] font-mono font-semibold text-text">
            {formatNaira(user?.amount_spent_kobo || 0)}
          </span>
        </div>

        <button onClick={() => navigate("/dashboard/cart")} className="relative">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-panel border border-border">
            <ShoppingCart size={15} className="text-text" />
          </div>
          {count > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 text-[10px] rounded-full flex items-center justify-center bg-brass text-brassDark font-bold"
              style={{ minWidth: 18, height: 18 }}
            >
              {count}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
