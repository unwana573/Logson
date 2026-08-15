import React, { useState } from "react";
import { ShieldCheck, Copy, Check } from "lucide-react";
import { formatDate } from "../utils/format";

export default function OwnedProductCard({ item }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(item.credential).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted">
            {item.vendor} &middot; purchased {formatDate(item.purchased_at)}
          </p>
          <h3 className="font-display font-semibold text-[16px] mt-0.5 text-text">{item.product_name}</h3>
        </div>
        <ShieldCheck size={18} className="text-mint" />
      </div>

      <div className="mx-5 mb-5 border-t border-dashed border-border" />

      <div className="mx-5 mb-5 flex items-center gap-3">
        <div className="flex-1 rounded-lg px-3.5 py-3 overflow-x-auto bg-ink border border-border">
          <span className="text-[13px] tracking-wide whitespace-nowrap font-mono" style={{ color: "#E3C077" }}>
            {item.credential}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 rounded-lg px-3 py-3 flex items-center gap-1.5 text-[13px] font-medium ${
            copied ? "bg-[#1E2A22] text-mint" : "bg-[#242B39] text-text"
          }`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
