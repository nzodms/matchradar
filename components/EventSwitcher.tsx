"use client";

import { EVENTS } from "@/data/events";
import { cn } from "@/lib/utils";
import Link from "next/link";

/** Horizontal sport/event selector. Active event is selectable; the rest tease "bientôt". */
export function EventSwitcher({ activeId = "wc" }: { activeId?: string }) {
  return (
    <div className="-mx-4 mask-fade-x">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-0.5">
        {EVENTS.map((event) => {
          const active = event.id === activeId && !event.comingSoon;
          return (
            <Link
              key={event.id}
              href={event.comingSoon ? "/events" : "/"}
              className={cn(
                "tap group relative flex shrink-0 items-center gap-1.5 rounded-2xl border px-3 py-2 transition-colors",
                active ? "border-hype/30 bg-hype/10" : "border-line/8 bg-surface/40 hover:border-line/16",
              )}
            >
              <span className="text-base leading-none">{event.emoji}</span>
              <div className="flex flex-col leading-none">
                <span className={cn("text-xs font-bold", active ? "text-hype" : "text-ink")}>
                  {event.name}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-faint">
                  {event.comingSoon ? "Bientôt" : "En direct"}
                </span>
              </div>
              {event.comingSoon && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-violet/70" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
