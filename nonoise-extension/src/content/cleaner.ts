import { baseDomain } from "@/shared/domains";
import type { Category } from "@/shared/stats";
import { getSettings, onSettingsChanged, type Settings } from "@/shared/storage";
import {
  BASE_GROUPS,
  buildHideCss,
  FOCUS_GROUP,
  OVERLAY_KEYWORDS,
  PROTECTED_SELECTORS,
  REMOVE_SELECTORS,
  VIDEO_GROUP,
  type CosmeticGroup,
} from "./cosmetic-rules";
import { startObserver } from "./observer";

/**
 * NoNoise content script (document_start).
 *  1. Injects hide-CSS immediately (no flash of ads).
 *  2. Sweeps the DOM (frame removal + overlay heuristic) after DOMContentLoaded
 *     and on every debounced mutation batch.
 *  3. Reports exact cleaned counts per category to the service worker.
 *  4. Answers debug / force-clean messages from the options page.
 * Checks the whitelist first and fully tears down when paused.
 */

const domain = baseDomain(location.hostname);
const STYLE_ID = "nonoise-style";

let active = false;
let currentSettings: Settings | null = null;
let stopObserver: (() => void) | null = null;
const counted = new WeakSet<Element>();

// Debug state (served to the options page).
const pageTotals: Partial<Record<Category, number>> = {};
let lastCleanAt = 0;

// Batched reporting.
let pending: Partial<Record<Category, number>> = {};
let flushTimer: number | null = null;

function record(category: Category, n: number): void {
  if (n <= 0) return;
  pending[category] = (pending[category] ?? 0) + n;
  pageTotals[category] = (pageTotals[category] ?? 0) + n;
  lastCleanAt = Date.now();
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    const byCategory = pending;
    pending = {};
    flushTimer = null;
    if (Object.keys(byCategory).length === 0) return;
    void chrome.runtime
      .sendMessage({ type: "nonoise:cleaned", byCategory, domain })
      .catch(() => undefined); // SW asleep mid-send — counts are best-effort UX.
  }, 800);
}

/* ── Active groups for the current settings ── */

function activeGroups(settings: Settings): CosmeticGroup[] {
  const groups: CosmeticGroup[] = [...BASE_GROUPS];
  if (settings.customSelectors.length > 0) {
    groups.push({ category: "ads", selectors: settings.customSelectors });
  }
  const focusEverywhere = settings.blacklist.includes(domain);
  if (settings.mode === "focus" || focusEverywhere) groups.push(FOCUS_GROUP);
  if (settings.mode === "video") groups.push(VIDEO_GROUP);
  return groups;
}

/* ── CSS injection ── */

function injectCss(settings: Settings): void {
  removeCss();
  const all = activeGroups(settings).flatMap((g) => g.selectors);
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = buildHideCss(all);
  (document.head ?? document.documentElement).appendChild(style);
}

function removeCss(): void {
  document.getElementById(STYLE_ID)?.remove();
}

/* ── DOM sweep ── */

function isProtected(el: Element): boolean {
  for (const sel of PROTECTED_SELECTORS) {
    try {
      if (el.matches(sel) || el.closest(sel) !== null) return true;
    } catch {
      /* invalid selector safety */
    }
  }
  return false;
}

/** Count elements neutralized by the injected CSS, once per element, per category. */
function countHidden(settings: Settings): void {
  for (const group of activeGroups(settings)) {
    let n = 0;
    for (const sel of group.selectors) {
      let nodes: NodeListOf<Element>;
      try {
        nodes = document.querySelectorAll(sel);
      } catch {
        continue; // user-provided selector may be invalid
      }
      nodes.forEach((el) => {
        if (counted.has(el)) return;
        counted.add(el);
        n++;
      });
    }
    record(group.category, n);
  }
}

function removeAdFrames(): void {
  let n = 0;
  for (const sel of REMOVE_SELECTORS) {
    document.querySelectorAll(sel).forEach((el) => {
      if (isProtected(el) || counted.has(el)) return;
      counted.add(el);
      el.remove();
      n++;
    });
  }
  record("ads", n);
}

/**
 * Overlay heuristic: fixed, near-full-viewport, very high z-index layers whose
 * text matches consent/newsletter wording. Categorizes cookie vs popup and
 * restores page scroll afterwards.
 */
function removeOverlays(): void {
  const candidates = document.querySelectorAll<HTMLElement>("body > div, body > section, body > aside");
  candidates.forEach((el) => {
    if (counted.has(el) || isProtected(el)) return;
    const cs = getComputedStyle(el);
    if ((cs.position !== "fixed" && cs.position !== "sticky") || cs.display === "none") return;
    const z = Number.parseInt(cs.zIndex, 10);
    if (Number.isNaN(z) || z < 1000) return;
    const r = el.getBoundingClientRect();
    const coversViewport = r.width >= innerWidth * 0.85 && r.height >= innerHeight * 0.6;
    if (!coversViewport) return;
    const text = (el.textContent ?? "").slice(0, 4000);
    if (!OVERLAY_KEYWORDS.test(text)) return;
    counted.add(el);
    el.remove();
    record(/cookie|consent|rgpd|gdpr/i.test(text) ? "cookies" : "popups", 1);
  });
  for (const node of [document.body, document.documentElement]) {
    if (node && getComputedStyle(node).overflow === "hidden") {
      node.style.setProperty("overflow", "auto", "important");
    }
  }
}

function sweep(settings: Settings): void {
  if (!active || !document.body) return;
  removeAdFrames();
  removeOverlays();
  countHidden(settings);
}

/* ── Lifecycle ── */

function start(settings: Settings): void {
  if (active) stop();
  active = true;
  injectCss(settings);
  const runSweep = () => sweep(settings);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runSweep, { once: true });
  } else {
    runSweep();
  }
  stopObserver = startObserver(runSweep);
}

function stop(): void {
  active = false;
  stopObserver?.();
  stopObserver = null;
  removeCss();
}

function apply(settings: Settings): void {
  currentSettings = settings;
  const paused = !settings.enabled || settings.whitelist.includes(domain);
  if (paused) stop();
  else start(settings);
}

/* ── Debug / force-clean messages (from the options page) ── */

interface DebugResponse {
  domain: string;
  active: boolean;
  whitelisted: boolean;
  mode: Settings["mode"] | null;
  lastCleanAt: number;
  totals: Partial<Record<Category, number>>;
}

chrome.runtime.onMessage.addListener((msg: { type?: string }, _sender, sendResponse) => {
  if (msg?.type === "nonoise:getDebug") {
    const res: DebugResponse = {
      domain,
      active,
      whitelisted: currentSettings?.whitelist.includes(domain) ?? false,
      mode: currentSettings?.mode ?? null,
      lastCleanAt,
      totals: pageTotals,
    };
    sendResponse(res);
    return false;
  }
  if (msg?.type === "nonoise:forceClean") {
    if (currentSettings && active) sweep(currentSettings);
    sendResponse({ ok: active, totals: pageTotals });
    return false;
  }
  return false;
});

void getSettings().then(apply);
onSettingsChanged(apply);
