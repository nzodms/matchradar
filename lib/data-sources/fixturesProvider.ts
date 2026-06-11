import { MATCHES } from "@/data/matches";
import type { Match } from "@/types";
import { PROVIDER_KEYS } from "./config";

/**
 * Fixtures provider — the single entry point for the match schedule.
 * Mock today; switches to the real API as soon as SPORTS_API_KEY is set.
 */
export async function getFixtures(): Promise<Match[]> {
  if (PROVIDER_KEYS.sports) {
    // TODO(api): fetch from the sports calendar API, then pipe each raw
    // fixture through normalizeFixture() and merge with the editorial layer.
    // Until implemented, fall back to mock so a misconfigured key never
    // breaks the app.
    return MATCHES;
  }
  return MATCHES;
}

/** Sync accessor for the current mock-first architecture (used by selectors). */
export function getFixturesSync(): Match[] {
  return MATCHES;
}
