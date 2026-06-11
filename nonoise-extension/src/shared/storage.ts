import type { Mode } from "./modes";

/** Persisted settings — single source of truth in chrome.storage.local. */
export interface Settings {
  /** Master switch. */
  enabled: boolean;
  /** Active mode (also the default applied on startup). */
  mode: Mode;
  /** Domains where NoNoise is fully paused (network + cosmetic). */
  whitelist: string[];
  /** Domains always cleaned at Focus intensity, whatever the mode. */
  blacklist: string[];
  /** User CSS selectors hidden on every site (one per entry). */
  customSelectors: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  mode: "clean",
  whitelist: [],
  blacklist: [],
  customSelectors: [],
};

const KEY = "nonoise:settings";

export async function getSettings(): Promise<Settings> {
  const raw = await chrome.storage.local.get(KEY);
  const stored = raw[KEY] as Partial<Settings> | undefined;
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function setSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await getSettings()), ...patch };
  await chrome.storage.local.set({ [KEY]: next });
  return next;
}

export function onSettingsChanged(cb: (settings: Settings) => void): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[KEY]) return;
    cb({ ...DEFAULT_SETTINGS, ...(changes[KEY].newValue as Partial<Settings>) });
  });
}

/* ── Whitelist helpers ── */

export async function pauseOnDomain(domain: string): Promise<void> {
  const s = await getSettings();
  if (!s.whitelist.includes(domain)) await setSettings({ whitelist: [...s.whitelist, domain] });
}

export async function resumeOnDomain(domain: string): Promise<void> {
  const s = await getSettings();
  await setSettings({ whitelist: s.whitelist.filter((d) => d !== domain) });
}

/* ── Export / import (Options page) ── */

export async function exportSettings(): Promise<string> {
  return JSON.stringify({ version: 1, settings: await getSettings() }, null, 2);
}

export async function importSettings(json: string): Promise<Settings> {
  const parsed = JSON.parse(json) as { settings?: Partial<Settings> };
  if (!parsed.settings || typeof parsed.settings !== "object") {
    throw new Error("Invalid settings file");
  }
  const s = parsed.settings;
  const clean: Partial<Settings> = {
    enabled: typeof s.enabled === "boolean" ? s.enabled : undefined,
    mode: s.mode === "clean" || s.mode === "focus" || s.mode === "video" ? s.mode : undefined,
    whitelist: Array.isArray(s.whitelist) ? s.whitelist.filter((d) => typeof d === "string") : undefined,
    blacklist: Array.isArray(s.blacklist) ? s.blacklist.filter((d) => typeof d === "string") : undefined,
    customSelectors: Array.isArray(s.customSelectors)
      ? s.customSelectors.filter((d) => typeof d === "string")
      : undefined,
  };
  Object.keys(clean).forEach((k) => {
    if (clean[k as keyof Settings] === undefined) delete clean[k as keyof Settings];
  });
  return setSettings(clean);
}
