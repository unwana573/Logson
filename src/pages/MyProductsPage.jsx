import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { userService } from "../services/orderService";
import OwnedProductCard from "../components/OwnedProductCard";

export default function MyProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .myCredentials()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">My products</h1>
      </div>
      <p className="text-[13px] mb-6 text-muted">
        Keep these keys safe. Each activates on one device unless noted otherwise.
      </p>

      {loading ? (
        <p className="text-[13px] text-muted">Loading&hellip;</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <p className="text-[13px] text-muted">No products yet. Purchases show up here once confirmed.</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {items.map((item, i) => (
            <OwnedProductCard key={i} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
