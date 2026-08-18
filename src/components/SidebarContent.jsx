import React from "react";
import { NavLink } from "react-router-dom";
import { KeyRound, LogOut } from "lucide-react";
import { NAV_ITEMS, ADMIN_NAV_ITEM } from "../utils/constants";
import { useAuth } from "../hooks/useAuth.jsx";

// Shared sidebar body used by both the desktop <Sidebar> and the mobile
// slide-in <MobileNav>. onNavigate lets the drawer close itself on tap.
export default function SidebarContent({ onNavigate }) {
  const { user, signOut } = useAuth();
  const items = user?.is_admin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-7">
        <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-brass">
          <KeyRound size={15} className="text-brass" />
        </div>
        <span className="font-display font-semibold text-[16px] text-text">Logson</span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-[13.5px] ${
                isActive ? "bg-border2 text-text font-semibold" : "text-muted font-normal"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-5 border-t border-border2">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] text-faint">{user?.is_admin ? "Admin" : "Signed in as"}</p>
            <p className="text-[13px] mt-0.5 truncate text-text font-medium" style={{ maxWidth: 140 }}>
              {user?.email}
            </p>
          </div>
          <button onClick={signOut} aria-label="Sign out">
            <LogOut size={15} className="text-faint" />
          </button>
        </div>
      </div>
    </>
  );
}
