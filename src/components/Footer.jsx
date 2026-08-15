import React from "react";
import { MessageCircle, Music2, Twitter, Mail } from "lucide-react";
import Logo from "./Logo";

const COLUMNS = [
  { title: "Product", items: ["Browse products", "Categories", "My orders"] },
  { title: "Company", items: ["Support", "Rules", "Contact"] },
  { title: "Legal", items: ["Terms of service", "Refund policy", "Privacy"] },
];

export default function Footer() {
  return (
    <div className="px-6 md:px-10 pt-14 pb-8" style={{ background: "#0F1219", borderTop: "1px solid #262C3A" }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8 mb-10" style={{ gridTemplateColumns: "1.4fr 1fr 1fr 1fr" }}>
          <div>
            <Logo />
            <p className="text-[12.5px] mt-3 text-faint leading-relaxed" style={{ maxWidth: 240 }}>
              Verified software licenses, delivered to your dashboard the moment you pay.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] uppercase tracking-wider mb-3 text-faint">{col.title}</p>
              <div className="space-y-2">
                {col.items.map((it) => (
                  <p key={it} className="text-[13px] text-muted cursor-pointer">
                    {it}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border">
          <span className="text-[12px] text-faint">&copy; 2026 Logson. All rights reserved.</span>
          <div className="flex items-center gap-3">
            {[MessageCircle, Music2, Twitter, Mail].map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center bg-panel border border-border">
                <Icon size={14} className="text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
