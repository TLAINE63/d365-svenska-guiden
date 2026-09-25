import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateBuyerContext } from "@/lib/buyerContext";
import { buildKomIgangUrl } from "@/lib/komIgangUrl";
import { trackFunnelStep } from "@/utils/trackFunnelEvent";

const NEED_LABELS: Record<string, string> = {
  industry: "Erfarenhet av er bransch",
  migration: "Migrering från NAV eller annat system",
  integrations: "Integrationer mot andra system",
  quickstart: "Snabbstart med fast pris",
  local: "Närhet och svensk support",
  support: "Löpande förvaltning efter införandet",
};

const FIT_LABELS: Record<string, string> = {
  high: "Business Central verkar passa er väl",
  good: "Business Central verkar passa er väl",
  medium: "Business Central kan passa, med vissa frågetecken",
  partial: "Business Central kan passa, med vissa frågetecken",
  low: "Business Central passar sannolikt sämre, kontrollera noga",
};

const STORE = "bc_site_handoff";

interface Handoff {
  users?: number;
  fit?: string;
  needs: string[];
}

function sizeFromUsers(users?: number): string | null {
  if (!users) return null;
  if (users <= 10) return "1-49";
  if (users <= 50) return "50-249";
  return "250-999";
}

/** Tar emot besökare från businesscentral.se och visar deras bedömning. */
export default function BcSiteHandoff() {
  const [data, setData] = useState<Handoff | null>(null);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      let h: Handoff | null = null;
      if ((p.get("utm_source") || "").toLowerCase() === "businesscentral.se") {
        const users = Number(p.get("users") || 0) || undefined;
        const needs = (p.get("needs") || "").split(",").filter((n) => NEED_LABELS[n]);
        h = { users, fit: p.get("fit") || undefined, needs };
        sessionStorage.setItem(STORE, JSON.stringify(h));
        updateBuyerContext({ product: "Business Central", size: sizeFromUsers(users) ?? undefined });
        trackFunnelStep("cta_view", { tool: "bc_site_handoff" } as never);
      } else {
        const saved = sessionStorage.getItem(STORE);
        if (saved) h = JSON.parse(saved);
      }
      setData(h);
    } catch {
      /* ignore */
    }
  }, []);

  if (!data) return null;

  const dismiss = () => {
    sessionStorage.removeItem(STORE);
    setData(null);
  };

  const komIgang = buildKomIgangUrl({
    product: "Business Central",
    source: "businesscentral.se",
    size: sizeFromUsers(data.users),
  });
  const fitText = data.fit ? FIT_LABELS[data.fit.toLowerCase()] : null;

  return (
    <section className="py-6 sm:py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative rounded-xl border border-accent/30 bg-card p-5 sm:p-7 shadow-sm">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Stäng"
            className="absolute right-3 top-3 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Välkommen från businesscentral.se</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
            Nu tar vi er bedömning vidare till partnervalet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Vi har tagit med det ni angav. Inget skickas till någon partner utan ert godkännande.
          </p>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
            {fitText && (
              <li className="flex gap-2"><CheckCircle2 className="size-4 mt-0.5 shrink-0 text-accent" />{fitText}</li>
            )}
            {data.users ? (
              <li className="flex gap-2"><CheckCircle2 className="size-4 mt-0.5 shrink-0 text-accent" />Cirka {data.users} användare</li>
            ) : null}
            {data.needs.map((n) => (
              <li key={n} className="flex gap-2"><CheckCircle2 className="size-4 mt-0.5 shrink-0 text-accent" />{NEED_LABELS[n]}</li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="default">
              <Link to={komIgang} onClick={() => trackFunnelStep("cta_click", { tool: "bc_site_handoff" } as never)}>
                Få rekommenderad partnerlista <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="#partners">Se Business&nbsp;Central-partners</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
