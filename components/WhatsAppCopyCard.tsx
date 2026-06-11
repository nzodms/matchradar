"use client";

import { useCopy } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { whatsAppShareUrl } from "@/lib/whatsapp";
import { Check, Copy, MessageCircle } from "lucide-react";
import { useToast } from "./Toast";

interface WhatsAppCopyCardProps {
  text: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

/** "Message prêt à envoyer" — chat-bubble preview + copy / share to WhatsApp. */
export function WhatsAppCopyCard({
  text,
  title = "Message prêt à envoyer",
  subtitle = "Le message prêt à balancer dans ton groupe.",
  className,
}: WhatsAppCopyCardProps) {
  const { copy, copied } = useCopy();
  const { toast } = useToast();

  return (
    <div className={cn("glass relative overflow-hidden rounded-3xl p-4", className)}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hype/60 to-transparent" />

      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hype/15 text-hype ring-1 ring-hype/30">
          <MessageCircle size={18} />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-ink">{title}</p>
          <p className="text-[11px] text-muted">{subtitle}</p>
        </div>
      </div>

      {/* chat bubble preview */}
      <div className="rounded-2xl rounded-tl-md border border-hype/15 bg-[#0c160f] p-3 shadow-inner">
        <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-ink/90">
          {text}
        </pre>
        <p className="mt-1 text-right text-[10px] text-faint">à l'instant ✓✓</p>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await copy(text);
            toast(ok ? "Brief copié 📋" : "Copie impossible", ok ? "success" : "info");
          }}
          className={cn(
            "tap inline-flex h-11 items-center justify-center gap-2 rounded-2xl font-bold transition-colors",
            copied ? "bg-hype/20 text-hype" : "bg-hype text-bg shadow-glow-hype",
          )}
        >
          {copied ? <Check size={18} strokeWidth={2.8} /> : <Copy size={18} />}
          {copied ? "Copié !" : "Copier le brief WhatsApp"}
        </button>
        <a
          href={whatsAppShareUrl(text)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur WhatsApp"
          className="tap inline-flex h-11 w-11 items-center justify-center rounded-2xl glass text-hype hover:bg-surface-2/60"
        >
          <MessageCircle size={18} />
        </a>
      </div>
    </div>
  );
}
