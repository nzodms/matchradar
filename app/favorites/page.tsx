"use client";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { MatchCard } from "@/components/MatchCard";
import { useFavorites } from "@/components/Providers";
import { SectionTitle } from "@/components/SectionTitle";
import { TeamPicker } from "@/components/TeamPicker";
import { getTeam } from "@/data/teams";
import { matchesForTeams } from "@/lib/selectors";
import { motion } from "framer-motion";
import { CalendarRange, Star, X } from "lucide-react";
import { useMemo } from "react";

export default function FavoritesPage() {
  const { favorites, toggle } = useFavorites();
  const teams = favorites.map(getTeam);
  const matches = useMemo(() => matchesForTeams(favorites), [favorites]);

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
          Suis tes équipes pour les retrouver en haut du radar et recevoir leurs matchs en priorité.
        </p>
      </motion.div>

      {/* selected chips */}
      {teams.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {teams.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              className="tap inline-flex items-center gap-1.5 rounded-full border border-hype/35 bg-hype/10 py-1.5 pl-2.5 pr-2 text-[13px] font-bold text-ink"
            >
              <span>{t.flag}</span>
              {t.name}
              <X size={13} className="text-muted" />
            </button>
          ))}
        </div>
      )}

      <TeamPicker />

      {/* their matches */}
      <section className="mt-7">
        <SectionTitle eyebrow="Sur le radar" title="Les matchs de tes équipes" />
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarRange}
            title="Choisis au moins une équipe"
            description="Sélectionne tes favoris ci-dessus pour voir leurs matchs apparaître ici."
          />
        )}
      </section>
    </AppShell>
  );
}
