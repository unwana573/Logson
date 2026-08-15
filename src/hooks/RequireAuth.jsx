import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth.jsx";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center bg-ink" style={{ minHeight: "100vh" }}>
        <p className="text-[13px] text-muted">Loading&hellip;</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;

  return children;
}
