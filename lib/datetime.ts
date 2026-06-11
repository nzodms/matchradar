import type { Match } from "@/types";

/**
 * Lightweight timezone handling for the demo. The base timezone for every
 * fixture is Europe/Paris; offsets below are expressed relative to Paris.
 * (DST is ignored on purpose — this is mock data, not a booking engine. A real
 * integration would swap this for the venue/user IANA zones + a tz library.)
 */
export interface TimezoneOption {
  id: string;
  label: string;
  city: string;
  /** Hours relative to Europe/Paris. */
  offset: number;
}

export const TIMEZONES: TimezoneOption[] = [
  { id: "Europe/Paris", label: "Paris (CET)", city: "Paris", offset: 0 },
  { id: "Europe/London", label: "Londres (GMT)", city: "Londres", offset: -1 },
  { id: "Africa/Casablanca", label: "Casablanca", city: "Casablanca", offset: -1 },
  { id: "Africa/Dakar", label: "Dakar", city: "Dakar", offset: -1 },
  { id: "America/New_York", label: "New York (ET)", city: "New York", offset: -6 },
  { id: "America/Montreal", label: "Montréal (ET)", city: "Montréal", offset: -6 },
  { id: "America/Los_Angeles", label: "Los Angeles (PT)", city: "Los Angeles", offset: -9 },
  { id: "America/Sao_Paulo", label: "São Paulo", city: "São Paulo", offset: -4 },
  { id: "Asia/Dubai", label: "Dubaï", city: "Dubaï", offset: 3 },
  { id: "Asia/Tokyo", label: "Tokyo", city: "Tokyo", offset: 8 },
];

export const DEFAULT_TZ = TIMEZONES[0];

export function getTimezone(id: string): TimezoneOption {
  return TIMEZONES.find((t) => t.id === id) ?? DEFAULT_TZ;
}

const WEEKDAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** Date (midnight) for a given day offset from today. */
export function dateForOffset(dayOffset: number, now = new Date()): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d;
}

/** "Aujourd'hui" / "Demain" / "jeudi 12 juin". */
export function formatDayLabel(dayOffset: number, now = new Date()): string {
  if (dayOffset === 0) return "Aujourd'hui";
  if (dayOffset === 1) return "Demain";
  const d = dateForOffset(dayOffset, now);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatShortDate(dayOffset: number, now = new Date()): string {
  const d = dateForOffset(dayOffset, now);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 4)}.`;
}

export interface DisplayTime {
  time: string; // "HH:MM" in the requested timezone
  /** -1 / 0 / +1 — whether the kickoff lands on the previous/next day there. */
  dayShift: number;
}

/** Convert a fixture's Paris clock time into a target timezone. */
export function displayTime(time: string, tzId: string = DEFAULT_TZ.id): DisplayTime {
  const tz = getTimezone(tzId);
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + tz.offset * 60;
  const dayShift = Math.floor(total / 1440);
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return {
    time: `${String(hh).padStart(2, "0")}h${String(mm).padStart(2, "0")}`,
    dayShift,
  };
}

/** Concrete Date for calendar exports (uses local time at the Paris clock hour). */
export function matchDateTime(match: Match, now = new Date()): Date {
  const base = dateForOffset(match.dayOffset, now);
  const [h, m] = match.time.split(":").map(Number);
  base.setHours(h, m, 0, 0);
  return base;
}

export const DAY_TABS = [
  { key: "today", label: "Aujourd'hui", match: (o: number) => o === 0 },
  { key: "tomorrow", label: "Demain", match: (o: number) => o === 1 },
  { key: "week", label: "Cette semaine", match: (o: number) => o >= 2 },
] as const;

export type DayTabKey = (typeof DAY_TABS)[number]["key"];
