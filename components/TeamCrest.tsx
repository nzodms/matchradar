"use client";

import { cn } from "@/lib/utils";
import type { Team } from "@/types";
import { Flag } from "./Flag";

interface TeamCrestProps {
  team: Team;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right" | "center";
  showRank?: boolean;
  className?: string;
}

const FLAG_PX = { sm: 30, md: 42, lg: 60 } as const;
const NAME_SIZE = { sm: "text-xs", md: "text-sm", lg: "text-[15px]" } as const;

/** Real flag crest + team name. */
export function TeamCrest({ team, size = "md", align = "center", showRank, className }: TeamCrestProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        align === "center" && "flex-col gap-2 text-center",
        align === "right" && "flex-row-reverse text-right",
        className,
      )}
    >
      <Flag cc={team.countryCode} size={FLAG_PX[size]} />
      <div className={cn("min-w-0", align === "center" && "w-full")}>
        <p className={cn("truncate font-display font-bold leading-tight text-ink", NAME_SIZE[size])}>{team.name}</p>
        {showRank && team.fifaRank && (
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-faint">FIFA #{team.fifaRank}</p>
        )}
      </div>
    </div>
  );
}
