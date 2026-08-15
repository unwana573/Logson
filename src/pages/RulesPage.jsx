import React from "react";
import { ScrollText } from "lucide-react";

export default function RulesPage() {
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <ScrollText size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">Rules</h1>
      </div>
      <p className="text-[13px] mb-6 text-muted">Keep the store fair for everyone.</p>

      <div className="rounded-2xl border border-border bg-panel p-6 space-y-4">
        {[
          "One key activates one device unless the listing says otherwise.",
          "Resale of your purchased key outside your own use isn't covered by support.",
          "Manual transfer orders are approved within a few hours during business hours.",
          "Refunds are only issued for keys that fail to activate after troubleshooting with support.",
        ].map((rule, i) => (
          <p key={i} className="text-[13.5px] text-muted leading-relaxed">
            {i + 1}. {rule}
          </p>
        ))}
      </div>
    </>
  );
}
