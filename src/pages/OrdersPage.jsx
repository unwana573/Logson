import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { orderService } from "../services/orderService";
import { formatNaira, formatDate } from "../utils/format";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .myOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">My orders</h1>
      </div>
      <p className="text-[13px] mb-6 text-muted">Every purchase you've made, and where it stands.</p>

      {loading ? (
        <p className="text-[13px] text-muted">Loading&hellip;</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <p className="text-[13px] text-muted">No orders yet. Products you buy will show up here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          {orders.map((o, i) => (
            <div key={o.id} className={`flex items-center justify-between px-5 py-3.5 ${i < orders.length - 1 ? "border-b border-border2" : ""}`}>
              <div>
                <p className="text-[13px] text-text">
                  {o.product_name} &times; {o.quantity}
                </p>
                <p className="text-[12px] mt-0.5 text-faint">
                  {o.payment_method === "manual" ? "Manual transfer" : "Paystack"} &middot; {formatDate(o.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-mono text-text">{formatNaira(o.amount_kobo)}</span>
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: o.status === "success" ? "#1E2A22" : "#3A241B",
                    color: o.status === "success" ? "#6EE7B7" : "#E39A6B",
                  }}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
