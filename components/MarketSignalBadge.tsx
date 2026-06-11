"use client";

import { getMarketSignal } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { MarketSignal } from "@/types";

interface MarketSignalBadgeProps {
  signal: MarketSignal;
  size?: "sm" | "md";
  glow?: boolean;
  className?: string;
}

/** Bold market-reading chip (Affiche brûlante, Match serré, Piège possible…). */
export function MarketSignalBadge({ signal, size = "md", glow, className }: MarketSignalBadgeProps) {
  const meta = getMarketSignal(signal);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border font-bold uppercase tracking-wide",
        size === "sm" ? "h-5 px-1.5 text-[9px]" : "h-7 px-2.5 text-[11px]",
        className,
      )}
      style={{
        color: `rgb(var(--${meta.accent}))`,
        backgroundColor: `rgb(var(--${meta.accent}) / 0.14)`,
        borderColor: `rgb(var(--${meta.accent}) / 0.45)`,
        boxShadow: glow ? `0 0 18px -4px rgb(var(--${meta.accent}) / 0.6)` : undefined,
      }}
    >
      <span className="text-xs leading-none">{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
