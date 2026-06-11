import type {
  AccentToken,
  ExpectedVibe,
  HeatLevel,
  HydratedMatch,
  MarketSignal,
  Odds,
  WatchReasonType,
} from "@/types";
import {
  Brain,
  Flame,
  Gem,
  Scale,
  Snowflake,
  Sofa,
  Sparkles,
  Swords,
  Target,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Market Pulse logic.
 *
 * IMPORTANT: odds are an INFORMATIONAL sport signal ("le marché voit quoi ?"),
 * never a betting incentive. No "parier", no bonus, no payout language anywhere.
 * Everything here is mock; swap for an odds API later via data/matches ODDS_META.
 */

export const RESPONSIBLE_NOTE =
  "Cotes indicatives, susceptibles d'évoluer. Jeu d'argent réservé aux 18+. Jouer comporte des risques. MatchRadar ne fournit pas de conseil de pari.";

/* ───────────────────────── Market signals ───────────────────────── */

interface MarketSignalMeta {
  label: string;
  icon: LucideIcon;
  accent: AccentToken;
  hint: string;
}

export const MARKET_SIGNALS: Record<MarketSignal, MarketSignalMeta> = {
  "affiche-brulante": { label: "Affiche brûlante", icon: Flame, accent: "danger", hint: "Le match que tout le monde va commenter." },
  "favori-clair": { label: "Favori clair", icon: Target, accent: "electric", hint: "Un favori se détache nettement." },
  "match-serre": { label: "Match serré", icon: Scale, accent: "gold", hint: "Le marché ne sait pas les départager." },
  "outsider-dangereux": { label: "Outsider dangereux", icon: Swords, accent: "violet", hint: "L'outsider a les armes pour surprendre." },
  "piege-possible": { label: "Piège possible", icon: TriangleAlert, accent: "gold", hint: "Le favori peut se faire surprendre." },
  "ouverture-chaude": { label: "Ouverture chaude", icon: Sparkles, accent: "hype", hint: "Marché ouvert, ambiance garantie." },
};

export function getMarketSignal(key: MarketSignal): MarketSignalMeta {
  return MARKET_SIGNALS[key];
}

/* ───────────────────────── Heat levels ───────────────────────── */

interface HeatMeta {
  label: string;
  icon: LucideIcon;
  accent: AccentToken;
  /** 1 (chill) → 5 (insane), used for sorting & meter fill. */
  rank: number;
  glow: boolean;
}

export const HEAT_LEVELS: Record<HeatLevel, HeatMeta> = {
  insane: { label: "Chaud bouillant", icon: Flame, accent: "danger", rank: 5, glow: true },
  very_hot: { label: "Très chaud", icon: Flame, accent: "danger", rank: 4, glow: true },
  hot: { label: "Chaud", icon: Flame, accent: "gold", rank: 3, glow: false },
  for_purists: { label: "Pour les puristes", icon: Gem, accent: "violet", rank: 2, glow: false },
  chill: { label: "Tranquille", icon: Snowflake, accent: "electric", rank: 1, glow: false },
};

export function getHeatLabel(level: HeatLevel): HeatMeta {
  return HEAT_LEVELS[level];
}

/* ───────────────────────── Vibe & reason ───────────────────────── */

export const VIBES: Record<ExpectedVibe, { icon: LucideIcon; accent: AccentToken }> = {
  "Ambiance folle": { icon: Flame, accent: "danger" },
  Tactique: { icon: Brain, accent: "electric" },
  Piège: { icon: TriangleAlert, accent: "gold" },
  "Gros choc": { icon: Zap, accent: "hype" },
  "Match de fond": { icon: Sofa, accent: "electric" },
};

export function getWatchMood(match: HydratedMatch): { icon: LucideIcon; label: string; accent: AccentToken } {
  const v = VIBES[match.expectedVibe];
  return { icon: v.icon, label: match.expectedVibe, accent: v.accent };
}

export const WATCH_REASON_LABELS: Record<WatchReasonType, string> = {
  rivalry: "Choc de rivalité",
  stars: "Stars sur le terrain",
  stakes: "Enjeu énorme",
  upset: "Piège à surprise",
  ambiance: "Ambiance de folie",
  casual: "Match canapé",
};

/* ───────────────────────── Odds helpers ───────────────────────── */

export function formatOdd(n: number): string {
  return n.toFixed(2);
}

/** De-vigged implied probabilities (sum to 1). */
export function impliedProbabilities(odds: Odds): { home: number; draw: number; away: number } {
  const rawH = 1 / odds.home;
  const rawD = 1 / odds.draw;
  const rawA = 1 / odds.away;
  const sum = rawH + rawD + rawA;
  return { home: rawH / sum, draw: rawD / sum, away: rawA / sum };
}

export interface MarketFavorite {
  side: "home" | "away" | "even";
  teamId: string | null;
  prob: number; // 0–100
}

export function marketFavorite(match: HydratedMatch): MarketFavorite {
  const p = impliedProbabilities(match.odds);
  const diff = p.home - p.away;
  if (Math.abs(diff) < 0.05) return { side: "even", teamId: null, prob: Math.round(Math.max(p.home, p.away) * 100) };
  return diff > 0
    ? { side: "home", teamId: match.homeTeamId, prob: Math.round(p.home * 100) }
    : { side: "away", teamId: match.awayTeamId, prob: Math.round(p.away * 100) };
}

/** Closeness of the two teams, 0 (lopsided) → 100 (perfectly even). */
export function marketBalance(odds: Odds): number {
  const p = impliedProbabilities(odds);
  const spread = Math.abs(p.home - p.away) / (p.home + p.away);
  return Math.round((1 - spread) * 100);
}

export function marketUpdatedLabel(minAgo: number): string {
  if (minAgo <= 1) return "à l'instant";
  return `il y a ${minAgo} min`;
}

/** Reading of how safe the favorite looks — phrased as sport tension, not advice. */
export function getMarketRisk(match: HydratedMatch): { label: string; level: "low" | "mid" | "high"; accent: AccentToken } {
  const risk = match.favoriteRisk;
  if (risk >= 55) return { label: "Favori sous pression", level: "high", accent: "danger" };
  if (risk >= 45) return { label: "Équilibre fragile", level: "mid", accent: "gold" };
  return { label: "Favori solide", level: "low", accent: "electric" };
}

/* ───────────────────────── Audience verdicts ───────────────────────── */

export function getGroupChatCopy(match: HydratedMatch): string {
  const g = match.groupChatPotential;
  if (g >= 90) return "Ce match peut retourner ton groupe WhatsApp.";
  if (g >= 75) return "Match parfait pour chauffer le groupe.";
  if (g >= 55) return "De quoi lancer un ou deux messages dans le groupe.";
  return "Pas le plus commentable, mais ça peut surprendre.";
}

export function getCasualVerdict(match: HydratedMatch): string {
  const c = match.casualFanScore;
  if (c >= 85) return "Parfait même si tu ne suis pas tout : du spectacle direct.";
  if (c >= 65) return "Accessible et sympa, pas besoin d'être expert.";
  if (c >= 50) return "Sympa en fond, à suivre d'un œil.";
  return "Plutôt réservé à ceux qui aiment vraiment ce sport.";
}

export function getHardcoreVerdict(match: HydratedMatch): string {
  const h = match.hardcoreFanScore;
  if (h >= 88) return "Les vrais passionnés vont se régaler.";
  if (h >= 75) return "Beaucoup à analyser pour les fans tactiques.";
  if (h >= 60) return "Quelques détails sympas pour les connaisseurs.";
  return "Pas le match le plus riche tactiquement.";
}
