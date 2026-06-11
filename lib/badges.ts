import type { AccentToken, BadgeKey } from "@/types";
import {
  AlarmClock,
  Flame,
  Moon,
  Shield,
  Siren,
  Sparkles,
  Swords,
  TrendingDown,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface BadgeMeta {
  label: string;
  accent: AccentToken;
  icon: LucideIcon;
  /** Pulsing dot (used for live). */
  pulse?: boolean;
}

export const BADGES: Record<BadgeKey, BadgeMeta> = {
  immanquable: { label: "Immanquable", accent: "hype", icon: Siren },
  "gros-match": { label: "Gros match", accent: "electric", icon: Flame },
  "match-piege": { label: "Match piège", accent: "gold", icon: Shield },
  "ambiance-folle": { label: "Ambiance folle", accent: "danger", icon: Users },
  "favori-en-danger": { label: "Favori en danger", accent: "gold", icon: TrendingDown },
  "pour-les-vrais": { label: "Pour les vrais", accent: "violet", icon: Sparkles },
  chill: { label: "Chill", accent: "electric", icon: Moon },
  live: { label: "Live", accent: "danger", icon: Zap, pulse: true },
  bientot: { label: "Bientôt", accent: "violet", icon: AlarmClock },
  "ce-soir": { label: "Ce soir", accent: "electric", icon: Moon },
  derby: { label: "Derby", accent: "danger", icon: Swords },
  "finale-avant-lheure": { label: "Finale avant l'heure", accent: "gold", icon: Trophy },
};

export function getBadge(key: BadgeKey): BadgeMeta {
  return BADGES[key];
}
