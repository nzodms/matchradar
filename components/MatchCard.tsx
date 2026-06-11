"use client";

import { useFavorites, useTimezone } from "@/components/Providers";
import { displayTime } from "@/lib/datetime";
import { getHypeTier } from "@/lib/hype";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { LiveBadge } from "./LiveBadge";
import { MatchStatusBadge } from "./MatchStatusBadge";
import { OddsStrip } from "./OddsStrip";
import { CopyBriefButton } from "./actions";

type Variant = "auto" | "hot" | "live" | "chill" | "market" | "brief";

interface MatchCardProps {
  match: HydratedMatch;
  index?: number;
  variant?: Variant;
  compact?: boolean;
}

/**
 * The premium match card. Calm, coherent, one accent (the hype number).
 * Structure: A header · B teams + hype · C reason · D market · E action.
 */
export function MatchCard({ match, index = 0, variant = "auto", compact }: MatchCardProps) {
  const { tzId } = useTimezone();
  const { isFavorite, toggle } = useFavorites();
  const tier = getHypeTier(match.hypeScore);
  const accent = tier.accent;
  const isLive = match.status === "live";
  const isBrief = variant === "brief" || compact;
  const { time, dayShift } = displayTime(match.time, tzId);
  const hasFav = isFavorite(match.homeTeamId) || isFavorite(match.awayTeamId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.045, 0.25), ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="card group relative rounded-[1.5rem] p-4 transition-colors duration-200 hover:border-line/12 active:scale-[0.99]">
        {/* stretched tap target */}
        <Link
          href={`/match/${match.id}`}
          aria-label={`${match.home.name} contre ${match.away.name}`}
          className="absolute inset-0 z-10 rounded-[1.5rem]"
        />

        {/* A · header */}
        <div className="relative flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-medium text-faint">
            {match.round}
            {match.group ? ` · ${match.group}` : ""}
          </p>
          <div className="flex items-center gap-2">
            {isLive ? <LiveBadge minute={match.liveMinute} size="sm" /> : <MatchStatusBadge badge={match.tags[0]} size="sm" />}
            <button
              type="button"
              aria-label="Suivre"
              onClick={() => toggle(match.homeTeamId)}
              className="tap relative z-20 -m-1 p-1 text-faint transition-colors hover:text-danger"
            >
              <Heart size={15} className={cn(hasFav && "fill-danger text-danger")} />
            </button>
          </div>
        </div>

        {/* B · teams + hype */}
        <div className="relative mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Side team={match.home} side="left" />

          <div className="flex min-w-[64px] flex-col items-center">
            {isLive && match.homeScore != null ? (
              <>
                <span className="font-display text-2xl font-bold leading-none tabular text-ink">
                  {match.homeScore}<span className="px-1 text-faint">-</span>{match.awayScore}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: `rgb(var(--${accent}))` }}>
                  Hype {match.hypeScore}
                </span>
              </>
            ) : (
              <>
                <span className="font-display text-[28px] font-bold leading-none tabular" style={{ color: `rgb(var(--${accent}))` }}>
                  {match.hypeScore}
                </span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-faint">Hype</span>
              </>
            )}
          </div>

          <Side team={match.away} side="right" />
        </div>

        {/* time */}
        <p className="relative mt-2 text-center text-[11.5px] font-medium text-muted">
          {isLive ? (
            <span className="text-danger">● En direct</span>
          ) : (
            <>
              {time}
              {dayShift !== 0 && <span className="text-faint"> ({dayShift > 0 ? "J+1" : "J-1"})</span>}
            </>
          )}
          <span className="text-faint"> · {match.city}</span>
        </p>

        {/* C · reason */}
        <p className={cn("relative mt-3 text-[13px] leading-snug text-muted", isBrief ? "line-clamp-1" : "line-clamp-2")}>
          {match.reasonToWatch}
        </p>

        {!isBrief && (
          <>
            {/* D · market */}
            <div className="relative mt-3 border-t border-line/6 pt-3">
              <OddsStrip match={match} />
            </div>

            {/* E · action */}
            <div className="relative mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted transition-colors group-hover:text-ink">
                Voir le détail <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <div className="relative z-20">
                <CopyBriefButton match={match} size="sm" label="Brief" variant="ghost" />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Side({ team, side }: { team: HydratedMatch["home"]; side: "left" | "right" }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", side === "right" && "flex-row-reverse")}>
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl ring-1 ring-line/10"
        style={{ background: `radial-gradient(circle at 30% 30%, ${team.color}22, rgb(var(--surface-2)))` }}
      >
        {team.flag}
      </span>
      <p className={cn("min-w-0 truncate font-display text-[15px] font-bold leading-tight text-ink", side === "right" && "text-right")}>
        {team.name}
      </p>
    </div>
  );
}

/* ── Named variants (kept for API compatibility; layout is now unified) ── */
export const HotMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="hot" />;
export const LiveMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="live" />;
export const ChillMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="chill" />;
export const MarketMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="market" />;
export const BriefMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="brief" />;
