"use client";

import { useTimezone } from "@/components/Providers";
import { broadcasterLabel } from "@/lib/data-sources/broadcastersProvider";
import { displayTime } from "@/lib/datetime";
import { getHypeTier } from "@/lib/hype";
import { marketFavorite } from "@/lib/market";
import type { HydratedMatch } from "@/types";
import { ArrowRight } from "lucide-react";
import { HypeScore } from "./HypeScore";
import { LiveBadge } from "./LiveBadge";
import { MarketSignalBadge } from "./MarketSignalBadge";
import { MatchStatusBadge } from "./MatchStatusBadge";
import { OddsPill } from "./OddsPill";
import { TeamCrest } from "./TeamCrest";
import { ActionButton, AddCalendarButton, CopyBriefButton } from "./actions";

/** The hero affiche — premium, calm, one accent. The screen-record star. */
export function HotMatchHero({ match, eyebrow = "Le match à ne pas rater ce soir" }: { match: HydratedMatch; eyebrow?: string }) {
  const { tzId } = useTimezone();
  const tier = getHypeTier(match.hypeScore);
  const accent = tier.accent;
  const isLive = match.status === "live";
  const { time, dayShift } = displayTime(match.time, tzId);
  const fav = marketFavorite(match);

  return (
    <div className="card-arcade relative overflow-hidden rounded-[1.75rem] p-5">
      {/* single soft accent wash */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: `radial-gradient(80% 100% at 50% 0%, rgb(var(--${accent}) / 0.14), transparent 70%)` }}
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow" style={{ color: `rgb(var(--${accent}))` }}>{eyebrow}</p>
          {isLive ? <LiveBadge minute={match.liveMinute} /> : <MatchStatusBadge badge={match.tags[0]} />}
        </div>

        <p className="mt-2 text-center text-[13px] font-medium italic text-muted">« {match.emotionalTag} »</p>

        {/* teams + hype */}
        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <TeamCrest team={match.home} align="center" size="lg" showRank className="min-w-0" />
          <div className="flex flex-col items-center">
            {isLive && match.homeScore != null ? (
              <>
                <span className="font-display text-4xl font-bold tabular text-ink">
                  {match.homeScore}<span className="px-1.5 text-faint">-</span>{match.awayScore}
                </span>
                <HypeScore score={match.hypeScore} size="sm" className="mt-1.5" />
              </>
            ) : (
              <HypeScore score={match.hypeScore} size="lg" showTier />
            )}
          </div>
          <TeamCrest team={match.away} align="center" size="lg" showRank className="min-w-0" />
        </div>

        {/* meta */}
        <p className="mt-3 text-center text-xs font-medium text-muted">
          {isLive ? <span className="text-danger">En direct</span> : time}
          {dayShift !== 0 && !isLive && <span className="text-faint"> ({dayShift > 0 ? "J+1" : "J-1"})</span>}
          <span className="text-faint"> · {match.round} · {match.city}</span>
          <span className="text-faint"> · </span>
          <span className="text-ink/90">{broadcasterLabel(match.broadcasters[0])}</span>
        </p>

        {/* verdict */}
        <div className="mt-4 rounded-2xl px-4 py-3 text-center" style={{ background: `rgb(var(--${accent}) / 0.08)` }}>
          <p className="font-display text-[15px] font-bold leading-snug text-ink">{match.watchVerdictShort}</p>
        </div>

        {/* market pulse mini */}
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Market Pulse</span>
            <MarketSignalBadge signal={match.marketSignal} size="sm" />
          </div>
          <div className="flex gap-2">
            <OddsPill label={match.home.id.toUpperCase()} odd={match.odds.home} favorite={fav.side === "home"} accent="gold" />
            <OddsPill label="Nul" odd={match.odds.draw} accent="gold" />
            <OddsPill label={match.away.id.toUpperCase()} odd={match.odds.away} favorite={fav.side === "away"} accent="gold" />
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-4 space-y-2">
          <ActionButton internalHref={`/match/${match.id}`} accent={accent} variant="solid" full size="lg" icon={<ArrowRight size={18} />}>
            Voir pourquoi ça chauffe
          </ActionButton>
          <div className="grid grid-cols-2 gap-2">
            <AddCalendarButton match={match} full />
            <CopyBriefButton match={match} full label="Copier le brief" />
          </div>
        </div>
      </div>
    </div>
  );
}
