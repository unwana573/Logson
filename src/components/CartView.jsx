import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Building2, CreditCard, UploadCloud } from "lucide-react";
import { formatNaira } from "../utils/format";
import { BANK_DETAILS } from "../utils/constants";
import { useCart } from "../hooks/useCart.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { orderService } from "../services/orderService";

export default function CartView() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, total } = useCart();
  const { refreshUser } = useAuth();

  const [method, setMethod] = useState("manual");
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    setError("");
    if (method === "manual") {
      if (!proofFile) {
        setError("Attach a proof-of-payment image before submitting.");
        return;
      }
      if (proofFile.size > 5 * 1024 * 1024) {
        setError("Proof image must be 5 MB or smaller.");
        return;
      }
    }

    setSubmitting(true);
    try {
      // Orders are created per product server-side, so a multi-item cart
      // becomes one order per line item.
      for (const item of items) {
        const order = await orderService.create({
          productId: item.product.id,
          quantity: item.qty,
          paymentMethod: method,
        });

        if (method === "manual") {
          // Second step: attach the proof image to the order we just made.
          await orderService.uploadProof(order.id, proofFile);
        }

        if (method === "paga") {
          const init = await orderService.pagaInit(order.id);
          // Redirect to Paga's payment link; Paga's webhook confirms
          // payment and fulfils the order automatically on their end,
          // no polling required from here.
          if (init.web_payment_link) {
            window.location.href = init.web_payment_link;
            return;
          }
          setError("Paga didn't return a payment link. Try again in a moment.");
          return;
        }
      }

      clearCart();
      await refreshUser().catch(() => {});
      navigate("/dashboard/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <ShoppingCart size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">Checkout</h1>
      </div>
      <p className="text-[13px] mb-6 text-muted">Review your cart, then pay by bank transfer or Paga.</p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <p className="text-[13px] text-muted">Your cart is empty. Add a product to get started.</p>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="mt-4 text-[13px] px-4 py-2 rounded-lg bg-brass text-brassDark font-semibold"
          >
            Browse products
          </button>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-border bg-panel overflow-hidden self-start">
            {items.map((c, i) => (
              <div
                key={c.product.id}
                className={`flex items-center gap-3 px-5 py-3.5 ${i < items.length - 1 ? "border-b border-border2" : ""}`}
              >
                {c.product.image_url && (
                  <img src={c.product.image_url} alt={c.product.name} className="rounded-lg object-cover shrink-0" style={{ width: 52, height: 40 }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] truncate text-text">{c.product.name}</p>
                  <p className="text-[12px] text-faint">
                    Qty {c.qty} &middot; {formatNaira(c.product.price_kobo)} each
                  </p>
                </div>
                <span className="text-[13.5px] font-mono font-semibold text-text">
                  {formatNaira(c.product.price_kobo * c.qty)}
                </span>
                <button onClick={() => removeItem(c.product.id)} aria-label="Remove item">
                  <X size={14} className="text-faint" />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "#141822" }}>
              <span className="text-[13px] text-muted">Total</span>
              <span className="text-[17px] font-mono font-semibold text-text">{formatNaira(total)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-panel p-5 self-start">
            <p className="text-[13px] mb-3 font-semibold text-text">Payment method</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setMethod("manual")}
                className={`rounded-lg px-3 py-2.5 flex items-center gap-2 text-[12.5px] border ${
                  method === "manual" ? "border-brass text-brass" : "border-border text-muted"
                }`}
                style={{ background: method === "manual" ? "#20180D" : "#0C0E14" }}
              >
                <Building2 size={14} />
                Manual transfer
              </button>
              <button
                onClick={() => setMethod("paga")}
                className={`rounded-lg px-3 py-2.5 flex items-center gap-2 text-[12.5px] border ${
                  method === "paga" ? "border-brass text-brass" : "border-border text-muted"
                }`}
                style={{ background: method === "paga" ? "#20180D" : "#0C0E14" }}
              >
                <CreditCard size={14} />
                Paga
              </button>
            </div>

            {method === "manual" ? (
              <div>
                <div className="rounded-lg px-3.5 py-3 space-y-1.5 mb-3 bg-ink border border-border">
                  {[
                    ["Bank", BANK_DETAILS.bank],
                    ["Account number", BANK_DETAILS.account],
                    ["Account name", BANK_DETAILS.name],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between">
                      <span className="text-[11.5px] text-faint">{l}</span>
                      <span className="text-[12.5px] font-mono text-text">{v}</span>
                    </div>
                  ))}
                </div>

                <label className="text-[11px] text-faint">Proof of payment (image)</label>
                <label className="mt-1 mb-3 flex items-center gap-2 rounded-lg px-3.5 bg-ink border border-border cursor-pointer" style={{ height: 44 }}>
                  <UploadCloud size={15} className="text-faint shrink-0" />
                  <span className={`flex-1 truncate text-[13px] ${proofFile ? "text-text" : "text-faint"}`}>
                    {proofFile ? proofFile.name : "Choose an image (JPEG, PNG, WEBP)"}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>

                {error && <p className="text-[12px] mb-2" style={{ color: "#D8433F" }}>{error}</p>}

                <button
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="w-full h-10 rounded-lg text-[13px] font-semibold bg-brass text-brassDark disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit for approval"}
                </button>
                <p className="text-[11px] mt-2 text-faint">
                  An admin reviews your proof and releases your keys once confirmed.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[12.5px] mb-3 text-muted leading-relaxed">
                  You'll be redirected to Paga to complete payment securely -- by bank
                  transfer, USSD, or card, whichever you prefer once there.
                </p>
                {error && <p className="text-[12px] mb-2" style={{ color: "#D8433F" }}>{error}</p>}
                <button
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="w-full h-10 rounded-lg text-[13px] font-semibold bg-brass text-brassDark disabled:opacity-60"
                >
                  {submitting ? "Starting..." : `Pay ${formatNaira(total)} with Paga`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}