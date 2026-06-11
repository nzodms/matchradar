"use client";

import { allMatches, liveMatches, todaysMatches } from "@/lib/selectors";
import type { AccentToken } from "@/types";
import { Flame, MessageCircle, Radio, Scale, Star, TriangleAlert, type LucideIcon } from "lucide-react";
import { useMemo } from "react";

interface TickerItem {
  icon: LucideIcon;
  text: string;
  accent: AccentToken;
}

function buildItems(): TickerItem[] {
  const all = allMatches();
  const today = todaysMatches();
  const live = liveMatches();
  const items: TickerItem[] = [];

  if (live.length > 0) {
    items.push({ icon: Radio, text: `${live.length} match${live.length > 1 ? "s" : ""} en live`, accent: "danger" });
  }

  const hottest = [...today].sort((a, b) => b.hypeScore - a.hypeScore)[0];
  if (hottest) items.push({ icon: Flame, text: `${hottest.home.name}–${hottest.away.name} · hype ${hottest.hypeScore}`, accent: "hype" });

  const trap = all.find((m) => m.marketSignal === "outsider-dangereux" || m.marketSignal === "piege-possible");
  if (trap) items.push({ icon: TriangleAlert, text: `${trap.home.name}–${trap.away.name} · piège possible`, accent: "gold" });

  const tight = all.find((m) => m.marketSignal === "match-serre");
  if (tight) items.push({ icon: Scale, text: `${tight.home.name}–${tight.away.name} · marché serré`, accent: "electric" });

  const must = today.filter((m) => m.hypeScore >= 90).length;
  if (must > 0) items.push({ icon: Star, text: `${must} immanquable${must > 1 ? "s" : ""} aujourd'hui`, accent: "danger" });

  const fire = [...today].sort((a, b) => b.groupChatPotential - a.groupChatPotential)[0];
  if (fire) items.push({ icon: MessageCircle, text: `${fire.home.name}–${fire.away.name} · pour le groupe`, accent: "violet" });

  return items;
}

/** Infinite live ticker — sport-TV energy at the top of the radar. */
export function SportTicker() {
  const items = useMemo(buildItems, []);
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line/7 bg-surface/30 py-2 mask-fade-x">
      <div className="flex w-max animate-marquee items-center gap-5 pr-5 hover:[animation-play-state:paused]">
        {loop.map((it, i) => {
          const Icon = it.icon;
          return (
            <span key={i} className="flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-muted">
              <Icon size={12} strokeWidth={2.4} style={{ color: `rgb(var(--${it.accent}))` }} />
              <span>{it.text}</span>
              <span className="ml-2 h-1 w-1 rounded-full bg-line/15" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
