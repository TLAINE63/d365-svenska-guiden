import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Sparkles, LifeBuoy, Users, Handshake, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CompetenceChoiceDialog from "@/components/kompetens/CompetenceChoiceDialog";
import { PRODUCT_OPTIONS } from "@/data/competenceGuides";
import { getBuyerContext } from "@/lib/buyerContext";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import {
  EXISTING_OPTIONS, PARTNER_REVIEW_HELP, PARTNER_REVIEW_HORIZON, optionByKey, partnerReviewLines,
  type ExistingOptionKey, type PartnerReviewDraft,
} from "@/lib/existingDynamicsPaths";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

const ICONS: Record<ExistingOptionKey, typeof Layers> = {
  vidareutveckla: Layers,
  ai: Sparkles,
  support: LifeBuoy,
  kompetens: Users,
  partnersamarbete: Handshake,
  annat: MessageCircle,
};

/** Hash som andra delar av sidan kan länka till för att öppna utvärderingen av partnersamarbetet. */
export const PARTNER_REVIEW_HASH = "utvardera-partnersamarbetet";

const selectCls = "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Sprint 1.3: sex vägar för befintliga Dynamics 365-kunder och två Conversion Exits
 * (Prata med d365.se / Utvärdera partnersamarbetet). Båda återanvänder rådgivningsflödet
 * (PlanContactDialog advisory → submit-inquiry), som skapar ett internt ärende. Inget skickas till partners.
 */
