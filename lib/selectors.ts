import { FUN_FACTS, MATCHES, getMatch } from "@/data/matches";
import { getTeam } from "@/data/teams";
import type { DailyBrief, HydratedMatch, Match } from "@/types";
import { formatDayLabel } from "./datetime";

/** Attach the home/away Team objects so components don't each re-resolve them. */
export function hydrate(match: Match): HydratedMatch {
  return { ...match, home: getTeam(match.homeTeamId), away: getTeam(match.awayTeamId) };
}

export function getHydratedMatch(id: string): HydratedMatch | undefined {
  const m = getMatch(id);
  return m ? hydrate(m) : undefined;
}

const ALL: HydratedMatch[] = MATCHES.map(hydrate);

/** Live first, then by hype. The signature sort of the whole app. */
export function byHype(a: HydratedMatch, b: HydratedMatch): number {
  if (a.status === "live" && b.status !== "live") return -1;
  if (b.status === "live" && a.status !== "live") return 1;
  return b.hypeScore - a.hypeScore;
}

export function allMatches(): HydratedMatch[] {
  return [...ALL];
}

export function matchesForOffset(predicate: (offset: number) => boolean): HydratedMatch[] {
  return ALL.filter((m) => predicate(m.dayOffset)).sort(byHype);
}

export function todaysMatches(): HydratedMatch[] {
  return matchesForOffset((o) => o === 0);
}

/** The single biggest match today — the "Match du jour" hero. */
export function matchOfTheDay(): HydratedMatch {
  const today = todaysMatches();
  return today[0] ?? [...ALL].sort(byHype)[0];
}

export function liveMatches(): HydratedMatch[] {
  return ALL.filter((m) => m.status === "live");
}

/** Matches involving any of the given team ids. */
export function matchesForTeams(teamIds: string[]): HydratedMatch[] {
  if (teamIds.length === 0) return [];
  const set = new Set(teamIds);
  return ALL.filter((m) => set.has(m.homeTeamId) || set.has(m.awayTeamId)).sort(byHype);
}

/** Build the daily brief from today's slate (falls back to the top matches). */
export function buildDailyBrief(now = new Date()): DailyBrief {
  const today = todaysMatches();
  const pool = today.length >= 3 ? today : [...ALL].sort(byHype);
  const threeToWatch = pool.slice(0, 3);
  const unmissable = pool[0];
  const headlinePlayer = unmissable.keyPlayers[0];

  // Deterministic "fact of the day" so server and client agree.
  const fact = FUN_FACTS[new Date(now).getDate() % FUN_FACTS.length];

  return {
    dateLabel: formatDayLabel(0, now),
    threeToWatch,
    unmissable,
    playerToWatch: { ...headlinePlayer, matchId: unmissable.id },
    funFact: fact,
    groupMessage: `Les gars, aujourd'hui le match à ne pas rater c'est ${unmissable.home.name} – ${unmissable.away.name}. Hype ${unmissable.hypeScore}/100. ${unmissable.reasonToWatch}`,
    verdict: unmissable.verdict,
  };
}
