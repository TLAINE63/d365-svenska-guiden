import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ArrowLeftRight, Target } from "lucide-react";
import { useShortlist } from "@/contexts/ShortlistContext";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type FunnelStage = "early" | "evaluation" | "decision";

interface Props {
  /** Vilken fas sidan i första hand tillhör – den lyfts fram som primär. */
  stage?: FunnelStage;
  /** Tidig fas: vilken köparguide som är mest relevant. */
  guide?: "erp" | "crm";
  /** Var CTA:n visas – används i mätningen. */
  source: string;
  className?: string;
}

const GUIDES = {
  erp: { to: "/erp-koparguiden-2026/", label: "ERP-köparguiden 2026" },
  crm: { to: "/crm-koparguiden-2026/", label: "CRM-köparguiden 2026" },
} as const;

/**
 * Trestegs-CTA som varje publik sida driver mot:
 *   Tidig köpfas    → köparguide (PDF-grind)
 *   Aktiv utvärdering → partnerjämförelse / shortlist
 *   Beslutsfas      → partnerväljaren
 */
const FunnelCTA = ({ stage = "early", guide = "erp", source, className = "" }: Props) => {
  const { count } = useShortlist();
  const g = GUIDES[guide];

  const track = (step: FunnelStage, target: string) =>
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "funnel_cta_click",
      metadata: { stage: step, source, target },
    });

  const cards: {
    key: FunnelStage;
    eyebrow: string;
    title: string;
    body: string;
    icon: typeof BookOpen;
    to: string;
    cta: string;
    secondary?: { to: string; label: string };
  }[] = [
    {
      key: "early",
      eyebrow: "Tidig köpfas",
      title: g.label,
      body: "Vad du behöver veta innan du börjar prata med leverantörer: kostnadsbild, vanliga fallgropar och vilka krav du bör ställa.",
      icon: BookOpen,
      to: g.to,
      cta: "Hämta guiden",
    },
    {
      key: "evaluation",
      eyebrow: "Aktiv utvärdering",
      title: "Partnerjämförelse",
      body:
        count > 0
          ? `Du har ${count} partner${count === 1 ? "" : "s"} sparade. Jämför dem sida vid sida innan du bjuder in till dialog.`
          : "Jämför partners sida vid sida på bransch, produktområde, storlek och leveransförmåga – och spara dina favoriter till shortlist.",
      icon: ArrowLeftRight,
      to: "/jamfor-partners/",
      cta: "Jämför partners",
      secondary: { to: "/shortlist/", label: count > 0 ? `Min shortlist (${count})` : "Min shortlist" },
    },
    {
      key: "decision",
      eyebrow: "Beslutsfas",
      title: "Partnerväljaren",
      body: "Svara på några frågor om verksamhet, behov och storlek – och få rätt typ av Dynamics 365-partner föreslagen från köparens sida.",
      icon: Target,
      to: "/valjdynamics365partner/",
      cta: "Hitta rätt partner",
    },
  ];

  return (
    <section className={`bg-muted/40 border-y border-border py-12 sm:py-16 ${className}`} aria-label="Nästa steg">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Vad är ditt nästa steg?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Var du står i processen avgör vad som hjälper mest just nu. Välj den väg som passar dig.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => {
            const primary = c.key === stage;
            const Icon = c.icon;
            return (
              <div
                key={c.key}
                className={`flex flex-col rounded-lg border p-6 transition-all hover:-translate-y-1 ${
                  primary
                    ? "border-[hsl(var(--cta-orange))] bg-card shadow-md"
                    : "border-border bg-card/60"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-4 w-4 ${primary ? "text-[hsl(var(--cta-orange))]" : "text-accent"}`} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {c.eyebrow}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{c.body}</p>

                <Link
                  to={c.to}
                  onClick={() => track(c.key, c.to)}
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
                    primary
                      ? "bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]"
                      : "border border-border text-foreground hover:border-[hsl(var(--cta-orange))] hover:text-[hsl(var(--cta-orange))]"
                  }`}
                >
                  {c.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {c.secondary && (
                  <Link
                    to={c.secondary.to}
                    onClick={() => track(c.key, c.secondary!.to)}
                    className="mt-2 text-center text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    {c.secondary.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FunnelCTA;
