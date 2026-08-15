import React from "react";
import { KeyRound } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-brass">
        <KeyRound size={15} className="text-brass" />
      </div>
      <span className="font-display font-semibold text-[17px] text-text">Logson</span>
    </div>
  );
}
