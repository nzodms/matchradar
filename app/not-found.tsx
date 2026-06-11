import { RadarBackground } from "@/components/RadarBackground";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 text-center">
      <RadarBackground accent="danger" />
      <div className="relative">
        <p className="font-display text-7xl font-bold tabular text-gradient-hype">404</p>
        <h1 className="mt-2 font-display text-xl font-bold text-ink">Hors radar</h1>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Cette page n'est pas sur le radar. Reviens voir les matchs du jour.
        </p>
        <Link
          href="/"
          className="tap mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-hype px-5 font-bold text-bg shadow-glow-hype"
        >
          <ArrowLeft size={18} /> Retour au radar
        </Link>
      </div>
    </div>
  );
}
