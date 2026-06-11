"use client";

import { getTodayHotBoard } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { HotBoardEntry } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { HypeChip } from "./HypeScore";
import { MarketSignalBadge } from "./MarketSignalBadge";

/** Arcade-style ranking board: one standout match per category. */
export function DailyHotBoard({ entries }: { entries?: HotBoardEntry[] }) {
  const board = entries ?? getTodayHotBoard();

  return (
    <div className="space-y-2.5">
      {board.map((entry, i) => (
        <HotBoardCard key={entry.kind} entry={entry} rank={i + 1} index={i} />
      ))}
    </div>
  );
}

function HotBoardCard({ entry, rank, index }: { entry: HotBoardEntry; rank: number; index: number }) {
  const { match, accent } = entry;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="card-arcade group relative overflow-hidden rounded-2xl p-3 transition-transform active:scale-[0.99]"
        style={{ boxShadow: `inset 0 0 0 1px rgb(var(--${accent}) / 0.18)` }}
      >
        <Link href={`/match/${match.id}`} aria-label={`${entry.label} : ${match.home.name} ${match.away.name}`} className="absolute inset-0 z-10" />
        <span
          className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full blur-2xl"
          style={{ background: `rgb(var(--${accent}) / 0.2)` }}
        />

        <div className="relative flex items-center gap-3">
          {/* rank */}
          <div className="flex w-10 shrink-0 flex-col items-center">
            <span className="font-display text-2xl font-bold leading-none tabular" style={{ color: `rgb(var(--${accent}))` }}>
              #{rank}
            </span>
            <span className="mt-0.5 text-lg leading-none">{entry.emoji}</span>
          </div>

          {/* content */}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: `rgb(var(--${accent}))` }}>
              {entry.label}
            </p>
            <p className="truncate font-display text-[15px] font-bold leading-tight text-ink">
              {match.home.flag} {match.home.name} <span className="text-faint">–</span> {match.away.name} {match.away.flag}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted">{entry.punch}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <HypeChip score={match.hypeScore} />
              <MarketSignalBadge signal={match.marketSignal} size="sm" />
            </div>
          </div>

          <ChevronRight size={18} className={cn("shrink-0 text-faint transition-transform group-hover:translate-x-0.5")} />
        </div>
      </div>
    </motion.div>
  );
}
