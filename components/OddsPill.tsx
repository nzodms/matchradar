"use client";

import { formatOdd } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { AccentToken } from "@/types";

interface OddsPillProps {
  label: string;
  odd: number;
  favorite?: boolean;
  accent?: AccentToken;
  className?: string;
}

/**
 * Big, instantly-readable 1-N-2 odds block (informational only — no bet action).
 * The market favorite gets the accent glow.
 */
export function OddsPill({ label, odd, favorite, accent = "gold", className }: OddsPillProps) {
  return (
    <div
      className={cn(
        "relative flex-1 rounded-xl border px-2 py-2 text-center transition-colors",
        favorite ? "" : "border-line/10 bg-bg/50",
        className,
      )}
      style={
        favorite
          ? {
              borderColor: `rgb(var(--${accent}) / 0.5)`,
              background: `rgb(var(--${accent}) / 0.12)`,
              boxShadow: `0 0 18px -6px rgb(var(--${accent}) / 0.55)`,
            }
          : undefined
      }
    >
      <p
        className="text-[9.5px] font-bold uppercase tracking-wide"
        style={{ color: favorite ? `rgb(var(--${accent}))` : "rgb(var(--faint))" }}
      >
        {label}
      </p>
      <p className="font-display text-lg font-bold leading-none tabular text-ink">{formatOdd(odd)}</p>
    </div>
  );
}
