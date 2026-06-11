"use client";

import { AppShell } from "@/components/AppShell";
import { DailyHotBoard } from "@/components/DailyHotBoard";
import { EventSwitcher } from "@/components/EventSwitcher";
import { HotMarketSection } from "@/components/HotMarketSection";
import { HotMatchHero } from "@/components/HotMatchHero";
import { EmptyState } from "@/components/EmptyState";
import { LiveMatchCard, MatchCard } from "@/components/MatchCard";
import { useFavorites } from "@/components/Providers";
import { SectionTitle } from "@/components/SectionTitle";
import { SportTicker } from "@/components/SportTicker";
import { Tabs, type TabOption } from "@/components/Tabs";
import {
  applyHomeFilter,
  liveMatches,
  matchOfTheDay,
  matchesForOffset,
  matchesForTeams,
  todaysMatches,
} from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { HomeFilter } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  LayoutGrid,
  MessageCircle,
  Newspaper,
  Radar,
  Radio,
  Rocket,
  Scale,
  Star,
  Swords,
  Trophy,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type DayKey = "today" | "tomorrow" | "week" | "teams";

const FILTERS: { key: HomeFilter; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "Tous", icon: LayoutGrid },
  { key: "immanquables", label: "Immanquables", icon: Star },
  { key: "live", label: "En live", icon: Radio },
  { key: "market", label: "Market Pulse", icon: BarChart3 },
  { key: "serres", label: "Serrés", icon: Scale },
  { key: "outsiders", label: "Outsiders", icon: Swords },
  { key: "favori-danger", label: "Favori en danger", icon: TriangleAlert },
  { key: "whatsapp", label: "Pour WhatsApp", icon: MessageCircle },
];

