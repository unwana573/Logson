import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full flex bg-ink" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main className="flex-1 min-w-0">
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="px-6 md:px-8 py-6">
          <Outlet context={{ searchQuery }} />
        </div>
      </main>
    </div>
  );
}
