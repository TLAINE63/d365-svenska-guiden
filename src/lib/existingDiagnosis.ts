/**
 * Diagnos för befintliga Dynamics 365-kunder: kort, adaptiv och deterministisk.
 * Resultatet är en behovskategori med förklaring och nästa steg, aldrig en poäng
 * och aldrig ett automatiskt kontaktformulär.
 */
export type DxNeed =
  | "optimize"
  | "support"
  | "second_opinion"
  | "switch_partner"
  | "extend"
  | "ai"
  | "specialist"
  | "partner_review";

export type DxSymptom =
  | "slow_or_manual" // systemet används inte fullt ut, manuella moment
  | "support_issues" // ärenden tar tid, uppdateringar strular
  | "unsure_cause" // vet inte om det är system, implementation eller partner
  | "partner_issue" // missnöje med nuvarande partner
  | "new_need" // ny funktion eller ny del av verksamheten
  | "ai_automation" // Copilot, AI, automatisering
  | "niche"; // bransch, integration, migrering

/** Följdfråga ställs bara där den avgör vilket nästa steg som passar. */
export type DxFollowUp =
  | { id: "partnerTalked"; question: string; options: { value: string; label: string }[] }
  | { id: "newArea"; question: string; options: { value: string; label: string }[] };

export const SYMPTOMS: { value: DxSymptom; label: string }[] = [
  { value: "slow_or_manual", label: "Lösningen används inte fullt ut, mycket görs fortfarande manuellt" },
  { value: "support_issues", label: "Support, ärenden eller uppdateringar fungerar inte bra" },
  { value: "unsure_cause", label: "Något fungerar inte, men vi vet inte varför" },
  { value: "partner_issue", label: "Vi är inte nöjda med vår nuvarande partner" },
  { value: "new_need", label: "Vi behöver ny funktionalitet eller stöd för fler delar av verksamheten" },
  { value: "ai_automation", label: "Vi vill komma igång med Copilot, AI eller automatisering" },
  { value: "niche", label: "Vi behöver specialistkompetens (bransch, integration, migrering)" },
];

export function followUpFor(s?: DxSymptom): DxFollowUp | null {
  if (s === "partner_issue")
    return {
      id: "partnerTalked",
      question: "Har ni tagit upp problemen med partnern på ledningsnivå?",
      options: [
        { value: "yes", label: "Ja, utan förbättring" },
        { value: "no", label: "Nej, inte ännu" },
      ],
    };
  if (s === "new_need")
    return {
      id: "newArea",
      question: "Vilket område gäller det nya behovet?",
      options: [
        { value: "erp", label: "Ekonomi, lager, inköp eller produktion (ERP)" },
        { value: "crm", label: "Sälj, marknad eller kundservice (CRM)" },
        { value: "unknown", label: "Vet inte ännu" },
      ],
    };
  return null;
}

export interface DxAnswers {
  symptom?: DxSymptom;
  partnerTalked?: "yes" | "no";
  newArea?: "erp" | "crm" | "unknown";
  /** Produkt som sajten redan känner till (buyerContext); används bara om den är känd. */
  knownProduct?: string | null;
}

export interface DxStep { label: string; href: string; kind: "content" | "second_opinion" | "partner" }
export interface DxResult { need: DxNeed; title: string; why: string; steps: DxStep[] }

/** Appnamn som partnerkatalogen kan förvälja via ?apps=. Okända namn skickas aldrig. */
const KNOWN_APPS = new Set([
  "Business Central", "Finance", "Supply Chain Management", "Sales", "Customer Service",
  "Field Service", "Contact Center", "Customer Insights", "Project Operations", "Human Resources", "Commerce",
]);
const APP_ALIAS: Record<string, string> = {
  "Finance & SCM": "Finance", "Finance & Supply Chain": "Finance",
  "Finance & Supply Chain Management (F&O)": "Finance", "Customer Insights (Marketing)": "Customer Insights",
};

export function partnerHref(product?: string | null): string {
  const app = product ? APP_ALIAS[product] ?? product : null;
  const q = app && KNOWN_APPS.has(app) ? `?apps=${encodeURIComponent(app)}&source=befintlig-kund` : "?source=befintlig-kund";
  return `/valjdynamics365partner/${q}`;
}

