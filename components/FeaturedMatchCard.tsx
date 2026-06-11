"use client";

import { useTimezone } from "@/components/Providers";
import { displayTime } from "@/lib/datetime";
import { getHypeTier } from "@/lib/hype";
import type { HydratedMatch } from "@/types";
import { ArrowRight, Clock, MapPin, Tv } from "lucide-react";
import { HypeScore } from "./HypeScore";
import { LiveBadge } from "./LiveBadge";
import { MatchStatusBadge } from "./MatchStatusBadge";
import { PremiumGlowCard } from "./PremiumGlowCard";
import { RadarBackground } from "./RadarBackground";
import { TeamCrest } from "./TeamCrest";
import { ActionButton, AddCalendarButton, CopyBriefButton } from "./actions";

export function FeaturedMatchCard({ match }: { match: HydratedMatch }) {
  const { tzId } = useTimezone();
  const tier = getHypeTier(match.hypeScore);
  const accent = tier.accent;
  const isLive = match.status === "live";
  const { time, dayShift } = displayTime(match.time, tzId);

  return (
    <PremiumGlowCard accent={accent} glow inset={false} className="p-5">
      <RadarBackground accent={accent} intensity="soft" className="opacity-70" />

      <div className="relative">
        {/* eyebrow */}
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow flex items-center gap-1.5" style={{ color: `rgb(var(--${accent}))` }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: `rgb(var(--${accent}))` }} />
            Le match à ne pas rater
          </span>
          {isLive ? (
            <LiveBadge minute={match.liveMinute} />
          ) : (
            <MatchStatusBadge badge={match.tags[0]} glow />
          )}
        </div>

        {/* teams + hype */}
        <div className="flex items-center justify-between gap-2">
          <TeamCrest team={match.home} align="center" size="lg" showRank className="flex-1" />

          <div className="flex flex-col items-center">
            {isLive && match.homeScore != null ? (
              <>
                <span className="font-display text-4xl font-bold tabular text-ink">
                  {match.homeScore}<span className="px-1.5 text-muted">-</span>{match.awayScore}
                </span>
                <HypeScore score={match.hypeScore} size="sm" className="mt-1" />
              </>
            ) : (
              <HypeScore score={match.hypeScore} size="lg" />
            )}
          </div>

          <TeamCrest team={match.away} align="center" size="lg" showRank className="flex-1" />
        </div>

        {/* meta */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {isLive ? "En direct" : time}
            {dayShift !== 0 && <span className="text-faint">({dayShift > 0 ? "J+1" : "J-1"})</span>}
          </span>
          <span className="text-faint">·</span>
          <span>{match.round}</span>
          <span className="text-faint">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {match.city}
          </span>
          {match.broadcasters[0] && (
            <>
              <span className="text-faint">·</span>
              <span className="inline-flex items-center gap-1 text-ink">
                <Tv size={12} /> {match.broadcasters.join(" / ")}
              </span>
            </>
          )}
        </div>

        {/* verdict */}
        <div
          className="mt-4 rounded-2xl border p-3.5"
          style={{ borderColor: `rgb(var(--${accent}) / 0.25)`, background: `rgb(var(--${accent}) / 0.07)` }}
        >
          <p className="text-[13px] font-semibold leading-snug text-ink">
            <span style={{ color: `rgb(var(--${accent}))` }}>Verdict du radar — </span>
            {match.verdict}
          </p>
        </div>

        {/* key players */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.keyPlayers.slice(0, 3).map((p) => (
            <span
              key={p.name}
              className="inline-flex items-center gap-1 rounded-full border border-line/10 bg-surface-2/50 px-2 py-1 text-[11px] font-semibold text-muted"
            >
              <span>{p.flag}</span>
              {p.name}
            </span>
          ))}
        </div>

        {/* actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ActionButton
            internalHref={`/match/${match.id}`}
            accent={accent}
            variant="solid"
            full
            size="lg"
            className="col-span-2"
            icon={<ArrowRight size={18} />}
          >
            Voir pourquoi c'est immanquable
          </ActionButton>
          <AddCalendarButton match={match} full />
          <CopyBriefButton match={match} full label="Copier le brief" />
        </div>
      </div>
    </PremiumGlowCard>
  );
}
