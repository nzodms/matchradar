"use client";

import { useTimezone } from "@/components/Providers";
import { displayTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { DailyBrief } from "@/types";
import { Lightbulb, Siren, Sparkles, Target, UserRound } from "lucide-react";
import Link from "next/link";
import { HypeChip } from "./HypeScore";
import { Logo } from "./Logo";
import { RadarBackground } from "./RadarBackground";

/** Story-style shareable brief. Reads like an Instagram story visual. */
export function DailyBriefCard({ brief, className }: { brief: DailyBrief; className?: string }) {
  const { tzId } = useTimezone();

  return (
    <div className={cn("glass-strong relative overflow-hidden rounded-[2rem] p-5", className)}>
      <RadarBackground accent="hype" intensity="soft" className="opacity-50" />

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
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            <Target size={13} className="text-electric" /> À suivre aujourd'hui
          </p>
          <div className="space-y-1.5">
            {brief.threeToWatch.map((m, i) => {
              const { time } = displayTime(m.time, tzId);
              return (
                <Link
                  key={m.id}
                  href={`/match/${m.id}`}
                  className="flex items-center gap-2 rounded-xl border border-line/8 bg-surface/40 px-2.5 py-2 tap"
                >
                  <span className="w-4 text-center font-display text-sm font-bold text-faint">{i + 1}</span>
                  <span className="text-base">{m.home.flag}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">
                    {m.home.name} <span className="text-faint">–</span> {m.away.name}
                  </span>
                  <span className="text-base">{m.away.flag}</span>
                  <span className="shrink-0 text-[11px] font-semibold tabular text-muted">
                    {m.status === "live" ? "LIVE" : time}
                  </span>
                  <HypeChip score={m.hypeScore} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* unmissable */}
        <div className="mt-3 rounded-2xl border border-hype/25 bg-hype/8 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-hype">
            <Siren size={13} /> À ne pas rater
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="font-display text-base font-bold text-ink">
              {brief.unmissable.home.flag} {brief.unmissable.home.name}
              <span className="px-1.5 text-faint">vs</span>
              {brief.unmissable.away.name} {brief.unmissable.away.flag}
            </p>
            <HypeChip score={brief.unmissable.hypeScore} />
          </div>
        </div>

        {/* player + fun fact */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-line/8 bg-surface/40 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gold">
              <UserRound size={12} /> Joueur à surveiller
            </p>
            <p className="mt-1 font-display text-sm font-bold text-ink">
              {brief.playerToWatch.flag} {brief.playerToWatch.name}
            </p>
            <p className="text-[11px] text-muted">{brief.playerToWatch.role}</p>
          </div>
          <div className="rounded-2xl border border-line/8 bg-surface/40 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-electric">
              <Lightbulb size={12} /> Le fun fact
            </p>
            <p className="mt-1 text-[11.5px] leading-snug text-ink/90">{brief.funFact}</p>
          </div>
        </div>

        {/* verdict */}
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-gold/25 bg-gold/8 p-3">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-[12.5px] font-semibold leading-snug text-ink">{brief.verdict}</p>
        </div>

        <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
          matchradar · 104 matchs, on te dit lesquels regarder
        </p>
      </div>
    </div>
  );
}
