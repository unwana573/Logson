import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import { useCart } from "../hooks/useCart.jsx";
import { OrderListSkeleton } from "../components/Skeleton";
import { formatNaira, formatDate } from "../utils/format";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // order currently mid-action
  const [error, setError] = useState("");

  const load = () => orderService.myOrders().then(setOrders);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  // "Buy again": an order only carries the product name/id, not live
  // pricing or stock -- so pull the current product, drop it in the cart at
  // the same quantity, and send them to checkout.
  const handleAddToCart = async (order) => {
    setError("");
    setBusyId(order.id);
    try {
      const product = await productService.get(order.product_id);
      addItem(product, order.quantity);
      navigate("/dashboard/cart");
    } catch (err) {
      setError(err.status === 404 ? "That product isn't available anymore." : err.message);
    } finally {
      setBusyId(null);
    }
  };

  // Remove an order they changed their mind about. Optimistic -- put the
  // row back and refetch the truth if the server rejects it.
  const handleDelete = async (order) => {
    setError("");
    setBusyId(order.id);
    const prev = orders;
    setOrders((os) => os.filter((o) => o.id !== order.id));
    try {
      await orderService.remove(order.id);
    } catch (err) {
      setOrders(prev);
      setError(err.message);
      load().catch(() => {});
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">My orders</h1>
      </div>
      <p className="text-[13px] mb-6 text-muted">Every purchase you've made, and where it stands.</p>

      {error && <p className="text-[12px] mb-3" style={{ color: "#D8433F" }}>{error}</p>}

      {loading ? (
        <OrderListSkeleton />
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <p className="text-[13px] text-muted">No orders yet. Products you buy will show up here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          {orders.map((o, i) => {
            const busy = busyId === o.id;
            return (
              <div
                key={o.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-5 py-3.5 ${i < orders.length - 1 ? "border-b border-border2" : ""}`}
              >
                <div className="min-w-0">
                  <p className="text-[13px] text-text truncate">
                    {o.product_name} &times; {o.quantity}
                  </p>
                  <p className="text-[12px] mt-0.5 text-faint">
                    {o.payment_method === "manual" ? "Manual transfer" : "Paga"} &middot; {formatDate(o.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
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

                  <div className="flex items-center gap-1.5 ml-1">
                    <button
                      onClick={() => handleAddToCart(o)}
                      disabled={busy}
                      aria-label="Add to cart and buy"
                      title={o.status === "success" ? "Buy again" : "Add to cart and pay"}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-brass text-brassDark disabled:opacity-50"
                    >
                      {busy ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                    </button>

                    {o.status !== "success" && (
                      <button
                        onClick={() => handleDelete(o)}
                        disabled={busy}
                        aria-label="Delete order"
                        title="Remove order"
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-faint transition-colors hover:text-accentRed hover:border-accentRed disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
