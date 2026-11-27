import type { PlanMeta } from "@/lib/d365Plan";
import type { ToolEntry } from "@/lib/toolContext";
import type { SourceTemplate } from "@/lib/nextSteps";

export type BuyerState = "UNKNOWN" | "EXPLORE" | "FRAME" | "DECIDE" | "ACT" | "EVOLVE";
export interface BuyerAction {
  state: BuyerState;
  basis: "observed" | "inferred" | "confirmed";
  reason: string;
  label: string;
  to?: string;
  help: string;
}

/** Only the current topic's evidence may influence a suggestion. No company identity or commercial data. */
export function buyerScope(path: string): string {
  if (/businesscentral|business-central/.test(path)) return "bc";
  if (/finance-supply|fscm/.test(path)) return "fscm";
  if (/d365sales|kravspecifikation-sales/.test(path)) return "sales";
  if (/d365customerservice|kravspecifikation-kundservice/.test(path)) return "service";
  if (/d365marketing|kravspecifikation-marketing/.test(path)) return "marketing";
  if (/d365fieldservice/.test(path)) return "field";
  if (/d365contactcenter/.test(path)) return "contact";
  if (/crm|customer-engagement/.test(path)) return "crm";
  if (/^\/ai|agents|copilot|losningsvagval/.test(path)) return "ai";
  if (/affarssystem|kravspecifikation\//.test(path)) return "erp";
  return path.replace(/\/$/, "");
}

function toolScope(t: ToolEntry): string {
  const id = `${t.tool} ${t.label}`.toLowerCase();
  if (/copilot|agent|ai/.test(id)) return "ai";
  if (/field-service/.test(id)) return "field";
  if (/contact-center/.test(id)) return "contact";
  if (/customer-insights/.test(id)) return "marketing";
  if (/fscm|finance/.test(id)) return "fscm";
  if (/\bbc\b|_bc|business central/.test(id)) return "bc";
  if (/service|kundservice/.test(id)) return "service";
  if (/marketing/.test(id) && !/sales/.test(id)) return "marketing";
  if (/sales|salj/.test(id)) return "sales";
  if (/crm/.test(id)) return "crm";
  if (/erp|affarssystem/.test(id)) return "erp";
  return "unknown";
}

const matches = (scope: string, evidence: string) => scope === evidence ||
  (scope === "crm" && ["sales", "service", "marketing", "field", "contact"].includes(evidence)) ||
  (scope === "erp" && ["bc", "fscm"].includes(evidence));

export function relevantBuyerTools(path: string, tools: ToolEntry[], now = Date.now()): ToolEntry[] {
  return tools.filter(t => Number.isFinite(Date.parse(t.at)) && now - Date.parse(t.at) >= 0 && now - Date.parse(t.at) <= 30 * 86400000 && matches(buyerScope(path), toolScope(t)));
}

const REQUIREMENTS: Record<string, string> = {
  bc: "/kravspecifikation/", fscm: "/kravspecifikation/", erp: "/kravspecifikation/",
  sales: "/kravspecifikation-sales/", service: "/kravspecifikation-kundservice/", marketing: "/kravspecifikation-marketing/",
  crm: "/guider/kravspecifikation-crm/",
};

export function resolveBuyerAction({ path, tools = [], plan, choice, now = Date.now() }: {
  path: string; template?: SourceTemplate; tools?: ToolEntry[]; plan?: PlanMeta; choice?: BuyerState; now?: number;
}): BuyerAction {
  const scope = buyerScope(path);
  const relevant = relevantBuyerTools(path, tools, now);
  const calculation = plan?.calculations?.find(c => matches(scope, buyerScope(c.url)) && Number.isFinite(Date.parse(c.savedAt)) && now - Date.parse(c.savedAt) >= 0 && now - Date.parse(c.savedAt) <= 30 * 86400000);
  const latest = relevant.at(-1);
  const cost = latest && /roi|kostnad|kalkyl|cost/.test(latest.tool);
  const state = choice ?? (latest || calculation ? cost || calculation ? "FRAME" : "DECIDE" : "UNKNOWN");
  const help = state === "DECIDE" ? "Diskutera tre viktiga frågor på 20 minuter" : state === "FRAME" ? "Få hjälp att avgränsa alternativen" : state === "EVOLVE" ? "Diskutera vad ni vill förbättra" : "Ställ en fråga";
  if (choice === "EXPLORE") return { state, basis: "confirmed", reason: "Ni vill utforska innan ni avgränsar behovet. Börja med frågan som är viktigast för er.", label: "Ställ en fråga", help };
  if (choice === "ACT") return { state, basis: "confirmed", reason: "Ni vill planera nästa aktivitet. Stäm av vad som ska göras och vem som behöver delta.", label: "Planera nästa steg med Thomas", help: "Planera nästa steg med Thomas" };
  if (choice === "EVOLVE") return { state, basis: "confirmed", reason: "Ni vill utveckla en befintlig lösning. Ett nästa steg är att avgränsa vad som behöver förbättras.", label: "Kartlägg vad ni vill förbättra", to: "/befintlig-kund/", help };
  if (scope === "ai" && (latest || choice === "FRAME" || choice === "DECIDE")) return { state, basis: choice ? "confirmed" : "inferred", reason: latest ? "Ni har ett AI-underlag. Stäm av process, data och ansvar innan ni väljer lösning." : "Ni vill avgränsa eller bedöma ett AI-case. Börja med vad arbetsmomentet kräver.", label: "Diskutera ert AI-case i 20 minuter", help: "Diskutera ert AI-case i 20 minuter" };
  if ((cost || calculation || choice === "FRAME") && REQUIREMENTS[scope]) return { state, basis: choice ? "confirmed" : "inferred", reason: latest || calculation ? "Ni har räknat på kostnaden inom detta område. Ett nästa steg är att kontrollera vilka krav beloppet ska täcka." : "Ni vill avgränsa behovet. Samla kraven innan ni väljer alternativ.", label: "Avgränsa era krav", to: REQUIREMENTS[scope], help };
  if (state === "DECIDE") return { state, basis: choice ? "confirmed" : "inferred", reason: choice ? "Ni vill jämföra alternativ inför ett beslut. Stäm av skillnader, risker och öppna frågor." : "Ni har ett underlag inom detta område. Jämför alternativ och kontrollera vad som återstår att verifiera.", label: "Jämför era alternativ", to: "/jamfor/", help };
  return { state, basis: choice ? "confirmed" : "observed", reason: choice ? "Ni vill utforska innan ni avgränsar behovet. Börja med frågan som är viktigast för er." : "Vad vill ni få hjälp med just nu? Ni behöver inte ha ett pågående projekt.", label: "Ställ en fråga", help };
}