"use client";

import { formatOdd, getMarketSignal, marketFavorite } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";

/** Clean inline market readout for cards. Favorite shown in accent — no betting CTA. */
export function OddsStrip({ match, className }: { match: HydratedMatch; className?: string }) {
  const fav = marketFavorite(match);
  const sig = getMarketSignal(match.marketSignal);
  const SigIcon = sig.icon;

  return (
    <div className={cn("flex items-center gap-3 text-[12px]", className)}>
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Marché</span>
      <div className="flex items-center gap-2.5 tabular">
        <Odd code={match.home.id.toUpperCase()} odd={match.odds.home} hot={fav.side === "home"} accent={sig.accent} />
        <Odd code="N" odd={match.odds.draw} accent={sig.accent} />
        <Odd code={match.away.id.toUpperCase()} odd={match.odds.away} hot={fav.side === "away"} accent={sig.accent} />
      </div>
      <SigIcon size={14} strokeWidth={2.4} className="ml-auto shrink-0" style={{ color: `rgb(var(--${sig.accent}))` }} aria-label={sig.label} />
    </div>
  );
}

function Odd({ code, odd, hot, accent }: { code: string; odd: number; hot?: boolean; accent: string }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="text-[10px] font-bold" style={{ color: hot ? `rgb(var(--${accent}))` : "rgb(var(--faint))" }}>
        {code}
      </span>
      <span className={cn("font-semibold", hot ? "text-ink" : "text-muted")}>{formatOdd(odd)}</span>
    </span>
  );
}
