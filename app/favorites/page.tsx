"use client";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { HotMatchCard, MatchCard } from "@/components/MatchCard";
import { useFavorites } from "@/components/Providers";
import { SectionTitle } from "@/components/SectionTitle";
import { TeamPicker } from "@/components/TeamPicker";
import { getTeam } from "@/data/teams";
import { useLocalStorage } from "@/lib/hooks";
import { allMatches, matchesForTeams } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { HydratedMatch, TeamAlertLevel } from "@/types";
import { motion } from "framer-motion";
import { BellRing, CalendarRange, Plus, Star, X } from "lucide-react";
import { useMemo } from "react";

const ALERT_LEVELS: { key: TeamAlertLevel; label: string }[] = [
  { key: "high", label: "Priorité" },
  { key: "big-only", label: "Gros matchs" },
  { key: "all", label: "Tous" },
];

function nextMatchForTeam(teamId: string): HydratedMatch | undefined {
  return allMatches()
    .filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId)
    .sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time))[0];
}

function teamBadge(m: HydratedMatch): { label: string; accent: string } | null {
  if (m.status === "live") return { label: "EN DIRECT", accent: "danger" };
  if (m.tags.includes("favori-en-danger") || m.marketSignal === "outsider-dangereux") return { label: "EN DANGER", accent: "gold" };
  if (m.hypeScore >= 90) return { label: "GROS CHOC", accent: "hype" };
  return { label: "À SUIVRE", accent: "electric" };
}

export default function FavoritesPage() {
  const { favorites, toggle } = useFavorites();
  const [levels, setLevels] = useLocalStorage<Record<string, TeamAlertLevel>>("mr.alertLevels", {});

  const teams = favorites.map(getTeam);
  const matches = useMemo(() => matchesForTeams(favorites), [favorites]);
  const nextMatch = useMemo(() => {
    const all = matches;
    return [...all].sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time))[0];
  }, [matches]);

  const setLevel = (teamId: string, lvl: TeamAlertLevel) => setLevels((p) => ({ ...p, [teamId]: lvl }));

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
            <Star size={18} className="fill-gold" />
          </span>
          <div>
            <p className="eyebrow">Tes équipes</p>
            <h1 className="font-display text-xl font-bold leading-tight text-ink">Mes favoris</h1>
          </div>
        </div>
        <p className="mb-4 text-sm leading-snug text-muted">
          Suis tes équipes, règle ton niveau d'alerte, et retrouve leurs matchs en haut du radar.
        </p>
      </motion.div>

      {teams.length > 0 ? (
        <>
          {/* Prochain match */}
          {nextMatch && (
            <section>
              <SectionTitle eyebrow="Le prochain rendez-vous" title="Prochain match de tes équipes" />
              <HotMatchCard match={nextMatch} />
            </section>
          )}

          {/* Teams on radar + alert level */}
          <section className="mt-6">
            <SectionTitle eyebrow="Réglages" title="Tes équipes sur le radar" />
            <div className="space-y-2">
              {teams.map((t) => {
                const next = nextMatchForTeam(t.id);
                const badge = next ? teamBadge(next) : null;
                const lvl = levels[t.id] ?? "all";
                return (
                  <div key={t.id} className="glass rounded-2xl p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ring-1 ring-line/10" style={{ background: `radial-gradient(circle at 30% 30%, ${t.color}33, rgb(var(--surface)))` }}>
                        {t.flag}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-bold text-ink">{t.name}</p>
                        {next && badge && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                            <span className="rounded px-1 py-0.5 text-[8.5px] font-bold uppercase tracking-wide" style={{ color: `rgb(var(--${badge.accent}))`, background: `rgb(var(--${badge.accent}) / 0.14)` }}>{badge.label}</span>
                            <span className="truncate">vs {next.homeTeamId === t.id ? next.away.name : next.home.name}</span>
                          </p>
                        )}
                      </div>
                      <button type="button" onClick={() => toggle(t.id)} aria-label={`Retirer ${t.name}`} className="tap -m-1 p-1 text-faint hover:text-danger">
                        <X size={15} />
                      </button>
                    </div>
                    {/* alert level */}
                    <div className="mt-2.5 flex items-center gap-1 rounded-xl border border-line/8 bg-bg/30 p-1">
                      <BellRing size={13} className="ml-1 mr-0.5 shrink-0 text-faint" />
                      {ALERT_LEVELS.map((a) => {
                        const active = lvl === a.key;
                        return (
                          <button key={a.key} type="button" onClick={() => setLevel(t.id, a.key)} className={cn("tap flex-1 rounded-lg py-1.5 text-[11px] font-bold transition-colors", active ? "bg-hype text-bg" : "text-muted hover:text-ink")}>
                            {a.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <EmptyState icon={Star} title="Aucune équipe favorite" description="Ajoute tes équipes ci-dessous pour les suivre en priorité." />
      )}

      {/* Add teams */}
      <section className="mt-6">
        <div className="mb-3 flex items-center gap-1.5">
          <Plus size={15} className="text-hype" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Ajouter une équipe</h2>
        </div>
        <TeamPicker />
      </section>

      {/* Their matches */}
      <section className="mt-7">
        <SectionTitle eyebrow="Sur le radar" title="Les matchs de tes équipes" />
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CalendarRange} title="Choisis au moins une équipe" description="Sélectionne tes favoris pour voir leurs matchs apparaître ici." />
        )}
      </section>
    </AppShell>
  );
}
