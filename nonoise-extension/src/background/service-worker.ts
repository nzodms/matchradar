import { domainFromUrl } from "@/shared/domains";
import { RULESETS, rulesetsForMode, type RulesetId } from "@/shared/modes";
import { addStats, isCleanedMessage } from "@/shared/stats";
import { getSettings, onSettingsChanged, type Settings } from "@/shared/storage";

/**
 * NoNoise background service worker.
 * Responsibilities:
 *  1. Keep declarativeNetRequest rulesets in sync with settings (mode + master switch).
 *  2. Maintain dynamic "allowAllRequests" rules for paused (whitelisted) domains.
 *  3. Count blocked requests — exact via onRuleMatchedDebug when available
 *     (unpacked installs), sampled via getMatchedRules() otherwise.
 *  4. Aggregate cleaned-element counts reported by the content script.
 *  5. Show a per-tab blocked counter on the action badge.
 */

const AD_RULESETS: ReadonlySet<string> = new Set(["ads", "annoyances", "scams", "video"]);

/* ───────────────────────── Ruleset sync ───────────────────────── */

async function syncRulesets(settings: Settings): Promise<void> {
  const wanted = new Set<RulesetId>(settings.enabled ? rulesetsForMode(settings.mode) : []);
  const enable = RULESETS.filter((r) => wanted.has(r));
  const disable = RULESETS.filter((r) => !wanted.has(r));
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: enable,
      disableRulesetIds: disable,
    });
  } catch (e) {
    console.error("NoNoise: updateEnabledRulesets failed", e);
  }
}

/** Whitelisted domains get one allowAllRequests rule each (exempts the whole page). */
async function syncWhitelistRules(settings: Settings): Promise<void> {
  try {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const addRules: chrome.declarativeNetRequest.Rule[] = settings.whitelist.map((domain, i) => ({
      id: i + 1,
      priority: 1_000_000,
      action: { type: "allowAllRequests" as chrome.declarativeNetRequest.RuleActionType },
      condition: {
        requestDomains: [domain],
        resourceTypes: ["main_frame" as chrome.declarativeNetRequest.ResourceType],
      },
    }));
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existing.map((r) => r.id),
      addRules,
    });
  } catch (e) {
    console.error("NoNoise: whitelist sync failed", e);
  }
}

async function syncAll(): Promise<void> {
  const settings = await getSettings();
  await syncRulesets(settings);
  await syncWhitelistRules(settings);
  await updateActionForAllTabs(settings);
}

chrome.runtime.onInstalled.addListener(() => void syncAll());
chrome.runtime.onStartup.addListener(() => void syncAll());
onSettingsChanged(() => void syncAll());

/* ───────────────────────── Badge ───────────────────────── */

const tabBlockCounts = new Map<number, number>();

function setBadge(tabId: number, count: number): void {
  const text = count > 0 ? (count > 999 ? "1k+" : String(count)) : "";
  void chrome.action.setBadgeText({ tabId, text });
  void chrome.action.setBadgeBackgroundColor({ tabId, color: "#0E1116" });
}

async function updateActionForAllTabs(settings: Settings): Promise<void> {
  const title = settings.enabled ? "NoNoise — protection active" : "NoNoise — désactivé";
  void chrome.action.setTitle({ title });
}

chrome.tabs.onRemoved.addListener((tabId) => tabBlockCounts.delete(tabId));
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "loading") {
    tabBlockCounts.set(tabId, 0);
    setBadge(tabId, 0);
  }
});

/* ───────────────────────── Counting: exact path (unpacked) ───────────────────────── */

interface MatchedRuleInfo {
  request: { tabId: number; url: string; initiator?: string };
  rule: { rulesetId: string; ruleId: number };
}

function categorize(rulesetId: string): { ads: number; trackers: number } {
  if (rulesetId === "trackers") return { ads: 0, trackers: 1 };
  if (AD_RULESETS.has(rulesetId)) return { ads: 1, trackers: 0 };
  return { ads: 0, trackers: 0 };
}

const debugEvent = (
  chrome.declarativeNetRequest as unknown as {
    onRuleMatchedDebug?: { addListener: (cb: (info: MatchedRuleInfo) => void) => void };
  }
).onRuleMatchedDebug;

let exactCounting = false;
if (debugEvent) {
  // Only fires for unpacked installs — gives exact, per-request counts.
  exactCounting = true;
  debugEvent.addListener((info) => {
    const { ads, trackers } = categorize(info.rule.rulesetId);
    if (ads + trackers === 0) return;
    const domain = domainFromUrl(info.request.initiator) ?? domainFromUrl(info.request.url);
    void addStats({ ads, trackers, domain });
    if (info.request.tabId >= 0) {
      const next = (tabBlockCounts.get(info.request.tabId) ?? 0) + 1;
      tabBlockCounts.set(info.request.tabId, next);
      setBadge(info.request.tabId, next);
    }
  });
}

/* ───────────────────────── Counting: sampled fallback (packed) ───────────────────────── */

// getMatchedRules is quota-limited (a handful of calls per 10 minutes), so the
// packed fallback samples every 5 minutes and only counts entries newer than
// the previous sample. This undercounts bursts — documented in the README.
let lastSampleTs = Date.now();

async function sampleMatchedRules(): Promise<void> {
  if (exactCounting) return;
  try {
    const { rulesMatchedInfo } = await chrome.declarativeNetRequest.getMatchedRules({});
    const fresh = rulesMatchedInfo.filter((m) => m.timeStamp > lastSampleTs);
    lastSampleTs = Date.now();
    let ads = 0;
    let trackers = 0;
    for (const m of fresh) {
      const c = categorize(m.rule.rulesetId);
      ads += c.ads;
      trackers += c.trackers;
    }
    if (ads + trackers > 0) await addStats({ ads, trackers, domain: null });
  } catch {
    // Quota exhausted or feedback permission unavailable — skip this sample.
  }
}

chrome.alarms.create("nonoise:sample", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "nonoise:sample") void sampleMatchedRules();
});

/* ───────────────────────── Cleaned-element reports ───────────────────────── */

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (isCleanedMessage(msg)) {
    void addStats({ cleaned: msg.count, domain: msg.domain });
    sendResponse({ ok: true });
  }
  return false;
});
