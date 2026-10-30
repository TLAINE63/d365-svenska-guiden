import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, UserRound, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DescribeNeedDialog from "@/components/kompetens/DescribeNeedDialog";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackCompetenceEvent } from "@/utils/trackCompetenceEvent";
import { markPartnerSearchStarted } from "@/lib/partnerSearchFunnel";
import { markExpertSearchStarted } from "@/lib/expertRequirement";

/**
 * Sprint 1.0: första steget efter "Hitta rätt kompetens" i startsidans hero.
 * Besökaren väljer själv om hon söker en partner eller en expert/konsult.
 * Båda vägarna leder till befintliga funktioner (partnerväljaren respektive
 * kompetensöversikten), så ingen parallell partner- eller kompetensmodell finns.
 */
export type CompetenceType = "partner" | "expert" | "unsure";

export const COMPETENCE_CHOICES: {
  type: Exclude<CompetenceType, "unsure">;
  title: string;
  text: string;
  cta: string;
  to: string;
  /** Intern klassificering, visas aldrig publikt. */
  intentType: "PartnerSearch" | "ExpertRequirement";
  startEvent: "partner_search_started" | "expert_search_started";
}[] = [
  {
    type: "partner",
    title: "En Dynamics\u00A0365-partner",
    text: "För ett projekt, införande, vidareutveckling, support eller förvaltning.",
    cta: "Hitta relevant partner",
    to: "/valjdynamics365partner/#hitta-partners",
    intentType: "PartnerSearch",
    startEvent: "partner_search_started",
  },
  {
    type: "expert",
    title: "En specifik expert eller konsult",
    text: "När ni behöver en viss roll, specialistkompetens eller förstärkning av ett befintligt team.",
    cta: "Hitta rätt expertkompetens",
    to: "/kompetens/",
    intentType: "ExpertRequirement",
    // Sprint 1.2: sökningen startar här; expert_requirement_started mäts när behovsformuläret öppnas.
    startEvent: "expert_search_started",
  },
];

export const UNSURE_INTENT = "CompetenceNeedUnclassified" as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Produkt från sidans sammanhang, om den är känd. */
  productContext?: string;
}

const CompetenceChoiceDialog = ({ open, onOpenChange, productContext }: Props) => {
  const [needOpen, setNeedOpen] = useState(false);

  const base = () => ({
    source_page: typeof window !== "undefined" ? window.location.pathname : "/",
    product_context: productContext,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    if (open) trackCompetenceEvent("competence_path_opened", base());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const select = (type: CompetenceType, intent: string) =>
    trackCompetenceEvent("competence_type_selected", { ...base(), competence_type: type, intent_type: intent });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Vad söker ni?</DialogTitle>
            <DialogDescription>
              Välj det som bäst beskriver ert behov. Är ni osäkra kan ni istället beskriva vad ni behöver hjälp med.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            {COMPETENCE_CHOICES.map((c) => {
              const Icon = c.type === "partner" ? Building2 : UserRound;
              return (
                <Link
                  key={c.type}
                  to={c.to}
                  onClick={() => {
                    select(c.type, c.intentType);
                    if (c.type === "partner") markPartnerSearchStarted();
                    if (c.type === "expert") markExpertSearchStarted();
                    trackCompetenceEvent(c.startEvent, { ...base(), competence_type: c.type, destination: c.to });
                    onOpenChange(false);
                  }}
                  className="group flex h-full flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-[hsl(var(--cta-orange))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
                >
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-base font-bold leading-tight text-foreground sm:text-lg">{c.title}</span>
                  <span className="text-sm leading-snug text-muted-foreground">{nowrapBrand(c.text)}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-[hsl(var(--cta-orange))] underline-offset-4 group-hover:underline">
                    {c.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-1 flex flex-wrap items-start gap-x-3 gap-y-1 border-t border-border pt-4 text-sm">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <div className="flex-1 min-w-[12rem]">
              <p className="font-semibold text-foreground">Osäker på vilket ni behöver?</p>
              <p className="text-muted-foreground">
                Beskriv kort vad ni behöver hjälp med så hjälper d365.se er att hitta rätt väg.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                select("unsure", UNSURE_INTENT);
                trackCompetenceEvent("kompetens_need_form_open", { competence_type: "unsure" });
                onOpenChange(false);
                setNeedOpen(true);
              }}
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Beskriv behovet <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <DescribeNeedDialog
        open={needOpen}
        onOpenChange={setNeedOpen}
        roleLabel="Osäker: partner eller expert/konsult"
        filters={productContext ? { product: productContext } : {}}
        compact
      />
    </>
  );
};

export default CompetenceChoiceDialog;
