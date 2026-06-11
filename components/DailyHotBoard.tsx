"use client";

import { getTodayHotBoard } from "@/lib/selectors";
import type { HotBoardEntry } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Flag } from "./Flag";

/** Clean ranking board: one standout match per category. */
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
  const Icon = entry.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="card group relative rounded-2xl p-3.5 transition-colors hover:border-line/12 active:scale-[0.99]">
        <Link href={`/match/${match.id}`} aria-label={`${entry.label} : ${match.home.name} ${match.away.name}`} className="absolute inset-0 z-10 rounded-2xl" />

        <div className="relative flex items-center gap-3.5">
          {/* rank */}
          <div className="flex w-9 shrink-0 flex-col items-center justify-center gap-1.5" style={{ color: `rgb(var(--${accent}))` }}>
            <span className="font-display text-xl font-bold leading-none tabular">{rank}</span>
            <Icon size={15} strokeWidth={2.2} />
          </div>

          <span className="h-10 w-px bg-line/8" />

          {/* content */}
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: `rgb(var(--${accent}))` }}>
              {entry.label}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Flag cc={match.home.countryCode} size={16} variant="inline" />
              <p className="min-w-0 truncate font-display text-[15px] font-bold leading-tight text-ink">
                {match.home.name} <span className="text-faint">·</span> {match.away.name}
              </p>
              <Flag cc={match.away.countryCode} size={16} variant="inline" />
            </div>
            <p className="mt-1 line-clamp-1 text-[12px] text-muted">{entry.punch}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="font-display text-sm font-bold tabular text-muted">
              <span style={{ color: `rgb(var(--${accent}))` }}>{match.hypeScore}</span>
              <span className="text-[10px] text-faint"> hype</span>
            </span>
            <ChevronRight size={16} className="text-faint transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
