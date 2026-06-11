import type { DailyBrief, HydratedMatch } from "@/types";
import { displayTime } from "./datetime";

/**
 * Ready-to-send WhatsApp messages. The whole viral loop runs through here:
 * copy → paste in the group → friends open the app.
 * Always includes the practical info: time AND channel.
 */

/** Channel string for messages — never presents an unverified channel as certain. */
export function channelLine(match: HydratedMatch): string {
  const b = match.broadcasters[0];
  if (!b) return "chaîne à confirmer";
  return b.verified ? b.name : `${b.name} (à confirmer)`;
}

export function matchWhatsApp(match: HydratedMatch, tzId?: string): string {
  const { time } = displayTime(match.time, tzId);
  const liveOrTime = match.status === "live" ? "EN DIRECT 🔴" : time;
  return [
    `${match.home.flag} ${match.home.name} vs ${match.away.name} ${match.away.flag}`,
    `⏰ ${liveOrTime} · 📺 ${channelLine(match)} · ${match.round}`,
    `🔥 Hype ${match.hypeScore}/100`,
    `👉 ${match.reasonToWatch}`,
    `— via MatchRadar 📡`,
  ].join("\n");
}

export function dailyBriefWhatsApp(brief: DailyBrief, tzId?: string): string {
  const lines: string[] = [];
  lines.push(`📡 LE BRIEF MATCHRADAR — ${brief.dateLabel}`);
  lines.push("");
  lines.push("📺 Le programme :");
  brief.threeToWatch.forEach((m) => {
    const { time } = displayTime(m.time, tzId);
    const when = m.status === "live" ? "LIVE 🔴" : time;
    lines.push(`• ${when} ${m.home.name} – ${m.away.name} · ${channelLine(m)} — ${m.hypeScore}/100`);
  });
  lines.push("");
  lines.push(
    `🚨 À NE PAS RATER : ${brief.unmissable.home.name} vs ${brief.unmissable.away.name} — Hype ${brief.unmissable.hypeScore}/100`,
  );
  lines.push(`👤 Le joueur à surveiller : ${brief.playerToWatch.name} ${brief.playerToWatch.flag}`);
  lines.push(`💡 ${brief.funFact}`);
  lines.push("");
  lines.push(`✅ Verdict : ${brief.verdict}`);
  lines.push("");
  lines.push("📲 via MatchRadar");
  return lines.join("\n");
}

/** wa.me deep link so the message can be shared straight to WhatsApp. */
export function whatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
