"use client";

import { getBadge } from "@/lib/badges";
import { cn } from "@/lib/utils";
import type { AccentToken, BadgeKey } from "@/types";

const SIZES = {
  sm: "h-5 gap-1 px-1.5 text-[9px]",
  md: "h-6 gap-1 px-2 text-[10px]",
} as const;

const ICON_SIZE = { sm: 9, md: 11 } as const;

interface PillProps {
  accent: AccentToken;
  label: string;
  icon?: React.ReactNode;
  size?: keyof typeof SIZES;
  pulse?: boolean;
  glow?: boolean;
  className?: string;
}

/** Base neon pill used by badges, statuses and counters everywhere. */
export function Pill({ accent, label, icon, size = "md", pulse, glow, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-bold uppercase tracking-wider backdrop-blur-sm tabular",
        SIZES[size],
        className,
      )}
      style={{
        color: `rgb(var(--${accent}))`,
        backgroundColor: `rgb(var(--${accent}) / 0.12)`,
        borderColor: `rgb(var(--${accent}) / 0.4)`,
        boxShadow: glow ? `0 0 16px -2px rgb(var(--${accent}) / 0.5)` : undefined,
      }}
    >
      {pulse && (
        <span
          className="h-1.5 w-1.5 animate-pulse-dot rounded-full"
          style={{ backgroundColor: `rgb(var(--${accent}))` }}
        />
      )}
      {icon}
      {label}
    </span>
  );
}

interface MatchStatusBadgeProps {
  badge: BadgeKey;
  size?: keyof typeof SIZES;
  glow?: boolean;
}

export function MatchStatusBadge({ badge, size = "md", glow }: MatchStatusBadgeProps) {
  const meta = getBadge(badge);
  const Icon = meta.icon;
  const isHero = badge === "immanquable" || badge === "live";
  return (
    <Pill
      accent={meta.accent}
      label={meta.label}
      size={size}
      pulse={meta.pulse}
      glow={glow ?? isHero}
      icon={!meta.pulse ? <Icon size={ICON_SIZE[size]} strokeWidth={2.6} /> : undefined}
    />
  );
}
