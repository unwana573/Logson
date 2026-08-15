import React from "react";
import { MessageCircle, Music2 } from "lucide-react";

// Replace with your real WhatsApp group invite link and TikTok handle.
const COMMUNITY = [
  { icon: MessageCircle, name: "WhatsApp community", body: "Get restock alerts and support in the group chat.", href: "https://chat.whatsapp.com/" },
  { icon: Music2, name: "TikTok", body: "Product walkthroughs and activation tips.", href: "https://www.tiktok.com/" },
];

export default function CommunitySlider() {
  const loop = [...COMMUNITY, ...COMMUNITY, ...COMMUNITY];

  return (
    <div className="py-16 overflow-hidden bg-ink">
      <div className="px-6 md:px-10 max-w-4xl mx-auto mb-7">
        <h2 className="font-display font-semibold text-[24px] text-text">Join the community</h2>
        <p className="text-[13.5px] mt-1 text-muted">Restock alerts, tips, and support outside the dashboard.</p>
      </div>

      <div className="relative">
        <div className="flex gap-4 logson-track" style={{ width: "max-content", paddingLeft: 24, paddingRight: 24 }}>
          {loop.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-2xl border border-border bg-panel p-5 flex items-center gap-4 no-underline"
              style={{ width: 300 }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 border border-border" style={{ background: "#20180D" }}>
                <c.icon size={18} className="text-brass" />
              </div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-text">{c.name}</p>
                <p className="text-[12px] mt-0.5 text-faint leading-snug">{c.body}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
