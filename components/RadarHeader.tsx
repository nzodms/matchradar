"use client";

import { liveMatches } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { ChevronLeft, Flame } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";

interface RadarHeaderProps {
  /** When set, shows a back chevron + page title instead of utilities. */
  back?: boolean;
  title?: string;
}

export function RadarHeader({ back, title }: RadarHeaderProps) {
  const router = useRouter();
  const liveCount = liveMatches().length;

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-b border-line/8">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-2 px-4">
          {back ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="tap -ml-1 flex items-center gap-1 text-sm font-semibold text-muted"
            >
              <ChevronLeft size={20} />
              Retour
            </button>
          ) : (
            <Link href="/" aria-label="Accueil MatchRadar">
              <Logo />
            </Link>
          )}

          {title && !back ? null : title ? (
            <span className="absolute left-1/2 -translate-x-1/2 font-display text-sm font-bold text-ink">
              {title}
            </span>
          ) : null}

          {!back && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-1 text-[11px] font-bold text-gold">
                <Flame size={12} className="fill-gold" /> 5j
              </span>
              {liveCount > 0 && (
                <Link
                  href="/"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/12 px-2 py-1 text-[11px] font-bold text-danger",
                  )}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
                  </span>
                  {liveCount} live
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
