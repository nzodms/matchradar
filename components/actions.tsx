"use client";

import { downloadICS, googleCalendarUrl } from "@/lib/calendar";
import { useCopy } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { matchWhatsApp, whatsAppShareUrl } from "@/lib/whatsapp";
import type { AccentToken, HydratedMatch } from "@/types";
import { BellRing, CalendarPlus, Check, Copy, Share2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "./Toast";
import { useTimezone } from "./Providers";

type Variant = "solid" | "ghost" | "outline";

interface ActionButtonProps {
  onClick?: () => void;
  /** External URL — opens in a new tab via <a>. */
  href?: string;
  /** Internal route — client-side navigation via next/link. */
  internalHref?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  accent?: AccentToken;
  variant?: Variant;
  full?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: "h-9 px-3 text-xs gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-[15px] gap-2",
} as const;

/** Shared tactile button — big touch targets, accent theming, active-scale. */
export function ActionButton({
  onClick,
  href,
  internalHref,
  icon,
  children,
  accent = "hype",
  variant = "ghost",
  full,
  size = "md",
  className,
}: ActionButtonProps) {
  const base = cn(
    "tap inline-flex items-center justify-center rounded-2xl font-bold leading-none transition-colors",
    SIZE[size],
    full && "w-full",
    className,
  );

  const style =
    variant === "solid"
      ? { backgroundColor: `rgb(var(--${accent}))`, color: "rgb(var(--bg))", boxShadow: `0 10px 30px -10px rgb(var(--${accent}) / 0.7)` }
      : variant === "outline"
        ? { color: `rgb(var(--${accent}))`, borderColor: `rgb(var(--${accent}) / 0.4)`, backgroundColor: `rgb(var(--${accent}) / 0.08)` }
        : undefined;

  const cls = cn(base, variant === "outline" && "border", variant === "ghost" && "glass text-ink hover:bg-surface-2/60");

  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (internalHref) {
    return (
      <Link href={internalHref} className={cls} style={style}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {content}
    </button>
  );
}

/* ───────────────── Specific viral actions ───────────────── */

export function CopyBriefButton({
  match,
  variant = "ghost",
  full,
  size = "md",
  label = "Copier le brief",
}: {
  match: HydratedMatch;
  variant?: Variant;
  full?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const { copy, copied } = useCopy();
  const { toast } = useToast();
  const { tzId } = useTimezone();

  return (
    <ActionButton
      variant={variant}
      accent="hype"
      full={full}
      size={size}
      icon={copied ? <Check size={16} strokeWidth={2.8} /> : <Copy size={16} />}
      onClick={async () => {
        const ok = await copy(matchWhatsApp(match, tzId));
        toast(ok ? "Brief copié 📋" : "Copie impossible", ok ? "success" : "info");
      }}
    >
      {copied ? "Copié !" : label}
    </ActionButton>
  );
}

export function AddCalendarButton({
  match,
  variant = "ghost",
  full,
  size = "md",
}: {
  match: HydratedMatch;
  variant?: Variant;
  full?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const { toast } = useToast();
  return (
    <ActionButton
      variant={variant}
      accent="electric"
      full={full}
      size={size}
      icon={<CalendarPlus size={16} />}
      onClick={() => {
        downloadICS([match], `${match.id}.ics`);
        toast("Ajouté à ton calendrier 📅");
      }}
    >
      Calendrier
    </ActionButton>
  );
}

export function GoogleCalendarButton({ match, full }: { match: HydratedMatch; full?: boolean }) {
  return (
    <ActionButton href={googleCalendarUrl(match)} variant="outline" accent="electric" full={full} icon={<CalendarPlus size={16} />}>
      Google Agenda
    </ActionButton>
  );
}

export function RemindButton({ match, full, variant = "ghost" }: { match: HydratedMatch; full?: boolean; variant?: Variant }) {
  const { toast } = useToast();
  return (
    <ActionButton
      variant={variant}
      accent="gold"
      full={full}
      icon={<BellRing size={16} />}
      onClick={() => toast("On te prévient 30 min avant ⏰")}
    >
      Me prévenir
    </ActionButton>
  );
}

export function ShareButton({ match, full, variant = "ghost" }: { match: HydratedMatch; full?: boolean; variant?: Variant }) {
  const { tzId } = useTimezone();
  const { toast } = useToast();
  const text = matchWhatsApp(match, tzId);

  return (
    <ActionButton
      variant={variant}
      accent="hype"
      full={full}
      icon={<Share2 size={16} />}
      onClick={async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
          try {
            await navigator.share({ title: "MatchRadar", text });
            return;
          } catch {
            /* user cancelled — fall through to WhatsApp */
          }
        }
        window.open(whatsAppShareUrl(text), "_blank");
        toast("Partage prêt 📲");
      }}
    >
      Partager
    </ActionButton>
  );
}
