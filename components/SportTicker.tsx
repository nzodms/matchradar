"use client";

import { getMarketSignal } from "@/lib/market";
import { allMatches, liveMatches, todaysMatches } from "@/lib/selectors";
import type { AccentToken } from "@/types";
import { useMemo } from "react";

interface TickerItem {
  emoji: string;
  text: string;
  accent: AccentToken;
}

function buildItems(): TickerItem[] {
  const all = allMatches();
  const today = todaysMatches();
  const live = liveMatches();
  const items: TickerItem[] = [];

  if (live.length > 0) {
    items.push({ emoji: "🔴", text: `${live.length} match${live.length > 1 ? "s" : ""} en live`, accent: "danger" });
  }

  const hottest = [...today].sort((a, b) => b.hypeScore - a.hypeScore)[0];
  if (hottest) items.push({ emoji: "🔥", text: `${hottest.home.name}–${hottest.away.name} : hype ${hottest.hypeScore}`, accent: "hype" });

  const trap = all.find((m) => m.marketSignal === "outsider-dangereux" || m.marketSignal === "piege-possible");
  if (trap) items.push({ emoji: "⚠️", text: `${trap.home.name}–${trap.away.name} : ${getMarketSignal(trap.marketSignal).label.toLowerCase()}`, accent: "gold" });

  const tight = all.find((m) => m.marketSignal === "match-serre");
  if (tight) items.push({ emoji: "📈", text: `${tight.home.name}–${tight.away.name} : marché serré`, accent: "electric" });

  const must = today.filter((m) => m.hypeScore >= 90).length;
  if (must > 0) items.push({ emoji: "🚨", text: `${must} immanquable${must > 1 ? "s" : ""} aujourd'hui`, accent: "danger" });

  const fire = [...today].sort((a, b) => b.groupChatPotential - a.groupChatPotential)[0];
  if (fire) items.push({ emoji: "📱", text: `${fire.home.name}–${fire.away.name} : à envoyer au groupe`, accent: "violet" });

  return items;
}

/** Infinite live ticker — sport-TV energy at the top of the radar. */
export function SportTicker() {
  const items = useMemo(buildItems, []);
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-full border border-line/8 bg-bg/50 py-2 mask-fade-x">
      <div className="flex w-max animate-marquee items-center gap-6 pr-6 hover:[animation-play-state:paused]">
        {loop.map((it, i) => (
          <span key={i} className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold">
            <span>{it.emoji}</span>
            <span className="text-muted" style={{ color: `rgb(var(--${it.accent}))` }}>
              {it.text}
            </span>
            <span className="ml-3 h-1 w-1 rounded-full bg-line/20" />
          </span>
        ))}
      </div>
    </div>
  );
}
