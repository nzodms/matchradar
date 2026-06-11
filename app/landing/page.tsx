"use client";

import { HotMatchHero } from "@/components/HotMatchHero";
import { Logo } from "@/components/Logo";
import { RadarBackground } from "@/components/RadarBackground";
import { matchOfTheDay, todaysMatches } from "@/lib/selectors";
import type { AccentToken } from "@/types";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarHeart,
  Flame,
  MessageCircle,
  Rocket,
  Siren,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const FEATURES: { icon: LucideIcon; accent: AccentToken; title: string; text: string }[] = [
  {
    icon: Siren,
    accent: "hype",
    title: "Le match à ne pas rater chaque jour",
    text: "Un verdict clair : si tu n'en regardes qu'un aujourd'hui, c'est celui-là.",
  },
  {
    icon: Flame,
    accent: "danger",
    title: "Un score de hype clair",
    text: "Enjeu, rivalité, stars, ambiance : chaque match noté sur 100. Fini de deviner.",
  },
  {
    icon: Activity,
    accent: "gold",
    title: "Le Market Pulse en un coup d'œil",
    text: "Cotes indicatives, favori, match serré ou piège : tu sais direct ce que vaut l'affiche.",
  },
  {
    icon: CalendarHeart,
    accent: "electric",
    title: "Ton calendrier personnalisé",
    text: "Ton pays, tes équipes, tes créneaux. Export Google et Apple en un tap.",
  },
  {
    icon: MessageCircle,
    accent: "hype",
    title: "Un brief prêt à envoyer sur WhatsApp",
    text: "Le résumé du jour, copié-collé dans le groupe. Tu passes pour le pro du foot.",
  },
];

export default function LandingPage() {
  const upcoming = todaysMatches().filter((m) => m.status !== "live");
  const featured = upcoming.sort((a, b) => b.hypeScore - a.hypeScore)[0] ?? matchOfTheDay();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-bg">
        <div className="absolute inset-x-0 top-0 h-[520px]" style={{ background: "radial-gradient(120% 70% at 50% -10%, rgb(var(--hype) / 0.1), transparent 60%)" }} />
        <div className="bg-noise absolute inset-0 opacity-[0.035]" />
      </div>

      <div className="mx-auto max-w-lg px-4 pb-28">
        {/* top bar */}
        <header className="flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="tap inline-flex h-9 items-center gap-1.5 rounded-full border border-line/12 bg-surface/50 px-3 text-xs font-bold text-ink"
          >
            Ouvrir l'app <ArrowRight size={14} />
          </Link>
        </header>

        {/* hero */}
        <section className="relative -mx-4 overflow-hidden px-4 pb-4 pt-6">
          <RadarBackground accent="hype" />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hype/25 bg-hype/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-hype">
              <Trophy size={12} strokeWidth={2.4} /> Coupe du Monde · En direct
            </span>
            <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.05] tracking-tight text-ink">
              Il y a trop de matchs.
              <br />
              <span className="text-gradient-hype">On te dit lesquels regarder.</span>
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-snug text-muted">
              MatchRadar classe les matchs par hype, enjeu et intérêt réel pour te sortir les immanquables
              du jour.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/"
                className="tap inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-hype font-display font-bold text-bg shadow-glow-hype"
              >
                Voir le radar du jour <ArrowRight size={18} />
              </Link>
              <Link
                href="/calendar"
                className="tap inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-surface-2/50 font-display font-bold text-ink ring-1 ring-line/8"
              >
                Créer mon calendrier
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-4 text-xs text-faint">
              <Stat value="104" label="matchs analysés" />
              <span className="h-8 w-px bg-line/10" />
              <Stat value="/100" label="score de hype" />
              <span className="h-8 w-px bg-line/10" />
              <Stat value="0€" label="pour commencer" />
            </div>
          </motion.div>
        </section>

        {/* live proof */}
        <section className="mt-6">
          <p className="eyebrow mb-2">Aperçu en direct</p>
          <HotMatchHero match={featured} eyebrow="Le match à ne pas rater" />
        </section>

        {/* features */}
        <section className="mt-10 space-y-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card relative flex items-start gap-3 overflow-hidden rounded-3xl p-4"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, rgb(var(--${f.accent}) / 0.6), transparent)` }}
              />
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-line/10"
                style={{ background: `rgb(var(--${f.accent}) / 0.12)`, color: `rgb(var(--${f.accent}))` }}
              >
                <f.icon size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold leading-tight text-ink">{f.title}</h3>
                <p className="mt-1 text-[13px] leading-snug text-muted">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* roadmap teaser */}
        <section className="mt-6">
          <div className="card-arcade relative overflow-hidden rounded-3xl p-5">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-24" style={{ background: "radial-gradient(70% 100% at 80% 0%, rgb(var(--violet) / 0.14), transparent 70%)" }} />
            <Rocket size={22} className="text-violet" />
            <h3 className="mt-3 font-display text-xl font-bold leading-tight text-ink">
              Coupe du Monde maintenant. Wimbledon ensuite. Puis tous les gros événements.
            </h3>
            <p className="mt-2 text-[13px] leading-snug text-muted">
              F1, UFC, Tour de France, NBA, Ligue des Champions, Roland-Garros, Super Bowl, JO… Un seul radar
              pour ne plus jamais rater un grand moment de sport.
            </p>
            <Link href="/events" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet">
              Voir la roadmap <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* final CTA */}
        <section className="mt-10 text-center">
          <h2 className="font-display text-2xl font-bold leading-tight text-ink">
            Prêt à ne plus rien rater ?
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Ouvre le radar, repère ton match du jour et envoie le brief à tes potes. Ça prend 10 secondes.
          </p>
          <Link
            href="/"
            className="tap mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-hype px-7 font-display font-bold text-bg shadow-glow-hype"
          >
            Voir les matchs du jour <ArrowRight size={18} />
          </Link>
        </section>

        <footer className="mt-12 border-t border-line/8 pt-6 text-center">
          <Logo className="justify-center" />
          <p className="mt-2 text-xs text-faint">
            Le radar des événements sportifs à ne pas rater. Pas de paris, juste les bons matchs.
          </p>
        </footer>
      </div>

      {/* sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 safe-bottom">
        <div className="mx-auto max-w-lg px-4 pb-3">
          <Link
            href="/"
            className="tap glass-strong flex items-center justify-center gap-2 rounded-2xl py-4 font-display font-bold text-ink shadow-card"
          >
            <Flame size={18} className="text-hype" /> Ouvrir MatchRadar
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-lg font-bold leading-none text-ink tabular">{value}</p>
      <p className="mt-0.5 text-[10px] text-faint">{label}</p>
    </div>
  );
}
