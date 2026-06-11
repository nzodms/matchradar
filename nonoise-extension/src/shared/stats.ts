/**
 * Local stats in chrome.storage.local.
 *
 * Counting honesty:
 *  - Network blocks are counted exactly via onRuleMatchedDebug when available
 *    (unpacked/dev installs). Packed installs fall back to periodic
 *    getMatchedRules() sampling (quota-limited), which undercounts — see the
 *    service worker for details.
 *  - Cleaned elements are counted exactly by the content script, per category.
 *  - "Time saved" is an estimate: 1.2s per blocked ad, 0.1s per tracker,
 *    0.4s per cleaned element (overlays/banners you'd otherwise dismiss).
 */

export type Category =
  | "ads"
  | "trackers"
  | "annoyances"
  | "popups"
  | "cookies"
  | "video"
  | "scams"
  | "focus";

export const CATEGORIES: Category[] = ["ads", "trackers", "annoyances", "popups", "cookies", "video", "scams", "focus"];

export const CATEGORY_LABELS: Record<Category, string> = {
  ads: "Pubs",
  trackers: "Trackers",
  annoyances: "Gênes",
  popups: "Popups",
  cookies: "Cookie banners",
  video: "Vidéo",
  scams: "Scams",
  focus: "Distractions",
};

function emptyCategories(): Record<Category, number> {
  return { ads: 0, trackers: 0, annoyances: 0, popups: 0, cookies: 0, video: 0, scams: 0, focus: 0 };
}

export interface DomainStats {
  ads: number;
  trackers: number;
  cleaned: number;
}

export interface Stats {
  adsBlocked: number;
  trackersBlocked: number;
  elementsCleaned: number;
  categories: Record<Category, number>;
  byDomain: Record<string, DomainStats>;
  lastActivityAt: number | null;
  since: number;
}

export function emptyStats(): Stats {
  return {
    adsBlocked: 0,
    trackersBlocked: 0,
    elementsCleaned: 0,
    categories: emptyCategories(),
    byDomain: {},
    lastActivityAt: null,
    since: Date.now(),
  };
}

const KEY = "nonoise:stats";

export async function getStats(): Promise<Stats> {
  const raw = await chrome.storage.local.get(KEY);
  const stored = raw[KEY] as Partial<Stats> | undefined;
  const base = emptyStats();
  return {
    ...base,
    ...stored,
    categories: { ...base.categories, ...(stored?.categories ?? {}) },
    byDomain: stored?.byDomain ?? {},
    since: stored?.since ?? base.since,
  };
}

export interface StatsDelta {
  ads?: number;
  trackers?: number;
  cleaned?: number;
  categories?: Partial<Record<Category, number>>;
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

  let touched = ads + trackers + cleaned;
  if (delta.categories) {
    for (const [cat, n] of Object.entries(delta.categories) as [Category, number][]) {
      if (!n) continue;
      s.categories[cat] = (s.categories[cat] ?? 0) + n;
      touched += n;
    }
  }

  if (delta.domain) {
    const d = s.byDomain[delta.domain] ?? { ads: 0, trackers: 0, cleaned: 0 };
    d.ads += ads;
    d.trackers += trackers;
    d.cleaned += cleaned;
    s.byDomain[delta.domain] = d;
    const keys = Object.keys(s.byDomain);
    if (keys.length > 300) {
      for (const k of keys.slice(0, keys.length - 300)) delete s.byDomain[k];
    }
  }

  if (touched > 0) s.lastActivityAt = Date.now();
  await chrome.storage.local.set({ [KEY]: s });
  return s;
}

export async function resetStats(): Promise<void> {
  await chrome.storage.local.set({ [KEY]: emptyStats() });
}

export function onStatsChanged(cb: (stats: Stats) => void): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[KEY]) return;
    void getStats().then(cb);
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
  byCategory: Partial<Record<Category, number>>;
  domain: string;
}

export function isCleanedMessage(msg: unknown): msg is CleanedMessage {
  return (
    typeof msg === "object" &&
    msg !== null &&
    (msg as CleanedMessage).type === "nonoise:cleaned" &&
    typeof (msg as CleanedMessage).byCategory === "object" &&
    typeof (msg as CleanedMessage).domain === "string"
  );
}

export function sumCategories(byCategory: Partial<Record<Category, number>>): number {
  return Object.values(byCategory).reduce((a, b) => a + (b ?? 0), 0);
}
