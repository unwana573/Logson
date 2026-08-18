import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/products" },
];

const SUPPORT_EMAIL = "support@logson.ng";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 sticky top-0 z-10 bg-ink/85 backdrop-blur-md border-b border-border">
      <Logo />
      <nav className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map((l) => (
          <button
            key={l.label}
            onClick={() => navigate(l.path)}
            className="text-[13.5px] text-muted hover:text-text transition-colors"
          >
            {l.label}
          </button>
        ))}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[13.5px] text-muted hover:text-text transition-colors">
          Support
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/signin")} className="text-[13.5px] hidden sm:inline text-muted">
          Sign in
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="text-[13px] px-4 py-2 rounded-lg bg-brass text-brassDark font-semibold"
        >
          Get started
        </button>
      </div>
    </div>
  );
}