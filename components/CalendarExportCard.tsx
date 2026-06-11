"use client";

import { downloadICS } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { HydratedMatch } from "@/types";
import { Apple, CalendarCheck, CalendarPlus } from "lucide-react";
import { useToast } from "./Toast";

/** Export the selected matches to Google / Apple calendars (+ ICS download). */
export function CalendarExportCard({ matches, className }: { matches: HydratedMatch[]; className?: string }) {
  const { toast } = useToast();
  const count = matches.length;

  return (
    <div className={cn("glass relative overflow-hidden rounded-3xl p-4", className)}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/60 to-transparent" />

      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/15 text-electric ring-1 ring-electric/30">
          <CalendarCheck size={18} />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-ink">Exporter ton calendrier</p>
          <p className="text-[11px] text-muted">
            {count} match{count > 1 ? "s" : ""} prêt{count > 1 ? "s" : ""} à synchroniser, rappel 30 min avant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={count === 0}
          onClick={() => {
            downloadICS(matches, "matchradar-google.ics");
            toast("Calendrier exporté 📅");
          }}
          className="tap inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-electric font-bold text-bg shadow-glow-electric disabled:opacity-40"
        >
          <CalendarPlus size={16} /> Google
        </button>
        <button
          type="button"
          disabled={count === 0}
          onClick={() => {
            downloadICS(matches, "matchradar-apple.ics");
            toast("Fichier .ics téléchargé 🍎");
          }}
          className="tap inline-flex h-11 items-center justify-center gap-2 rounded-2xl glass font-bold text-ink hover:bg-surface-2/60 disabled:opacity-40"
        >
          <Apple size={16} /> Apple
        </button>
      </div>
    </div>
  );
}
