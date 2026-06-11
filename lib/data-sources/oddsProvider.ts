import type { Odds, OddsMeta } from "@/types";
import { ODDS_META } from "@/data/matches";
import { PROVIDER_KEYS } from "./config";
import { sourceFor } from "./config";

export interface MarketOdds {
  matchId: string;
  odds: Odds;
  updatedAt: string;
}

/**
 * Odds provider — indicative odds only (informational sport signal, never a
 * betting incentive; no bookmaker link is rendered).
 */
export async function getMarketOdds(matchId: string): Promise<MarketOdds | null> {
  if (PROVIDER_KEYS.odds) {
    // TODO(api): fetch 1N2 odds from a licensed odds feed for this fixture.
    return null;
  }
  return null;
}

export function oddsMeta(): OddsMeta {
  return { ...ODDS_META, sourceType: sourceFor(PROVIDER_KEYS.odds) === "api" ? "api" : "mock" };
}
