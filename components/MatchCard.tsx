"use client";

import { useFavorites, useTimezone } from "@/components/Providers";
import { displayTime } from "@/lib/datetime";
import { getHypeTier } from "@/lib/hype";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { HypeChip } from "./HypeScore";
import { LiveBadge } from "./LiveBadge";
import { MatchStatusBadge } from "./MatchStatusBadge";
import { TeamCrest } from "./TeamCrest";
import { CopyBriefButton } from "./actions";

interface MatchCardProps {
  match: HydratedMatch;
  index?: number;
  compact?: boolean;
}

/**
 * Dense, premium match card. Uses a "stretched link" overlay so the whole card
 * is tappable while the inline buttons stay independently clickable (no invalid
 * <a> > <button> nesting).
 */
export function MatchCard({ match, index = 0, compact }: MatchCardProps) {
  const { tzId } = useTimezone();
  const { isFavorite, toggle } = useFavorites();
  const tier = getHypeTier(match.hypeScore);
  const accent = tier.accent;
  const isLive = match.status === "live";
  const { time, dayShift } = displayTime(match.time, tzId);

  const hasFav = isFavorite(match.homeTeamId) || isFavorite(match.awayTeamId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="group glass relative overflow-hidden rounded-3xl p-3.5 transition-all duration-200 hover:border-line/20 active:scale-[0.985]"
        style={{
          boxShadow: isLive
            ? "0 0 0 1px rgb(var(--danger) / 0.28), 0 20px 44px -26px rgb(var(--danger) / 0.5)"
            : undefined,
        }}
      >
        {/* stretched tap target */}
        <Link href={`/match/${match.id}`} aria-label={`${match.home.name} contre ${match.away.name}`} className="absolute inset-0 z-10" />

        {/* hype tint */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgb(var(--${accent}) / 0.6), transparent)` }}
        />
        <span
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl"
          style={{ background: `rgb(var(--${accent}) / 0.1)` }}
        />

        {/* header */}
        <div className="relative mb-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {isLive ? (
              <LiveBadge minute={match.liveMinute} size="sm" />
            ) : (
              match.tags.slice(0, compact ? 1 : 2).map((t) => <MatchStatusBadge key={t} badge={t} size="sm" />)
            )}
          </div>
          <button
            type="button"
            aria-label="Suivre une équipe"
            onClick={() => toggle(match.homeTeamId)}
            className="tap relative z-20 -m-1 p-1 text-muted transition-colors hover:text-danger"
          >
            <Heart size={16} className={cn(hasFav && "fill-danger text-danger")} />
          </button>
        </div>

        {/* teams */}
        <div className="relative flex items-center gap-2">
          <TeamCrest team={match.home} align="left" size="md" className="flex-1" />

          <div className="flex flex-col items-center px-1">
            {isLive && match.homeScore != null ? (
              <span className="font-display text-xl font-bold tabular text-ink">
                {match.homeScore}<span className="px-1 text-muted">-</span>{match.awayScore}
              </span>
            ) : (
              <>
                <span className="font-display text-sm font-bold tabular text-ink">{time}</span>
                {dayShift !== 0 && (
                  <span className="text-[9px] font-semibold text-faint">{dayShift > 0 ? "J+1" : "J-1"}</span>
                )}
              </>
            )}
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-faint">{match.round}</span>
          </div>

          <TeamCrest team={match.away} align="right" size="md" className="flex-1" />
        </div>

        {/* hype + reason */}
        <div className="relative mt-3 flex items-stretch gap-2.5">
          <HypeChip score={match.hypeScore} className="self-start" />
          <p className="flex-1 border-l border-line/10 pl-2.5 text-[12.5px] leading-snug text-muted line-clamp-2">
            {match.reasonToWatch}
          </p>
        </div>

        {!compact && (
          <>
            <div className="relative mt-2.5 flex items-center gap-1 text-[11px] text-faint">
              <MapPin size={11} />
              <span className="truncate">
                {match.venue} · {match.city}
              </span>
              {match.broadcasters[0] && (
                <span className="ml-auto shrink-0 rounded-md bg-line/8 px-1.5 py-0.5 font-semibold text-muted">
                  {match.broadcasters[0]}
                </span>
              )}
            </div>

            {/* actions */}
            <div className="relative mt-3 flex items-center gap-2 border-t border-line/8 pt-3">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-ink transition-colors group-hover:text-hype">
                Détails <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <div className="relative z-20 ml-auto">
                <CopyBriefButton match={match} size="sm" label="Brief" />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
