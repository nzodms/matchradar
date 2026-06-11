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
    <div className={cn("card relative overflow-hidden rounded-3xl p-4", className)}>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/12 text-electric ring-1 ring-electric/20">
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
            toast("Calendrier exporté");
          }}
          className="tap inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-electric font-bold text-bg shadow-[0_10px_26px_-14px_rgb(var(--electric)/0.6)] disabled:opacity-40"
        >
          <CalendarPlus size={16} /> Google
        </button>
        <button
          type="button"
          disabled={count === 0}
          onClick={() => {
            downloadICS(matches, "matchradar-apple.ics");
            toast("Fichier .ics téléchargé");
          }}
          className="tap inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-surface-2/50 font-bold text-ink ring-1 ring-line/8 hover:bg-surface-2/80 disabled:opacity-40"
        >
          <Apple size={16} /> Apple
        </button>
      </div>
    </div>
  );
}
