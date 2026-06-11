"use client";

import { AlertSignupCard } from "@/components/AlertSignupCard";
import { AppShell } from "@/components/AppShell";
import { SportEventCard } from "@/components/SportEventCard";
import { useToast } from "@/components/Toast";
import { ACTIVE_EVENT, COMING_SOON_EVENTS, getEvent } from "@/data/events";
import { getEventIcon } from "@/lib/eventIcons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, Radar, Sparkles, Vote } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const VOTE_OPTIONS = [
  { id: "wimbledon", label: "Wimbledon", base: 1240 },
  { id: "f1", label: "Formule 1", base: 1980 },
  { id: "ufc", label: "UFC", base: 1610 },
  { id: "tdf", label: "Tour de France", base: 870 },
];

export default function EventsPage() {
  const wimbledon = getEvent("wimbledon");
  const rest = COMING_SOON_EVENTS.filter((e) => e.id !== "wimbledon");

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="eyebrow">La roadmap MatchRadar</p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight text-ink">
          Après la Coupe du Monde, le radar continue.
        </h1>
        <p className="mt-2 text-sm leading-snug text-muted">
          MatchRadar ne s'arrête pas au foot. Active les radars Wimbledon, F1, UFC, Tour de France, NBA et
          Ligue des Champions — on te dira quoi regarder à chaque fois.
        </p>
      </motion.div>

      {/* Active radar */}
      <Link href="/" className="tap group mt-5 block">
        <div className="card-arcade relative overflow-hidden rounded-3xl p-4 ring-1 ring-hype/15">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-20" style={{ background: "radial-gradient(70% 100% at 50% 0%, rgb(var(--hype) / 0.1), transparent 70%)" }} />
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-hype/12 text-hype ring-1 ring-hype/25">
              {(() => {
                const Icon = getEventIcon(ACTIVE_EVENT.id);
                return <Icon size={26} strokeWidth={2} />;
              })()}
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

      {/* Next big radar — Wimbledon */}
      {wimbledon && (
        <section className="mt-6">
          <div className="mb-2.5 flex items-center gap-2">
            <Sparkles size={15} className="text-violet" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Le prochain gros radar</h2>
          </div>
          <SportEventCard event={wimbledon} index={0} />
        </section>
      )}

      {/* Vote */}
      <NextRadarVote />

      {/* Coming soon roadmap */}
      <div className="mb-3 mt-7 flex items-center gap-2">
        <Radar size={16} className="text-violet" />
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Bientôt sur le radar</h2>
        <span className="ml-auto rounded-full bg-line/10 px-2 py-0.5 text-[11px] font-bold tabular text-muted">{rest.length}</span>
      </div>
      <div className="space-y-3">
        {rest.map((event, i) => (
          <SportEventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      <div className="mt-6">
        <AlertSignupCard title="Sois prévenu à chaque lancement" subtitle="Un email quand un nouveau radar s'allume. Wimbledon, F1, UFC… tu seras le premier au courant." cta="Me prévenir" />
      </div>
    </AppShell>
  );
}

function NextRadarVote() {
  const { toast } = useToast();
  const [voted, setVoted] = useState<string | null>(null);

  const totals = useMemo(() => {
    const map: Record<string, number> = {};
    let sum = 0;
    for (const o of VOTE_OPTIONS) {
      const v = o.base + (voted === o.id ? 1 : 0);
      map[o.id] = v;
      sum += v;
    }
    return { map, sum };
  }, [voted]);

  return (
    <section className="mt-7">
      <div className="card-arcade relative overflow-hidden rounded-3xl p-4">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-20" style={{ background: "radial-gradient(70% 100% at 30% 0%, rgb(var(--violet) / 0.12), transparent 70%)" }} />
        <div className="relative mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/15 text-violet ring-1 ring-violet/30">
            <Vote size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink">Vote pour le prochain radar</p>
            <p className="text-[11px] text-muted">{voted ? "Merci ! Voici les tendances." : "Quel radar tu veux en premier ?"}</p>
          </div>
        </div>

        <div className="relative space-y-2">
          {VOTE_OPTIONS.map((o) => {
            const pct = Math.round((totals.map[o.id] / totals.sum) * 100);
            const isMine = voted === o.id;
            return (
              <button
                key={o.id}
                type="button"
                disabled={!!voted}
                onClick={() => {
                  setVoted(o.id);
                  toast(`Vote pour ${o.label} enregistré`);
                }}
                className={cn(
                  "relative w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all",
                  isMine ? "border-violet/50 bg-violet/10" : "border-line/10 bg-bg/30",
                  !voted && "tap hover:border-line/25",
                )}
              >
                {voted && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-xl transition-all duration-700"
                    style={{ width: `${pct}%`, background: `rgb(var(--violet) / ${isMine ? 0.22 : 0.12})` }}
                  />
                )}
                <span className="relative flex items-center gap-2.5">
                  {(() => {
                    const Icon = getEventIcon(o.id);
                    return <Icon size={17} strokeWidth={2.2} className="text-muted" />;
                  })()}
                  <span className="flex-1 font-display text-sm font-bold text-ink">{o.label}</span>
                  {isMine && <Check size={14} className="text-violet" strokeWidth={3} />}
                  {voted && <span className="font-display text-sm font-bold tabular text-violet">{pct}%</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
