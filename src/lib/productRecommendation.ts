// Regelbaserad produktrekommendation för behovsguiden (Kom igång).
// Utgår från köparens behov, storlek, bolagsstruktur och nuläge – aldrig från
// ett tidigt produktval. Manuellt underhållna regler, ingen AI vid körning.

export type NeedKey =
  | "finance"
  | "order"
  | "production"
  | "sales"
  | "service"
  | "field"
  | "projects"
  | "marketing"
  | "unsure";

export const NEED_OPTIONS: { value: NeedKey; label: string }[] = [
  { value: "finance", label: "Fakturering och redovisning" },
  { value: "order", label: "Order, lager, inköp" },
  { value: "production", label: "Tillverkning och produktionsplanering" },
  { value: "sales", label: "B2B-försäljning, pipeline och offerter" },
  { value: "service", label: "Kundservice, ärendehantering och support" },
  { value: "field", label: "Fältservice, tekniker ute på fältet och arbetsorder" },
  { value: "projects", label: "Projekt, tidrapportering och timdebitering" },
  { value: "marketing", label: "Marknadsföring och leadshantering" },
  { value: "unsure", label: "Osäker, vill ha vägledning" },
];

export type StructureKey = "single" | "group";
export const STRUCTURE_OPTIONS: { value: StructureKey; label: string; desc: string }[] = [
  { value: "single", label: "Ett enskilt bolag", desc: "En juridisk enhet, främst i Sverige" },
  { value: "group", label: "Koncern eller flera länder", desc: "Flera legala enheter, länder eller valutor" },
];

export type SituationKey = "first" | "replace" | "extend" | "unsure";
export const SITUATION_OPTIONS: { value: SituationKey; label: string }[] = [
  { value: "first", label: "Införa vårt första moderna affärssystem eller CRM" },
  { value: "replace", label: "Byta från ett äldre system (t.ex. äldre NAV/Axapta, Visma, Monitor, Fortnox)" },
  { value: "extend", label: "Vidareutveckla eller komplettera en befintlig lösning" },
  { value: "unsure", label: "Osäker, behöver rådgivning och underlag" },
];

export interface ProductRecommendation {
  app: string; // värde som matchar productOptions i KomIgang
  label: string;
  reason: string;
}

export interface RecommendationResult {
  primary: ProductRecommendation;
  complements: ProductRecommendation[];
  note?: string;
}

const SIZE_INDEX: Record<string, number> = {
  "1-49": 0, "50-99": 1, "100-249": 2, "250-999": 3, "1.000-4.999": 4, ">5.000": 5,
};

export function recommendProducts(input: {
  needs: string[];
  size: string | null;
  structure: StructureKey | null;
  situation: SituationKey | null;
}): RecommendationResult {
  const needs = new Set(input.needs);
  const sizeIdx = input.size ? SIZE_INDEX[input.size] ?? 0 : 0;
  const group = input.structure === "group";
  const large = sizeIdx >= 3 || (group && sizeIdx >= 2);

  const crmNeeds = ["sales", "service", "field", "marketing"].filter((n) => needs.has(n));
  const erpNeed =
    needs.has("finance") || needs.has("order") || needs.has("production") ||
    needs.has("unsure") || (needs.has("projects") && !large) ||
    (crmNeeds.length === 0 && !needs.has("projects"));

  const recs: ProductRecommendation[] = [];

  if (erpNeed) {
    if (large) {
      recs.push({
        app: "Finance & SCM",
        label: "Finance & Supply Chain Management",
        reason: group
          ? "Flera bolag, länder eller valutor i kombination med er storlek talar för Finance & Supply Chain Management framför Business Central."
          : "Er storlek och de processer ni vill förbättra talar för Finance & Supply Chain Management, som är byggt för större volymer och organisationer.",
      });
    } else {
      const prod = needs.has("production");
      recs.push({
        app: "Business Central",
        label: "Business Central",
        reason: prod
          ? "Business Central Premium täcker tillverkning, ekonomi, order och lager för bolag i er storlek utan onödig systemkostnad."
          : "Business Central täcker fakturering, redovisning, order och lager för bolag i er storlek och är snabbare och billigare att införa.",
      });
    }
  }

  if (needs.has("projects") && large) {
    recs.push({
      app: "Project Operations",
      label: "Project Operations",
      reason: "För större projekt- och konsultverksamheter med resursplanering och timdebitering är Project Operations byggt för ändamålet.",
    });
  }
  if (needs.has("sales")) {
    recs.push({ app: "Sales", label: "Sales", reason: "Ger säljteamet pipeline, prognoser och offerter i samma miljö som Outlook och Teams." });
  }
  if (needs.has("service")) {
    recs.push({ app: "Customer Service", label: "Customer Service", reason: "Samlar ärenden från e-post, chatt och telefon med SLA och kunskapsbas." });
  }
  if (needs.has("field")) {
    recs.push({ app: "Field Service", label: "Field Service", reason: "Planerar tekniker, arbetsorder och reservdelar och kopplar dem till service och fakturering." });
  }
  if (needs.has("marketing")) {
    recs.push({ app: "Customer Insights (Marketing)", label: "Customer Insights", reason: "Automatiserar kampanjer och kundresor och lämnar kvalificerade leads till sälj." });
  }

  const [primary, ...complements] = recs;
  let note: string | undefined;
  if (input.situation === "extend") note = "Har ni redan Dynamics 365? Då kan en kompletterande app eller utökning vara rätt väg i stället för ett helt nytt system.";
  else if (needs.has("unsure")) note = "Förslaget är en utgångspunkt utifrån storlek och bransch. En detaljerad behovsanalys ger ett säkrare svar.";

  return { primary, complements, note };
}
