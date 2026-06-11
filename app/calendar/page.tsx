"use client";

import { AlertSignupCard } from "@/components/AlertSignupCard";
import { AppShell } from "@/components/AppShell";
import { CalendarExportCard } from "@/components/CalendarExportCard";
import { MatchCard } from "@/components/MatchCard";
import { useFavorites, useTimezone } from "@/components/Providers";
import { MatchCardSkeleton } from "@/components/LoadingSkeleton";
import { SectionTitle } from "@/components/SectionTitle";
import { TeamPicker } from "@/components/TeamPicker";
import { TEAMS } from "@/data/teams";
import { TIMEZONES } from "@/lib/datetime";
import { allMatches, byHype } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { FanLevel, HydratedMatch, TimeSlot } from "@/types";
import { motion } from "framer-motion";
import { CalendarHeart, Check, Globe2, Moon, Sparkles, Sun, Sunrise, Sunset, Users, Zap } from "lucide-react";
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

function bucket(time: string): TimeSlot {
  const h = Number(time.split(":")[0]);
  if (h >= 6 && h < 12) return "matin";
  if (h >= 12 && h < 18) return "apres-midi";
  if (h >= 18 && h < 23) return "soir";
  return "nuit";
}

export default function CalendarPage() {
  const { favorites } = useFavorites();
  const { tzId, setTzId } = useTimezone();

  const [country, setCountry] = useState("fra");
  const [fanLevel, setFanLevel] = useState<FanLevel>("hype");
  const [slots, setSlots] = useState<TimeSlot[]>(["soir", "apres-midi"]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const countries = useMemo(() => [...TEAMS].sort((a, b) => a.name.localeCompare(b.name)), []);

  const recommended = useMemo<HydratedMatch[]>(() => {
    let pool = allMatches();
    const favSet = new Set([...favorites, country]);

    if (fanLevel === "gros-matchs") pool = pool.filter((m) => m.hypeScore >= 80);
    else if (fanLevel === "hype") pool = pool.filter((m) => m.hypeScore >= 70);
    else if (fanLevel === "mon-pays")
      pool = pool.filter((m) => favSet.has(m.homeTeamId) || favSet.has(m.awayTeamId) || m.hypeScore >= 90);

    if (slots.length > 0 && slots.length < 4) {
      pool = pool.filter((m) => slots.includes(bucket(m.time)));
    }
    return pool.sort(byHype);
  }, [favorites, country, fanLevel, slots]);

  const toggleSlot = (s: TimeSlot) =>
    setSlots((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

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
            <CalendarHeart size={18} />
          </span>
          <div>
            <p className="eyebrow">Ton calendrier sportif</p>
            <h1 className="font-display text-xl font-bold leading-tight text-ink">Personnalise ton radar</h1>
          </div>
        </div>
        <p className="mb-5 text-sm leading-snug text-muted">
          Réponds à 4 questions, on te sort le calendrier des matchs faits pour toi — exportable en un tap.
        </p>
      </motion.div>

      {/* Pays + fuseau */}
      <div className="grid grid-cols-1 gap-3">
        <Field label="Ton pays">
          <SelectShell>
            <Globe2 size={16} className="text-faint" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
            >
              {countries.map((t) => (
                <option key={t.id} value={t.id} className="bg-surface text-ink">
                  {t.flag} {t.name}
                </option>
              ))}
            </select>
          </SelectShell>
        </Field>

        <Field label="Ton fuseau horaire">
          <SelectShell>
            <Globe2 size={16} className="text-faint" />
            <select
              value={tzId}
              onChange={(e) => setTzId(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id} className="bg-surface text-ink">
                  {tz.label}
                </option>
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
              <button
                key={lvl.key}
                type="button"
                onClick={() => setFanLevel(lvl.key)}
                className={cn(
                  "tap relative flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all",
                  active ? "border-hype/45 bg-hype/10 shadow-glow-hype" : "border-line/10 bg-surface/40",
                )}
              >
                <Icon size={18} className={active ? "text-hype" : "text-muted"} />
                <span className="font-display text-[13px] font-bold leading-tight text-ink">{lvl.label}</span>
                <span className="text-[10.5px] text-faint">{lvl.hint}</span>
                {active && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-hype text-bg">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
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
              <button
                key={s.key}
                type="button"
                onClick={() => toggleSlot(s.key)}
                className={cn(
                  "tap flex flex-col items-center gap-1 rounded-2xl border py-2.5 transition-all",
                  active ? "border-electric/45 bg-electric/10" : "border-line/10 bg-surface/40",
                )}
              >
                <Icon size={18} className={active ? "text-electric" : "text-muted"} />
                <span className="text-[11px] font-bold text-ink">{s.label}</span>
                <span className="text-[9px] text-faint">{s.range}</span>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Équipes favorites */}
      <Field label="Tes équipes favorites" className="mt-4">
        <TeamPicker limit={6} />
      </Field>

      {/* Generate */}
      <button
        type="button"
        onClick={generate}
        className="tap mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-hype py-4 font-display text-base font-bold text-bg shadow-glow-hype"
      >
        <Zap size={18} className="fill-bg" /> {generated ? "Mettre à jour mon radar" : "Générer mon radar"}
      </button>

      {/* Result */}
      {generated && (
        <section id="radar-result" className="mt-7 scroll-mt-20">
          <div className="mb-3 rounded-3xl border border-hype/25 bg-hype/8 p-4 text-center">
            <Sparkles size={20} className="mx-auto mb-1.5 text-hype" />
            <p className="font-display text-lg font-bold text-ink">Ton radar est prêt.</p>
            <p className="text-sm text-muted">
              On te recommande{" "}
              <span className="font-bold text-hype tabular">{recommended.length}</span> match
              {recommended.length > 1 ? "s" : ""} cette semaine.
            </p>
          </div>

          {!generating && recommended.length > 0 && (
            <div className="mb-4">
              <CalendarExportCard matches={recommended} />
            </div>
          )}

          <SectionTitle eyebrow="Sélection pour toi" title="Tes matchs à suivre" />
          <div className="space-y-3">
            {generating ? (
              <>
                <MatchCardSkeleton />
                <MatchCardSkeleton />
                <MatchCardSkeleton />
              </>
            ) : (
              recommended.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)
            )}
          </div>

          {!generating && (
            <div className="mt-5">
              <AlertSignupCard
                title="Reçois ce radar chaque matin"
                subtitle="Ton calendrier perso et le brief du jour directement par email."
                cta="Recevoir le brief"
              />
            </div>
          )}
        </section>
      )}
    </AppShell>
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
  return (
    <div className="flex h-12 items-center gap-2 rounded-2xl border border-line/10 bg-surface/50 px-3 focus-within:border-hype/40">
      {children}
    </div>
  );
}
