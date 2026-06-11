import type { Team } from "@/types";

/**
 * Mocked national teams. Emoji flags keep the bundle asset-free and render
 * crisply on mobile. Popularity scores feed the hype engine (lib/hype.ts).
 */
export const TEAMS: Team[] = [
  { id: "fra", name: "France", countryCode: "FR", flag: "🇫🇷", popularityScore: 96, color: "#1E3A8A", group: "C", fifaRank: 2, star: "Kylian Mbappé" },
  { id: "bra", name: "Brésil", countryCode: "BR", flag: "🇧🇷", popularityScore: 98, color: "#F7D417", group: "H", fifaRank: 5, star: "Vinícius Jr" },
  { id: "arg", name: "Argentine", countryCode: "AR", flag: "🇦🇷", popularityScore: 97, color: "#6CB4EE", group: "E", fifaRank: 1, star: "Lionel Messi" },
  { id: "por", name: "Portugal", countryCode: "PT", flag: "🇵🇹", popularityScore: 92, color: "#C8102E", group: "F", fifaRank: 6, star: "Cristiano Ronaldo" },
  { id: "esp", name: "Espagne", countryCode: "ES", flag: "🇪🇸", popularityScore: 93, color: "#C60B1E", group: "B", fifaRank: 3, star: "Lamine Yamal" },
  { id: "mar", name: "Maroc", countryCode: "MA", flag: "🇲🇦", popularityScore: 88, color: "#C1272D", group: "B", fifaRank: 12, star: "Achraf Hakimi" },
  { id: "ger", name: "Allemagne", countryCode: "DE", flag: "🇩🇪", popularityScore: 90, color: "#111111", group: "H", fifaRank: 9, star: "Jamal Musiala" },
  { id: "eng", name: "Angleterre", countryCode: "EN", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", popularityScore: 91, color: "#FFFFFF", group: "D", fifaRank: 4, star: "Jude Bellingham" },
  { id: "ita", name: "Italie", countryCode: "IT", flag: "🇮🇹", popularityScore: 87, color: "#0066B3", group: "G", fifaRank: 8, star: "Federico Chiesa" },
  { id: "ned", name: "Pays-Bas", countryCode: "NL", flag: "🇳🇱", popularityScore: 84, color: "#F36C21", group: "A", fifaRank: 7, star: "Cody Gakpo" },
  { id: "sen", name: "Sénégal", countryCode: "SN", flag: "🇸🇳", popularityScore: 79, color: "#00853F", group: "C", fifaRank: 17, star: "Sadio Mané" },
  { id: "usa", name: "États-Unis", countryCode: "US", flag: "🇺🇸", popularityScore: 76, color: "#1B3A6B", group: "D", fifaRank: 16, star: "Christian Pulisic" },
  { id: "jpn", name: "Japon", countryCode: "JP", flag: "🇯🇵", popularityScore: 78, color: "#BC002D", group: "A", fifaRank: 18, star: "Takefusa Kubo" },
  { id: "mex", name: "Mexique", countryCode: "MX", flag: "🇲🇽", popularityScore: 80, color: "#006847", group: "A", fifaRank: 14, star: "Santiago Giménez" },
  { id: "rsa", name: "Afrique du Sud", countryCode: "ZA", flag: "🇿🇦", popularityScore: 58, color: "#007A4D", group: "A", fifaRank: 56, star: "Lyle Foster" },
  { id: "cro", name: "Croatie", countryCode: "HR", flag: "🇭🇷", popularityScore: 82, color: "#FF0000", group: "F", fifaRank: 10, star: "Luka Modrić" },
  { id: "bel", name: "Belgique", countryCode: "BE", flag: "🇧🇪", popularityScore: 83, color: "#E30613", group: "F", fifaRank: 11, star: "Kevin De Bruyne" },
  { id: "uru", name: "Uruguay", countryCode: "UY", flag: "🇺🇾", popularityScore: 81, color: "#5BBCD5", group: "G", fifaRank: 13, star: "Federico Valverde" },
];

const TEAM_MAP = new Map(TEAMS.map((t) => [t.id, t]));

export function getTeam(id: string): Team {
  const team = TEAM_MAP.get(id);
  if (!team) {
    // Defensive fallback keeps the UI resilient if data drifts.
    return {
      id,
      name: id.toUpperCase(),
      countryCode: id.slice(0, 2).toUpperCase(),
      flag: "🏳️",
      popularityScore: 50,
      color: "#64748B",
    };
  }
  return team;
}
