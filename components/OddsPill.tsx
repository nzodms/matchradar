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

/** Clean 1-N-2 odds block (informational only). Favorite gets a subtle accent. */
export function OddsPill({ label, odd, favorite, accent = "gold", className }: OddsPillProps) {
  return (
    <div
      className={cn("flex-1 rounded-2xl border px-2 py-2.5 text-center transition-colors", className)}
      style={
        favorite
          ? { borderColor: `rgb(var(--${accent}) / 0.32)`, background: `rgb(var(--${accent}) / 0.08)` }
          : { borderColor: "rgb(var(--line) / 0.08)", background: "rgb(var(--bg) / 0.4)" }
      }
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: favorite ? `rgb(var(--${accent}))` : "rgb(var(--faint))" }}>
        {label}
      </p>
      <p className="mt-0.5 font-display text-[17px] font-bold leading-none tabular text-ink">{formatOdd(odd)}</p>
    </div>
  );
}
