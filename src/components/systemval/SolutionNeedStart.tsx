import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import {
  BUSINESS_NEEDS, CONCRETE_NEEDS, COMPANY_SIZES, TIME_HORIZONS, COST_LINK, assessmentLines, businessNeedByKey,
  type AssessmentDraft, type BusinessNeed, type BusinessNeedKey, type ExploreLink,
} from "@/lib/solutionNeeds";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

const STARTED_KEY = "d365_solution_journey_started";
const selectCls = "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const track = (event_name: string, metadata: Record<string, unknown> = {}) =>
  trackFunnelEvent({ event_type: "cta_click", event_name, metadata: { initial_intent: "BuyerProject", source_page: "/kom-igang/", ...metadata } });

interface Props {
  /** Fortsätt i den befintliga behovsguiden med behovet förifyllt. */
  onContinue: (need: BusinessNeed) => void;
  /** Hoppa över första steget och gå direkt till behovsguiden. */
  onSkip: () => void;
}

/**
 * Sprint 1.4: börja med verksamhetsbehovet, visa sedan vad som kan vara relevant att utforska
 * och två frivilliga utgångar till d365.se. Inga kontaktuppgifter krävs för att läsa vidare.
 */
export default function SolutionNeedStart({ onContinue, onSkip }: Props) {
  const [selected, setSelected] = useState<BusinessNeedKey | null>(null);
  const [draft, setDraft] = useState<AssessmentDraft>({});
  const [dialog, setDialog] = useState<"assessment" | "advice" | null>(null);
  const viewed = useRef<string | null>(null);
  const need = businessNeedByKey(selected);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STARTED_KEY) === "1") return;
      sessionStorage.setItem(STARTED_KEY, "1");
    } catch { /* ignoreras */ }
    track("solution_journey_started");
  }, []);

  useEffect(() => {
    if (!need || viewed.current === need.key) return;
    viewed.current = need.key;
    track("solution_area_viewed", { need: need.key, areas: need.areas.map((a) => a.href).join(",") });
  }, [need]);

  const choose = (key: BusinessNeedKey) => {
    setSelected(key);
    const concrete = CONCRETE_NEEDS.some((n) => n.key === key);
    setDraft((d) => ({ ...d, areas: concrete ? [key] : d.areas ?? [] }));
    track("business_need_selected", { need: key });
    window.setTimeout(() => document.getElementById("losning-utforska")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const toggleArea = (k: BusinessNeedKey) =>
    setDraft((d) => ({ ...d, areas: (d.areas || []).includes(k) ? (d.areas || []).filter((x) => x !== k) : [...(d.areas || []), k] }));

  const group = (title: string, links: ExploreLink[]) => links.length > 0 && (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link to={l.href} onClick={() => track("solution_area_viewed", { need: need?.key, target: l.href, via: "link" })} className="text-sm font-medium text-primary hover:underline">
              {nowrapBrand(l.label)} <ArrowRight className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const lines = assessmentLines(draft);

  return (
    <section aria-labelledby="behov-start-h">
      <h1 id="behov-start-h" className="text-2xl sm:text-[28px] font-semibold text-foreground text-balance mb-1">
        Vilket verksamhetsbehov vill ni börja med?
      </h1>
      <p className="text-muted-foreground mb-4">
        {nowrapBrand("Ni behöver inte känna till Microsofts produkter. Välj det område som ligger närmast, så visar vi vad som kan vara relevant att utforska.")}
      </p>

      <div role="radiogroup" aria-labelledby="behov-start-h" className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {BUSINESS_NEEDS.map((n) => {
          const active = selected === n.key;
          return (
            <button
              key={n.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choose(n.key)}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}
            >
              <span className="flex items-start gap-3">
                <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                  {active && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="font-medium text-foreground">{n.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onSkip} className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
        Gå direkt till behovsguiden
      </button>

      {need && (
        <div id="losning-utforska" className="mt-8 scroll-mt-28 rounded-xl border border-border bg-card p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent mb-1">{need.label}</p>
          <h2 className="text-xl font-semibold text-foreground mb-2">Det här kan vara relevant att utforska</h2>
          <p className="text-sm text-muted-foreground mb-5">
            {nowrapBrand("Ett enskilt behov räcker inte för en säker rekommendation. Läs vidare själva, eller svara på några frågor i behovsguiden så får ni en mer underbyggd bild.")}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {group("Lösningsområden", need.areas)}
            {group("Guider", need.guides)}
            {group("Jämförelser", need.comparisons)}
            {group("Branschperspektiv", need.industries)}
          </div>
          <Link to={COST_LINK.href} onClick={() => track("solution_area_viewed", { need: need.key, target: COST_LINK.href, via: "cost" })} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Calculator className="h-4 w-4" aria-hidden="true" />{COST_LINK.label}
          </Link>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
            <Button onClick={() => onContinue(need)}>
              Fortsätt med behovsguiden <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-5">
            <h2 className="text-lg font-semibold text-foreground mb-1">Vill ni ha en första bedömning från d365.se?</h2>
            <p className="text-sm text-muted-foreground mb-4">Allt nedan är frivilligt. Uppgifterna följer med först när ni själva skickar dem.</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sa-change">Vad vill ni förändra eller förbättra?</Label>
                <Textarea id="sa-change" rows={2} maxLength={600} value={draft.change ?? ""} onChange={(e) => setDraft({ ...draft, change: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="sa-system">Nuvarande system</Label>
                  <Input id="sa-system" maxLength={120} placeholder="T.ex. Excel, Fortnox, Visma" value={draft.currentSystem ?? ""} onChange={(e) => setDraft({ ...draft, currentSystem: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="sa-size">Ungefärlig storlek</Label>
                  <select id="sa-size" className={selectCls} value={draft.size ?? ""} onChange={(e) => setDraft({ ...draft, size: e.target.value || undefined })}>
                    <option value="">Välj</option>
                    {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="sa-horizon">Tidshorisont</Label>
                  <select id="sa-horizon" className={selectCls} value={draft.horizon ?? ""} onChange={(e) => setDraft({ ...draft, horizon: e.target.value || undefined })}>
                    <option value="">Välj</option>
                    {TIME_HORIZONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <fieldset>
                <legend className="text-sm font-medium mb-2">Verksamhetsområden</legend>
                <div className="flex flex-wrap gap-2">
                  {CONCRETE_NEEDS.map((n) => {
                    const on = (draft.areas || []).includes(n.key);
                    return (
                      <button key={n.key} type="button" aria-pressed={on} onClick={() => toggleArea(n.key)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${on ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50"}`}>
                        {n.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setDialog("assessment")}>Få en första bedömning <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
                <Button variant="outline" onClick={() => setDialog("advice")}>Prata med d365.se <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
              </div>
              <p className="text-xs text-muted-foreground">Inget skickas till någon partner. En introduktion görs bara efter ert godkännande.</p>
            </div>
          </div>
        </div>
      )}

      {dialog === "assessment" && need && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setDialog(null)}
            topic={{
              title: "Få en första bedömning",
              description: "d365.se går igenom underlaget manuellt och återkommer med en första bedömning av vilka lösningsvägar som kan passa. Inget skickas till någon partner.",
              helpWith: `Första bedömning: ${need.label}`,
              startEvent: "solution_assessment_started",
              submitEvent: "solution_assessment_requested",
              messageLabel: "Något mer vi bör veta? (valfritt)",
              hideFocus: true,
              extras: lines.length ? [{ key: "losningsbehov", label: "Ert underlag", lines }] : [],
              metadata: { initial_intent: "BuyerProject", need: need.key, areas: (draft.areas || []).join(","), size: draft.size ?? null, horizon: draft.horizon ?? null },
              advisory: { placement: "solution_assessment", cta: "Få en första bedömning", pageType: "behovsguide" },
              doneTitle: "Tack, vi har tagit emot ert underlag",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom underlaget manuellt och hör av sig med en första bedömning.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}

      {dialog === "advice" && need && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setDialog(null)}
            topic={{
              title: "Prata med d365.se",
              description: "Berätta kort vad ni funderar på så hör d365.se av sig. Inget skickas till någon partner.",
              helpWith: `Rådgivning: ${need.label}`,
              startEvent: "solution_advice_started",
              submitEvent: "solution_advice_requested",
              messageLabel: "Vad vill ni prata om?",
              hideFocus: true,
              extras: [{ key: "losningsbehov", label: "Ert underlag", lines: [`Verksamhetsbehov: ${need.label}`, ...lines] }],
              metadata: { initial_intent: "BuyerProject", need: need.key },
              advisory: { placement: "solution_advice", cta: "Prata med d365.se", pageType: "behovsguide" },
              doneTitle: "Tack, vi hör av oss",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom er fråga manuellt och hör av sig.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
