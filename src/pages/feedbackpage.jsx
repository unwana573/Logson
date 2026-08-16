import React, { useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { feedbackService } from "../services/feedbackService";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!message.trim()) {
      setError("Write something before sending.");
      return;
    }
    setSubmitting(true);
    try {
      await feedbackService.submit(message.trim());
      setMessage("");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <MessageSquareText size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">Feedback</h1>
      </div>
      <p className="text-[13px] mb-6 text-muted">
        Tell us what's working, what isn't, or what you'd like to see next. It goes
        straight to the team.
      </p>

      <div className="rounded-2xl border border-border bg-panel p-6" style={{ maxWidth: 560 }}>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setSent(false);
          }}
          placeholder="Share your thoughts..."
          rows={6}
          className="w-full rounded-lg px-3.5 py-3 outline-none text-[13.5px] resize-none bg-ink border border-border text-text"
        />

        {error && <p className="text-[12px] mt-3" style={{ color: "#D8433F" }}>{error}</p>}
        {sent && !error && (
          <p className="text-[12px] mt-3" style={{ color: "#6EE7B7" }}>
            Thanks — your feedback was sent.
          </p>
        )}

        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="mt-4 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[13px] font-semibold bg-brass text-brassDark disabled:opacity-60"
        >
          <Send size={14} />
          {submitting ? "Sending..." : "Send feedback"}
        </button>
      </div>
    </>
  );
}