import type { AccentToken, HypeFactors } from "@/types";
import { clamp } from "./utils";

/**
 * The hype engine. Today the scores live in data/matches.ts, but this is the
 * single place that decides what a score *means* and how it's computed — swap
 * the data source later and the whole UI keeps working.
 *
 *   hype = teamPopularity + stakes + rivalry + starPower + accessibility + storyFactor
 *
 * (expressed here as a weighted blend so every factor stays on a 0–100 scale).
 */
export const HYPE_WEIGHTS: Record<keyof HypeFactors, number> = {
  teamPopularity: 0.2,
  stakes: 0.22,
  rivalry: 0.16,
  starPower: 0.18,
  accessibility: 0.1,
  storyFactor: 0.14,
};

export function computeHype(factors: HypeFactors): number {
  const total = (Object.keys(HYPE_WEIGHTS) as (keyof HypeFactors)[]).reduce(
    (acc, key) => acc + factors[key] * HYPE_WEIGHTS[key],
    0,
  );
  return Math.round(clamp(total));
}

export const HYPE_FACTOR_LABELS: Record<keyof HypeFactors, string> = {
  teamPopularity: "Popularité des équipes",
  stakes: "Enjeu sportif",
  rivalry: "Rivalité",
  starPower: "Stars sur le terrain",
  accessibility: "Horaire accessible",
  storyFactor: "Histoire & émotion",
};

export interface HypeTier {
  min: number;
  label: string;
  /** Short punchline used on compact cards. */
  short: string;
  accent: AccentToken;
}

/** Tier thresholds straight from the product brief. */
export const HYPE_TIERS: HypeTier[] = [
  { min: 90, label: "Immanquable", short: "Immanquable", accent: "hype" },
  { min: 80, label: "Gros match", short: "Gros match", accent: "hype" },
  { min: 60, label: "Bon match à suivre", short: "Bon match", accent: "electric" },
  { min: 40, label: "Sympa si tu es dispo", short: "Sympa", accent: "gold" },
  { min: 0, label: "Pour les vrais fans", short: "Pour les vrais", accent: "danger" },
];

export function getHypeTier(score: number): HypeTier {
  return HYPE_TIERS.find((t) => score >= t.min) ?? HYPE_TIERS[HYPE_TIERS.length - 1];
}

/** CSS color for a score — used for rings, bars and glows. */
export function hypeColorVar(score: number): string {
  const tier = getHypeTier(score);
  return `rgb(var(--${tier.accent}))`;
}

export function importanceLabel(score: number): string {
  if (score >= 90) return "Enjeu maximal";
  if (score >= 75) return "Gros enjeu";
  if (score >= 55) return "Enjeu réel";
  return "Enjeu modéré";
}
