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
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide",
        size === "sm" ? "h-[22px] px-2 text-[10px]" : "h-7 px-2.5 text-[11px]",
        className,
      )}
      style={{
        color: `rgb(var(--${meta.accent}))`,
        backgroundColor: `rgb(var(--${meta.accent}) / 0.1)`,
        borderColor: `rgb(var(--${meta.accent}) / 0.26)`,
        boxShadow: glow ? `0 0 18px -8px rgb(var(--${meta.accent}) / 0.45)` : undefined,
      }}
    >
      <Icon size={size === "sm" ? 11 : 12} strokeWidth={2.4} />
      {meta.label}
    </span>
  );
}
