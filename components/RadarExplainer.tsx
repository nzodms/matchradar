"use client";

import { Clock3, Flame, Trophy, Zap, type LucideIcon } from "lucide-react";

const FACTORS: { icon: LucideIcon; label: string; text: string; accent: string }[] = [
  { icon: Flame, label: "Hype", text: "Stars, rivalité, attente autour du match", accent: "hype" },
  { icon: Trophy, label: "Enjeu", text: "Ce qui se joue vraiment sur le terrain", accent: "gold" },
  { icon: Clock3, label: "Horaire", text: "Un match à 21h vaut plus qu'à 4h du matin", accent: "electric" },
  { icon: Zap, label: "Tension", text: "Le potentiel de suspense et de drame", accent: "danger" },
];

/** "Comment le radar classe les matchs ?" — 4 plain-language factors. */
export function RadarExplainer() {
  return (
    <div className="card rounded-3xl p-4">
      <h3 className="font-display text-[15px] font-bold text-ink">Comment le radar classe les matchs ?</h3>
      <p className="mt-1 text-[12.5px] leading-snug text-muted">
        Chaque match est noté sur 100 à partir de quatre facteurs simples :
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {FACTORS.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="flex items-start gap-2.5 rounded-2xl bg-bg/30 p-2.5 ring-1 ring-line/6">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-line/10"
                style={{ background: `rgb(var(--${f.accent}) / 0.12)`, color: `rgb(var(--${f.accent}))` }}
              >
                <Icon size={14} />
              </span>
              <span>
                <span className="block text-[12px] font-bold text-ink">{f.label}</span>
                <span className="block text-[10.5px] leading-snug text-muted">{f.text}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
