"use client";

import { cn } from "@/lib/utils";
import type { Team } from "@/types";
import { Flag } from "./Flag";

interface TeamCrestProps {
  team: Team;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "hero" | "inline";
  align?: "left" | "right" | "center";
  showRank?: boolean;
  className?: string;
}

const FLAG_PX = { xs: 22, sm: 32, md: 44, lg: 64 } as const;
const NAME_SIZE = { xs: "text-[11px]", sm: "text-xs", md: "text-sm", lg: "text-[15px]" } as const;

/**
 * Standardized team identity: premium flag crest + name.
 * Same rendering everywhere — home, cards, detail, brief, favorites.
 */
export function TeamCrest({ team, size = "md", variant = "default", align = "center", showRank, className }: TeamCrestProps) {
  const inline = variant === "inline";
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        align === "center" && !inline && "flex-col gap-2 text-center",
        align === "right" && "flex-row-reverse text-right",
        className,
      )}
    >
      <Flag
        cc={team.countryCode}
        size={FLAG_PX[size]}
        variant={inline ? "inline" : "default"}
        fallback={team.name}
      />
      <div className={cn("min-w-0", align === "center" && !inline && "w-full")}>
        <p className={cn("truncate font-display font-bold leading-tight text-ink", NAME_SIZE[size], variant === "hero" && "text-base")}>
          {team.name}
        </p>
        {(showRank || variant === "hero") && team.fifaRank && (
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-faint">FIFA #{team.fifaRank}</p>
        )}
      </div>
    </div>
  );
}
