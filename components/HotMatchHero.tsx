"use client";

import { useTimezone } from "@/components/Providers";
import { displayTime } from "@/lib/datetime";
import { getHeatLabel, marketFavorite } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { ArrowRight, Clock, Flame, MapPin, Siren, Tv } from "lucide-react";
import { HypeScore } from "./HypeScore";
import { LiveBadge } from "./LiveBadge";
import { MatchHeatMeter } from "./MatchHeatMeter";
import { MarketSignalBadge } from "./MarketSignalBadge";
import { OddsPill } from "./OddsPill";
import { PremiumGlowCard } from "./PremiumGlowCard";
import { RadarBackground } from "./RadarBackground";
import { TeamCrest } from "./TeamCrest";
import { ActionButton, AddCalendarButton, CopyBriefButton } from "./actions";

/** The showstopper. The hottest/live match, rendered like a burning poster. */
export function HotMatchHero({ match, eyebrow = "Le match le plus chaud maintenant" }: { match: HydratedMatch; eyebrow?: string }) {
  const { tzId } = useTimezone();
  const heat = getHeatLabel(match.heatLevel);
  const accent = heat.accent;
  const isLive = match.status === "live";
  const { time, dayShift } = displayTime(match.time, tzId);
  const fav = marketFavorite(match);

  return (
    <PremiumGlowCard accent={accent} glow inset={false} className="card-arcade sheen p-4">
      <RadarBackground accent={accent} className="opacity-80" />

      <div className="relative">
        {/* top badges */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-bg"
            style={{ background: `rgb(var(--${accent}))`, boxShadow: `0 8px 24px -8px rgb(var(--${accent}))` }}
          >
            <Siren size={13} strokeWidth={2.8} />
            {isLive ? "Match en direct" : "Match à ne pas rater"}
          </span>
          {isLive ? <LiveBadge minute={match.liveMinute} /> : (
            <span className="inline-flex items-center gap-1 text-[12px] font-bold" style={{ color: `rgb(var(--${accent}))` }}>
              {heat.emoji} {heat.label}
            </span>
          )}
        </div>

        {/* emotional tag */}
        <p className="mb-2 text-center font-display text-[13px] font-semibold text-muted">
          « {match.emotionalTag} »
        </p>

        {/* teams + hype */}
        <div className="flex items-center justify-between gap-1">
          <TeamCrest team={match.home} align="center" size="lg" showRank className="flex-1" />
          <div className="flex flex-col items-center">
            {isLive && match.homeScore != null ? (
              <>
                <span className="font-display text-5xl font-bold leading-none tabular text-ink">
                  {match.homeScore}<span className="px-1 text-muted">-</span>{match.awayScore}
                </span>
                <HypeScore score={match.hypeScore} size="sm" className="mt-1.5" />
              </>
            ) : (
              <HypeScore score={match.hypeScore} size="xl" />
            )}
          </div>
          <TeamCrest team={match.away} align="center" size="lg" showRank className="flex-1" />
        </div>

        {/* meta */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock size={11} /> {isLive ? "En direct" : time}
            {dayShift !== 0 && <span className="text-faint">({dayShift > 0 ? "J+1" : "J-1"})</span>}
          </span>
          <Dot /> <span>{match.round}</span>
          <Dot />
          <span className="inline-flex items-center gap-1"><MapPin size={11} /> {match.city}</span>
          {match.broadcasters[0] && (
            <>
              <Dot />
              <span className="inline-flex items-center gap-1 text-ink"><Tv size={11} /> {match.broadcasters[0]}</span>
            </>
          )}
        </div>

        {/* heat meter */}
        <div className="mt-3.5">
          <MatchHeatMeter level={match.heatLevel} />
        </div>

        {/* verdict */}
        <div
          className="mt-3 flex items-start gap-2 rounded-2xl border p-3"
          style={{ borderColor: `rgb(var(--${accent}) / 0.3)`, background: `rgb(var(--${accent}) / 0.08)` }}
        >
          <Flame size={16} className="mt-0.5 shrink-0" style={{ color: `rgb(var(--${accent}))` }} />
          <p className="font-display text-[15px] font-bold leading-tight text-ink">{match.watchVerdictShort}</p>
        </div>

        {/* market pulse mini */}
        <div className="mt-3 rounded-2xl border border-line/8 bg-bg/40 p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wide text-faint">📊 Market Pulse</span>
            <MarketSignalBadge signal={match.marketSignal} size="sm" />
          </div>
          <div className="flex gap-2">
            <OddsPill label={match.home.id.toUpperCase()} odd={match.odds.home} favorite={fav.side === "home"} accent={accent} />
            <OddsPill label="Nul" odd={match.odds.draw} accent={accent} />
            <OddsPill label={match.away.id.toUpperCase()} odd={match.odds.away} favorite={fav.side === "away"} accent={accent} />
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ActionButton
            internalHref={`/match/${match.id}`}
            accent={accent}
            variant="solid"
            full
            size="lg"
            className="col-span-2"
            icon={<ArrowRight size={18} />}
          >
            Voir pourquoi ça chauffe
          </ActionButton>
          <AddCalendarButton match={match} full />
          <CopyBriefButton match={match} full label="Copier le brief" />
        </div>
      </div>
    </PremiumGlowCard>
  );
}

function Dot() {
  return <span className="text-faint">·</span>;
}