export default function RadarPage() {
  const { favorites } = useFavorites();
  const [day, setDay] = useState<DayKey>("today");
  const [filter, setFilter] = useState<HomeFilter>("all");

  const today = todaysMatches();
  const tomorrow = useMemo(() => matchesForOffset((o) => o === 1), []);
  const week = useMemo(() => matchesForOffset((o) => o >= 2), []);
  const teamMatches = useMemo(() => matchesForTeams(favorites), [favorites]);
  const live = liveMatches();

  // The headline affiche = hottest upcoming today (falls back to match of the day).
  const affiche = useMemo(
    () => today.filter((m) => m.status !== "live").sort((a, b) => b.hypeScore - a.hypeScore)[0] ?? matchOfTheDay(),
    [today],
  );

  const immanquables = today.filter((m) => m.hypeScore >= 90).length;

  const dayList = day === "today" ? today : day === "tomorrow" ? tomorrow : day === "week" ? week : teamMatches;
  const list = useMemo(() => applyHomeFilter(dayList, filter), [dayList, filter]);

  const dayTabs: TabOption<DayKey>[] = [
    { key: "today", label: "Aujourd'hui", count: today.length },
    { key: "tomorrow", label: "Demain", count: tomorrow.length },
    { key: "week", label: "Cette semaine", count: week.length },
    { key: "teams", label: "Mes équipes", count: teamMatches.length },
  ];

  return (
    <AppShell>
      {/* ─── Hero ─── */}
      <section className="relative -mx-4 overflow-hidden px-4 pb-2 pt-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hype/25 bg-hype/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-hype">
              <Trophy size={11} strokeWidth={2.4} /> Coupe du Monde
              <span className="mx-0.5 h-2.5 w-px bg-hype/30" />
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-hype" /> En direct
            </span>
          </div>

          <h1 className="font-display text-[30px] font-bold leading-[1.05] tracking-tight text-ink">
            Ce soir, tu <span className="text-gradient-hype">regardes quoi</span> ?
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-snug text-muted">
            Le radar classe les matchs par hype, enjeu et tension du marché. On te sort les affiches chaudes,
            tu choisis ton match.
          </p>

          <div className="mt-3.5">
            <SportTicker />
          </div>

          <div className="card mt-4 flex items-center rounded-2xl">
            <Stat value={today.length} label="aujourd'hui" />
            <Divider />
            <Stat value={immanquables} label="immanquables" accent="hype" />
            <Divider />
            <Stat value={live.length} label="en direct" accent="danger" live={live.length > 0} />
          </div>
        </motion.div>
      </section>

      {/* ─── Event switcher ─── */}
      <div className="mt-4">
        <EventSwitcher activeId="wc" />
      </div>

      {/* ─── En direct ─── */}
      {live.length > 0 && (
        <section className="mt-5">
          <SectionTitle eyebrow="Ça se passe maintenant" title="En direct" />
          <div className="space-y-3">
            {live.map((m, i) => (
              <LiveMatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Affiche du jour ─── */}
      <section className="mt-5">
        <SectionTitle eyebrow="Le verdict du radar" title="Le match à ne pas rater" />
        <HotMatchHero match={affiche} eyebrow="Le match à ne pas rater ce soir" />
      </section>

      {/* ─── Hot Board ─── */}
      <section className="mt-7">
        <SectionTitle
          eyebrow="Le classement du jour"
          title="Les plus chauds du jour"
          action={<span className="text-[11px] font-bold uppercase tracking-wide text-faint">Hot Board</span>}
        />
        <DailyHotBoard />
      </section>

      {/* ─── Market Pulse ─── */}
      <section className="mt-7">
        <SectionTitle eyebrow="Cotes indicatives" title="Le marché chauffe" />
        <HotMarketSection />
      </section>

      {/* ─── Programme ─── */}
      <section className="mt-7">
        <SectionTitle
          eyebrow="Le programme"
          title="Tous les matchs"
          action={
            <Link href="/brief" className="inline-flex items-center gap-1 text-xs font-bold text-hype">
              Le brief <ArrowRight size={13} />
            </Link>
          }
        />
        <Tabs options={dayTabs} value={day} onChange={(d) => { setDay(d); }} className="mb-2.5" />

        {/* filter chips */}
        <div className="-mx-4 mask-fade-x">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-1">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "tap inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                    active ? "border-hype/30 bg-hype/12 text-hype" : "border-line/8 bg-surface/40 text-muted hover:text-ink",
                  )}
                >
                  <Icon size={13} strokeWidth={2.4} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {list.length > 0 ? (
            list.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)
          ) : day === "teams" && teamMatches.length === 0 ? (
            <EmptyState
              icon={Star}
              title="Aucune équipe favorite"
              description="Choisis tes équipes pour voir leurs matchs ici en priorité."
              action={
                <Link href="/favorites" className="tap inline-flex h-10 items-center gap-2 rounded-2xl bg-hype px-4 text-sm font-bold text-bg shadow-glow-hype">
                  Choisir mes équipes <ArrowRight size={16} />
                </Link>
              }
            />
          ) : (
            <EmptyState icon={Radar} title="Aucun match sur ce filtre" description="Change de filtre ou de jour, le radar a forcément quelque chose pour toi." />
          )}
        </div>
      </section>

      {/* ─── Teasers ─── */}
      <section className="mt-7 grid grid-cols-1 gap-3">
        <TeaserCard href="/brief" icon={Newspaper} accent="hype" title="Le brief du jour" subtitle="3 matchs, 1 immanquable, 1 verdict. Prêt à envoyer dans ton groupe." />
        <TeaserCard href="/events" icon={Rocket} accent="violet" title="Coupe du Monde maintenant. Wimbledon ensuite." subtitle="Active les prochains radars : F1, UFC, Tour de France, NBA, Ligue des Champions." />
      </section>
    </AppShell>
  );
}

function Divider() {
  return <span className="h-9 w-px bg-line/8" />;
}

function Stat({ value, label, accent, live }: { value: number; label: string; accent?: "hype" | "danger"; live?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-3">
      <span className="flex items-center gap-1.5 font-display text-[22px] font-bold leading-none tabular" style={{ color: accent ? `rgb(var(--${accent}))` : "rgb(var(--ink))" }}>
        {live && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
          </span>
        )}
        {value}
      </span>
      <span className="mt-1 text-[10.5px] font-medium text-faint">{label}</span>
    </div>
  );
}

function TeaserCard({ href, icon: Icon, title, subtitle, accent }: { href: string; icon: typeof Newspaper; title: string; subtitle: string; accent: "hype" | "violet" }) {
  return (
    <Link href={href} className="tap group block">
      <div className="card relative flex items-center gap-3 overflow-hidden rounded-3xl p-4">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgb(var(--${accent}) / 0.6), transparent)` }} />
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-line/10" style={{ background: `rgb(var(--${accent}) / 0.12)`, color: `rgb(var(--${accent}))` }}>
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
