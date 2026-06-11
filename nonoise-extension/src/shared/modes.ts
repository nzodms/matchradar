/** NoNoise protection modes and their ruleset mapping. */

export type Mode = "clean" | "focus" | "video";

export const RULESETS = ["ads", "trackers", "annoyances", "scams", "video"] as const;
export type RulesetId = (typeof RULESETS)[number];

export const MODES: Record<Mode, { label: string; tagline: string; rulesets: RulesetId[] }> = {
  clean: {
    label: "Clean",
    tagline: "Ads, trackers, popups and scams.",
    rulesets: ["ads", "trackers", "annoyances", "scams"],
  },
  focus: {
    label: "Focus",
    tagline: "Clean + feeds, prompts and distractions.",
    rulesets: ["ads", "trackers", "annoyances", "scams"],
  },
  video: {
    label: "Video Clean",
    tagline: "Clean + compatible video players.",
    rulesets: ["ads", "trackers", "annoyances", "scams", "video"],
  },
};

export function rulesetsForMode(mode: Mode): RulesetId[] {
  return MODES[mode].rulesets;
}
