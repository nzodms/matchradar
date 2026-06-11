"use client";

import { useFavorites, useTimezone } from "@/components/Providers";
import { displayTime } from "@/lib/datetime";
import { getHeatLabel } from "@/lib/market";
import { getHypeTier } from "@/lib/hype";
import { cn } from "@/lib/utils";
import type { AccentToken, HydratedMatch } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { HypeChip } from "./HypeScore";
import { LiveBadge } from "./LiveBadge";
import { MatchStatusBadge } from "./MatchStatusBadge";
import { OddsStrip } from "./OddsStrip";
import { TeamCrest } from "./TeamCrest";
import { CopyBriefButton } from "./actions";

type Variant = "auto" | "hot" | "live" | "chill" | "market" | "brief";

interface MatchCardProps {
  match: HydratedMatch;
  index?: number;
  variant?: Variant;
  compact?: boolean;
}

interface Skin {
  accent: AccentToken;
  glow: boolean;
  showOdds: boolean;
}

function resolve(variant: Variant, match: HydratedMatch): Variant {
  if (variant !== "auto") return variant;
  if (match.status === "live") return "live";
  if (match.heatLevel === "insane" || match.heatLevel === "very_hot") return "hot";
  if (match.heatLevel === "chill") return "chill";
  return "market";
}

function skinFor(v: Variant, match: HydratedMatch): Skin {
  const tier = getHypeTier(match.hypeScore);
  switch (v) {
    case "live":
      return { accent: "danger", glow: true, showOdds: true };
    case "hot":
      return { accent: getHeatLabel(match.heatLevel).accent, glow: true, showOdds: true };
    case "market":
      return { accent: "gold", glow: false, showOdds: true };
    case "chill":
      return { accent: "electric", glow: false, showOdds: true };
    case "brief":
      return { accent: tier.accent, glow: false, showOdds: false };
    default:
      return { accent: tier.accent, glow: false, showOdds: true };
  }
}

/**
 * Polymorphic match card. `variant="auto"` picks a personality from the match
 * (live / hot / chill / market). Hype + reason stay the headline; the odds strip
 * is a secondary informational signal.
 */
export function MatchCard({ match, index = 0, variant = "auto", compact }: MatchCardProps) {
  const { tzId } = useTimezone();
  const { isFavorite, toggle } = useFavorites();
  const v = resolve(variant, match);
  const skin = skinFor(v, match);
  const heat = getHeatLabel(match.heatLevel);
  const isLive = match.status === "live";
  const isBrief = v === "brief" || compact;
  const { time, dayShift } = displayTime(match.time, tzId);
  const hasFav = isFavorite(match.homeTeamId) || isFavorite(match.awayTeamId);
  const accent = skin.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          "group glass relative overflow-hidden rounded-3xl transition-all duration-200 hover:border-line/20 active:scale-[0.985]",
          isBrief ? "p-3" : "p-3.5",
        )}
        style={{
          boxShadow: skin.glow
            ? `0 0 0 1px rgb(var(--${accent}) / 0.3), 0 22px 46px -26px rgb(var(--${accent}) / 0.55)`
            : undefined,
        }}
      >
        {/* stretched tap target */}
        <Link href={`/match/${match.id}`} aria-label={`${match.home.name} contre ${match.away.name}`} className="absolute inset-0 z-10" />

        {/* left accent bar — gives each variant its identity */}
        <span
          className="pointer-events-none absolute bottom-3 left-0 top-3 w-1 rounded-r-full"
          style={{ background: `rgb(var(--${accent}))`, boxShadow: skin.glow ? `0 0 10px 0 rgb(var(--${accent}))` : undefined }}
        />
        <span
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl"
          style={{ background: `rgb(var(--${accent}) / ${skin.glow ? 0.16 : 0.08})` }}
        />

        {/* header */}
        <div className="relative mb-3 flex items-center justify-between gap-2 pl-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {isLive ? (
              <LiveBadge minute={match.liveMinute} size="sm" />
            ) : (
              <>
                <span
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide"
                  style={{ color: `rgb(var(--${heat.accent}))`, background: `rgb(var(--${heat.accent}) / 0.14)` }}
                >
                  {heat.emoji} {heat.label}
                </span>
                {match.tags.slice(0, 1).map((t) => (
                  <MatchStatusBadge key={t} badge={t} size="sm" />
                ))}
              </>
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
        <div className="relative flex items-center gap-2 pl-2">
          <TeamCrest team={match.home} align="left" size={isBrief ? "sm" : "md"} className="flex-1" />
          <div className="flex flex-col items-center px-1">
            {isLive && match.homeScore != null ? (
              <span className="font-display text-xl font-bold tabular text-ink">
                {match.homeScore}<span className="px-1 text-muted">-</span>{match.awayScore}
              </span>
            ) : (
              <>
                <span className="font-display text-sm font-bold tabular text-ink">{time}</span>
                {dayShift !== 0 && <span className="text-[9px] font-semibold text-faint">{dayShift > 0 ? "J+1" : "J-1"}</span>}
              </>
            )}
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-faint">{match.round}</span>
          </div>
          <TeamCrest team={match.away} align="right" size={isBrief ? "sm" : "md"} className="flex-1" />
        </div>

        {/* hype + reason */}
        <div className="relative mt-3 flex items-stretch gap-2.5 pl-2">
          <HypeChip score={match.hypeScore} className="self-start" />
          <p className={cn("flex-1 border-l border-line/10 pl-2.5 text-[12.5px] leading-snug text-muted", isBrief ? "line-clamp-1" : "line-clamp-2")}>
            {match.reasonToWatch}
          </p>
        </div>

        {!isBrief && skin.showOdds && (
          <div className="relative mt-2.5 pl-2">
            <OddsStrip match={match} />
          </div>
        )}

        {!isBrief && (
          <>
            <div className="relative mt-2.5 flex items-center gap-1 pl-2 text-[11px] text-faint">
              <MapPin size={11} />
              <span className="truncate">{match.venue} · {match.city}</span>
              {match.broadcasters[0] && (
                <span className="ml-auto shrink-0 rounded-md bg-line/8 px-1.5 py-0.5 font-semibold text-muted">{match.broadcasters[0]}</span>
              )}
            </div>

            <div className="relative mt-3 flex items-center gap-2 border-t border-line/8 pt-3 pl-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-ink transition-colors group-hover:text-hype">
                Voir pourquoi ça chauffe <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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

/* ── Named personality variants (thin wrappers) ── */
export const HotMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="hot" />;
export const LiveMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="live" />;
export const ChillMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="chill" />;
export const MarketMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="market" />;
export const BriefMatchCard = (p: Omit<MatchCardProps, "variant">) => <MatchCard {...p} variant="brief" />;
