import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { orderService } from "../../services/orderService";
import { formatNaira } from "../../utils/format";

export default function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    orderService
      .listAll()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (id) => {
    try {
      await orderService.approve(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-[13px] text-muted">Loading&hellip;</p>;

  return (
    <div className="space-y-3">
      {error && <p className="text-[12px]" style={{ color: "#D8433F" }}>{error}</p>}
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-panel p-4 flex items-center gap-4">
          {o.proof_url ? (
            <img src={o.proof_url} alt="Payment proof" className="rounded-lg shrink-0 object-cover border border-border" style={{ width: 44, height: 56 }} />
          ) : (
            <div className="rounded-lg shrink-0 flex items-center justify-center bg-ink border border-border" style={{ width: 44, height: 56 }}>
              <CreditCard size={15} className="text-faint" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-text">{o.product_name}</p>
            <p className="text-[12px] mt-0.5 text-faint">
              {o.user_email} &middot; {o.payment_method === "manual" ? "Manual transfer" : "Paystack"}
            </p>
          </div>
          <span className="text-[13.5px] shrink-0 font-mono font-semibold text-text">{formatNaira(o.amount_kobo)}</span>
          {o.status === "pending" ? (
            o.payment_method === "manual" ? (
              <button onClick={() => handleApprove(o.id)} className="shrink-0 text-[12px] px-3.5 py-2 rounded-lg bg-brass text-brassDark font-semibold">
                Approve
              </button>
            ) : (
              <span className="shrink-0 text-[11px] px-3 py-1.5 rounded-full font-medium" style={{ background: "#3A241B", color: "#E39A6B" }}>
                Awaiting Paystack
              </span>
            )
          ) : (
            <span
              className="shrink-0 text-[11px] px-3 py-1.5 rounded-full font-medium"
              style={{
                background: o.status === "success" ? "#1E2A22" : "#3A241B",
                color: o.status === "success" ? "#6EE7B7" : "#E39A6B",
              }}
            >
              {o.status}
            </span>
          )}
        </div>
      ))}
      {orders.length === 0 && (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <p className="text-[13px] text-muted">No payments yet.</p>
        </div>
      )}
    </div>
  );
}
