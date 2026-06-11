"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "./Toast";

interface AlertSignupCardProps {
  title?: string;
  subtitle?: string;
  cta?: string;
  className?: string;
}

/** Email capture for the daily brief. Front-end only — wire to an API later. */
export function AlertSignupCard({
  title = "Reçois le brief chaque matin",
  subtitle = "Les matchs à ne pas rater, ton verdict du jour et le message prêt pour le groupe. Tous les matins, gratuit.",
  cta = "Activer le brief quotidien",
  className,
}: AlertSignupCardProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const valid = /.+@.+\..+/.test(email);

  return (
    <div className={cn("glass-strong relative overflow-hidden rounded-3xl p-5", className)}>
      <span className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-hype/15 blur-3xl" />

      <div className="relative">
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-hype/15 text-hype ring-1 ring-hype/30">
          <Mail size={18} />
        </span>
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        <p className="mt-1 text-[13px] leading-snug text-muted">{subtitle}</p>

        {done ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hype/30 bg-hype/10 px-4 py-3 text-sm font-bold text-hype">
            <Check size={18} strokeWidth={2.8} /> C'est noté ! Premier brief demain matin.
          </div>
        ) : (
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!valid) {
                toast("Entre un email valide", "info");
                return;
              }
              setDone(true);
              toast("Brief quotidien activé 🔔");
            }}
          >
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="h-12 flex-1 rounded-2xl border border-line/10 bg-surface/60 px-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-hype/40"
            />
            <button
              type="submit"
              className="tap inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-hype px-5 font-bold text-bg shadow-glow-hype"
            >
              {cta} <ArrowRight size={18} />
            </button>
          </form>
        )}
        <p className="mt-2 text-[11px] text-faint">Zéro spam. Désinscription en un clic. 100 % gratuit.</p>
      </div>
    </div>
  );
}
