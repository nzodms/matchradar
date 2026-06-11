"use client";

import { getMarketRisk, getMarketSignal, marketBalance, marketFavorite, marketUpdatedLabel } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { Activity, Clock3 } from "lucide-react";
import { Flag } from "./Flag";
import { MarketSignalBadge } from "./MarketSignalBadge";
import { OddsPill } from "./OddsPill";
import { ResponsibleGamingNote } from "./ResponsibleGamingNote";

/** Premium, calm market readout. Informational signal only — no bet CTA. */
export function MarketPulseCard({ match, className }: { match: HydratedMatch; className?: string }) {
  const sig = getMarketSignal(match.marketSignal);
  const fav = marketFavorite(match);
  const balance = marketBalance(match.odds);
  const risk = getMarketRisk(match);
  const favTeam = fav.side === "home" ? match.home : fav.side === "away" ? match.away : null;

  return (
    <div className={cn("card rounded-3xl p-4", className)}>
      {/* header */}
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/12 text-gold ring-1 ring-gold/20">
            <Activity size={15} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold text-ink">Market Pulse</p>
            <p className="text-[11px] text-faint">Le marché voit quoi ?</p>
          </div>
        </div>
        <MarketSignalBadge signal={match.marketSignal} />
      </div>

      {/* odds */}
      <div className="flex gap-2">
        <OddsPill label={match.home.id.toUpperCase()} odd={match.odds.home} favorite={fav.side === "home"} accent="gold" />
        <OddsPill label="Nul" odd={match.odds.draw} accent="gold" />
        <OddsPill label={match.away.id.toUpperCase()} odd={match.odds.away} favorite={fav.side === "away"} accent="gold" />
      </div>

      {/* favorite + balance */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">Favori du marché</p>
          {favTeam ? (
            <p className="mt-1 flex items-center gap-1.5 font-display text-sm font-bold text-ink">
              <Flag cc={favTeam.countryCode} size={18} ring={false} />
              <span className="truncate">{favTeam.name}</span>
              <span className="text-[11px] font-semibold tabular text-gold">{fav.prob}%</span>
            </p>
          ) : (
            <p className="mt-1 font-display text-sm font-bold text-ink">Marché partagé</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">Équilibre</p>
            <span className="text-[11px] font-bold tabular" style={{ color: `rgb(var(--${risk.accent}))` }}>{risk.label}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/10">
            <div className="h-full rounded-full" style={{ width: `${balance}%`, background: `rgb(var(--${risk.accent}))` }} />
          </div>
        </div>
      </div>

      {/* analysis */}
      <p className="mt-3.5 text-[13px] leading-relaxed text-muted">{match.marketCopy}</p>

      {/* footer */}
      <div className="mt-3 flex items-center gap-1 border-t border-line/6 pt-2.5 text-[10.5px] text-faint">
        <Clock3 size={11} />
        Mis à jour {marketUpdatedLabel(match.marketUpdatedMinAgo)}
        <span className="ml-auto">Cotes indicatives</span>
      </div>

      <ResponsibleGamingNote className="mt-2.5 border-0 bg-transparent p-0" compact />
    </div>
  );
}
