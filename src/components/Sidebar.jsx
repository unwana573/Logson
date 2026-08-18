import React from "react";
import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col shrink-0 bg-panel2 border-r border-border2" style={{ width: 216 }}>
      <SidebarContent />
    </aside>
  );
}
