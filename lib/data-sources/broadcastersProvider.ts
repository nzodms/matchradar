import type { Broadcaster } from "@/types";
import { PROVIDER_KEYS } from "./config";
import { normalizeBroadcaster } from "./normalizeMatch";

/**
 * Broadcasters provider. Rule of the house: a channel is only displayed as
 * certain when `verified === true`. Mock/manual entries can be verified by an
 * editor; API entries arrive unverified until reviewed.
 */
export async function getBroadcasters(matchId: string): Promise<Broadcaster[]> {
  if (PROVIDER_KEYS.broadcasters) {
    // TODO(api): fetch rights for this fixture, map through normalizeBroadcaster().
    return [];
  }
  return [];
}

/** UI helper — the only sanctioned way to render a channel name. */
export function broadcasterLabel(b: Broadcaster | undefined): string {
  if (!b) return "Chaîne à confirmer";
  return b.verified ? b.name : `${b.name} (à confirmer)`;
}

export { normalizeBroadcaster };
