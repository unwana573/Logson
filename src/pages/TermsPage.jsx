import React from "react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <FileText size={16} className="text-brass" />
        <h1 className="font-display font-semibold text-[22px] text-text">Terms of service</h1>
      </div>
      <p className="text-[13px] mb-6 text-muted">Last updated August 2026.</p>

      <div className="rounded-2xl border border-border bg-panel p-6 space-y-4">
        <p className="text-[13.5px] text-muted leading-relaxed">
          By creating an account and purchasing from Logson, you agree that all license keys sold
          are for legitimate use with the software they're licensed for, and that Logson is not
          responsible for third-party vendor policy changes affecting activation.
        </p>
        <p className="text-[13.5px] text-muted leading-relaxed">
          Payments made via manual bank transfer are reviewed and approved by an admin. Payments
          made via Paga are verified automatically once Paga confirms the transaction.
        </p>
      </div>
    </>
  );
}