const SO_LABELS: Partial<Record<DxNeed, string>> = {
  optimize: "Lösningen används inte fullt ut",
  second_opinion: "Oklart vad som orsakar problemen",
  partner_review: "Missnöje med partnern, inte taget upp ännu",
};
type SoNeed = "optimize" | "second_opinion" | "partner_review";
const so = (need: SoNeed): DxStep => ({ label: "Be om en second opinion", href: `/second-opinion/?kalla=diagnos&behov=${need}`, kind: "second_opinion" });

/** Läser behovet som diagnosen skickade med; okända värden ignoreras (ingen gissning). */
export function secondOpinionContext(need: string | null): { need: string; label: string } | null {
  const label = need ? SO_LABELS[need as DxNeed] : undefined;
  return need && label ? { need, label } : null;
}

export function diagnose(a: DxAnswers): DxResult | null {
  const partner = (label = "Hitta partner med rätt kompetens"): DxStep => ({ label, href: partnerHref(a.knownProduct), kind: "partner" });
  switch (a.symptom) {
    case "slow_or_manual":
      return { need: "optimize", title: "Optimera den befintliga lösningen", why: "Problemet verkar ligga i hur lösningen används och är uppsatt, inte i att ni behöver ett nytt system.", steps: [
        { label: "Läs om förvaltning och vidareutveckling", href: "/kompetens/", kind: "content" }, so("optimize"), partner() ] };
    case "support_issues":
      return { need: "support", title: "Support och löpande förvaltning", why: "Det handlar om supportnivå, uppdateringar och ansvar efter driftstart.", steps: [
        { label: "Se vad som ingår i förvaltning", href: "/kompetens/", kind: "content" }, partner("Hitta partner för förvaltning") ] };
    case "unsure_cause":
      return { need: "second_opinion", title: "Second opinion", why: "När orsaken är oklar är en extern bedömning av lösning, implementation och förvaltning ofta rätt första steg, innan ni byter något.", steps: [
        so("second_opinion"), { label: "Läs partnerbytesguiden (utvärdera först)", href: "/guider/byta-dynamics-partner/", kind: "content" } ] };
    case "partner_issue":
      if (a.partnerTalked === "no")
        return { need: "second_opinion", title: "Utvärdera samarbetet först", why: "Ni har inte tagit upp problemen med partnern ännu. Det kan ibland lösas utan byte; en second opinion ger underlag för samtalet.", steps: [
          { label: "Till partnerbytesguiden", href: "/guider/byta-dynamics-partner/", kind: "content" }, so("partner_review") ] };
      if (a.partnerTalked !== "yes") return null;
      return { need: "switch_partner", title: "Byta Dynamics\u00A0365-partner", why: "Problemen kvarstår trots dialog. Lösningen och era data finns kvar, det som byts är vem som förvaltar den.", steps: [
        { label: "Gör partnerbytesanalysen", href: "/guider/byta-dynamics-partner/", kind: "content" }, partner("Hitta ny partner") ] };
    case "new_need": {
      if (!a.newArea) return null;
      const href = a.newArea === "erp" ? "/affarssystem/" : a.newArea === "crm" ? "/crm/" : "/kom-igang/";
      const label = a.newArea === "unknown" ? "Ta reda på vilken applikation som passar" : a.newArea === "erp" ? "Utforska ERP i Dynamics\u00A0365" : "Utforska CRM i Dynamics\u00A0365";
      return { need: "extend", title: "Utöka med fler applikationer", why: "Nya behov kan ofta byggas på den data ni redan har i Dynamics\u00A0365.", steps: [
        { label, href, kind: "content" }, { label: "Se tilläggslösningar", href: "/kunskapscenter/dynamics-365-tillagg/", kind: "content" } ] };
    }
    case "ai_automation":
      return { need: "ai", title: "Power Platform, Copilot och AI", why: "Börja med en konkret arbetsuppgift där tid eller kvalitet går att mäta.", steps: [
        { label: "AI och Copilot i Dynamics\u00A0365", href: "/aioversikt/", kind: "content" }, { label: "Se verifierade AI-exempel", href: "/ai/exempel/", kind: "content" } ] };
    case "niche":
      return { need: "specialist", title: "Annat specialistbehov", why: "Ett avgränsat behov kan lösas med en specialist som samarbetar med er nuvarande partner.", steps: [
        partner("Hitta specialist per produkt och bransch"), { label: "Se kompetensområden", href: "/kompetens/", kind: "content" } ] };
    default:
      return null;
  }
}
