import type { DataProviderStatus } from "@/types";
import { PROVIDER_KEYS, isFullMock, sourceFor } from "./config";

/** Snapshot of where each data layer currently comes from (see /api/health). */
export function getProviderStatus(): DataProviderStatus {
  return {
    fixtures: sourceFor(PROVIDER_KEYS.sports),
    liveScores: sourceFor(PROVIDER_KEYS.sports),
    broadcasters: sourceFor(PROVIDER_KEYS.broadcasters),
    odds: sourceFor(PROVIDER_KEYS.odds),
    lastSyncedAt: isFullMock() ? null : new Date().toISOString(),
  };
}

export { isFullMock };
