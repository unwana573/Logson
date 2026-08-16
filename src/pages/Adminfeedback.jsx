import React, { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { feedbackService } from "../../services/feedbackService";
import { formatDate } from "../../utils/format";

export default function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    feedbackService
      .listAll()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[13px] text-muted">Loading&hellip;</p>;

  return (
    <div className="space-y-3">
      {error && <p className="text-[12px]" style={{ color: "#D8433F" }}>{error}</p>}
      {items.map((f) => (
        <div key={f.id} className="rounded-2xl border border-border bg-panel p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-faint">{f.user_email || "Anonymous"}</span>
            <span className="text-[11px] text-faint">{formatDate(f.created_at)}</span>
          </div>
          <p className="text-[13.5px] text-text leading-relaxed">{f.message}</p>
        </div>
      ))}
      {items.length === 0 && (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <MessageSquareText size={18} className="text-faint mx-auto mb-2" />
          <p className="text-[13px] text-muted">No feedback yet.</p>
        </div>
      )}
    </div>
  );
}