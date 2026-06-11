"use client";

import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  minute?: number;
  className?: string;
  size?: "sm" | "md";
}

/** Pulsing LIVE chip with optional live minute. */
export function LiveBadge({ minute, className, size = "md" }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-danger/45 bg-danger/15 font-bold uppercase tracking-wider text-danger shadow-glow-danger",
        size === "sm" ? "h-5 px-1.5 text-[9px]" : "h-6 px-2 text-[10px]",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
      </span>
      Live
      {minute != null && <span className="tabular">{minute}&apos;</span>}
    </span>
  );
}
