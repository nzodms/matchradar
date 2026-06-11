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
        "inline-flex items-center gap-1.5 rounded-full border border-danger/26 bg-danger/10 font-semibold uppercase tracking-wide text-danger",
        size === "sm" ? "h-[22px] px-2 text-[10px]" : "h-7 px-2.5 text-[11px]",
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
