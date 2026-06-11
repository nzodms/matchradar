import type { HydratedMatch } from "@/types";
import { matchDateTime } from "./datetime";

/**
 * Calendar export. Both Google and the .ics download are driven from here so a
 * future "Recevoir le brief / sync calendar" API can reuse the same builders.
 */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Floating local time stamp (YYYYMMDDTHHMMSS) — calendars read it as local. */
function floatingStamp(d: Date): string {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

/** UTC stamp (…Z) for Google Calendar template links. */
function utcStamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  );
}

function matchTitle(match: HydratedMatch): string {
  return `${match.home.flag} ${match.home.name} – ${match.away.name} ${match.away.flag} | ${match.round}`;
}

function matchDescription(match: HydratedMatch): string {
  return [
    `Hype ${match.hypeScore}/100 · Enjeu ${match.importanceScore}/100`,
    match.reasonToWatch,
    match.broadcasters.length
      ? `Diffusion : ${match.broadcasters.map((b) => (b.verified ? b.name : `${b.name} (à confirmer)`)).join(", ")}`
      : "Diffusion : chaîne à confirmer",
    "Ajouté depuis MatchRadar 📡",
  ]
    .filter(Boolean)
    .join("\\n");
}

export function buildICS(matches: HydratedMatch[]): string {
  const now = new Date();
  const events = matches
    .map((match) => {
      const start = matchDateTime(match, now);
      const end = new Date(start.getTime() + match.durationMin * 60 * 1000);
      return [
        "BEGIN:VEVENT",
        `UID:${match.id}-${start.getTime()}@matchradar.app`,
        `DTSTAMP:${utcStamp(now)}`,
        `DTSTART:${floatingStamp(start)}`,
        `DTEND:${floatingStamp(end)}`,
        `SUMMARY:${matchTitle(match)}`,
        `DESCRIPTION:${matchDescription(match)}`,
        `LOCATION:${match.venue}, ${match.city}`,
        "BEGIN:VALARM",
        "TRIGGER:-PT30M",
        "ACTION:DISPLAY",
        `DESCRIPTION:${matchTitle(match)} dans 30 min`,
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MatchRadar//Radar Sportif//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(matches: HydratedMatch[], filename = "matchradar.ics") {
  if (typeof window === "undefined") return;
  const blob = new Blob([buildICS(matches)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(match: HydratedMatch): string {
  const start = matchDateTime(match);
  const end = new Date(start.getTime() + match.durationMin * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: matchTitle(match),
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    details: matchDescription(match).replace(/\\n/g, "\n"),
    location: `${match.venue}, ${match.city}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
