import { cn } from "@/lib/utils";

/** Country codes that don't map 1:1 to a flag-icons ISO code. */
const SPECIAL: Record<string, string> = { EN: "gb-eng" };

export function flagIso(countryCode: string): string {
  return (SPECIAL[countryCode] ?? countryCode).toLowerCase();
}

interface FlagProps {
  /** Team countryCode (e.g. "FR", "EN"). */
  cc?: string;
  size?: number;
  className?: string;
  /** default = premium crest (dark ring + inner padding) · inline = bare mini flag. */
  variant?: "default" | "inline";
  /** Fallback initials when no flag is available. */
  fallback?: string;
}

/**
 * Premium team crest: neutral dark circle, hairline border, soft shadow, and
 * the flag cropped inside with breathing room — reads as a badge, not a sticker.
 * Falls back to initials when no country code is available.
 */
export function Flag({ cc, size = 28, className, variant = "default", fallback }: FlagProps) {
  const inline = variant === "inline";
  // Inner flag occupies ~72% of the crest so it never touches the edge.
  const inset = inline ? 0 : Math.max(2, Math.round(size * 0.14));

  if (!cc) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-surface-2 font-display font-bold text-muted",
          !inline && "ring-1 ring-line/10 shadow-soft",
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        aria-hidden
      >
        {(fallback ?? "?").slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 rounded-full",
        !inline && "bg-surface-2 ring-1 ring-line/10 shadow-soft",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="absolute overflow-hidden rounded-full ring-1 ring-line/8" style={{ inset }}>
        <span
          className={cn("fi fis fi-" + flagIso(cc), "absolute inset-0")}
          style={{ width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        {/* subtle inner shading so the flag sits "into" the crest */}
        <span className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]" />
      </span>
    </span>
  );
}
