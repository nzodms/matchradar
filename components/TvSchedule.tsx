"use client";

import { useTimezone } from "@/components/Providers";
import { broadcasterLabel } from "@/lib/data-sources/broadcastersProvider";
import { displayTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { Tv } from "lucide-react";
import Link from "next/link";
import { Flag } from "./Flag";

interface TvScheduleProps {
  matches: HydratedMatch[];
  className?: string;
}

/**
 * The TV-guide block: one row per match, sorted by kickoff.
 * Time · teams · channel · hype — readable in two seconds.
 */
export function TvSchedule({ matches, className }: TvScheduleProps) {
  const { tzId } = useTimezone();
  const sorted = [...matches].sort((a, b) => {
    const liveA = a.status === "live" || a.status === "halftime";
    const liveB = b.status === "live" || b.status === "halftime";
    if (liveA !== liveB) return liveA ? -1 : 1;
    return a.time.localeCompare(b.time);
  });

  if (sorted.length === 0) return null;

  return (
    <div className={cn("card overflow-hidden rounded-3xl", className)}>
      {sorted.map((m, i) => {
        const { time } = displayTime(m.time, tzId);
        const isLive = m.status === "live" || m.status === "halftime";
        const b = m.broadcasters[0];
        return (
          <Link
            key={m.id}
            href={`/match/${m.id}`}
            className={cn(
              "tap flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-surface/40",
              i > 0 && "border-t border-line/6",
            )}
          >
            {/* time / live */}
            <span className="w-12 shrink-0">
              {isLive ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-danger">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
                  </span>
                  Live
                </span>
              ) : (
                <span className="font-display text-[13px] font-bold tabular text-ink">{time}</span>
              )}
            </span>

            {/* teams */}
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <Flag cc={m.home.countryCode} size={16} variant="inline" />
              <span className="min-w-0 truncate text-[13px] font-semibold text-ink">
                {m.home.name} <span className="text-faint">–</span> {m.away.name}
              </span>
              <Flag cc={m.away.countryCode} size={16} variant="inline" />
              {isLive && m.homeScore != null && (
                <span className="ml-0.5 shrink-0 font-display text-[12px] font-bold tabular text-ink">
                  {m.homeScore}-{m.awayScore}
                </span>
              )}
            </span>

            {/* channel */}
            <span className="hidden shrink-0 items-center gap-1 text-[11px] font-medium text-muted min-[400px]:inline-flex">
              <Tv size={11} className="text-faint" />
              <span className={cn("max-w-[88px] truncate", b && !b.verified && "italic text-faint")}>
                {broadcasterLabel(b)}
              </span>
            </span>

            {/* hype */}
            <span
              className="w-8 shrink-0 text-right font-display text-[13px] font-bold tabular"
              style={{ color: m.hypeScore >= 90 ? "rgb(var(--hype))" : m.hypeScore >= 75 ? "rgb(var(--gold))" : "rgb(var(--muted))" }}
            >
              {m.hypeScore}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
