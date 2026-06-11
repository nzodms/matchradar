"use client";

import { liveMatches } from "@/lib/selectors";
import { ChevronLeft, Flame } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";

interface RadarHeaderProps {
  back?: boolean;
  title?: string;
}

export function RadarHeader({ back, title }: RadarHeaderProps) {
  const router = useRouter();
  const liveCount = liveMatches().length;

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-b border-line/7">
        <div className="mx-auto flex h-[52px] max-w-lg items-center justify-between gap-2 px-4">
          {back ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="tap -ml-2 flex h-9 items-center gap-0.5 rounded-full pl-1 pr-3 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              <ChevronLeft size={20} />
              {title ?? "Retour"}
            </button>
          ) : (
            <Link href="/" aria-label="Accueil MatchRadar" className="tap">
              <Logo />
            </Link>
          )}

          {!back && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-gold/10 px-2 text-[11px] font-bold text-gold ring-1 ring-gold/20">
                <Flame size={12} className="fill-gold/30" /> 5j
              </span>
              {liveCount > 0 && (
                <Link
                  href="/"
                  className="tap inline-flex h-7 items-center gap-1.5 rounded-full bg-danger/10 px-2.5 text-[11px] font-bold text-danger ring-1 ring-danger/20"
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
