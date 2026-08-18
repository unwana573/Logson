import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/products" },
];

const SUPPORT_EMAIL = "support@logson.ng";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="sticky top-0 z-20 bg-ink/85 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
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
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden text-text"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden px-6 pb-3 flex flex-col border-t border-border">
          {NAV_LINKS.map((l) => (
            <button key={l.label} onClick={() => go(l.path)} className="text-left text-[14px] py-2.5 text-muted">
              {l.label}
            </button>
          ))}
          <a href={`mailto:${SUPPORT_EMAIL}`} onClick={() => setOpen(false)} className="text-[14px] py-2.5 text-muted">
            Support
          </a>
          <button onClick={() => go("/signin")} className="text-left text-[14px] py-2.5 text-muted">
            Sign in
          </button>
        </nav>
      )}
    </div>
  );
}
