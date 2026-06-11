"use client";

import { AppShell } from "@/components/AppShell";
import { HypeScore } from "@/components/HypeScore";
import { StatBar } from "@/components/ImportanceScore";
import { MarketPulseCard } from "@/components/MarketPulseCard";
import { MatchHeatMeter } from "@/components/MatchHeatMeter";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { useTimezone } from "@/components/Providers";
import { ResponsibleGamingNote } from "@/components/ResponsibleGamingNote";
import { TeamCrest } from "@/components/TeamCrest";
import { WhatsAppCopyCard } from "@/components/WhatsAppCopyCard";
import { AddCalendarButton, GoogleCalendarButton, RemindButton, ShareButton } from "@/components/actions";
import { EmptyState } from "@/components/EmptyState";
import { LiveBadge } from "@/components/LiveBadge";
import { displayTime } from "@/lib/datetime";
import { HYPE_FACTOR_LABELS, getHypeTier, importanceLabel } from "@/lib/hype";
import { getCasualVerdict, getGroupChatCopy, getHardcoreVerdict, getHeatLabel } from "@/lib/market";
import { getHydratedMatch } from "@/lib/selectors";
import { matchWhatsApp } from "@/lib/whatsapp";
import type { HypeFactors } from "@/types";
import { motion } from "framer-motion";
import { Clapperboard, MapPin, Radar, Sofa, Sparkles, Star, Target, Trophy, Tv, Users } from "lucide-react";
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
              <Link href="/" className="tap inline-flex h-10 items-center rounded-2xl bg-hype px-4 text-sm font-bold text-bg">
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
        <div className="card-arcade relative overflow-hidden rounded-[1.75rem] p-5">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-40"
            style={{ background: `radial-gradient(80% 100% at 50% 0%, rgb(var(--${accent}) / 0.14), transparent 70%)` }}
          />
          <div className="relative">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                <Trophy size={12} className="text-gold" /> {match.competition} · {match.round}
              </span>
              {isLive ? <LiveBadge minute={match.liveMinute} /> : <MatchStatusBadge badge={match.tags[0]} />}
            </div>

            <p className="mt-2 text-center text-[13px] font-medium italic text-muted">« {match.emotionalTag} »</p>

            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <TeamCrest team={match.home} align="center" size="lg" showRank className="min-w-0" />
              <div className="flex flex-col items-center">
                {isLive && match.homeScore != null ? (
                  <>
                    <span className="font-display text-4xl font-bold tabular text-ink">
                      {match.homeScore}<span className="px-1.5 text-faint">-</span>{match.awayScore}
                    </span>
                    <HypeScore score={match.hypeScore} size="sm" className="mt-1.5" />
                  </>
                ) : (
                  <HypeScore score={match.hypeScore} size="lg" showTier />
                )}
              </div>
              <TeamCrest team={match.away} align="center" size="lg" showRank className="min-w-0" />
            </div>

            <p className="mt-3 text-center text-xs font-medium text-muted">
              {isLive ? <span className="text-danger">En direct</span> : time}
              {dayShift !== 0 && !isLive && <span className="text-faint"> ({dayShift > 0 ? "J+1" : "J-1"})</span>}
              <span className="text-faint"> · </span>
              <span className="inline-flex items-center gap-1"><MapPin size={11} /> {match.venue}, {match.city}</span>
              {match.broadcasters[0] && <span className="text-faint"> · </span>}
              {match.broadcasters[0] && <span className="inline-flex items-center gap-1 text-ink"><Tv size={11} /> {match.broadcasters.join(" / ")}</span>}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <RemindButton match={match} />
              <AddCalendarButton match={match} />
              <ShareButton match={match} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Verdict ─── */}
      <div className="mt-4 rounded-3xl p-4" style={{ background: `rgb(var(--${accent}) / 0.08)`, border: `1px solid rgb(var(--${accent}) / 0.18)` }}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: `rgb(var(--${accent}))` }}>
          <Sparkles size={13} /> Si tu n'as le temps que pour un match
        </p>
        <p className="mt-1.5 font-display text-lg font-bold leading-snug text-ink">{match.watchVerdictShort}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{match.watchVerdictLong}</p>
      </div>

      {/* ─── Stat trio ─── */}
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        <StatTile label="Hype" value={`${match.hypeScore}`} sub={tier.short} accent={accent} />
        <StatTile label="Enjeu" value={`${match.importanceScore}`} sub={importanceLabel(match.importanceScore)} accent="electric" />
        <StatTile label="Chaleur" value={heat.emoji} sub={heat.label} accent={heat.accent} />
      </div>

      {/* ─── Market Pulse ─── */}
      <div className="mt-4">
        <MarketPulseCard match={match} />
      </div>

      {/* ─── Score detail ─── */}
      <div className="card mt-4 rounded-3xl p-4">
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="font-display text-[15px] font-bold text-ink">Pourquoi ce score</h3>
          <span className="font-display text-sm font-bold tabular" style={{ color: `rgb(var(--${accent}))` }}>{match.hypeScore}/100</span>
        </div>
        <div className="space-y-3">
          {factorKeys.map((key, i) => (
            <StatBar key={key} value={match.hypeFactors[key]} label={HYPE_FACTOR_LABELS[key]} accent={accent} delay={i * 0.05} />
          ))}
        </div>
        <div className="mt-4 border-t border-line/7 pt-3.5">
          <MatchHeatMeter level={match.heatLevel} />
        </div>
      </div>

      {/* ─── L'essentiel ─── */}
      <div className="card mt-4 divide-y divide-line/7 rounded-3xl">
        <Prose icon={Target} accent={accent} title="Pourquoi regarder ce match ?">{match.reasonToWatch}</Prose>
        <Prose icon={Clapperboard} accent="electric" title="Le scénario probable">{match.story}</Prose>
        <Prose icon={Trophy} accent="gold" title="Ce qui est en jeu">{match.atStake}</Prose>
      </div>

      {/* ─── Key stat ─── */}
      <div className="mt-4 flex items-center gap-3 rounded-3xl border border-electric/15 bg-electric/[0.06] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-electric/12 text-electric ring-1 ring-electric/20">
          <Star size={18} />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-electric">La stat qui compte</p>
          <p className="mt-0.5 text-[13.5px] font-semibold leading-snug text-ink">{match.keyStat}</p>
        </div>
      </div>

      {/* ─── Storylines ─── */}
      <div className="card mt-4 rounded-3xl p-4">
        <h3 className="mb-2.5 font-display text-[15px] font-bold text-ink">Les fils à suivre</h3>
        <ul className="space-y-2.5">
          {match.storylines.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `rgb(var(--${accent}))` }} />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Key players ─── */}
      <div className="card mt-4 rounded-3xl p-4">
        <h3 className="mb-3 flex items-center gap-2 font-display text-[15px] font-bold text-ink">
          <Users size={16} className="text-gold" /> Joueurs à surveiller
        </h3>
        <div className="space-y-2">
          {match.keyPlayers.map((p) => (
            <div key={p.name} className="flex items-center gap-3 rounded-2xl bg-bg/30 p-2.5 ring-1 ring-line/6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2/60 text-xl ring-1 ring-line/10">{p.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-ink">{p.name}</p>
                <p className="text-[11px] font-medium text-faint">{p.role}</p>
              </div>
              <p className="hidden max-w-[45%] text-right text-[11px] leading-snug text-muted sm:block">{p.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Who for + audience verdicts ─── */}
      <div className="card mt-4 rounded-3xl p-4">
        <h3 className="mb-3 font-display text-[15px] font-bold text-ink">Pour qui ce match est fait ?</h3>
        <div className="flex flex-wrap gap-2">
          {match.whoFor.map((w) => (
            <span key={w} className="inline-flex items-center gap-1.5 rounded-full bg-bg/40 px-3 py-1.5 text-[12px] font-semibold text-ink ring-1 ring-line/8">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(var(--${accent}))` }} />
              {w}
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <VerdictRow icon={Sofa} accent="hype" label="Fan occasionnel" text={getCasualVerdict(match)} />
          <VerdictRow icon={Users} accent="violet" label="Vrai passionné" text={getHardcoreVerdict(match)} />
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-2xl bg-gold/[0.07] px-3 py-2.5 ring-1 ring-gold/12">
          <span className="text-base">📱</span>
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

      <ResponsibleGamingNote className="mt-4" />
    </AppShell>
  );
}

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="card rounded-2xl p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold leading-none tabular" style={{ color: `rgb(var(--${accent}))` }}>{value}</p>
      <p className="mt-1 line-clamp-1 text-[10.5px] text-muted">{sub}</p>
    </div>
  );
}

function Prose({ icon: Icon, accent, title, children }: { icon: typeof Target; accent: string; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4">
      <p className="mb-1.5 flex items-center gap-2 text-[13px] font-bold text-ink">
        <Icon size={15} style={{ color: `rgb(var(--${accent}))` }} />
        {title}
      </p>
      <p className="text-[13.5px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function VerdictRow({ icon: Icon, accent, label, text }: { icon: typeof Sofa; accent: string; label: string; text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-bg/30 p-2.5 ring-1 ring-line/6">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-line/10" style={{ background: `rgb(var(--${accent}) / 0.12)`, color: `rgb(var(--${accent}))` }}>
        <Icon size={14} />
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">{label}</p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-ink">{text}</p>
      </div>
    </div>
  );
}
