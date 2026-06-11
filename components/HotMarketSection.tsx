"use client";

import { allMatches } from "@/lib/selectors";
import { useMemo } from "react";
import { MarketPulseCard } from "./MarketPulseCard";

const INTERESTING = ["affiche-brulante", "match-serre", "outsider-dangereux", "piege-possible"];

/** Swipeable row of Market Pulse cards for the hottest markets. */
export function HotMarketSection() {
  const matches = useMemo(
    () =>
      allMatches()
        .filter((m) => INTERESTING.includes(m.marketSignal))
        .sort((a, b) => b.hypeScore - a.hypeScore)
        .slice(0, 4),
    [],
  );

  if (matches.length === 0) return null;

  return (
    <div className="-mx-4 mask-fade-x">
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
        {matches.map((m) => (
          <div key={m.id} className="w-[86%] max-w-sm shrink-0 snap-center">
            <MarketPulseCard match={m} />
          </div>
        ))}
      </div>
    </div>
  );
}
