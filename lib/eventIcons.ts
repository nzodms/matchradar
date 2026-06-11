import { Bike, CircleDot, Gauge, Globe, Medal, Shield, Star, Swords, Trophy, type LucideIcon } from "lucide-react";

/** UI-layer icon per event (keeps real lucide icons out of the data file). */
export const EVENT_ICONS: Record<string, LucideIcon> = {
  wc: Trophy,
  wimbledon: CircleDot,
  tdf: Bike,
  f1: Gauge,
  ufc: Swords,
  nba: CircleDot,
  ucl: Star,
  rg: CircleDot,
  can: Globe,
  euro: Shield,
  superbowl: Shield,
  jo: Medal,
};

export function getEventIcon(id: string): LucideIcon {
  return EVENT_ICONS[id] ?? Trophy;
}
