import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import AdminPanel from "../components/admin/AdminPanel";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Client-side gate for a clean redirect -- the real enforcement lives in
  // the backend (every admin route depends on get_current_admin), so even
  // if someone bypasses this check, the API calls inside AdminPanel's
  // children will fail with 403.
  if (!user?.is_admin) return <Navigate to="/dashboard/products" replace />;

  return <AdminPanel />;
}
