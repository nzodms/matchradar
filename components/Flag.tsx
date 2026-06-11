import { cn } from "@/lib/utils";

/** Country codes that don't map 1:1 to a flag-icons ISO code. */
const SPECIAL: Record<string, string> = { EN: "gb-eng" };

export function flagIso(countryCode: string): string {
  return (SPECIAL[countryCode] ?? countryCode).toLowerCase();
}

interface FlagProps {
  /** Team countryCode (e.g. "FR", "EN"). */
  cc: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

/** Real SVG country flag, cropped into a clean circular crest. No emoji. */
export function Flag({ cc, size = 28, className, ring = true }: FlagProps) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-surface-2",
        ring && "ring-1 ring-line/12",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className={cn("fi fis fi-" + flagIso(cc), "absolute inset-0")}
        style={{ width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center" }}
      />
    </span>
  );
}
