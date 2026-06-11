"use client";

import { AppShell } from "@/components/AppShell";
import { HypeScore } from "@/components/HypeScore";
import { ImportanceScore, StatBar } from "@/components/ImportanceScore";
import { InfoBlock } from "@/components/InfoBlock";
import { LiveBadge } from "@/components/LiveBadge";
import { MarketPulseCard } from "@/components/MarketPulseCard";
import { MatchHeatMeter } from "@/components/MatchHeatMeter";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { useTimezone } from "@/components/Providers";
import { PremiumGlowCard } from "@/components/PremiumGlowCard";
import { RadarBackground } from "@/components/RadarBackground";
import { ResponsibleGamingNote } from "@/components/ResponsibleGamingNote";
import { TeamCrest } from "@/components/TeamCrest";
import { WhatsAppCopyCard } from "@/components/WhatsAppCopyCard";
import { AddCalendarButton, GoogleCalendarButton, RemindButton, ShareButton } from "@/components/actions";
import { EmptyState } from "@/components/EmptyState";
import { displayTime } from "@/lib/datetime";
import { HYPE_FACTOR_LABELS, getHypeTier } from "@/lib/hype";
import { getCasualVerdict, getGroupChatCopy, getHardcoreVerdict, getHeatLabel } from "@/lib/market";
import { getHydratedMatch } from "@/lib/selectors";
import { matchWhatsApp } from "@/lib/whatsapp";
import type { HypeFactors } from "@/types";
import { motion } from "framer-motion";
import {
  BarChart3,
  Clapperboard,
  Clock,
  Flame,
  ListChecks,
  MapPin,
  Radar,
  Sofa,
  Sparkles,
  Star,
  Target,
  Trophy,
  Tv,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = getHydratedMatch(params.id);
  const { tzId } = useTimezone();

  if (!match) {
    return (
      <AppShell back>
        <div className="pt-10">
          <EmptyState
            icon={Radar}
            title="Match introuvable"
            description="Ce match n'est pas (ou plus) sur le radar."
            action={
              <Link href="/" className="tap inline-flex h-10 items-center rounded-2xl bg-hype px-4 text-sm font-bold text-bg shadow-glow-hype">
                Retour au radar
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  const tier = getHypeTier(match.hypeScore);
  const accent = tier.accent;
  const heat = getHeatLabel(match.heatLevel);
  const isLive = match.status === "live";
  const { time, dayShift } = displayTime(match.time, tzId);
  const factorKeys = Object.keys(match.hypeFactors) as (keyof HypeFactors)[];

  return (
    <AppShell back>
      {/* ─── Hero ─── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <PremiumGlowCard accent={accent} glow inset={false} className="card-arcade sheen p-5">
          <RadarBackground accent={accent} intensity="bold" className="opacity-75" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/60 px-2.5 py-1 text-[11px] font-bold text-muted ring-1 ring-line/10">
                <Trophy size={12} className="text-gold" /> {match.competition} · {match.round}
              </span>
              {isLive ? <LiveBadge minute={match.liveMinute} /> : (
                <span className="inline-flex items-center gap-1 text-[12px] font-bold" style={{ color: `rgb(var(--${heat.accent}))` }}>
                  {heat.emoji} {heat.label}
                </span>
              )}
            </div>

            <p className="mb-2 text-center font-display text-[13px] font-semibold text-muted">« {match.emotionalTag} »</p>

            <div className="flex items-center justify-between gap-2">
              <TeamCrest team={match.home} align="center" size="lg" showRank className="flex-1" />
              <div className="flex flex-col items-center">
                {isLive && match.homeScore != null ? (
                  <>
                    <span className="font-display text-4xl font-bold tabular text-ink">
                      {match.homeScore}<span className="px-1.5 text-muted">-</span>{match.awayScore}
                    </span>
                    <HypeScore score={match.hypeScore} size="sm" className="mt-1" />
                  </>
                ) : (
                  <HypeScore score={match.hypeScore} size="lg" showTier />
                )}
              </div>
              <TeamCrest team={match.away} align="center" size="lg" showRank className="flex-1" />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-medium text-muted">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {isLive ? "En direct" : time}
                {dayShift !== 0 && <span className="text-faint">({dayShift > 0 ? "J+1" : "J-1"})</span>}
              </span>
              <span className="text-faint">·</span>
              <span className="inline-flex items-center gap-1"><MapPin size={12} /> {match.venue}, {match.city}</span>
              {match.broadcasters[0] && (
                <>
                  <span className="text-faint">·</span>
                  <span className="inline-flex items-center gap-1 text-ink"><Tv size={12} /> {match.broadcasters.join(" / ")}</span>
                </>
              )}
            </div>

            <div className="mt-4">
              <MatchHeatMeter level={match.heatLevel} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <RemindButton match={match} />
              <AddCalendarButton match={match} />
              <ShareButton match={match} />
            </div>
          </div>
        </PremiumGlowCard>
      </motion.div>

      {/* ─── Verdict ─── */}
      <div className="mt-4 flex items-start gap-3 rounded-3xl border p-4" style={{ borderColor: `rgb(var(--${accent}) / 0.3)`, background: `rgb(var(--${accent}) / 0.08)` }}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `rgb(var(--${accent}) / 0.15)`, color: `rgb(var(--${accent}))` }}>
          <Sparkles size={18} />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: `rgb(var(--${accent}))` }}>
            Si tu n'as le temps que pour un match
          </p>
          <p className="mt-0.5 font-display text-base font-bold leading-snug text-ink">{match.watchVerdictShort}</p>
          <p className="mt-1 text-[13px] leading-snug text-muted">{match.watchVerdictLong}</p>
        </div>
      </div>

      {/* ─── Market Pulse ─── */}
      <div className="mt-4">
        <MarketPulseCard match={match} />
      </div>

      {/* ─── Score detail ─── */}
      <div className="mt-4 glass rounded-3xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-hype/14 text-hype ring-1 ring-line/10">
            <BarChart3 size={15} />
          </span>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Le détail du score</h3>
          <span className="ml-auto font-display text-sm font-bold tabular" style={{ color: `rgb(var(--${accent}))` }}>Hype {match.hypeScore}/100</span>
        </div>
        <ImportanceScore score={match.importanceScore} className="mb-4" />
        <div className="space-y-3">
          {factorKeys.map((key, i) => (
            <StatBar key={key} value={match.hypeFactors[key]} label={HYPE_FACTOR_LABELS[key]} accent={accent} delay={i * 0.06} />
          ))}
        </div>
      </div>

      {/* ─── Key stat ─── */}
      <div className="mt-4 flex items-center gap-3 rounded-3xl border border-electric/20 bg-electric/[0.06] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-electric/15 text-electric ring-1 ring-electric/25">
          <Star size={18} />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-electric">La stat qui compte</p>
          <p className="mt-0.5 text-[13.5px] font-semibold leading-snug text-ink">{match.keyStat}</p>
        </div>
      </div>

      {/* ─── Why watch ─── */}
      <div className="mt-4 space-y-3">
        <InfoBlock icon={Target} title="Pourquoi regarder ce match ?" accent={accent}>{match.reasonToWatch}</InfoBlock>
        <InfoBlock icon={Clapperboard} title="Le scénario probable" accent="electric">{match.story}</InfoBlock>
        <InfoBlock icon={Trophy} title="Ce qui est en jeu" accent="gold">{match.atStake}</InfoBlock>
      </div>

      {/* ─── Storylines ─── */}
      <div className="mt-4 glass rounded-3xl p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet/14 text-violet ring-1 ring-line/10">
            <ListChecks size={15} />
          </span>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Les fils à suivre</h3>
        </div>
        <ul className="space-y-2">
          {match.storylines.map((s) => (
            <li key={s} className="flex items-start gap-2 text-[13.5px] leading-snug text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `rgb(var(--${accent}))` }} />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Key players ─── */}
      <div className="mt-4 glass rounded-3xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/14 text-gold ring-1 ring-line/10">
            <Users size={15} />
          </span>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Joueurs à surveiller</h3>
        </div>
        <div className="space-y-2">
          {match.keyPlayers.map((p) => (
            <div key={p.name} className="flex items-center gap-3 rounded-2xl border border-line/8 bg-surface/40 p-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2/60 text-xl ring-1 ring-line/10">{p.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-ink">{p.name}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">{p.role}</p>
              </div>
              <p className="hidden max-w-[45%] text-right text-[11px] leading-snug text-muted sm:block">{p.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Who for + audience verdicts ─── */}
      <div className="mt-4 glass rounded-3xl p-4">
        <h3 className="mb-2.5 font-display text-sm font-bold uppercase tracking-wide text-ink">Pour qui ce match est fait ?</h3>
        <div className="flex flex-wrap gap-2">
          {match.whoFor.map((w) => (
            <span key={w} className="inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-surface/50 px-3 py-1.5 text-[12px] font-semibold text-ink">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(var(--${accent}))` }} />
              {w}
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <VerdictRow icon={Sofa} accent="hype" label="Fan occasionnel" text={getCasualVerdict(match)} />
          <VerdictRow icon={Flame} accent="violet" label="Vrai passionné" text={getHardcoreVerdict(match)} />
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gold/20 bg-gold/[0.07] px-3 py-2.5">
          <span className="text-lg">📱</span>
          <p className="text-[12.5px] font-semibold text-ink">{getGroupChatCopy(match)}</p>
        </div>
      </div>

      {/* ─── WhatsApp ─── */}
      <div className="mt-4">
        <WhatsAppCopyCard text={matchWhatsApp(match, tzId)} subtitle="Balance ça dans le groupe, ils comprendront direct." />
      </div>

      {/* ─── Calendar ─── */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <AddCalendarButton match={match} full variant="outline" />
        <GoogleCalendarButton match={match} full />
      </div>

      {/* ─── Compliance ─── */}
      <ResponsibleGamingNote className="mt-4" />
    </AppShell>
  );
}

function VerdictRow({ icon: Icon, accent, label, text }: { icon: typeof Sofa; accent: string; label: string; text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-line/8 bg-surface/40 p-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-line/10" style={{ background: `rgb(var(--${accent}) / 0.14)`, color: `rgb(var(--${accent}))` }}>
        <Icon size={14} />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-faint">{label}</p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-ink">{text}</p>
      </div>
    </div>
  );
}
