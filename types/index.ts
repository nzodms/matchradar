/**
 * MatchRadar — domain types.
 * Designed so the mocked data layer (data/*) can be swapped for a live sports
 * calendar / scores API without touching the UI components.
 */

import type { LucideIcon } from "lucide-react";

export type Sport =
  | "football"
  | "tennis"
  | "f1"
  | "mma"
  | "basketball"
  | "cycling"
  | "americanfootball"
  | "olympics"
  | "multi";

export type EventStatus = "live" | "upcoming" | "comingSoon";

export type RadarType =
  | "Matchs à ne pas rater"
  | "Étapes à suivre"
  | "Combats à suivre"
  | "Grands rendez-vous"
  | "Courses à suivre";

export interface SportEvent {
  id: string;
  name: string;
  sport: Sport;
  status: EventStatus;
  /** Human readable period, e.g. "En ce moment" or "Juin – Juillet 2026". */
  startDate: string;
  endDate?: string;
  heroLabel: string;
  /** Token name used to theme the event (maps to a CSS accent). */
  themeColor: AccentToken;
  comingSoon: boolean;
  radarType: RadarType;
  emoji: string;
  tagline: string;
  bullets: string[];
}

export type AccentToken = "hype" | "danger" | "gold" | "electric" | "violet";

export interface Team {
  id: string;
  name: string;
  /** ISO-ish code, used for grouping/search. */
  countryCode: string;
  flag: string; // emoji flag — zero asset, crisp on mobile
  popularityScore: number; // 0–100
  color: string; // hex, used for subtle accenting
  group?: string;
  fifaRank?: number;
  star?: string; // headline player for the team
}

export type MatchStatus = "upcoming" | "live" | "halftime" | "finished" | "postponed";

/* ───────────────────────── Data provenance ───────────────────────── */

export type DataSource = "mock" | "manual" | "api";

export type ConfidenceLevel = "high" | "medium" | "low";

/** Where a record came from and how much to trust it. Rendered as small trust labels. */
export interface DataProvenance {
  source: DataSource;
  /** Minutes ago (mock) — a real provider returns an ISO date instead. */
  lastUpdatedMinAgo: number;
  confidence: ConfidenceLevel;
  verified: boolean;
}

export interface Broadcaster {
  name: string;
  country: string;
  channelType: "tv" | "streaming" | "radio" | "unknown";
  url?: string;
  /** false ⇒ the UI must show "à confirmer", never present it as certain. */
  verified: boolean;
}

export interface DataProviderStatus {
  fixtures: DataSource;
  liveScores: DataSource;
  broadcasters: DataSource;
  odds: DataSource;
  lastSyncedAt: string | null;
}

export type BadgeKey =
  | "immanquable"
  | "gros-match"
  | "match-piege"
  | "ambiance-folle"
  | "favori-en-danger"
  | "pour-les-vrais"
  | "chill"
  | "live"
  | "bientot"
  | "ce-soir"
  | "derby"
  | "finale-avant-lheure";

/** Breakdown that feeds the hype score — shown as bars on the detail page. */
export interface HypeFactors {
  teamPopularity: number; // 0–100
  stakes: number;
  rivalry: number;
  starPower: number;
  accessibility: number;
  storyFactor: number;
}

export interface KeyPlayer {
  name: string;
  teamId: string;
  role: string;
  flag: string;
  note: string;
}

/* ───────────────────────── Market Pulse ───────────────────────── */

/** Market reading of a match — never a betting incentive, just a signal. */
export type MarketSignal =
  | "affiche-brulante"
  | "favori-clair"
  | "match-serre"
  | "outsider-dangereux"
  | "piege-possible"
  | "ouverture-chaude";

export type HeatLevel = "chill" | "for_purists" | "hot" | "very_hot" | "insane";

export type ExpectedVibe = "Ambiance folle" | "Tactique" | "Piège" | "Gros choc" | "Match de fond";

