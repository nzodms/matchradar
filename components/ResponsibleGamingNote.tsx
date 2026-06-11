import { RESPONSIBLE_NOTE } from "@/lib/market";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

/**
 * Discreet compliance note shown wherever odds appear. Indicative odds only —
 * MatchRadar never gives betting advice and shows no bookmaker link in V1.
 */
export function ResponsibleGamingNote({ className, compact }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <p className={cn("flex items-start gap-1 text-[9.5px] leading-tight text-faint/80", className)}>
        <Info size={10} className="mt-px shrink-0" />
        <span>{RESPONSIBLE_NOTE}</span>
      </p>
    );
  }
  return (
    <p className={cn("flex items-start gap-1.5 rounded-xl border border-line/8 bg-bg/40 px-2.5 py-2 text-[10px] leading-snug text-faint", className)}>
      <Info size={12} className="mt-px shrink-0" />
      <span>{RESPONSIBLE_NOTE}</span>
    </p>
  );
}