export default function ExistingDynamicsNextStep() {
  const [selected, setSelected] = useState<ExistingOptionKey | null>(null);
  const [product, setProduct] = useState<string>("");
  const [review, setReview] = useState<PartnerReviewDraft>({});
  const [competenceOpen, setCompetenceOpen] = useState(false);
  const [dialog, setDialog] = useState<"help" | "review" | null>(null);

  useEffect(() => {
    const known = getBuyerContext().product;
    if (known && (PRODUCT_OPTIONS as readonly string[]).includes(known)) setProduct(known);
    const fromHash = () => { if (window.location.hash === `#${PARTNER_REVIEW_HASH}`) choose("partnersamarbete"); };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const option = optionByKey(selected);

  function choose(key: ExistingOptionKey) {
    const o = optionByKey(key)!;
    setSelected(key);
    trackFunnelEvent({ event_type: "cta_click", event_name: "existing_dynamics_option_selected", metadata: { option: key, initial_intent: o.intent, source_page: "/befintlig-kund/" } });
    if (key === "kompetens") setCompetenceOpen(true);
    if (typeof window !== "undefined") window.setTimeout(() => document.getElementById("befintlig-nasta-steg-svar")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }

  const reviewWithProduct: PartnerReviewDraft = { ...review, product: product || undefined };

  return (
    <section id="nasta-steg" className="mb-12 rounded-lg border border-border bg-card p-6 sm:p-8 scroll-mt-28" aria-labelledby="befintlig-nasta-steg-h">
      <h2 id="befintlig-nasta-steg-h" className="text-2xl font-bold text-foreground mb-2">Vad vill ni göra härnäst?</h2>
      <p className="text-muted-foreground mb-5 max-w-3xl">
        {nowrapBrand("Välj det som ligger närmast. Inget av valen förutsätter att ni byter lösning eller partner.")}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Nästa steg">
        {EXISTING_OPTIONS.map((o) => {
          const Icon = ICONS[o.key];
          const active = selected === o.key;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={active}
              onClick={() => choose(o.key)}
              className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/50"}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="font-semibold text-foreground leading-snug">{nowrapBrand(o.label)}</span>
            </button>
          );
        })}
      </div>

      <div id="befintlig-nasta-steg-svar" className="scroll-mt-28" aria-live="polite">
        {option && (
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">{nowrapBrand(option.label)}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-3xl">{nowrapBrand(option.text)}</p>

            {option.links.length > 0 && (
              <ul className="mb-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
                {option.links.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                      {nowrapBrand(l.label)} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {option.key === "kompetens" && (
              <Button variant="outline" onClick={() => setCompetenceOpen(true)}>
                Välj partner eller expert <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}

            {option.key === "partnersamarbete" && (
              <div id={PARTNER_REVIEW_HASH} className="scroll-mt-28 space-y-4 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pr-product">{nowrapBrand("Dynamics 365-produkt")}</Label>
                    <select id="pr-product" className={selectCls} value={product} onChange={(e) => setProduct(e.target.value)}>
                      <option value="">Vet inte / flera</option>
                      {PRODUCT_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="pr-horizon">Tidshorisont</Label>
                    <select id="pr-horizon" className={selectCls} value={review.horizon ?? ""} onChange={(e) => setReview({ ...review, horizon: e.target.value || undefined })}>
                      <option value="">Välj</option>
                      {PARTNER_REVIEW_HORIZON.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="pr-works">Vad fungerar bra i samarbetet?</Label>
                  <Textarea id="pr-works" rows={2} maxLength={600} value={review.works ?? ""} onChange={(e) => setReview({ ...review, works: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="pr-improve">Vad behöver förbättras?</Label>
                  <Textarea id="pr-improve" rows={2} maxLength={600} value={review.improve ?? ""} onChange={(e) => setReview({ ...review, improve: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="pr-help">Vilken hjälp önskar ni?</Label>
                  <select id="pr-help" className={selectCls} value={review.help ?? ""} onChange={(e) => setReview({ ...review, help: e.target.value || undefined })}>
                    <option value="">Välj</option>
                    {PARTNER_REVIEW_HELP.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">Allt är frivilligt. Uppgifterna följer med först när ni själva skickar dem till d365.se.</p>
                <Button onClick={() => setDialog("review")}>
                  Få hjälp att utvärdera partnersamarbetet <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            )}

            {option.key !== "kompetens" && option.key !== "partnersamarbete" && (
              <div className="max-w-3xl space-y-3">
                <div className="sm:max-w-xs">
                  <Label htmlFor="ex-product">{nowrapBrand("Dynamics 365-produkt, om ni vill")}</Label>
                  <select id="ex-product" className={selectCls} value={product} onChange={(e) => setProduct(e.target.value)}>
                    <option value="">Vet inte / flera</option>
                    {PRODUCT_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <Button onClick={() => setDialog("help")}>
                  Prata med d365.se om nästa steg <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <p className="text-xs text-muted-foreground">Ni kan också fortsätta läsa utan att lämna några uppgifter.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CompetenceChoiceDialog open={competenceOpen} onOpenChange={setCompetenceOpen} productContext={product || undefined} />

      {dialog === "help" && option && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setDialog(null)}
            topic={{
              title: "Prata med d365.se om nästa steg",
              description: "Beskriv kort vad ni behöver. d365.se går igenom det manuellt och hör av sig. Inget skickas till någon partner.",
              helpWith: `Befintlig Dynamics 365: ${option.label}`,
              startEvent: "existing_dynamics_help_started",
              submitEvent: "existing_dynamics_help_requested",
              messageLabel: "Kort beskrivning av behovet",
              hideFocus: true,
              extras: [{ key: "befintlig", label: "Befintlig Dynamics\u00A0365", lines: [`Valt behov: ${option.label}`, ...(product ? [`Dynamics-produkt: ${product}`] : [])] }],
              metadata: { initial_intent: option.intent, option: option.key, product: product || null },
              advisory: { placement: "existing_dynamics", cta: "Prata med d365.se om nästa steg", pageType: "befintlig-kund" },
              doneTitle: "Tack, vi har tagit emot ert behov",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom behovet manuellt och hör av sig.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}

      {dialog === "review" && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setDialog(null)}
            topic={{
              title: "Få hjälp att utvärdera partnersamarbetet",
              description: "d365.se går igenom ert underlag manuellt. Inget skickas till någon partner, varken nuvarande eller ny. Vill ni bli introducerade till en namngiven partner frågar vi er först.",
              helpWith: "Utvärdera partnersamarbetet",
              startEvent: "partner_relationship_review_started",
              submitEvent: "partner_relationship_review_requested",
              messageLabel: "Något mer vi bör veta? (valfritt)",
              hideFocus: true,
              extras: partnerReviewLines(reviewWithProduct).length ? [{ key: "partnersamarbete", label: "Partnersamarbetet", lines: partnerReviewLines(reviewWithProduct) }] : [],
              metadata: { initial_intent: "PartnerChange", product: product || null, help: review.help ?? null, horizon: review.horizon ?? null },
              advisory: { placement: "partner_relationship_review", cta: "Få hjälp att utvärdera partnersamarbetet", pageType: "befintlig-kund" },
              doneTitle: "Tack, vi har tagit emot ert underlag",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom underlaget manuellt och hör av sig.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
