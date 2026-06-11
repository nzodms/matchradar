/**
 * MatchRadar — domain types.
 * Designed so the mocked data layer (data/*) can be swapped for a live sports
 * calendar / scores API without touching the UI components.
 */

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

export type MatchStatus = "upcoming" | "live" | "finished";

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
  whatsappBrief: string;
  broadcasters: string[];
  verdict: string;
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
  playerToWatch: KeyPlayer & { matchId: string };
  funFact: string;
  groupMessage: string;
  verdict: string;
}

export type FanLevel = "gros-matchs" | "mon-pays" | "tout" | "hype";

export type TimeSlot = "matin" | "apres-midi" | "soir" | "nuit";
