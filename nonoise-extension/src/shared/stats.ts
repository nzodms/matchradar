/**
 * Local stats in chrome.storage.local.
 *
 * Counting honesty:
 *  - Network blocks are counted exactly via onRuleMatchedDebug when available
 *    (unpacked/dev installs). Packed installs fall back to periodic
 *    getMatchedRules() sampling (quota-limited), which undercounts — see the
 *    service worker for details.
 *  - Cleaned elements are counted exactly by the content script.
 *  - "Time saved" is an estimate: 1.2s per blocked ad, 0.1s per tracker,
 *    0.4s per cleaned element (overlays/banners you'd otherwise dismiss).
 */

export interface DomainStats {
  ads: number;
  trackers: number;
  cleaned: number;
}

export interface Stats {
  adsBlocked: number;
  trackersBlocked: number;
  elementsCleaned: number;
  byDomain: Record<string, DomainStats>;
  lastActivityAt: number | null;
  since: number;
}

export const EMPTY_STATS: Stats = {
  adsBlocked: 0,
  trackersBlocked: 0,
  elementsCleaned: 0,
  byDomain: {},
  lastActivityAt: null,
  since: Date.now(),
};

const KEY = "nonoise:stats";

export async function getStats(): Promise<Stats> {
  const raw = await chrome.storage.local.get(KEY);
  const stored = raw[KEY] as Partial<Stats> | undefined;
  return { ...EMPTY_STATS, since: stored?.since ?? Date.now(), ...stored };
}

export interface StatsDelta {
  ads?: number;
  trackers?: number;
  cleaned?: number;
  domain?: string | null;
}

export async function addStats(delta: StatsDelta): Promise<Stats> {
  const s = await getStats();
  const ads = delta.ads ?? 0;
  const trackers = delta.trackers ?? 0;
  const cleaned = delta.cleaned ?? 0;
  s.adsBlocked += ads;
  s.trackersBlocked += trackers;
  s.elementsCleaned += cleaned;
  if (delta.domain) {
    const d = s.byDomain[delta.domain] ?? { ads: 0, trackers: 0, cleaned: 0 };
    d.ads += ads;
    d.trackers += trackers;
    d.cleaned += cleaned;
    s.byDomain[delta.domain] = d;
    // Keep the per-domain map bounded.
    const keys = Object.keys(s.byDomain);
    if (keys.length > 300) {
      for (const k of keys.slice(0, keys.length - 300)) delete s.byDomain[k];
    }
  }
  if (ads + trackers + cleaned > 0) s.lastActivityAt = Date.now();
  await chrome.storage.local.set({ [KEY]: s });
  return s;
}

export async function resetStats(): Promise<void> {
  await chrome.storage.local.set({ [KEY]: { ...EMPTY_STATS, since: Date.now() } });
}

export function onStatsChanged(cb: (stats: Stats) => void): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[KEY]) return;
    cb({ ...EMPTY_STATS, ...(changes[KEY].newValue as Partial<Stats>) });
  });
}

/** Estimated seconds saved (see module docblock for the model). */
export function estimatedSecondsSaved(s: Stats): number {
  return Math.round(s.adsBlocked * 1.2 + s.trackersBlocked * 0.1 + s.elementsCleaned * 0.4);
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const m = Math.floor(totalSeconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}`;
}

/** Message sent by the content script when it removes/hides elements. */
export interface CleanedMessage {
  type: "nonoise:cleaned";
  count: number;
  domain: string;
}

export function isCleanedMessage(msg: unknown): msg is CleanedMessage {
  return (
    typeof msg === "object" &&
    msg !== null &&
    (msg as CleanedMessage).type === "nonoise:cleaned" &&
    typeof (msg as CleanedMessage).count === "number" &&
    typeof (msg as CleanedMessage).domain === "string"
  );
}
