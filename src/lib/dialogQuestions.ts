/**
 * Situationsanpassade frågor inför partnerdialog. Regelbaserat från
 * köparens egna svar (underlag + beslutsmognad). Ingen partnerbedömning,
 * ingen ranking – bara konkreta frågor kunden kan ställa.
 */
import type { BuyerProfile } from "@/lib/buyerProfile";

export interface DialogQuestion { id: string; reason: string; question: string }

const CRM = ["sales", "customer_service", "field_service", "customer_insights", "contact_center"];

export function dialogQuestions(p: BuyerProfile): DialogQuestion[] {
  const apps = (p.scope?.apps as string[]) || [];
  const fscm = apps.some((a) => a === "finance" || a === "scm");
  const crm = apps.some((a) => CRM.includes(a));
  const integrations = (p.integrations?.critical as string[]) || [];
  const erp = p.current_erp?.erp as string | undefined;
  const countries = p.company?.countries as string | undefined;
  const entities = p.company?.legal_entities as string | undefined;
  const timeline = p.project?.timeline as string | undefined;
  const weak = (p.assessment?.bm_weak as string[]) || [];
  const out: DialogQuestion[] = [];

  if (integrations.length >= 2 || integrations.includes("edi") || integrations.includes("plm_mes"))
    out.push({ id: "integrations", reason: "Ni har angett affärskritiska integrationer.", question: "Hur kartlägger och testar ni integrationer före driftsättning, och vem ansvarar för dem efter go-live?" });
  if (erp && ["ax2012", "nav", "sap", "oracle", "ifs", "other"].includes(erp))
    out.push({ id: "migration", reason: "Ni byter från ett befintligt affärssystem.", question: "Hur går ni tillväga vid datamigrering: vilken data flyttas, hur tvättas den och hur många provmigreringar gör ni?" });
  if (countries && countries !== "1")
    out.push({ id: "countries", reason: "Ni har verksamhet i flera länder.", question: "Hur organiserar ni internationell projektstyrning och lokala krav (lokalisering, skatter, språk) per land?" });
  if (entities && entities !== "1")
    out.push({ id: "entities", reason: "Flera juridiska bolag ingår.", question: "Vilken erfarenhet har ni av koncernstrukturer, intercompany och konsolidering i liknande projekt?" });
  if (fscm && crm)
    out.push({ id: "erp_crm", reason: "Ni utvärderar både affärssystem och CRM.", question: "Hur säkerställer ni att ERP- och CRM-delen hänger ihop, och levererar ni båda själva eller med underleverantör?" });
  if (timeline === "0-6")
    out.push({ id: "timeline", reason: "Ni har en kort tidsram.", question: "Är tidsplanen realistisk för vårt omfång, och vad behöver vara klart hos oss för att hålla den?" });
  if (weak.includes("samsyn") || weak.includes("beslutsstruktur"))
    out.push({ id: "anchoring", reason: "Er beslutsmognad visar att intern förankring behöver stärkas.", question: "Hur brukar ni arbeta med förändringsledning och styrgrupp, och vilka roller behöver vi bemanna internt?" });
  if (weak.includes("riskinsikt"))
    out.push({ id: "risk", reason: "Er beslutsmognad visar att riskbilden är ofullständig.", question: "Vilka är de vanligaste riskerna i projekt som vårt, och hur hanterar ni scopeändringar och budgetavvikelser?" });
  out.push({ id: "references", reason: "Gäller alla projekt.", question: "Kan ni visa ett liknande genomfört projekt (bransch, storlek, omfång) och ge oss en referens att prata med?" });
  out.push({ id: "support", reason: "Gäller alla projekt.", question: "Hur ser supporten ut efter driftstart: SLA, vem vi pratar med och hur vidareutveckling beställs?" });
  return out.slice(0, 6);
}
