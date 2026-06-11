"use client";

import { AppShell } from "@/components/AppShell";
import { EventSwitcher } from "@/components/EventSwitcher";
import { FeaturedMatchCard } from "@/components/FeaturedMatchCard";
import { MatchCard } from "@/components/MatchCard";
import { useFavorites } from "@/components/Providers";
import { RadarBackground } from "@/components/RadarBackground";
import { SectionTitle } from "@/components/SectionTitle";
import { Tabs, type TabOption } from "@/components/Tabs";
import { EmptyState } from "@/components/EmptyState";
import { ACTIVE_EVENT } from "@/data/events";
import {
  matchOfTheDay,
  matchesForOffset,
  matchesForTeams,
  todaysMatches,
} from "@/lib/selectors";
import { motion } from "framer-motion";
import { ArrowRight, Newspaper, Radar, Rocket, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type TabKey = "today" | "tomorrow" | "week" | "teams";

export default function RadarPage() {
  const { favorites } = useFavorites();
  const [tab, setTab] = useState<TabKey>("today");

  const featured = matchOfTheDay();
  const today = todaysMatches();
  const tomorrow = useMemo(() => matchesForOffset((o) => o === 1), []);
  const week = useMemo(() => matchesForOffset((o) => o >= 2), []);
  const teamMatches = useMemo(() => matchesForTeams(favorites), [favorites]);

  const immanquables = today.filter((m) => m.hypeScore >= 90).length;
  const liveNow = today.filter((m) => m.status === "live").length;

  const list = useMemo(() => {
    switch (tab) {
      case "today":
        return today.filter((m) => m.id !== featured.id);
      case "tomorrow":
        return tomorrow;
      case "week":
        return week;
      case "teams":
        return teamMatches;
    }
  }, [tab, today, tomorrow, week, teamMatches, featured.id]);

  const tabs: TabOption<TabKey>[] = [
    { key: "today", label: "Aujourd'hui", count: today.length },
    { key: "tomorrow", label: "Demain", count: tomorrow.length },
    { key: "week", label: "Cette semaine", count: week.length },
    { key: "teams", label: "Mes équipes", count: teamMatches.length },
  ];

  return (
    <AppShell>
      {/* ─── Hero ─── */}
      <section className="relative -mx-4 overflow-hidden px-4 pb-2 pt-2">
        <RadarBackground accent="hype" className="opacity-90" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-hype/25 bg-hype/8 px-3 py-1">
            <span className="text-base">{ACTIVE_EVENT.emoji}</span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-hype">
              Coupe du Monde · En direct
            </span>
          </div>

          <h1 className="mt-3 font-display text-[28px] font-bold leading-[1.1] tracking-tight text-ink">
            Quels matchs <span className="text-gradient-hype">regarder</span> aujourd'hui ?
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-snug text-muted">
            On analyse les matchs, les enjeux et la hype pour te dire quoi ne pas rater. 104 matchs, on
            te sort les immanquables.
          </p>

          {/* live stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatTile value={today.length} label="matchs aujourd'hui" accent="electric" />
            <StatTile value={immanquables} label="immanquables" accent="hype" />
            <StatTile value={liveNow} label="en direct" accent="danger" pulse={liveNow > 0} />
          </div>
        </motion.div>
      </section>

      {/* ─── Event switcher ─── */}
      <div className="mt-4">
        <EventSwitcher activeId="wc" />
      </div>

      {/* ─── Match du jour ─── */}
      <section className="mt-5">
        <SectionTitle
          eyebrow="Le verdict du radar"
          title="Le match à ne pas rater"
        />
        <FeaturedMatchCard match={featured} />
      </section>

      {/* ─── Programme ─── */}
      <section className="mt-6">
        <SectionTitle
          eyebrow="Le programme"
          title="Tous les matchs"
          action={
            <Link href="/brief" className="inline-flex items-center gap-1 text-xs font-bold text-hype">
              Le brief <ArrowRight size={13} />
            </Link>
          }
        />
        <Tabs options={tabs} value={tab} onChange={setTab} className="mb-3" />

        {list.length > 0 ? (
          <div className="space-y-3">
            {list.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        ) : tab === "teams" ? (
          <EmptyState
            icon={Star}
            title="Aucune équipe favorite"
            description="Choisis tes équipes pour voir leurs matchs ici en priorité."
            action={
              <Link
                href="/favorites"
                className="tap inline-flex h-10 items-center gap-2 rounded-2xl bg-hype px-4 text-sm font-bold text-bg shadow-glow-hype"
              >
                Choisir mes équipes <ArrowRight size={16} />
              </Link>
            }
          />
        ) : (
          <EmptyState icon={Radar} title="Rien à signaler" description="Pas de match sur ce créneau. Reviens vite, le radar tourne." />
        )}
      </section>

      {/* ─── Teasers ─── */}
      <section className="mt-6 grid grid-cols-1 gap-3">
        <TeaserCard
          href="/brief"
          icon={Newspaper}
          accent="hype"
          title="Le brief du jour"
          subtitle="3 matchs, 1 immanquable, 1 verdict. Prêt à envoyer dans ton groupe."
        />
        <TeaserCard
          href="/events"
          icon={Rocket}
          accent="violet"
          title="Coupe du Monde maintenant. Wimbledon ensuite."
          subtitle="Active les prochains radars : F1, UFC, Tour de France, NBA, Ligue des Champions."
        />
      </section>
    </AppShell>
  );
}

function StatTile({
  value,
  label,
  accent,
  pulse,
}: {
  value: number;
  label: string;
  accent: "hype" | "electric" | "danger";
  pulse?: boolean;
}) {
  return (
    <div className="glass rounded-2xl px-2.5 py-2.5">
      <div className="flex items-center gap-1.5">
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
          </span>
        )}
        <span className="font-display text-2xl font-bold leading-none tabular" style={{ color: `rgb(var(--${accent}))` }}>
          {value}
        </span>
      </div>
      <p className="mt-1 text-[10px] font-medium leading-tight text-faint">{label}</p>
    </div>
  );
}

function TeaserCard({
  href,
  icon: Icon,
  title,
  subtitle,
  accent,
}: {
  href: string;
  icon: typeof Newspaper;
  title: string;
  subtitle: string;
  accent: "hype" | "violet";
}) {
  return (
    <Link href={href} className="tap group block">
      <div className="glass relative flex items-center gap-3 overflow-hidden rounded-3xl p-4">
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgb(var(--${accent}) / 0.6), transparent)` }}
        />
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-line/10"
          style={{ background: `rgb(var(--${accent}) / 0.12)`, color: `rgb(var(--${accent}))` }}
        >
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-bold leading-tight text-ink">{title}</p>
          <p className="mt-0.5 text-xs leading-snug text-muted">{subtitle}</p>
        </div>
        <ArrowRight size={18} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>
    </Link>
  );
}
