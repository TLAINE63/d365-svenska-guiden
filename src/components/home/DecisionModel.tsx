import { track } from "@/lib/track";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, LayoutGrid, type LucideIcon } from "lucide-react";

/** Fyra vägval, ett huvudmål per kort (hela kortet klickbart) med enhetlig text-CTA. */
export const HERO_NODES: {
  icon: LucideIcon;
  title: string;
  text: string;
  cta: string;
  to: string;
  journey: string;
  /** Stabilt kort-id för mätning (Sprint 0.9). */
  cardId: string;
  /** Intern klassificering, visas aldrig publikt. */
  intentType?: "BuyerProject" | "ExpertRequirement";
  buyerStage?: "Plan";
  /** Kortet öppnar startsidans val av behovsanalys. */
  needsAnalysis?: boolean;
  /** Sprint 1.0: kortet öppnar valet "Vad söker ni?" (partner eller expert). Länken är reserv utan JavaScript. */
  opensCompetenceChoice?: boolean;
}[] = [
  { icon: ClipboardCheck, title: "Vi utvärderar ett nytt CRM- eller affärssystem (ERP)", text: "Utforska och jämför alternativ utifrån verksamhetens behov.", cta: "Utforska rätt lösning", to: "/kom-igang/?source=startsida", journey: "new_system", cardId: "hero_new_crm_erp", intentType: "BuyerProject" },
  { icon: ArrowLeftRight, title: "Vi vill förstå vad det kostar", text: "Beräkna licenser, införande, löpande kostnader och TCO.", cta: "Beräkna kostnaden", to: "/kostnad/", journey: "cost", cardId: "hero_cost", intentType: "BuyerProject", buyerStage: "Plan" },
  { icon: LayoutGrid, title: "Vi använder redan Dynamics\u00A0365", text: "Få mer värde genom vidareutveckling, support, AI, förvaltning eller ett bättre partnersamarbete.", cta: "Utforska nästa steg", to: "/befintlig-kund/", journey: "existing_customer", cardId: "hero_existing_dynamics" },
  { icon: Users, title: "Vi behöver Dynamics\u00A0365-kompetens", text: "Hitta en relevant partner eller specifik kompetens utifrån ert behov.", cta: "Hitta rätt kompetens", to: "/kompetens/", journey: "competence", cardId: "hero_competence", opensCompetenceChoice: true },
];
const NODES = HERO_NODES;

const cardClass =
  "group flex h-full min-h-[44px] w-full flex-col items-start gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/[0.07] shadow-md p-3 sm:p-3.5 text-left transition-colors hover:border-[hsl(var(--accent-dark-zone)/0.7)] hover:bg-primary-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))] lg:p-5";

const CardBody = ({ n }: { n: (typeof NODES)[number] }) => (
  <>
    <n.icon className="h-5 w-5 shrink-0 text-[hsl(var(--accent-dark-zone))] lg:h-6 lg:w-6" aria-hidden="true" />
    <span className="text-balance text-[14.5px] sm:text-[16px] font-bold leading-tight text-primary-foreground lg:text-[19px]">{n.title}</span>
    <span className="text-[12.5px] leading-snug text-primary-foreground/65 lg:text-[14px]">{n.text}</span>
    <span className="mt-auto inline-flex items-center gap-1 rounded-md bg-primary-foreground/10 px-2 py-1 text-[13px] font-semibold text-primary-foreground lg:bg-transparent lg:px-0 lg:py-0 lg:pt-1.5 lg:text-[14px] underline-offset-4 group-hover:underline">
      {n.cta} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
    </span>
  </>
);

interface DecisionModelProps {
  /** Öppnar startsidans val av behovsanalys (ERP, CRM eller kundservice). */
  onStartNeedsAnalysis?: () => void;
  /** Öppnar valet "Vad söker ni?" för kompetenskortet. */
  onOpenCompetenceChoice?: () => void;
}

/** Icke-linjär beslutsmodell. Desktop: fyra kort i en rad. */
const DecisionModel = ({ onStartNeedsAnalysis, onOpenCompetenceChoice }: DecisionModelProps) => (
  <nav aria-label="Vägval i ert Dynamics 365-beslut">
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
      {NODES.map((n) =>
        n.needsAnalysis && onStartNeedsAnalysis ? (
          <button
            key={n.to}
            type="button"
            className={cardClass}
            onClick={() => {
              track("home_needs_analysis_click", { source: "beslutsmodell" });
              onStartNeedsAnalysis();
            }}
          >
            <CardBody n={n} />
          </button>
        ) : (
          <Link
            key={n.to}
            to={n.to}
            className={cardClass}
            onClick={(e) => {
              const opensChoice = !!(n.opensCompetenceChoice && onOpenCompetenceChoice);
              const destination = opensChoice ? "competence_choice" : n.to;
              const meta = {
                source_page: typeof window !== "undefined" ? window.location.pathname : "/",
                card_id: n.cardId,
                intent_type: n.intentType ?? null,
                buyer_stage: n.buyerStage ?? null,
                destination,
                timestamp: new Date().toISOString(),
              };
              track("hero_intent_clicked", {
                card_id: n.cardId,
                source_page: meta.source_page,
                initial_intent: n.intentType ?? null,
                buyer_stage: n.buyerStage ?? null,
                destination,
                timestamp: meta.timestamp,
              });
              track("home_path_click", { path: n.title, to: destination, ...meta });
              trackFunnelEvent({ event_type: "journey", event_name: "homepage_journey_selected", metadata: { journey_type: n.journey, to: destination, ...meta } });
              if (opensChoice) {
                e.preventDefault();
                onOpenCompetenceChoice!();
              }
            }}
          >
            <CardBody n={n} />
          </Link>
        ),
      )}
    </div>
  </nav>
);

export default DecisionModel;
