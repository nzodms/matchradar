"use client";

import { formatOdd, getMarketSignal, marketFavorite } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { Activity } from "lucide-react";

/** Compact one-line market readout for match cards. Hype stays the headline. */
export function OddsStrip({ match, className }: { match: HydratedMatch; className?: string }) {
  const fav = marketFavorite(match);
  const sig = getMarketSignal(match.marketSignal);
  const homeCode = match.home.id.toUpperCase();
  const awayCode = match.away.id.toUpperCase();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-xl border border-line/8 bg-bg/40 px-2 py-1.5",
        className,
      )}
    >
      <Activity size={12} className="shrink-0 text-gold" />
      <span className="text-[9px] font-bold uppercase tracking-wide text-faint">Pulse</span>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tabular text-muted">
        <OddBit code={homeCode} odd={match.odds.home} hot={fav.side === "home"} />
        <span className="text-faint/60">·</span>
        <OddBit code="N" odd={match.odds.draw} />
        <span className="text-faint/60">·</span>
        <OddBit code={awayCode} odd={match.odds.away} hot={fav.side === "away"} />
      </div>
      <span
        className="ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
        style={{
          color: `rgb(var(--${sig.accent}))`,
          background: `rgb(var(--${sig.accent}) / 0.14)`,
        }}
      >
        {sig.emoji} {sig.label}
      </span>
    </div>
  );
}

function OddBit({ code, odd, hot }: { code: string; odd: number; hot?: boolean }) {
  return (
    <span className={cn(hot && "text-ink")}>
      <span className={cn(hot ? "text-gold" : "text-faint")}>{code}</span> {formatOdd(odd)}
    </span>
  );
}
