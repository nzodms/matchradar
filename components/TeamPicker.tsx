"use client";

import { useFavorites } from "@/components/Providers";
import { TEAMS } from "@/data/teams";
import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface TeamPickerProps {
  /** Limit the visible list (e.g. compact mode inside the calendar form). */
  limit?: number;
  className?: string;
}

export function TeamPicker({ limit, className }: TeamPickerProps) {
  const { isFavorite, toggle } = useFavorites();
  const [query, setQuery] = useState("");

  const teams = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...TEAMS].sort((a, b) => b.popularityScore - a.popularityScore);
    const filtered = q ? sorted.filter((t) => t.name.toLowerCase().includes(q)) : sorted;
    return limit && !q ? filtered.slice(0, limit) : filtered;
  }, [query, limit]);

  return (
    <div className={className}>
      <div className="relative mb-3">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une équipe…"
          className="h-11 w-full rounded-2xl border border-line/10 bg-surface/50 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-hype/40 focus:bg-surface-2/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {teams.map((team) => {
          const active = isFavorite(team.id);
          return (
            <button
              key={team.id}
              type="button"
              onClick={() => toggle(team.id)}
              className={cn(
                "tap relative flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition-all",
                active
                  ? "border-hype/40 bg-hype/10 shadow-glow-hype"
                  : "border-line/10 bg-surface/40 hover:border-line/20",
              )}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl ring-1 ring-line/10"
                style={{ background: `radial-gradient(circle at 30% 30%, ${team.color}33, rgb(var(--surface)))` }}
              >
                {team.flag}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-bold text-ink">{team.name}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide text-faint">
                  FIFA #{team.fifaRank}
                </span>
              </span>
              {active && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hype text-bg">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {teams.length === 0 && (
        <p className="py-6 text-center text-sm text-muted">Aucune équipe trouvée.</p>
      )}
    </div>
  );
}
