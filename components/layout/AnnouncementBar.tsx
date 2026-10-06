"use client";

import React, { useState } from "react";
import { X, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#171717] border-b border-[#242424] text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center flex items-center justify-center gap-2 text-[#F3EDE3]">
          <Sparkles className="w-3.5 h-3.5 text-[#A47551] shrink-0" />
          <span className="tracking-wide">
            Nationwide Delivery Available Across All 64 Districts • Free Exchanges on Size
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-zinc-500 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
