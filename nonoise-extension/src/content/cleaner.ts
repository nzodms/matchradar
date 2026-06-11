import { baseDomain } from "@/shared/domains";
import { getSettings, onSettingsChanged, type Settings } from "@/shared/storage";
import {
  buildHideCss,
  FOCUS_SELECTORS,
  HIDE_SELECTORS,
  OVERLAY_KEYWORDS,
  PROTECTED_SELECTORS,
  REMOVE_SELECTORS,
  VIDEO_SELECTORS,
} from "./cosmetic-rules";
import { startObserver } from "./observer";

/**
 * NoNoise content script. Runs at document_start:
 *  1. Injects hide-CSS immediately (no flash of ads).
 *  2. Sweeps the DOM (removals + overlay heuristic) after DOMContentLoaded,
 *     then again on every observed mutation batch.
 *  3. Reports exact cleaned counts to the service worker.
 * It checks the whitelist first and tears everything down when paused.
 */

const domain = baseDomain(location.hostname);
const STYLE_ID = "nonoise-style";

let active = false;
let stopObserver: (() => void) | null = null;
let pendingCount = 0;
let flushTimer: number | null = null;
const counted = new WeakSet<Element>();

/* ── Stats reporting (batched) ── */

function reportCleaned(count: number): void {
  pendingCount += count;
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    const n = pendingCount;
    pendingCount = 0;
    flushTimer = null;
    if (n <= 0) return;
    void chrome.runtime
      .sendMessage({ type: "nonoise:cleaned", count: n, domain })
      .catch(() => undefined); // SW asleep mid-send — counts are best-effort UX, not billing.
  }, 800);
}

/* ── CSS injection ── */

function selectorsFor(settings: Settings): string[] {
  const focusEverywhere = settings.blacklist.includes(domain);
  const list = [...HIDE_SELECTORS, ...settings.customSelectors];
  if (settings.mode === "focus" || focusEverywhere) list.push(...FOCUS_SELECTORS);
  if (settings.mode === "video") list.push(...VIDEO_SELECTORS);
  return list;
}

function injectCss(settings: Settings): void {
  removeCss();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = buildHideCss(selectorsFor(settings));
  (document.head ?? document.documentElement).appendChild(style);
}

function removeCss(): void {
  document.getElementById(STYLE_ID)?.remove();
}

/* ── DOM sweep ── */

function isProtected(el: Element): boolean {
  for (const sel of PROTECTED_SELECTORS) {
    try {
      if (el.matches(sel) || el.closest(sel) !== null || el.querySelector(sel) !== null) return true;
    } catch {
      /* invalid selector safety */
    }
  }
  return false;
}

function countHidden(settings: Settings): void {
  // Count elements neutralized by the injected CSS (once per element).
  for (const sel of selectorsFor(settings)) {
    let nodes: NodeListOf<Element>;
    try {
      nodes = document.querySelectorAll(sel);
    } catch {
      continue; // user-provided selector may be invalid
    }
    let n = 0;
    nodes.forEach((el) => {
      if (counted.has(el)) return;
      counted.add(el);
      n++;
    });
    if (n > 0) reportCleaned(n);
  }
}

function removeAdFrames(): void {
  for (const sel of REMOVE_SELECTORS) {
    document.querySelectorAll(sel).forEach((el) => {
      if (isProtected(el)) return;
      if (!counted.has(el)) {
        counted.add(el);
        reportCleaned(1);
      }
      el.remove();
    });
  }
}

/**
 * Overlay heuristic: fixed, near-full-viewport, very high z-index layers whose
 * text matches consent/newsletter wording. Restores page scroll afterwards.
 */
function removeOverlays(): void {
  const candidates = document.querySelectorAll<HTMLElement>("body > div, body > section, body > aside");
  candidates.forEach((el) => {
    if (counted.has(el) || isProtected(el)) return;
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" || cs.display === "none") return;
    const z = Number.parseInt(cs.zIndex, 10);
    if (Number.isNaN(z) || z < 1000) return;
    const r = el.getBoundingClientRect();
    const coversViewport = r.width >= innerWidth * 0.85 && r.height >= innerHeight * 0.6;
    if (!coversViewport) return;
    const text = (el.textContent ?? "").slice(0, 4000);
    if (!OVERLAY_KEYWORDS.test(text)) return;
    counted.add(el);
    el.remove();
    reportCleaned(1);
  });
  // Many overlay vendors lock scrolling on <body>/<html>; undo it.
  for (const node of [document.body, document.documentElement]) {
    if (node && getComputedStyle(node).overflow === "hidden") node.style.setProperty("overflow", "auto", "important");
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
  const paused = !settings.enabled || settings.whitelist.includes(domain);
  if (paused) stop();
  else start(settings);
}

void getSettings().then(apply);
onSettingsChanged(apply);
