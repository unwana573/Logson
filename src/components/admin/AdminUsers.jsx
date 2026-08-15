import React, { useEffect, useState } from "react";
import { userService } from "../../services/orderService";
import { formatDate } from "../../utils/format";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    userService
      .list()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // The "Make admin" button only exists here, and this whole tab only
  // renders for a signed-in admin (see DashboardLayout / AdminPanel). The
  // backend re-checks the same rule server-side in PATCH /users/{id}/role,
  // so this button is a convenience, not the actual security boundary.
  const handleMakeAdmin = async (id) => {
    try {
      await userService.updateRole(id, true);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (id, nextActive) => {
    try {
      await userService.updateStatus(id, nextActive);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-[13px] text-muted">Loading&hellip;</p>;

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      {error && <p className="text-[12px] px-5 py-3" style={{ color: "#D8433F" }}>{error}</p>}
      <div
        className="grid px-5 py-3 text-[11px] uppercase tracking-wider text-faint border-b border-border"
        style={{ gridTemplateColumns: "1.2fr 1.4fr 0.9fr 0.9fr 0.9fr" }}
      >
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      {users.map((u, i) => (
        <div
          key={u.id}
          className={`grid items-center px-5 py-3.5 ${i < users.length - 1 ? "border-b border-border2" : ""}`}
          style={{ gridTemplateColumns: "1.2fr 1.4fr 0.9fr 0.9fr 0.9fr" }}
        >
          <span className="text-[13px] text-text">{u.full_name}</span>
          <span className="text-[13px] truncate text-muted">{u.email}</span>
          <span
            className="text-[11px] px-2.5 py-1 rounded-full w-fit font-medium"
            style={{ background: u.is_admin ? "#20180D" : "#232A38", color: u.is_admin ? "#C6A15B" : "#9AA1B4" }}
          >
            {u.is_admin ? "Admin" : "User"}
          </span>
          <button
            onClick={() => handleToggleActive(u.id, !u.is_active)}
            disabled={u.id === currentUser?.id}
            className="text-[11px] px-3 py-1.5 rounded-full w-fit font-medium disabled:opacity-50"
            style={{ background: u.is_active ? "#1E2A22" : "#2A2A2A", color: u.is_active ? "#6EE7B7" : "#656C80" }}
          >
            {u.is_active ? "Active" : "Inactive"}
          </button>
          <div className="flex justify-end">
            {!u.is_admin ? (
              <button
                onClick={() => handleMakeAdmin(u.id)}
                className="text-[11px] px-2.5 py-1.5 rounded-lg border border-border text-muted"
              >
                Make admin
              </button>
            ) : (
              <span className="text-[11px] text-faint">&mdash;</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
