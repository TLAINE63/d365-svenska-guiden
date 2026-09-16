import { useEffect, useState } from "react";
import { Bot, Sparkles, Search, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isInternalViewer } from "@/lib/internalView";

interface SiteStats {
  botHits90: number;
  botHits365: number;
  botCount: number;
  topBots: { label: string; hits: number }[];
  aiReferralVisits: number;
  citationChecks: number;
  citationMentions: number;
}
interface PartnerStats {
  slug: string;
  botHits90: number;
  botCount: number;
}

interface Props {
  slug: string;
  partnerName: string;
  /** Visa alltid, t.ex. i partnerns egen vy via profileringslänken. */
  forceVisible?: boolean;
}

const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export default function PartnerAiVisibilityCard({ slug, partnerName, forceVisible }: Props) {
  const [site, setSite] = useState<SiteStats | null>(null);
  const [partner, setPartner] = useState<PartnerStats | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(Boolean(forceVisible) || isInternalViewer());
  }, [forceVisible]);

  // Mätpixel: loggar hämtningar av just den här profilsidan, inklusive
  // AI-robotar som hämtar sidans innehåll.
  useEffect(() => {
    if (!slug || typeof window === "undefined") return;
    const img = new Image();
    img.src = `${FN_BASE}/crawler-log?p=/partner/${encodeURIComponent(slug)}&t=${Date.now()}`;
  }, [slug]);

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.functions.invoke("partner-ai-visibility", {
        body: { slug },
      });
      if (cancelled || error || !data || data.error) return;
      setSite(data.site as SiteStats);
      setPartner(data.partner as PartnerStats);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, allowed]);

  if (!allowed || !site) return null;

  const citationPct =
    site.citationChecks > 0
      ? Math.round((site.citationMentions / site.citationChecks) * 100)
      : null;

  const boxes: { icon: typeof Bot; label: string; value: string; hint: string }[] = [];

  if (partner && partner.botHits90 > 0) {
    boxes.push({
      icon: Sparkles,
      label: `AI-hämtningar av ${partnerName}s profil`,
      value: partner.botHits90.toLocaleString("sv-SE"),
      hint: `${partner.botCount} olika AI-modeller, senaste 90 dagarna`,
    });
  }
  if (site.botHits90 > 0) {
    boxes.push({
      icon: Bot,
      label: "AI-hämtningar av d365.se",
      value: site.botHits90.toLocaleString("sv-SE"),
      hint: `${site.botCount} olika AI-modeller, senaste 90 dagarna`,
    });
  }
  if (site.botHits365 > 0) {
    boxes.push({
      icon: Search,
      label: "AI-hämtningar senaste 12 månaderna",
      value: site.botHits365.toLocaleString("sv-SE"),
      hint: "hela d365.se",
    });
  }
  if (site.aiReferralVisits > 0) {
    boxes.push({
      icon: Sparkles,
      label: "Besökare via AI-tjänster",
      value: site.aiReferralVisits.toLocaleString("sv-SE"),
      hint: "ChatGPT, Copilot, Perplexity och liknande",
    });
  }
  if (citationPct !== null) {
    boxes.push({
      icon: Quote,
      label: "Testfrågor där d365.se nämns i AI-svaret",
      value: `${site.citationMentions} av ${site.citationChecks}`,
      hint: `${citationPct} % av kontrollerade frågor`,
    });
  }

  if (boxes.length === 0) return null;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Synlighet i AI-svar</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Allt fler köpare frågar ChatGPT, Copilot och Perplexity innan de kontaktar en
            leverantör. Så här ofta hämtar AI-modellerna innehåll härifrån.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {boxes.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="rounded-lg border bg-background p-3">
                  <div className="flex items-center gap-2 text-accent mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium text-muted-foreground">{b.label}</span>
                  </div>
                  <p className="text-2xl font-bold leading-tight text-foreground">{b.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{b.hint}</p>
                </div>
              );
            })}
          </div>

          {site.topBots.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Mest aktiva AI-modeller:{" "}
              {site.topBots.map((b) => `${b.label} (${b.hits.toLocaleString("sv-SE")})`).join(", ")}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Siffrorna avser d365.se som helhet om inget annat anges. Profilmaterialet på den här
            sidan ingår i det innehåll AI-modellerna hämtar. Statistiken började mätas fr.o.m.
            2026-09-16.
          </p>
        </div>
      </div>
    </section>
  );
}
