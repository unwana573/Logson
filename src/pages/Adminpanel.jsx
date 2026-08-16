import React, { useState } from "react";
import { Settings } from "lucide-react";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminPayments from "./AdminPayments";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminFeedback from "./AdminFeedback";

const TABS = [
  { id: "overview", label: "Overview", Component: AdminOverview },
  { id: "users", label: "Users", Component: AdminUsers },
  { id: "payments", label: "Payments", Component: AdminPayments },
  { id: "products", label: "Products", Component: AdminProducts },
  { id: "categories", label: "Categories", Component: AdminCategories },
  { id: "feedback", label: "Feedback", Component: AdminFeedback },
];

export default function AdminPanel() {
  const [tab, setTab] = useState("overview");
  const Active = TABS.find((t) => t.id === tab).Component;

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <Settings size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">Admin panel</h1>
      </div>
      <p className="text-[13px] mb-5 text-muted">Manage users, payments, products, and categories.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="text-[12.5px] px-3.5 py-1.5 rounded-full transition-colors"
            style={{
              background: tab === t.id ? "#C6A15B" : "#171B24",
              color: tab === t.id ? "#1A140B" : "#9AA1B4",
              border: tab === t.id ? "none" : "1px solid #262C3A",
              fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Active />
    </>
  );
}