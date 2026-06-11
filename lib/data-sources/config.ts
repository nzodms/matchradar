import type { DataSource } from "@/types";

/**
 * Provider configuration. Each provider switches from mock to real API the
 * moment its key is present in the environment — no UI change needed.
 *
 *   SPORTS_API_KEY        → fixtures + live scores (e.g. API-Football, Sportradar)
 *   BROADCASTERS_API_KEY  → TV/streaming rights    (optional)
 *   ODDS_API_KEY          → indicative odds        (optional)
 */
export const PROVIDER_KEYS = {
  sports: process.env.SPORTS_API_KEY ?? null,
  broadcasters: process.env.BROADCASTERS_API_KEY ?? null,
  odds: process.env.ODDS_API_KEY ?? null,
};

export function sourceFor(key: string | null): DataSource {
  return key ? "api" : "mock";
}

/** True when every provider still runs on demo data. */
export function isFullMock(): boolean {
  return !PROVIDER_KEYS.sports && !PROVIDER_KEYS.broadcasters && !PROVIDER_KEYS.odds;
}
