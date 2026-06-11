import type { Broadcaster, DataProvenance, Match } from "@/types";

/**
 * Normalization layer: every provider (API-Football, Sportradar, manual CMS…)
 * funnels its raw payload through here so the rest of the app only ever sees
 * the internal `Match` shape. Mock data is already normalized.
 */

/** Minimal shape we expect from an external fixtures API. */
export interface RawFixture {
  id: string | number;
  league?: { name?: string; round?: string };
  teams?: { home?: { name?: string; code?: string }; away?: { name?: string; code?: string } };
  fixture?: {
    date?: string; // ISO kickoff
    venue?: { name?: string; city?: string };
    status?: { short?: string; elapsed?: number };
  };
  goals?: { home?: number | null; away?: number | null };
}

const STATUS_MAP: Record<string, Match["status"]> = {
  NS: "upcoming",
  "1H": "live",
  "2H": "live",
  ET: "live",
  P: "live",
  HT: "halftime",
  FT: "finished",
  AET: "finished",
  PEN: "finished",
  PST: "postponed",
};

export function normalizeStatus(short: string | undefined): Match["status"] {
  return STATUS_MAP[short ?? "NS"] ?? "upcoming";
}

export function normalizeBroadcaster(raw: { name?: string; country?: string; type?: string; url?: string }): Broadcaster {
  return {
    name: raw.name ?? "Chaîne à confirmer",
    country: raw.country ?? "FR",
    channelType: raw.type === "streaming" ? "streaming" : raw.type === "radio" ? "radio" : raw.type === "tv" ? "tv" : "unknown",
    url: raw.url,
    // Anything coming from an unconfirmed feed stays unverified until reviewed.
    verified: false,
  };
}

export function apiProvenance(): DataProvenance {
  return { source: "api", lastUpdatedMinAgo: 0, confidence: "high", verified: true };
}

/**
 * Partial normalizer — fills the schedule/score half of a Match from a raw
 * fixture. Editorial fields (hype, verdicts, storylines) come from our own
 * scoring layer and are merged by the fixtures provider.
 */
export function normalizeFixture(raw: RawFixture): Partial<Match> {
  return {
    id: String(raw.id),
    round: raw.league?.round ?? "",
    competition: raw.league?.name ?? "",
    venue: raw.fixture?.venue?.name ?? "",
    city: raw.fixture?.venue?.city ?? "",
    status: normalizeStatus(raw.fixture?.status?.short),
    liveMinute: raw.fixture?.status?.elapsed ?? undefined,
    homeScore: raw.goals?.home ?? undefined,
    awayScore: raw.goals?.away ?? undefined,
    provenance: apiProvenance(),
  };
}
