import React from "react";
import { X } from "lucide-react";
import SidebarContent from "./SidebarContent";

// Mobile-only slide-in navigation drawer. Hidden at md+ where the fixed
// <Sidebar> takes over. Backdrop tap or nav tap closes it.
export default function MobileNav({ open, onClose }) {
  return (
    <div className={`md:hidden fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={`absolute inset-y-0 left-0 w-[260px] max-w-[80%] flex flex-col bg-panel2 border-r border-border2 shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-4 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-faint"
        >
          <X size={18} />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
