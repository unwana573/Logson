import React from "react";
import { Zap, ShieldCheck, CreditCard, Headset } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant delivery", body: "Keys land in your dashboard the moment payment clears, no waiting on email." },
  { icon: ShieldCheck, title: "Verified vendors", body: "Every listing is sourced and checked before it goes live on the store." },
  { icon: CreditCard, title: "Pay your way", body: "Check out with a manual bank transfer or straight through Paystack." },
  { icon: Headset, title: "Human support", body: "Real people answer activation issues, refunds, and account questions." },
];

export default function FeatureCards() {
  return (
    <div className="px-6 md:px-10 py-16 bg-ink">
      <div className="max-w-4xl mx-auto grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-panel p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 border border-border" style={{ background: "#20180D" }}>
              <f.icon size={16} className="text-brass" />
            </div>
            <h3 className="font-display font-semibold text-[15.5px] text-text">{f.title}</h3>
            <p className="text-[13px] mt-1.5 text-muted leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
