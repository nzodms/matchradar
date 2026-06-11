"use client";

import { AlertSignupCard } from "@/components/AlertSignupCard";
import { AppShell } from "@/components/AppShell";
import { CalendarExportCard } from "@/components/CalendarExportCard";
import { MatchCardSkeleton } from "@/components/LoadingSkeleton";
import { MatchCard } from "@/components/MatchCard";
import { useFavorites, useTimezone } from "@/components/Providers";
import { SectionTitle } from "@/components/SectionTitle";
import { TeamPicker } from "@/components/TeamPicker";
import { TEAMS } from "@/data/teams";
import { TIMEZONES } from "@/lib/datetime";
import { allMatches, byHype } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { FanLevel, HydratedMatch, TimeSlot } from "@/types";
import { motion } from "framer-motion";
import {
  BarChart3,
  Check,
  Flag,
  Flame,
  Globe2,
  Hammer,
  Moon,
  Radio,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Sunset,
  TriangleAlert,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const FAN_LEVELS: { key: FanLevel; label: string; hint: string; icon: typeof Zap }[] = [
  { key: "gros-matchs", label: "Juste les gros matchs", hint: "On te garde l'essentiel", icon: Sparkles },
  { key: "mon-pays", label: "Suivre mon pays", hint: "Tes équipes en priorité", icon: Users },
  { key: "hype", label: "Le plus de hype", hint: "Les matchs qui buzzent", icon: Zap },
  { key: "tout", label: "Tout suivre", hint: "Aucun match raté", icon: Globe2 },
];

const SLOTS: { key: TimeSlot; label: string; icon: typeof Sun; range: string }[] = [
  { key: "matin", label: "Matin", icon: Sunrise, range: "6h–12h" },
  { key: "apres-midi", label: "Après-midi", icon: Sun, range: "12h–18h" },
  { key: "soir", label: "Soir", icon: Sunset, range: "18h–23h" },
  { key: "nuit", label: "Nuit", icon: Moon, range: "23h–6h" },
];

type Inclusion = "market" | "immanquables" | "pays" | "brulantes";
const INCLUSIONS: { key: Inclusion; label: string; icon: LucideIcon }[] = [
  { key: "brulantes", label: "Affiches brûlantes", icon: Flame },
  { key: "market", label: "Fort Market Pulse", icon: BarChart3 },
  { key: "pays", label: "Matchs de mon pays", icon: Flag },
  { key: "immanquables", label: "Seulement immanquables", icon: Star },
];

function bucket(time: string): TimeSlot {
  const h = Number(time.split(":")[0]);
  if (h >= 6 && h < 12) return "matin";
  if (h >= 12 && h < 18) return "apres-midi";
  if (h >= 18 && h < 23) return "soir";
  return "nuit";
}

const isPiege = (m: HydratedMatch) =>
  m.tags.includes("favori-en-danger") || m.marketSignal === "outsider-dangereux" || m.marketSignal === "piege-possible";
const isHot = (m: HydratedMatch) => m.heatLevel === "insane" || m.heatLevel === "very_hot";
const isMarket = (m: HydratedMatch) =>
  ["affiche-brulante", "match-serre", "outsider-dangereux", "piege-possible"].includes(m.marketSignal);

export default function CalendarPage() {
  const { favorites } = useFavorites();
  const { tzId, setTzId } = useTimezone();

  const [country, setCountry] = useState("fra");
  const [fanLevel, setFanLevel] = useState<FanLevel>("hype");
  const [slots, setSlots] = useState<TimeSlot[]>(["soir", "apres-midi"]);
  const [inclusions, setInclusions] = useState<Inclusion[]>(["brulantes", "pays"]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const countries = useMemo(() => [...TEAMS].sort((a, b) => a.name.localeCompare(b.name)), []);

  const recommended = useMemo<HydratedMatch[]>(() => {
    const favSet = new Set([...favorites, country]);
    const all = allMatches();

    // base pool from fan level
    let base = all;
    if (fanLevel === "gros-matchs") base = all.filter((m) => m.hypeScore >= 80);
    else if (fanLevel === "hype") base = all.filter((m) => m.hypeScore >= 70);
    else if (fanLevel === "mon-pays")
      base = all.filter((m) => favSet.has(m.homeTeamId) || favSet.has(m.awayTeamId) || m.hypeScore >= 90);

    // additive inclusions
    const pool = new Set(base);
    if (inclusions.includes("brulantes")) all.filter(isHot).forEach((m) => pool.add(m));
    if (inclusions.includes("market")) all.filter(isMarket).forEach((m) => pool.add(m));
    if (inclusions.includes("pays")) all.filter((m) => favSet.has(m.homeTeamId) || favSet.has(m.awayTeamId)).forEach((m) => pool.add(m));

    let result = [...pool];
    if (inclusions.includes("immanquables")) result = result.filter((m) => m.hypeScore >= 90);
    if (slots.length > 0 && slots.length < 4) result = result.filter((m) => slots.includes(bucket(m.time)));

    return result.sort(byHype);
  }, [favorites, country, fanLevel, slots, inclusions]);

  const stats = useMemo(
    () => ({
      total: recommended.length,
      immanquables: recommended.filter((m) => m.hypeScore >= 90).length,
      pieges: recommended.filter(isPiege).length,
      live: recommended.filter((m) => m.status === "live").length,
      hot: recommended.filter(isHot).length,
    }),
    [recommended],
  );

  const toggleSlot = (s: TimeSlot) => setSlots((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const toggleInc = (i: Inclusion) => setInclusions((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const generate = () => {
    setGenerating(true);
    setGenerated(true);
    setTimeout(() => {
      setGenerating(false);
      document.getElementById("radar-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 750);
  };

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/15 text-electric ring-1 ring-electric/30">
            <Hammer size={18} />
          </span>
          <div>
            <p className="eyebrow">Ton calendrier sportif</p>
            <h1 className="font-display text-xl font-bold leading-tight text-ink">Construis ton radar</h1>
          </div>
        </div>
        <p className="mb-5 text-sm leading-snug text-muted">
          Quelques réglages, et on te sort le calendrier des matchs faits pour toi — exportable en un tap.
        </p>
      </motion.div>

      {/* Pays + fuseau */}
      <div className="grid grid-cols-1 gap-3">
        <Field label="Ton pays">
          <SelectShell>
            <Globe2 size={16} className="text-faint" />
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-ink outline-none">
              {countries.map((t) => (
                <option key={t.id} value={t.id} className="bg-surface text-ink">{t.name}</option>
              ))}
            </select>
          </SelectShell>
        </Field>
        <Field label="Ton fuseau horaire">
          <SelectShell>
            <Globe2 size={16} className="text-faint" />
            <select value={tzId} onChange={(e) => setTzId(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-ink outline-none">
              {TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id} className="bg-surface text-ink">{tz.label}</option>
              ))}
            </select>
          </SelectShell>
        </Field>
      </div>

      {/* Niveau de fan */}
      <Field label="Ton niveau de fan" className="mt-4">
        <div className="grid grid-cols-2 gap-2">
          {FAN_LEVELS.map((lvl) => {
            const active = fanLevel === lvl.key;
            const Icon = lvl.icon;
            return (
              <button key={lvl.key} type="button" onClick={() => setFanLevel(lvl.key)} className={cn("tap relative flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all", active ? "border-hype/45 bg-hype/10 shadow-glow-hype" : "border-line/10 bg-surface/40")}>
                <Icon size={18} className={active ? "text-hype" : "text-muted"} />
                <span className="font-display text-[13px] font-bold leading-tight text-ink">{lvl.label}</span>
                <span className="text-[10.5px] text-faint">{lvl.hint}</span>
                {active && <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-hype text-bg"><Check size={10} strokeWidth={3} /></span>}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Créneaux */}
      <Field label="Tes créneaux dispo" className="mt-4">
        <div className="grid grid-cols-4 gap-2">
          {SLOTS.map((s) => {
            const active = slots.includes(s.key);
            const Icon = s.icon;
            return (
              <button key={s.key} type="button" onClick={() => toggleSlot(s.key)} className={cn("tap flex flex-col items-center gap-1 rounded-2xl border py-2.5 transition-all", active ? "border-electric/45 bg-electric/10" : "border-line/10 bg-surface/40")}>
                <Icon size={18} className={active ? "text-electric" : "text-muted"} />
                <span className="text-[11px] font-bold text-ink">{s.label}</span>
                <span className="text-[9px] text-faint">{s.range}</span>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Inclusions */}
      <Field label="Ce que tu veux dans ton radar" className="mt-4">
        <div className="flex flex-wrap gap-2">
          {INCLUSIONS.map((inc) => {
            const active = inclusions.includes(inc.key);
            const Icon = inc.icon;
            return (
              <button key={inc.key} type="button" onClick={() => toggleInc(inc.key)} className={cn("tap inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors", active ? "border-gold/30 bg-gold/10 text-gold" : "border-line/8 bg-surface/40 text-muted hover:text-ink")}>
                <Icon size={13} strokeWidth={2.4} />
                {inc.label}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Équipes favorites */}
      <Field label="Tes équipes favorites" className="mt-4">
        <TeamPicker limit={6} />
      </Field>

      <button type="button" onClick={generate} className="tap mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-hype py-4 font-display text-base font-bold text-bg shadow-glow-hype">
        <Zap size={18} className="fill-bg" /> {generated ? "Mettre à jour mon radar" : "Générer mon radar"}
      </button>

      {/* Result */}
      {generated && (
        <section id="radar-result" className="mt-7 scroll-mt-20">
          <div className="card-arcade relative overflow-hidden rounded-3xl p-5 text-center ring-1 ring-hype/15">
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-24"
              style={{ background: "radial-gradient(70% 100% at 50% 0%, rgb(var(--hype) / 0.12), transparent 70%)" }}
            />
            <Sparkles size={22} className="relative mx-auto mb-1.5 text-hype" />
            <p className="font-display text-xl font-bold text-ink">Ton radar est prêt.</p>
            <p className="mt-0.5 text-sm text-muted">
              Tu as <span className="font-bold text-hype tabular">{stats.total}</span> match{stats.total > 1 ? "s" : ""} chaud{stats.total > 1 ? "s" : ""} sur ton radar.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              <ResultPill icon={Star} value={stats.immanquables} label="immanquables" accent="danger" />
              <ResultPill icon={TriangleAlert} value={stats.pieges} label="pièges" accent="gold" />
              {stats.live > 0 && <ResultPill icon={Radio} value={stats.live} label="en live" accent="danger" />}
              <ResultPill icon={Flame} value={stats.hot} label="chauds" accent="hype" />
            </div>
          </div>

          {!generating && recommended.length > 0 && (
            <div className="mt-4">
              <CalendarExportCard matches={recommended} />
            </div>
          )}

          <div className="mt-5">
            <SectionTitle eyebrow="Aperçu du calendrier" title="Tes matchs à suivre" />
          </div>
          <div className="space-y-3">
            {generating ? (
              <>
                <MatchCardSkeleton />
                <MatchCardSkeleton />
                <MatchCardSkeleton />
              </>
            ) : recommended.length > 0 ? (
              recommended.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)
            ) : (
              <p className="rounded-2xl border border-line/10 bg-surface/40 p-6 text-center text-sm text-muted">
                Aucun match avec ces réglages. Élargis tes créneaux ou tes inclusions.
              </p>
            )}
          </div>

          {!generating && (
            <div className="mt-5">
              <AlertSignupCard title="Reçois ce radar chaque matin" subtitle="Ton calendrier perso et le brief du jour directement par email." cta="Recevoir le brief" />
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}

function ResultPill({ icon: Icon, value, label, accent }: { icon: LucideIcon; value: number; label: string; accent: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold" style={{ color: `rgb(var(--${accent}))`, borderColor: `rgb(var(--${accent}) / 0.3)`, background: `rgb(var(--${accent}) / 0.1)` }}>
      <Icon size={12} strokeWidth={2.4} /> <span className="tabular">{value}</span> <span className="text-muted">{label}</span>
    </span>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-faint">{label}</p>
      {children}
    </div>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return <div className="flex h-12 items-center gap-2 rounded-2xl border border-line/10 bg-surface/50 px-3 focus-within:border-hype/40">{children}</div>;
}
