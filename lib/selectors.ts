import { FUN_FACTS, MATCHES, getMatch } from "@/data/matches";
import { getTeam } from "@/data/teams";
import type {
  DailyBrief,
  HomeFilter,
  HotBoardEntry,
  HotBoardKind,
  HydratedMatch,
  Match,
} from "@/types";
import { formatDayLabel } from "./datetime";
import { HEAT_LEVELS, marketBalance } from "./market";

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

/* ───────────────────────── Market-flavoured selectors ───────────────────────── */

const NEAR_TERM = (): HydratedMatch[] => {
  const soon = matchesForOffset((o) => o <= 1);
  return soon.length >= 5 ? soon : [...ALL].sort(byHype);
};

export function getMostBalancedMatches(limit = 5): HydratedMatch[] {
  return [...NEAR_TERM()]
    .sort((a, b) => marketBalance(b.odds) * b.hypeScore - marketBalance(a.odds) * a.hypeScore)
    .slice(0, limit);
}

export function getUpsetPotentialMatches(limit = 5): HydratedMatch[] {
  return [...NEAR_TERM()].sort((a, b) => upsetScore(b) - upsetScore(a)).slice(0, limit);
}

export function getBestForCasualFans(limit = 5): HydratedMatch[] {
  return [...NEAR_TERM()].sort((a, b) => b.casualFanScore - a.casualFanScore).slice(0, limit);
}

export function getBestForGroupChat(limit = 5): HydratedMatch[] {
  return [...NEAR_TERM()].sort((a, b) => b.groupChatPotential - a.groupChatPotential).slice(0, limit);
}

function heatRank(m: HydratedMatch): number {
  return HEAT_LEVELS[m.heatLevel].rank;
}

function upsetScore(m: HydratedMatch): number {
  let s = m.favoriteRisk * (m.hypeScore / 100);
  if (m.tags.includes("favori-en-danger")) s += 20;
  if (m.marketSignal === "outsider-dangereux" || m.marketSignal === "piege-possible") s += 12;
  return s;
}

/* ───────────────────────── Hot Board ───────────────────────── */

interface HotBoardConfig {
  kind: HotBoardKind;
  label: string;
  punch: string;
  emoji: string;
  accent: HotBoardEntry["accent"];
  score: (m: HydratedMatch) => number;
}

const HOT_BOARD: HotBoardConfig[] = [
  {
    kind: "hottest",
    label: "Le plus chaud",
    punch: "Le match le plus chaud du jour, toutes catégories.",
    emoji: "🌋",
    accent: "danger",
    score: (m) => heatRank(m) * 1000 + m.hypeScore,
  },
  {
    kind: "casual",
    label: "Pour tout le monde",
    punch: "Parfait même si tu ne suis pas tout.",
    emoji: "🍿",
    accent: "hype",
    score: (m) => m.casualFanScore,
  },
  {
    kind: "balanced",
    label: "Le plus serré",
    punch: "Le marché n'arrive pas à les départager.",
    emoji: "⚖️",
    accent: "gold",
    score: (m) => marketBalance(m.odds) * (m.hypeScore / 100),
  },
  {
    kind: "upset",
    label: "Le favori en danger",
    punch: "Ça sent le piège pour le favori.",
    emoji: "⚠️",
    accent: "violet",
    score: upsetScore,
  },
  {
    kind: "groupchat",
    label: "Le match du groupe",
    punch: "Celui qui va faire vibrer ta conversation WhatsApp.",
    emoji: "📱",
    accent: "electric",
    score: (m) => m.groupChatPotential,
  },
];

/** Arcade-style ranking: one distinct match per category, picked greedily. */
export function getTodayHotBoard(): HotBoardEntry[] {
  const pool = NEAR_TERM();
  const used = new Set<string>();
  const board: HotBoardEntry[] = [];

  for (const cfg of HOT_BOARD) {
    const pick = [...pool]
      .filter((m) => !used.has(m.id))
      .sort((a, b) => cfg.score(b) - cfg.score(a))[0];
    if (!pick) continue;
    used.add(pick.id);
    board.push({
      kind: cfg.kind,
      match: pick,
      label: cfg.label,
      punch: cfg.punch,
      emoji: cfg.emoji,
      accent: cfg.accent,
    });
  }
  return board;
}

/* ───────────────────────── Home filters ───────────────────────── */

export function applyHomeFilter(matches: HydratedMatch[], filter: HomeFilter): HydratedMatch[] {
  switch (filter) {
    case "immanquables":
      return matches.filter((m) => m.hypeScore >= 90);
    case "live":
      return matches.filter((m) => m.status === "live");
    case "market":
      return matches.filter((m) =>
        ["affiche-brulante", "match-serre", "outsider-dangereux", "piege-possible"].includes(m.marketSignal),
      );
    case "serres":
      return matches.filter((m) => marketBalance(m.odds) >= 68 || m.marketSignal === "match-serre");
    case "outsiders":
      return matches.filter((m) => m.marketSignal === "outsider-dangereux" || m.upsetPotential >= 58);
    case "favori-danger":
      return matches.filter(
        (m) => m.tags.includes("favori-en-danger") || m.favoriteRisk >= 55 || m.marketSignal === "piege-possible",
      );
    case "whatsapp":
      return matches.filter((m) => m.groupChatPotential >= 80);
    case "all":
    default:
      return matches;
  }
}

/* ───────────────────────── Daily brief ───────────────────────── */

function shortTime(time: string): string {
  const [h, m] = time.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

/** Build the daily brief from today's slate (falls back to the top matches). */
export function buildDailyBrief(now = new Date()): DailyBrief {
  const today = todaysMatches();
  const pool = today.length >= 3 ? today : [...ALL].sort(byHype);
  const threeToWatch = pool.slice(0, 3);
  const unmissable = pool[0];
  const hotMatch = liveMatches()[0] ?? [...pool].sort((a, b) => heatRank(b) - heatRank(a))[0];
  const headlinePlayer = unmissable.keyPlayers[0];

  // Deterministic "fact of the day" so server and client agree.
  const fact = FUN_FACTS[new Date(now).getDate() % FUN_FACTS.length];

  const list = threeToWatch
    .map((m) =>
      m.status === "live"
        ? `${m.home.name}–${m.away.name} est en live`
        : `${m.home.name}–${m.away.name} à ${shortTime(m.time)}`,
    )
    .join(", ");

  const groupMessage = `Les gars, aujourd'hui le match à ne pas rater c'est ${unmissable.home.name} – ${unmissable.away.name}. Hype ${unmissable.hypeScore}/100. ${unmissable.reasonToWatch}`;

  const shortMessage = `Les gars, aujourd'hui ça chauffe : ${list}. Le radar met ${unmissable.home.name}–${unmissable.away.name} à ${unmissable.hypeScore}/100. Si vous n'en regardez qu'un, c'est celui-là. 📡`;

  const funnyMessage = `Bon, le radar a parlé 📡 : ${unmissable.home.name}–${unmissable.away.name}, ${unmissable.hypeScore}/100, c'est LE match des vrais aujourd'hui. ${hotMatch.id !== unmissable.id ? `Et ${hotMatch.home.name}–${hotMatch.away.name} envoie déjà du lourd. ` : ""}Préviens tout le monde, sortez les chips. 🍿`;

  return {
    dateLabel: formatDayLabel(0, now),
    threeToWatch,
    unmissable,
    hotMatch,
    playerToWatch: { ...headlinePlayer, matchId: unmissable.id },
    funFact: fact,
    groupMessage,
    shortMessage,
    funnyMessage,
    verdict: unmissable.watchVerdictLong || unmissable.verdict,
  };
}
