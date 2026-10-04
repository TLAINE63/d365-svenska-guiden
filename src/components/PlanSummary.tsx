import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuyerContext, sizeLabel, updateBuyerContext } from "@/lib/buyerContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuyerProfile } from "@/lib/buyerProfile";
import { clearD365Plan, planNextStep, updatePlan, usePlanMeta } from "@/lib/d365Plan";
import { UNDERLAG_QUESTIONS, answerLabel } from "@/data/underlagQuestions";
import { useShortlist } from "@/contexts/ShortlistContext";
import { nowrapBrand } from "@/lib/nowrapBrand";

export default function PlanSummary({ onEdit }: { onEdit: () => void }) {
  const buyer = useBuyerContext();
  const profile = useBuyerProfile();
  const meta = usePlanMeta();
  const { items } = useShortlist();
  const next = planNextStep(profile, buyer, meta, items.length);
  const areas = { erp: "ERP / affärssystem", crm: "CRM / kundarbete", migration: "Migration", partner: "Partnerjämförelse" };
  const scopeQuestion = UNDERLAG_QUESTIONS.find((q) => q.id === "apps");
  const scope = Array.isArray(profile.scope.apps) && scopeQuestion ? answerLabel(scopeQuestion, profile.scope.apps) : "Inte valt ännu";
  const needs = UNDERLAG_QUESTIONS.filter((q) => ["fscm", "crm", "contact_center", "integrations", "project"].includes(q.section) && profile[q.section]?.[q.key] !== undefined)
    .map((q) => `${q.text} ${answerLabel(q, profile[q.section][q.key])}`);
  const priorities = Object.entries(meta.dimensions);
  return (
    <section aria-labelledby="plan-summary-title" className="mb-8 border-y border-border py-6">
      <h2 id="plan-summary-title" className="mb-3 text-xl font-semibold text-foreground">Er plan just nu</h2>
      <p className="mb-4 text-sm text-muted-foreground">Era val sparas i den här webbläsaren mellan besök. Inga kontaktuppgifter behövs och inget skickas till partners utan ert godkännande.</p>
      <div className="mb-4 flex flex-wrap gap-2" aria-label="Område att utreda">
        {(["erp", "crm", "migration"] as const).map((area) => <Button key={area} size="sm" variant={meta.area === area ? "default" : "outline"} aria-pressed={meta.area === area} onClick={() => updatePlan({ area })}>{areas[area]}</Button>)}
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {[
          ["Område som utreds", meta.area ? areas[meta.area] : scope],
          ["Bransch", buyer.industry || "Inte angiven ännu"],
          ["Företagsstorlek", sizeLabel(buyer.size) || "Inte angiven ännu"],
        ].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium text-foreground">{nowrapBrand(value)}</dd></div>)}
        <div><dt className="mb-1 text-muted-foreground">Vald produkt</dt><dd>
          <Select value={buyer.product || "unset"} onValueChange={(product) => updateBuyerContext({ product: product === "unset" ? null : product })}>
            <SelectTrigger aria-label="Vald produkt" className="h-auto min-h-10 text-left [&>span]:whitespace-normal"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unset">Inte vald ännu</SelectItem>
              {["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Field Service", "Contact Center", "Project Operations", "Commerce", "Human Resources"].map((product) => <SelectItem key={product} value={product}>{product === "Finance & SCM" ? "Finance & Supply Chain Management (F&O)" : product}</SelectItem>)}
            </SelectContent>
          </Select>
        </dd></div>
      </dl>
      <ul aria-label="Planens status" className="mt-5 grid gap-1.5 text-sm sm:grid-cols-2">
        {([
          [Boolean(meta.area), meta.area ? areas[meta.area] : "Område ej valt"],
          [Boolean(buyer.industry), buyer.industry || "Bransch ej angiven"],
          [Boolean(buyer.size), sizeLabel(buyer.size) || "Storlek ej angiven"],
          [needs.length + meta.needs.length + priorities.length > 0, "Viktiga behov angivna"],
          [Boolean(buyer.product), buyer.product ? `Lösning: ${buyer.product}` : "Lösning ej vald"],
          [items.length > 0, items.length ? `${items.length} partner sparade` : "Partner ej vald"],
        ] as [boolean, string][]).map(([done, label]) => <li key={label} className={done ? "text-foreground" : "text-muted-foreground"}><span aria-hidden="true" className={done ? "text-accent" : ""}>{done ? "✓" : "□"}</span> {nowrapBrand(label)}<span className="sr-only">{done ? " (klart)" : " (återstår)"}</span></li>)}
      </ul>
      <p className="mt-3 text-sm"><span className="font-semibold">Rekommenderat nästa steg:</span> {next.label}</p>
      <h3 className="mt-5 font-semibold">Behov och prioriteringar</h3>
      {needs.length || meta.needs.length || priorities.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
        {Array.from(new Set([...meta.needs, ...needs])).map((need) => <li key={need}>{nowrapBrand(need)}</li>)}
        {priorities.map(([key, value]) => <li key={key}>{key.slice(key.indexOf(":") + 1)}: {value === "important" ? "Prioriterat behov" : "Behöver utredas"}</li>)}
      </ul> : <p className="mt-2 text-sm text-muted-foreground">Inga behov har angetts ännu.</p>}
      <div className="mt-5 flex flex-wrap gap-3 print:hidden">
        {next.to.startsWith("#") ? <Button onClick={onEdit}>{next.label}<ArrowRight className="h-4 w-4" /></Button> : <Button asChild className="h-auto min-h-10 whitespace-normal"><Link to={next.to}>{next.label}<ArrowRight className="h-4 w-4 shrink-0" /></Link></Button>}
        <Button variant="outline" onClick={onEdit}>Ändra eller komplettera svar</Button>
        <Button variant="ghost" onClick={() => { if (window.confirm("Rensa planens svar och prioriteringar? Era sparade partners finns kvar.")) clearD365Plan(); }}><RotateCcw className="h-4 w-4" />Rensa planen</Button>
      </div>
    </section>
  );
}