export type WatchReasonType = "rivalry" | "stars" | "stakes" | "upset" | "ambiance" | "casual";

/** Indicative 1-N-2 decimal odds (informational only). */
export interface Odds {
  home: number;
  draw: number;
  away: number;
}

/** Scaffolding for a future odds API. Mock-only in V1 — no bookmaker link shown. */
export interface OddsMeta {
  sourceType: "mock" | "api";
  oddsProvider: string | null;
  providerCountry: string;
  isLegalProvider: boolean;
  /** Intentionally unused in V1. */
  affiliateUrl: string | null;
}

export interface Match {
  id: string;
  eventId: string;
  sport: Sport;
  competition: string;
  round: string;
  group?: string;
  homeTeamId: string;
  awayTeamId: string;

  /** 0 = today, 1 = tomorrow, 2–6 = later this week. Keeps demo evergreen. */
  dayOffset: number;
  /** Kickoff clock time in the base timezone, "HH:MM". */
  time: string;
  durationMin: number;
  /** Base timezone the `time` is expressed in. */
  timezone: string;
  venue: string;
  city: string;
  country: string;
  countryFlag: string;

  hypeScore: number; // 0–100
  importanceScore: number; // 0–100
  hypeFactors: HypeFactors;

  status: MatchStatus;
  liveMinute?: number;
  homeScore?: number;
  awayScore?: number;

  tags: BadgeKey[];
  reasonToWatch: string;
  whoFor: string[];
  keyPlayers: KeyPlayer[];
  /** "Le scénario probable" */
  story: string;
  /** "Ce qui est en jeu" */
  atStake: string;
  /** One-line summary of what's at stake (practical info blocks). */
  stakesSummary: string;
  whatsappBrief: string;
  broadcasters: Broadcaster[];
  officialUrl?: string;
  verdict: string;

  /* ── Data provenance (trust labels, dev badge, future API swap) ── */
  provenance: DataProvenance;

  /* ── Market Pulse (cotes indicatives) ── */
  odds: Odds;
  marketSignal: MarketSignal;
  marketCopy: string;
  marketUpdatedMinAgo: number;

  /* ── Heat & vibe ── */
  heatLevel: HeatLevel;
  expectedVibe: ExpectedVibe;
  emotionalTag: string;
  watchReasonType: WatchReasonType;
  keyStat: string;
  storylines: string[];

  /* ── Audience scores (0–100) ── */
  groupChatPotential: number;
  casualFanScore: number;
  hardcoreFanScore: number;
  tensionScore: number;
  upsetPotential: number;
  favoriteRisk: number;

  /* ── Verdicts ── */
  watchVerdictShort: string;
  watchVerdictLong: string;
}

/** A team hydrated onto a match for convenient rendering. */
export interface HydratedMatch extends Match {
  home: Team;
  away: Team;
}

export interface DailyBrief {
  dateLabel: string;
  threeToWatch: HydratedMatch[];
  unmissable: HydratedMatch;
  hotMatch: HydratedMatch;
  playerToWatch: KeyPlayer & { matchId: string };
  funFact: string;
  /** Standard group message. */
  groupMessage: string;
  /** Punchy one-liner. */
  shortMessage: string;
  /** Looser, funnier variant. */
  funnyMessage: string;
  verdict: string;
}

export type HotBoardKind = "hottest" | "casual" | "balanced" | "upset" | "groupchat";

export interface HotBoardEntry {
  kind: HotBoardKind;
  match: HydratedMatch;
  label: string;
  punch: string;
  icon: LucideIcon;
  accent: AccentToken;
}

export type HomeFilter =
  | "all"
  | "immanquables"
  | "live"
  | "market"
  | "serres"
  | "outsiders"
  | "favori-danger"
  | "whatsapp";

export type TeamAlertLevel = "high" | "big-only" | "all";

export type FanLevel = "gros-matchs" | "mon-pays" | "tout" | "hype";

export type TimeSlot = "matin" | "apres-midi" | "soir" | "nuit";
