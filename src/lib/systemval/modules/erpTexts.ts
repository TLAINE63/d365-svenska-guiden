// Konfigurerade textblock för ERP-resultatet. Regelstyrt och reproducerbart (ingen fri AI).
import type { ErpResult } from "./erp";

const PROCESS: Record<string, string> = {
  finance: "ekonomi och redovisning", purchasing: "inköp", sales_orders: "order och fakturering",
  warehouse: "lager", logistics: "logistik och distribution", production: "produktion",
  projects: "projekt och projektekonomi", service: "service och eftermarknad",
  multi_company: "flera bolag eller enheter", adv_finance: "avancerad ekonomistyrning",
};
const INTENT: Record<string, string> = {
  introduce: "införa systemstöd ni saknar idag", replace: "ersätta ett befintligt system",
  consolidate: "samla flera system i en gemensammare lösning", improve: "förbättra eller modernisera nuvarande lösning",
  integrate: "koppla ihop system som ska finnas kvar",
};
const SYSTEM: Record<string, string> = {
  bc: "Business Central", nav: "Dynamics NAV", fscm: "Finance eller Supply Chain Management", ax: "Dynamics AX",
  other: "ett annat affärssystem", several: "flera olika affärssystem", excel: "främst Excel eller manuella lösningar",
};
export const PRODUCT_LABEL: Record<string, string> = { bc: "Business Central", fscm: "Finance & Supply Chain Management" };

const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} och ${xs[xs.length - 1]}`);

export function interpretation(r: ErpResult): string[] {
  const out: string[] = [];
  const procs = r.processNeeds.filter((p) => PROCESS[p]).map((p) => PROCESS[p]);
  out.push(procs.length ? `Ni behöver ett affärssystem som håller ihop ${list(procs)}.` : "Vilka processer affärssystemet ska hålla ihop är ännu inte kartlagt.");
  const fin = r.financeSignals.length > 0, scm = r.scmSignals.length > 0;
  if (fin && scm) out.push("Ni beskriver avancerade krav både inom ekonomisk styrning och inom lager, logistik eller produktion.");
  else if (fin) out.push("De mest krävande behoven finns inom ekonomisk och finansiell styrning.");
  else if (scm) out.push("De mest krävande behoven finns inom lager, logistik eller produktion.");
  else if (r.comparisonSignals.length) out.push("Vissa krav kan tala för båda produkterna och behöver bedömas närmare.");
  else if (r.uncertainties.length === 0) out.push("Ni har inte beskrivit några avancerade krav inom ekonomi, lager eller produktion.");
  if (r.changeIntent && INTENT[r.changeIntent]) {
    const sys = r.currentSystem && SYSTEM[r.currentSystem] ? `, och använder idag ${SYSTEM[r.currentSystem]}` : "";
    out.push(`Ni vill framför allt ${INTENT[r.changeIntent]}${sys}.`);
  }
  if (r.uncertainties.length) out.push("En del avgörande frågor är ännu obesvarade.");
  return out.slice(0, 4);
}

export function trackLabel(r: ErpResult): string {
  switch (r.preliminaryOutcome) {
    case "bc": return "Business Central";
    case "fscm": return "Finance & Supply Chain Management";
    case "compare": return "Business Central och F&SCM behöver jämföras";
    default: return "Underlaget behöver fördjupas innan ett produktspår kan rekommenderas";
  }
}

export function driverLabel(r: ErpResult): string | null {
  if (r.preliminaryOutcome !== "fscm") return null;
  return r.fscmDriver === "both"
    ? "Relevansen drivs av både Finance- och Supply Chain Management-behov."
    : r.fscmDriver === "finance"
      ? "Relevansen drivs främst av Finance-behov (ekonomi och finansiell styrning)."
      : "Relevansen drivs främst av Supply Chain Management-behov (lager, logistik eller produktion).";
}

export const CLARITY_LABEL = { clear: "Tydlig riktning", multiple: "Flera möjliga vägar", limited: "Begränsat underlag" } as const;

export function startDiffers(r: ErpResult): boolean {
  const s = r.selectedProductStartingPoint;
  if (!s || !(s in PRODUCT_LABEL)) return false;
  return !(r.preliminaryOutcome === s);
}

export const DISCLAIMER =
  "Detta är en preliminär vägledning baserad på era svar, inte ett slutligt systembeslut eller en färdig kravspecifikation.";
export const PO_NOTE = "Project Operations kan behöva utvärderas separat.";
export const EXISTING_NOTE = "Det kan vara relevant att först utreda om den befintliga lösningen kan förbättras eller kompletteras.";
