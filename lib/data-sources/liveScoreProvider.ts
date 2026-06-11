import type { Match } from "@/types";
import { PROVIDER_KEYS } from "./config";

export interface LiveMatchStatus {
  matchId: string;
  status: Match["status"];
  minute?: number;
  homeScore?: number;
  awayScore?: number;
}

/**
 * Live scores provider. Mock mode returns no overrides (scores live inside the
 * mock fixtures); API mode will poll the live endpoint and patch matches.
 */
export async function getLiveStatuses(): Promise<LiveMatchStatus[]> {
  if (PROVIDER_KEYS.sports) {
    // TODO(api): poll the live-scores endpoint (short cache, e.g. 30s) and
    // map through normalizeStatus().
    return [];
  }
  return [];
}

/** Merge live overrides onto fixtures (no-op in mock mode). */
export function applyLiveStatuses(matches: Match[], statuses: LiveMatchStatus[]): Match[] {
  if (statuses.length === 0) return matches;
  const byId = new Map(statuses.map((s) => [s.matchId, s]));
  return matches.map((m) => {
    const s = byId.get(m.id);
    return s ? { ...m, status: s.status, liveMinute: s.minute, homeScore: s.homeScore, awayScore: s.awayScore } : m;
  });
}
