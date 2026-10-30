import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/** Stabil, icke-personlig nyckel för en rekommendation (sökväg utan parametrar). */
const nbaKey = (to: string) => to.split("?")[0].replace(/[^a-z0-9#/-]/gi, "").slice(0, 60) || "okand";
import PlanContactDialog, { type PlanContactMode } from "@/components/plan/PlanContactDialog";
import { ArrowRight, CheckCircle2, Circle, Compass, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuyerContext, sizeLabel, updateBuyerContext } from "@/lib/buyerContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuyerProfile } from "@/lib/buyerProfile";
import { clearD365Plan, removePlanCalculation, PLAN_CONTACT_LABEL, planNextStep, planPartnerListUrl, planProductLabel, updatePlan, usePlanMeta } from "@/lib/d365Plan";
import { UNDERLAG_QUESTIONS, answerLabel } from "@/data/underlagQuestions";
import { useShortlist } from "@/contexts/ShortlistContext";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { productNextSteps } from "@/data/productNextSteps";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

export default function PlanSummary({ onEdit }: { onEdit: () => void }) {
  const buyer = useBuyerContext();
  const profile = useBuyerProfile();
  const meta = usePlanMeta();
  const { items, remove } = useShortlist();
  const next = planNextStep(profile, buyer, meta, items.length);
  const areas = { erp: "ERP / affärssystem", crm: "CRM / kundarbete", migration: "Migration", partner: "Partnerjämförelse" };
  const scopeQuestion = UNDERLAG_QUESTIONS.find((q) => q.id === "apps");
  const scope = Array.isArray(profile.scope.apps) && scopeQuestion ? answerLabel(scopeQuestion, profile.scope.apps) : "Inte valt ännu";
  const needs = UNDERLAG_QUESTIONS.filter((q) => ["fscm", "crm", "contact_center", "integrations", "project"].includes(q.section) && profile[q.section]?.[q.key] !== undefined)
    .map((q) => `${q.text} ${answerLabel(q, profile[q.section][q.key])}`);
  const priorities = Object.entries(meta.dimensions);
  const [contact, setContact] = useState<PlanContactMode | null>(null);
  // Mätning: planvisning en gång per session, rekommendation en gång per unik rekommendation och session.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("plan_viewed_sent")) { sessionStorage.setItem("plan_viewed_sent", "1"); trackFunnelEvent({ event_type: "engagement", event_name: "plan_viewed", metadata: { shortlist: items.length } }); }
      const k = `nba_seen_${nbaKey(next.to)}`;
      if (!sessionStorage.getItem(k)) { sessionStorage.setItem(k, "1"); trackFunnelEvent({ event_type: "engagement", event_name: "next_best_action_viewed", metadata: { action_key: nbaKey(next.to), action_label: next.label, target: next.to } }); }
    } catch { /* ignore */ }
  }, [next.to]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section aria-labelledby="plan-summary-title" className="plan-card">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="plan-eyebrow mb-2">Översikt</p>
          <h2 id="plan-summary-title" className="text-2xl font-semibold text-foreground sm:text-3xl">Er plan just nu</h2>
        </div>
      <div className="flex flex-wrap gap-2" aria-label="Område att utreda">
        {(["erp", "crm", "migration"] as const).map((area) => <Button key={area} size="sm" variant={meta.area === area ? "default" : "outline"} aria-pressed={meta.area === area} onClick={() => updatePlan({ area })}>{areas[area]}</Button>)}
      </div>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {/* Alla fyra delarna går att ändra direkt; valen sparas bara lokalt i webbläsaren. */}
        <div className="rounded-xl bg-muted/70 p-4"><dt className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Område som utreds</dt><dd>
          <Select value={meta.area || "unset"} onValueChange={(v) => updatePlan({ area: v === "unset" ? undefined : (v as keyof typeof areas) })}>
            <SelectTrigger aria-label="Område som utreds" className="h-auto min-h-10 bg-card text-left [&>span]:whitespace-normal"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unset">{meta.area ? "Inte valt" : nowrapBrand(scope)}</SelectItem>
              {(Object.keys(areas) as (keyof typeof areas)[]).map((a) => <SelectItem key={a} value={a}>{areas[a]}</SelectItem>)}
            </SelectContent>
          </Select>
        </dd></div>
        <div className="rounded-xl bg-muted/70 p-4"><dt className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Bransch</dt><dd>
          <Select value={buyer.industry || "unset"} onValueChange={(v) => updateBuyerContext({ industry: v === "unset" ? null : v })}>
            <SelectTrigger aria-label="Bransch" className="h-auto min-h-10 bg-card text-left [&>span]:whitespace-normal"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unset">Inte angiven ännu</SelectItem>
              {buyer.industry && !STANDARD_INDUSTRIES.some((i) => i.name === buyer.industry) && <SelectItem value={buyer.industry}>{buyer.industry}</SelectItem>}
              {STANDARD_INDUSTRIES.map((i) => <SelectItem key={i.slug} value={i.name}>{i.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </dd></div>
        <div className="rounded-xl bg-muted/70 p-4"><dt className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Företagsstorlek</dt><dd>
          <Select value={buyer.size || "unset"} onValueChange={(v) => updateBuyerContext({ size: v === "unset" ? null : v })}>
            <SelectTrigger aria-label="Företagsstorlek" className="h-auto min-h-10 bg-card text-left [&>span]:whitespace-normal"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unset">Inte angiven ännu</SelectItem>
              {["1-49", "50-99", "100-249", "250-999", "1.000-4.999", ">5.000"].map((s) => <SelectItem key={s} value={s}>{sizeLabel(s)}</SelectItem>)}
            </SelectContent>
          </Select>
        </dd></div>
        <div className="rounded-xl bg-muted/70 p-4"><dt className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Vald produkt</dt><dd>
          <Select value={buyer.product || "unset"} onValueChange={(product) => updateBuyerContext({ product: product === "unset" ? null : product })}>
            <SelectTrigger aria-label="Vald produkt" className="h-auto min-h-10 bg-card text-left [&>span]:whitespace-normal"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unset">Inte vald ännu</SelectItem>
              {["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Field Service", "Contact Center", "Project Operations", "Commerce", "Human Resources"].map((product) => <SelectItem key={product} value={product}>{product === "Finance & SCM" ? "Finance & Supply Chain Management (F&O)" : product}</SelectItem>)}
            </SelectContent>
          </Select>
        </dd></div>
      </dl>
      <ul aria-label="Planens status" className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {([
          [Boolean(meta.area), meta.area ? areas[meta.area] : "Område ej valt"],
          [Boolean(buyer.industry), buyer.industry || "Bransch ej angiven"],
          [Boolean(buyer.size), sizeLabel(buyer.size) || "Storlek ej angiven"],
          [needs.length + meta.needs.length + priorities.length > 0, "Viktiga behov angivna"],
          [Boolean(buyer.product), buyer.product ? `Lösning: ${buyer.product}` : "Lösning ej vald"],
          [items.length > 0, items.length ? `${items.length} partner sparade` : "Partner ej vald"],
        ] as [boolean, string][]).map(([done, label]) => <li key={label} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${done ? "border-accent/40 bg-accent/5 text-foreground" : "border-border text-muted-foreground"}`}>{done ? <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" /> : <Circle aria-hidden="true" className="h-4 w-4 shrink-0 opacity-50" />}<span className="min-w-0">{nowrapBrand(label)}</span><span className="sr-only">{done ? " (klart)" : " (återstår)"}</span></li>)}
      </ul>
      <p className="mt-5 flex items-start gap-3 rounded-xl border-l-4 border-primary bg-primary/5 p-4 text-sm"><Compass aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><span className="font-semibold">Rekommenderat nästa steg:</span> {next.label}</span></p>
      {meta.solution && (() => { const sol = meta.solution; return <div className="mt-8 border-t border-border pt-6">
        <h3 className="text-lg font-semibold">Lösningsbild från behovsguiden <span className="text-xs font-normal text-muted-foreground">sparad {sol.savedAt}</span></h3>
        <p className="mt-1 text-sm text-muted-foreground">{sol.existingCustomer ? "Ni är redan Dynamics-kund och undersöker vidareutveckling." : sol.knownProduct ? `Ni har valt ${sol.knownProduct} och undersöker hur lösningen bör kompletteras.` : `Ni utforskar ${sol.areaLabel}.`}</p>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          {sol.knownProduct && <div><dt className="text-muted-foreground">Vald produkt (ert val)</dt><dd className="font-medium">{nowrapBrand(`Dynamics 365 ${sol.knownProduct}`)}</dd></div>}
          {sol.primary && !sol.knownProduct && <div><dt className="text-muted-foreground">Huvudspår (förslag)</dt><dd className="font-medium">{nowrapBrand(`Dynamics 365 ${sol.primary.label}`)}</dd><dd className="text-muted-foreground">{sol.primary.reason}</dd></div>}
          {sol.complements.length > 0 && <div><dt className="text-muted-foreground">Kompletteringar att undersöka</dt>{sol.complements.map((c) => <dd key={c.label} className="font-medium">{nowrapBrand(c.label)}</dd>)}</div>}
          {sol.isvNote && <div><dt className="text-muted-foreground">Möjligt tilläggsbehov (ISV)</dt><dd>{sol.isvNote.text} <Link to={sol.isvNote.path} className="text-primary hover:underline">Se tillägg</Link></dd></div>}
        </dl>
        {sol.insufficient && !sol.primary && <p className="mt-2 text-sm text-muted-foreground">Underlaget räckte inte för ett produktförslag. En fördjupad behovsanalys ger ett säkrare svar.</p>}
        {sol.aiSummary && <><h4 className="mt-4 text-sm font-semibold">AI, Copilot och agenter</h4><p className="text-sm">{nowrapBrand(sol.aiSummary)}</p></>}
        {sol.implementationNote && <><h4 className="mt-4 text-sm font-semibold">Införande och arbetssätt</h4><p className="text-sm">{nowrapBrand(sol.implementationNote)}</p></>}
        {sol.openQuestions.length > 0 && <><h4 className="mt-4 text-sm font-semibold">Att undersöka vidare</h4><ul className="list-disc pl-5 text-sm">{sol.openQuestions.map((q) => <li key={q}>{nowrapBrand(q)}</li>)}</ul></>}
        {sol.nextSteps.length > 1 && <><h4 className="mt-4 text-sm font-semibold">Andra möjliga vägar</h4><ul className="text-sm">{sol.nextSteps.slice(1, 4).map((n) => <li key={n.path}><Link to={n.path} className="text-primary hover:underline">{nowrapBrand(n.label)} →</Link></li>)}</ul></>}
        <p className="mt-3 text-sm print:hidden"><Link to="/kom-igang/?source=min-d365-plan" className="text-primary hover:underline">Gör om behovsguiden</Link></p>
      </div>; })()}
      {(meta.completedSteps || []).length > 0 && <p className="mt-4 text-sm"><span className="font-semibold">Genomfört:</span> {(meta.completedSteps || []).map((c) => c === "behovsguide" ? "✓ Behovsguiden" : `✓ ${c}`).join(", ")}</p>}
      <h3 className="mt-8 border-t border-border pt-6 text-lg font-semibold">Behov och prioriteringar</h3>
      {needs.length || meta.needs.length || priorities.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
        {Array.from(new Set([...meta.needs, ...needs])).map((need) => <li key={need}>{nowrapBrand(need)}</li>)}
        {priorities.map(([key, value]) => <li key={key}>{key.slice(key.indexOf(":") + 1)}: {value === "important" ? "Prioriterat behov" : "Behöver utredas"}</li>)}
      </ul> : <p className="mt-2 text-sm text-muted-foreground">Inga behov har angetts ännu.</p>}
      {(() => {
        const map: Record<string, string> = { "Business Central": "Business Central", "Finance & SCM": "Finance & Supply Chain", Sales: "Sales", "Customer Service": "Customer Service", "Field Service": "Field Service", "Customer Insights (Marketing)": "Customer Insights", "Contact Center": "Contact Center" };
        const cfg = buyer.product ? Object.values(productNextSteps).find((c) => c.label === map[buyer.product as string]) : undefined;
        const general = [
          "Vilket affärsproblem ska lösningen lösa, och hur mäter vi att det fungerar?",
          "Vad kostar helheten över tre år: licenser, införande och förvaltning?",
          "Vem i organisationen äger beslutet, och vilka roller behöver vara med?",
        ];
        return <>
          <h3 id="plan-fragor" className="mt-8 scroll-mt-32 border-t border-border pt-6 text-lg font-semibold">Frågor att ta med till styrgrupp och partners</h3>
          <p className="mt-1 text-sm text-muted-foreground">Använd frågorna som checklista inför interna möten och partnersamtal.</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-foreground marker:font-semibold marker:text-primary">
            {[...general, ...(cfg ? cfg.questions : [])].map((q) => <li key={q}>{nowrapBrand(q)}</li>)}
          </ol>
          {!cfg && <p className="mt-2 text-xs text-muted-foreground print:hidden">Välj en produkt ovan för att få produktspecifika frågor.</p>}
          {(meta.calculations || []).length > 0 && <>
            <h3 className="mt-8 border-t border-border pt-6 text-lg font-semibold">Sparade kalkyler</h3>
            <p className="mt-1 text-sm text-muted-foreground">Indikativa siffror från kalkylatorerna, exkl. moms.</p>
            {(meta.calculations || []).map((c) => <div key={c.id} className="mt-3 break-inside-avoid rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-foreground">{nowrapBrand(c.product)} <span className="text-xs font-normal text-muted-foreground">uppdaterad {c.savedAt}</span></p>
                <span className="flex gap-3 text-xs print:hidden">
                  {c.url && <Link to={c.url} className="text-primary hover:underline">Ändra i kalkylatorn</Link>}
                  <button type="button" className="text-muted-foreground hover:underline" onClick={() => removePlanCalculation(c.id)}>Ta bort</button>
                </span>
              </div>
              <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {c.rows.map((r, i) => <div key={i} className="flex justify-between gap-3 border-b border-border/50 py-0.5"><dt className="text-muted-foreground">{r.label}</dt><dd className="text-right font-medium text-foreground">{r.value}</dd></div>)}
              </dl>
            </div>)}
          </>}
          <h3 className="mt-8 border-t border-border pt-6 text-lg font-semibold">Mina partneralternativ</h3>
          <p className="mt-1 text-sm text-muted-foreground">Partners ni vill undersöka vidare (högst tre). Att spara en partner kontaktar ingen och delar inga uppgifter.</p>
          {items.length === 0 ? <p className="mt-2 text-sm print:hidden">Inga partners sparade ännu. <Link to={planPartnerListUrl(buyer, meta)} className="text-primary hover:underline">Hitta relevanta partners →</Link></p> : <>
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
              {items.map((p) => <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
                <div className="min-w-0"><p className="font-medium text-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{p.verified ? "Verifierad partner" : "Grundprofil"}</p></div>
                <span className="flex gap-3 text-xs print:hidden">
                  <Link to={p.url} className="text-primary hover:underline" onClick={() => trackFunnelEvent({ event_type: "cta_click", event_name: "partner_profile_opened_from_plan", metadata: { partner: p.slug } })}>Visa partner</Link>
                  <button type="button" className="text-muted-foreground hover:underline" onClick={() => remove(p.slug)}>Ta bort</button>
                </span>
              </li>)}
            </ul>
            <div className="mt-3 flex flex-wrap gap-3 text-sm print:hidden">
              {items.length >= 2 && <Link to={`/jamfor-partners/?${new URLSearchParams(Object.fromEntries(items.slice(0, 3).map((c, i) => [["a", "b", "c"][i], c.slug])))}`} onClick={() => trackFunnelEvent({ event_type: "cta_click", event_name: "partner_comparison_started", metadata: { source: "min-d365-plan", count: Math.min(items.length, 3) } })} className="font-medium text-primary hover:underline">Jämför mina partners →</Link>}
              {items.length < 3 && <Link to={planPartnerListUrl(buyer, meta)} className="text-primary hover:underline">Lägg till fler alternativ →</Link>}
              <Link to="/kortlista/" className="text-muted-foreground hover:underline">Öppna kortlistan</Link>
            </div>
          </>}
        </>;
      })()}
      <section aria-labelledby="plan-contact-title" className="mt-8 rounded-xl bg-muted/70 p-5 sm:p-6">
        <h3 id="plan-contact-title" className="text-lg font-semibold">Ta nästa steg när ni är redo</h3>
        <p className="mt-1 text-sm text-muted-foreground">Ni bestämmer själva vilka som får ert underlag. Inget skickas till någon partner utan ert godkännande, och planen behöver inte vara komplett.</p>
        {(meta.contacts || []).length > 0 && <ul aria-label="Kontaktstatus" className="mt-3 space-y-1 text-sm">
          {(meta.contacts || []).map((c, i) => <li key={i}><span className="text-accent" aria-hidden="true">✓</span> {PLAN_CONTACT_LABEL[c.type]}{c.partners.length ? `: ${c.partners.join(", ")}` : ""} <span className="text-xs text-muted-foreground">{c.date}</span></li>)}
          <li className="text-xs text-muted-foreground">Skickad betyder inte att dialogen är bekräftad. Partnern eller d365.se hör av sig till er.</li>
        </ul>}
        <div className="mt-3 flex flex-wrap gap-3 print:hidden">
          <Button variant="outline" onClick={() => setContact("advisory")}>Få hjälp med nästa steg</Button>
          <Button variant="outline" onClick={() => setContact("partners")} disabled={!items.length} title={items.length ? undefined : "Spara minst en partner i kortlistan först"}>Kontakta mina valda partners</Button>
        </div>
        {!items.length && <p className="mt-2 text-xs text-muted-foreground print:hidden">Spara minst en partner i kortlistan för att kunna kontakta partners.</p>}
      </section>
      {contact && <PlanContactDialog mode={contact} onClose={() => setContact(null)} />}
      <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6 print:hidden" onClickCapture={(e) => { if ((e.target as HTMLElement).closest("[data-nba]")) trackFunnelEvent({ event_type: "cta_click", event_name: "next_best_action_clicked", metadata: { action_key: nbaKey(next.to), action_label: next.label, target: next.to } }); }}>
        {next.to === "#plan-fragor" ? <Button data-nba onClick={() => document.getElementById("plan-fragor")?.scrollIntoView({ behavior: "smooth" })}>{next.label}<ArrowRight className="h-4 w-4" /></Button> : next.to.startsWith("#") ? <Button data-nba onClick={onEdit}>{next.label}<ArrowRight className="h-4 w-4" /></Button> : <Button asChild className="h-auto min-h-10 whitespace-normal"><Link data-nba to={next.to}>{next.label}<ArrowRight className="h-4 w-4 shrink-0" /></Link></Button>}
        <Button variant="outline" onClick={onEdit}>Ändra eller komplettera svar</Button>
        <Button variant="ghost" onClick={() => { if (window.confirm("Rensa planens svar och prioriteringar? Era sparade partners finns kvar.")) clearD365Plan(); }}><RotateCcw className="h-4 w-4" />Rensa planen</Button>
      </div>
    </section>
  );
}