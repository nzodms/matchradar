"use client";

import { useTimezone } from "@/components/Providers";
import { getTeam } from "@/data/teams";
import { displayTime } from "@/lib/datetime";
import { formatOdd, marketFavorite } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { DailyBrief } from "@/types";
import { Lightbulb, Siren, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { Flag } from "./Flag";
import { Logo } from "./Logo";
import { MarketSignalBadge } from "./MarketSignalBadge";
import { RadarBackground } from "./RadarBackground";

/** Beautiful, screenshot-friendly daily brief. Reads like a premium story card. */
export function DailyBriefCard({ brief, className }: { brief: DailyBrief; className?: string }) {
  const { tzId } = useTimezone();
  const u = brief.unmissable;
  const fav = marketFavorite(u);

  return (
    <div className={cn("card-arcade relative overflow-hidden rounded-[1.75rem] p-5", className)}>
      <RadarBackground accent="hype" className="opacity-60" />

      <div className="relative">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow text-hype">Le brief du jour</p>
            <p className="font-display text-lg font-bold capitalize text-ink">{brief.dateLabel}</p>
          </div>
          <Logo compact />
        </div>

        {/* 3 to watch */}
        <div className="mt-4 rounded-2xl border border-line/7 bg-bg/30 p-1">
          {brief.threeToWatch.map((m, i) => {
            const { time } = displayTime(m.time, tzId);
            return (
              <Link
                key={m.id}
                href={`/match/${m.id}`}
                className={cn(
                  "tap flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-surface/40",
                  i > 0 && "border-t border-line/6",
                )}
              >
                <span className="w-4 text-center font-display text-sm font-bold text-faint">{i + 1}</span>
                <Flag cc={m.home.countryCode} size={18} ring={false} />
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-ink">
                  {m.home.name} <span className="text-faint">·</span> {m.away.name}
                </span>
                <Flag cc={m.away.countryCode} size={18} ring={false} />
                <span className="shrink-0 text-[11px] font-medium tabular text-faint">{m.status === "live" ? "LIVE" : time}</span>
                <span className="shrink-0 font-display text-sm font-bold tabular text-hype">{m.hypeScore}</span>
              </Link>
            );
          })}
        </div>

        {/* unmissable */}
        <div className="mt-3 rounded-2xl bg-hype/[0.07] p-3.5 ring-1 ring-hype/15">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-hype">
              <Siren size={13} /> À ne pas rater
            </p>
            <span className="font-display text-lg font-bold tabular text-hype">{u.hypeScore}<span className="text-[11px] font-medium text-faint">/100</span></span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Flag cc={u.home.countryCode} size={22} ring={false} />
            <p className="min-w-0 flex-1 truncate font-display text-[17px] font-bold leading-tight text-ink">
              {u.home.name} <span className="text-faint">·</span> {u.away.name}
            </p>
            <Flag cc={u.away.countryCode} size={22} ring={false} />
          </div>
          <div className="mt-2.5 flex items-center gap-2 border-t border-hype/12 pt-2.5 text-[11px] tabular text-muted">
            <span className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Marché</span>
            <span className={fav.side === "home" ? "text-ink" : ""}><span className="text-faint">{u.home.id.toUpperCase()}</span> {formatOdd(u.odds.home)}</span>
            <span className="text-faint/50">·</span>
            <span><span className="text-faint">N</span> {formatOdd(u.odds.draw)}</span>
            <span className="text-faint/50">·</span>
            <span className={fav.side === "away" ? "text-ink" : ""}><span className="text-faint">{u.away.id.toUpperCase()}</span> {formatOdd(u.odds.away)}</span>
            <MarketSignalBadge signal={u.marketSignal} size="sm" className="ml-auto" />
          </div>
        </div>

        {/* player + fun fact */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-faint">
              <UserRound size={12} className="text-gold" /> Joueur à surveiller
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-sm font-bold text-ink">
              <Flag cc={getTeam(brief.playerToWatch.teamId).countryCode} size={16} ring={false} />
              {brief.playerToWatch.name}
            </p>
            <p className="text-[11px] text-muted">{brief.playerToWatch.role}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-faint">
              <Lightbulb size={12} className="text-electric" /> Le fun fact
            </p>
            <p className="mt-1 text-[12px] leading-snug text-ink/90">{brief.funFact}</p>
          </div>
        </div>

        {/* verdict */}
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-gold/[0.07] p-3 ring-1 ring-gold/12">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-[12.5px] font-semibold leading-snug text-ink">{brief.verdict}</p>
        </div>

        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
          matchradar · on te dit quels matchs regarder
        </p>
      </div>
    </div>
  );
}
