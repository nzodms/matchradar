"use client";

import { AlertSignupCard } from "@/components/AlertSignupCard";
import { AppShell } from "@/components/AppShell";
import { SportEventCard } from "@/components/SportEventCard";
import { ACTIVE_EVENT, COMING_SOON_EVENTS } from "@/data/events";
import { motion } from "framer-motion";
import { ArrowRight, Radar } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="eyebrow">La roadmap MatchRadar</p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight text-ink">
          Les prochains radars arrivent.
        </h1>
        <p className="mt-2 text-sm leading-snug text-muted">
          MatchRadar ne s'arrête pas au foot. Après la Coupe du Monde, active les radars Wimbledon, F1,
          UFC, Tour de France, NBA et Ligue des Champions.
        </p>
      </motion.div>

      {/* Active radar */}
      <Link href="/" className="tap group mt-5 block">
        <div className="glass relative overflow-hidden rounded-3xl p-4 shadow-glow-hype">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hype/70 to-transparent" />
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-hype/12 text-3xl ring-1 ring-hype/25">
              {ACTIVE_EVENT.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-ink">{ACTIVE_EVENT.name}</h3>
                <span className="inline-flex items-center gap-1 rounded-full border border-hype/40 bg-hype/12 px-2 py-0.5 text-[10px] font-bold uppercase text-hype">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-hype" /> En direct
                </span>
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-muted">{ACTIVE_EVENT.tagline}</p>
            </div>
            <ArrowRight size={18} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-hype" />
          </div>
        </div>
      </Link>

      {/* Coming soon roadmap */}
      <div className="mb-3 mt-6 flex items-center gap-2">
        <Radar size={16} className="text-violet" />
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Bientôt sur le radar</h2>
        <span className="ml-auto rounded-full bg-line/10 px-2 py-0.5 text-[11px] font-bold tabular text-muted">
          {COMING_SOON_EVENTS.length}
        </span>
      </div>

      <div className="space-y-3">
        {COMING_SOON_EVENTS.map((event, i) => (
          <SportEventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      <div className="mt-6">
        <AlertSignupCard
          title="Sois prévenu à chaque lancement"
          subtitle="Un email quand un nouveau radar s'allume. Wimbledon, F1, UFC… tu seras le premier au courant."
          cta="Me prévenir"
        />
      </div>
    </AppShell>
  );
}
