import { lazy, Suspense, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { COMPETENCE_CTA } from "@/lib/conversionCtas";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import { draftSummary, requirementsToClarify, roleTitle, type ExpertDraft } from "@/lib/expertRequirement";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

interface Props {
  draft: ExpertDraft;
  /** Visa listan med krav att precisera (på kompetensguiden). */
  showRequirements?: boolean;
  pageType: string;
  className?: string;
  /** Valfritt styrt läge, t.ex. när partnerdelens tomläge öppnar formuläret. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Sprint 1.2 Conversion Exit, primär "Beskriv kompetensbehovet" och sekundär "Prata med d365.se"
 * för den som är osäker på vilken kompetens som behövs (Conversion & Trust steg 3).
 * Återanvänder rådgivningsflödet (PlanContactDialog advisory → submit-inquiry), som skapar ett
 * internt ärende hos d365.se med status ny. Inget skickas till någon partner, och en namngiven
 * introduktion kräver köparens godkännande (partner_introductions).
 */
export default function ExpertRequirementExit({ draft, showRequirements = true, pageType, className = "", open: openProp, onOpenChange }: Props) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (v: boolean) => { setOpenState(v); onOpenChange?.(v); };
  const summary = draftSummary(draft);
  const toClarify = requirementsToClarify(draft);

  return (
    <section id="beskriv-behov" className={`scroll-mt-28 rounded-xl border border-border bg-card p-6 ${className}`}>
      <h2 className="text-lg font-bold mb-2">Så går ni vidare med ert kompetensbehov</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
        Beskriv behovet så går d365.se igenom det manuellt. Tillgänglighet och lämplig leveransform
        behöver alltid verifieras. Behovet skickas inte vidare till partners automatiskt.
      </p>

      {(summary.length > 0 || showRequirements) && (
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          {summary.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <h3 className="text-sm font-semibold mb-2">Ert behov hittills</h3>
              <dl className="space-y-1 text-sm">
                {summary.map((r) => (
                  <div key={r.label} className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground">{r.label}:</dt>
                    <dd className="font-medium">{nowrapBrand(r.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {showRequirements && (
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold mb-2">Krav som kan behöva preciseras</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {toClarify.map((t) => <li key={t}>{nowrapBrand(t)}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <Button onClick={() => setOpen(true)}>
        {COMPETENCE_CTA.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      <p className="text-xs text-muted-foreground mt-3">
        Ingen information skickas vidare till partners utan ert godkännande.
      </p>
      <AdvisoryOffer
        className="mt-5 border-t border-border pt-4"
        variant="compact"
        placement="expert_requirement"
        pageType={pageType}
        cta={COMPETENCE_CTA.secondary}
        text="Osäker på vilken kompetens ni behöver, eller om det är en partner eller en expert ni söker?"
        dialogTitle="Prata med d365.se om ert kompetensbehov"
        dialogDescription="Resonera med oss om vilken kompetens ni behöver och vilken väg som passar. Inget skickas till någon partner utan ert godkännande."
        messageLabel="Vad funderar ni på? (valfritt)"
        submitEvent="expert_requirement_submitted"
        metadata={{ intent_type: "ExpertRequirement", role: draft.role ?? null, product: draft.product ?? null }}
      />

      {open && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setOpen(false)}
            topic={{
              title: COMPETENCE_CTA.primary,
              description: "Behovet går till d365.se (Dynamic Factory) för manuell genomgång. Inget skickas till någon partner. Vill ni bli introducerade till en namngiven partner frågar vi er först.",
              helpWith: roleTitle(draft.role) ? `Kompetensbehov: ${roleTitle(draft.role)}` : "Kompetensbehov",
              startEvent: "expert_requirement_started",
              submitEvent: "expert_requirement_submitted",
              messageLabel: "Beskrivning av behovet (valfritt)",
              hideFocus: true,
              extras: summary.length ? [{ key: "kompetensbehov", label: "Kompetensbehov", lines: summary.map((r) => `${r.label}: ${r.value}`) }] : [],
              metadata: {
                intent_type: "ExpertRequirement",
                role: draft.role ?? null,
                product: draft.product ?? null,
                specialism: draft.specialism ?? null,
                seniority: draft.seniority ?? null,
                delivery: draft.delivery ?? null,
              },
              advisory: { placement: "expert_requirement", cta: COMPETENCE_CTA.primary, pageType },
              doneTitle: "Ert kompetensbehov är registrerat",
              showDoneSummary: true,
              doneNotes: [
                "d365.se granskar behovet manuellt och hör av sig.",
                "Konsulters tillgänglighet och lämplig leveransform måste verifieras innan vi kan föreslå ett nästa steg.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
