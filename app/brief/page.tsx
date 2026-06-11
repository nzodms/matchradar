"use client";

import { AlertSignupCard } from "@/components/AlertSignupCard";
import { AppShell } from "@/components/AppShell";
import { DailyBriefCard } from "@/components/DailyBriefCard";
import { HotMatchCard } from "@/components/MatchCard";
import { MarketPulseCard } from "@/components/MarketPulseCard";
import { useTimezone } from "@/components/Providers";
import { SectionTitle } from "@/components/SectionTitle";
import { useToast } from "@/components/Toast";
import { WhatsAppCopyCard } from "@/components/WhatsAppCopyCard";
import { useCopy } from "@/lib/hooks";
import { buildDailyBrief } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { dailyBriefWhatsApp } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Check, Copy, Laugh, Newspaper, Zap } from "lucide-react";

export default function BriefPage() {
  const { tzId } = useTimezone();
  const brief = buildDailyBrief();

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hype/15 text-hype ring-1 ring-hype/30">
            <Newspaper size={18} />
          </span>
          <div>
            <p className="eyebrow">Coupe du Monde</p>
            <h1 className="font-display text-xl font-bold leading-tight text-ink">Le brief du jour</h1>
          </div>
        </div>
        <p className="mb-4 text-sm leading-snug text-muted">
          Tout ce qu'il faut savoir aujourd'hui en 10 secondes. Capture-le, balance-le au groupe, garde une
          longueur d'avance.
        </p>
      </motion.div>

      <DailyBriefCard brief={brief} />

      {/* Copy variants */}
      <div className="mt-4">
        <SectionTitle eyebrow="Prêt à envoyer" title="Le message du groupe" />
        <div className="mb-2 grid grid-cols-2 gap-2">
          <CopyChip text={brief.shortMessage} label="Version courte" icon={Zap} accent="hype" />
          <CopyChip text={brief.funnyMessage} label="Version drôle" icon={Laugh} accent="gold" />
        </div>
        <WhatsAppCopyCard
          text={dailyBriefWhatsApp(brief, tzId)}
          title="Version complète"
          subtitle="Le résumé complet, prêt à coller dans la conversation."
        />
      </div>

      {/* Hot match of the day */}
      <div className="mt-5">
        <SectionTitle eyebrow="Ça chauffe" title="Le match chaud du jour" />
        <HotMatchCard match={brief.hotMatch} />
      </div>

      {/* Market pulse of the day */}
      <div className="mt-5">
        <SectionTitle eyebrow="Cotes indicatives" title="Le Market Pulse du jour" />
        <MarketPulseCard match={brief.unmissable} />
      </div>

      <div className="mt-5">
        <AlertSignupCard />
      </div>
    </AppShell>
  );
}

function CopyChip({ text, label, icon: Icon, accent }: { text: string; label: string; icon: typeof Zap; accent: "hype" | "gold" }) {
  const { copy, copied } = useCopy();
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copy(text);
        toast(ok ? "Copié 📋" : "Copie impossible", ok ? "success" : "info");
      }}
      className={cn(
        "tap inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl border text-[13px] font-bold transition-colors",
        copied ? "border-hype/40 bg-hype/15 text-hype" : "border-line/10 bg-surface/50 text-ink",
      )}
    >
      {copied ? <Check size={15} strokeWidth={2.8} /> : <Icon size={15} style={{ color: `rgb(var(--${accent}))` }} />}
      {copied ? "Copié !" : label}
    </button>
  );
}
