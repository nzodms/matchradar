"use client";

import { AlertSignupCard } from "@/components/AlertSignupCard";
import { AppShell } from "@/components/AppShell";
import { DailyBriefCard } from "@/components/DailyBriefCard";
import { useTimezone } from "@/components/Providers";
import { SectionTitle } from "@/components/SectionTitle";
import { WhatsAppCopyCard } from "@/components/WhatsAppCopyCard";
import { buildDailyBrief } from "@/lib/selectors";
import { dailyBriefWhatsApp } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

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
          Tout ce qu'il faut savoir aujourd'hui en 10 secondes. Capture-le, partage-le, garde une longueur
          d'avance sur le groupe.
        </p>
      </motion.div>

      <DailyBriefCard brief={brief} />

      <div className="mt-4">
        <SectionTitle eyebrow="Prêt à envoyer" title="Le message du groupe" />
        <WhatsAppCopyCard
          text={dailyBriefWhatsApp(brief, tzId)}
          title="Brief WhatsApp du jour"
          subtitle="Le résumé complet, prêt à coller dans la conversation."
        />
      </div>

      <div className="mt-4">
        <AlertSignupCard />
      </div>
    </AppShell>
  );
}
