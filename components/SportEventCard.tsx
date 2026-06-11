"use client";

import { cn } from "@/lib/utils";
import type { SportEvent } from "@/types";
import { motion } from "framer-motion";
import { BellRing, Check, CalendarRange } from "lucide-react";
import { useState } from "react";
import { Pill } from "./MatchStatusBadge";
import { useToast } from "./Toast";

export function SportEventCard({ event, index = 0 }: { event: SportEvent; index?: number }) {
  const { toast } = useToast();
  const [armed, setArmed] = useState(false);
  const accent = event.themeColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-4"
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgb(var(--${accent}) / 0.6), transparent)` }}
      />
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl"
        style={{ background: `rgb(var(--${accent}) / 0.14)` }}
      />

      <div className="relative flex items-start gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ring-1"
          style={{ background: `rgb(var(--${accent}) / 0.12)`, boxShadow: `inset 0 0 0 1px rgb(var(--${accent}) / 0.25)` }}
        >
          {event.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-bold text-ink">{event.name}</h3>
            <Pill accent={accent} label="Bientôt" size="sm" />
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-muted">
            <CalendarRange size={12} /> {event.startDate}
          </p>
          <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{event.tagline}</p>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-line/10 bg-surface/50 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(var(--${accent}))` }} />
            <span className="text-[11px] font-bold text-ink">{event.radarType}</span>
          </div>
        </div>
      </div>

      {/* what the radar will detect */}
      <div className="relative mt-3 rounded-2xl border border-line/8 bg-bg/30 p-2.5">
        <p className="mb-1.5 text-[9.5px] font-bold uppercase tracking-wide text-faint">Ce que le radar va détecter</p>
        <ul className="grid grid-cols-1 gap-1">
          {event.bullets.map((b) => (
            <li key={b} className="flex items-center gap-1.5 text-[11.5px] text-muted">
              <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: `rgb(var(--${accent}))` }} />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => {
          setArmed(true);
          toast(`Radar ${event.name} activé 🔔`);
        }}
        className={cn(
          "tap mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold transition-colors",
          armed ? "bg-surface-2/60 text-muted" : "text-bg",
        )}
        style={armed ? undefined : { backgroundColor: `rgb(var(--${accent}))`, boxShadow: `0 10px 30px -12px rgb(var(--${accent}))` }}
      >
        {armed ? (
          <>
            <Check size={16} strokeWidth={2.8} /> Tu seras prévenu
          </>
        ) : (
          <>
            <BellRing size={16} /> Me prévenir au lancement
          </>
        )}
      </button>
    </motion.div>
  );
}
