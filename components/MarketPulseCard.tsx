"use client";

import {
  getMarketRisk,
  getMarketSignal,
  marketBalance,
  marketFavorite,
  marketUpdatedLabel,
} from "@/lib/market";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { Activity, Clock3 } from "lucide-react";
import { MarketSignalBadge } from "./MarketSignalBadge";
import { OddsPill } from "./OddsPill";
import { ResponsibleGamingNote } from "./ResponsibleGamingNote";

/** Big, Winamax-energy market readout. Informational signal only — no bet CTA. */
export function MarketPulseCard({ match, className }: { match: HydratedMatch; className?: string }) {
  const sig = getMarketSignal(match.marketSignal);
  const fav = marketFavorite(match);
  const balance = marketBalance(match.odds);
  const risk = getMarketRisk(match);
  const accent = sig.accent;

  const favTeam = fav.side === "home" ? match.home : fav.side === "away" ? match.away : null;

  return (
    <div
      className={cn("card-arcade sheen relative overflow-hidden rounded-3xl p-4", className)}
      style={{ boxShadow: `0 0 0 1px rgb(var(--${accent}) / 0.28), 0 26px 52px -28px rgb(var(--${accent}) / 0.45)` }}
    >
      <span
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{ background: `rgb(var(--${accent}) / 0.22)` }}
      />

      {/* header */}
      <div className="relative mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 font-display text-base font-bold tracking-tight">
            <Activity size={16} style={{ color: `rgb(var(--${accent}))` }} />
            <span className="text-gradient-hype">Market Pulse</span>
          </p>
          <p className="text-[11px] text-muted">Le marché voit quoi ?</p>
        </div>
        <MarketSignalBadge signal={match.marketSignal} glow />
      </div>

      {/* odds */}
      <div className="relative flex gap-2">
        <OddsPill label={match.home.id.toUpperCase()} odd={match.odds.home} favorite={fav.side === "home"} accent={accent} />
        <OddsPill label="Nul" odd={match.odds.draw} accent={accent} />
        <OddsPill label={match.away.id.toUpperCase()} odd={match.odds.away} favorite={fav.side === "away"} accent={accent} />
      </div>

      {/* favorite + balance */}
      <div className="relative mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-line/8 bg-bg/40 p-2.5">
          <p className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Favori du marché</p>
          {favTeam ? (
            <p className="mt-0.5 flex items-center gap-1.5 font-display text-sm font-bold text-ink">
              <span>{favTeam.flag}</span>
              {favTeam.name}
              <span className="text-[11px] font-semibold tabular" style={{ color: `rgb(var(--${accent}))` }}>
                {fav.prob}%
              </span>
            </p>
          ) : (
            <p className="mt-0.5 font-display text-sm font-bold text-ink">⚖️ Marché partagé</p>
          )}
        </div>
        <div className="rounded-xl border border-line/8 bg-bg/40 p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Équilibre</p>
            <span className="text-[11px] font-bold tabular" style={{ color: `rgb(var(--${risk.accent}))` }}>
              {balance}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${balance}%`, background: `rgb(var(--${risk.accent}))`, boxShadow: `0 0 8px -1px rgb(var(--${risk.accent}))` }}
            />
          </div>
          <p className="mt-1 text-[9.5px] font-semibold" style={{ color: `rgb(var(--${risk.accent}))` }}>
            {risk.label}
          </p>
        </div>
      </div>

      {/* analysis */}
      <p
        className="relative mt-3 rounded-xl border-l-2 py-1 pl-2.5 text-[12.5px] leading-snug text-ink/90"
        style={{ borderColor: `rgb(var(--${accent}))` }}
      >
        {match.marketCopy}
      </p>

      {/* footer */}
      <div className="relative mt-3 flex items-center gap-1 text-[10px] text-faint">
        <Clock3 size={11} />
        Mis à jour {marketUpdatedLabel(match.marketUpdatedMinAgo)}
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-faint">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" /> Cotes indicatives
        </span>
      </div>

      <ResponsibleGamingNote className="relative mt-2.5" compact />
    </div>
  );
}
