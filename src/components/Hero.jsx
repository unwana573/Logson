import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const STATS = [
  ["1,400+", "keys delivered"],
  ["98%", "instant activation"],
  ["24/7", "support"],
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden px-6 md:px-10 pt-20 pb-24 bg-ink">
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          top: -160,
          left: -120,
          width: 480,
          height: 480,
          background: "#3B6BE0",
          opacity: 0.28,
          filter: "blur(110px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          top: -60,
          right: -140,
          width: 520,
          height: 520,
          background: "#D8433F",
          opacity: 0.26,
          filter: "blur(120px)",
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <span className="inline-block text-[11.5px] px-3 py-1.5 rounded-full mb-6 bg-panel border border-border text-muted">
          Genuine licenses, delivered instantly
        </span>
        <h1 className="font-display font-semibold text-[42px] leading-[1.15] tracking-tight text-text">
          Software licenses, without the wait
        </h1>
        <p className="text-[15px] mt-4 mx-auto text-muted leading-relaxed max-w-[460px]">
          Buy verified keys for the tools you already run &mdash; delivered to your dashboard
          the second your payment clears.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => navigate("/signup")}
            className="text-[13.5px] px-5 py-3 rounded-lg flex items-center gap-2 bg-brass text-brassDark font-semibold"
          >
            Browse products
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-[13.5px] px-5 py-3 rounded-lg border border-border text-text font-medium"
          >
            Create account
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 mt-12">
          {STATS.map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="font-mono font-semibold text-[18px] text-text">{num}</p>
              <p className="text-[11.5px] mt-0.5 text-faint">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
