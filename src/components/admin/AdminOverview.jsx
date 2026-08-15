import React, { useEffect, useState } from "react";
import { BarChart3, ClipboardList, Users } from "lucide-react";
import { formatNaira } from "../../utils/format";
import { orderService, userService } from "../../services/orderService";

export default function AdminOverview() {
  const [orders, setOrders] = useState([]);
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderService.listAll(), userService.list()])
      .then(([o, users]) => {
        setOrders(o);
        setUserCount(users.length);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[13px] text-muted">Loading&hellip;</p>;

  const revenue = orders.filter((o) => o.status === "success").reduce((s, o) => s + o.amount_kobo, 0);
  const pending = orders.filter((o) => o.status === "pending").length;

  return (
    <>
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {[
          { label: "Revenue collected", value: formatNaira(revenue), icon: BarChart3 },
          { label: "Payments pending", value: String(pending), icon: ClipboardList },
          { label: "Registered users", value: String(userCount), icon: Users },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-panel p-4">
            <s.icon size={15} className="text-brass" />
            <p className="text-[12px] mt-2 text-muted">{s.label}</p>
            <p className="text-[19px] mt-0.5 font-mono font-semibold text-text">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <span className="text-[13px] font-semibold text-text">Recent orders</span>
        </div>
        {orders.slice(0, 6).map((o, i, arr) => (
          <div key={o.id} className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-border2" : ""}`}>
            <div>
              <p className="text-[13px] text-text">{o.product_name}</p>
              <p className="text-[12px] mt-0.5 text-faint">{o.user_email}</p>
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
        {orders.length === 0 && <p className="text-[13px] text-muted px-5 py-6">No orders yet.</p>}
      </div>
    </>
  );
}
