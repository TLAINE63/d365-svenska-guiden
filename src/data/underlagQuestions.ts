import type { BuyerProfile, SectionKey } from "@/lib/buyerProfile";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

export interface UQOption { value: string; label: string }
export interface UQuestion {
  id: string;
  section: SectionKey;
  key: string;
  text: string;
  help?: string;
  multi?: boolean;
  options: UQOption[];
  /** Visa bara när villkoret är uppfyllt. */
  when?: (p: BuyerProfile) => boolean;
}

const yn: UQOption[] = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nej" },
  { value: "unknown", label: "Vet inte" },
];

export const APP_OPTIONS: UQOption[] = [
  { value: "finance", label: "Finance" },
  { value: "scm", label: "Supply\u00A0Chain\u00A0Management" },
  { value: "project_ops", label: "Project Operations" },
  { value: "commerce", label: "Commerce" },
  { value: "hr", label: "Human Resources" },
  { value: "sales", label: "Sales" },
  { value: "customer_service", label: "Customer Service" },
  { value: "field_service", label: "Field Service" },
  { value: "customer_insights", label: "Customer Insights (Marketing)" },
  { value: "contact_center", label: "Contact\u00A0Center" },
];

const apps = (p: BuyerProfile) => (p.scope.apps as string[]) || [];
const hasFscm = (p: BuyerProfile) => apps(p).some((a) => a === "finance" || a === "scm");
const hasCrm = (p: BuyerProfile) => apps(p).some((a) => ["sales", "customer_service", "field_service", "customer_insights", "contact_center"].includes(a));
const hasCc = (p: BuyerProfile) => apps(p).includes("contact_center");
const hasContactChannel = (p: BuyerProfile) => hasCc(p) || apps(p).includes("customer_service");

export const UNDERLAG_QUESTIONS: UQuestion[] = [
  // Verksamhet
  { id: "industry", section: "company", key: "industry", text: "Vilken bransch är ni verksamma i?", options: STANDARD_INDUSTRIES.map((i) => ({ value: i.slug, label: i.name })) },
  { id: "employees", section: "company", key: "employees", text: "Hur många anställda har ni?", options: ["1-49", "50-99", "100-249", "250-999", "1.000-4.999", ">5.000"].map((v) => ({ value: v, label: v.replace(">", "Fler än ") })) },
  { id: "revenue", section: "company", key: "revenue", text: "Ungefärlig omsättning?", options: [{ value: "<100", label: "Under 100 Mkr" }, { value: "100-500", label: "100–500 Mkr" }, { value: "500-2000", label: "500 Mkr – 2 Mdr" }, { value: ">2000", label: "Över 2 Mdr" }] },
  { id: "legal_entities", section: "company", key: "legal_entities", text: "Hur många juridiska bolag ingår?", options: ["1", "2-5", "6-15", "16+"].map((v) => ({ value: v, label: v })) },
  { id: "countries", section: "company", key: "countries", text: "I hur många länder har ni verksamhet?", options: [{ value: "1", label: "Bara Sverige" }, { value: "nordic", label: "Flera nordiska länder" }, { value: "europe", label: "Flera länder i Europa" }, { value: "global", label: "Även utanför Europa" }] },
  { id: "multi_currency", section: "company", key: "multi_currency", text: "Har koncernen flera valutor?", options: yn },
  { id: "apps", section: "scope", key: "apps", multi: true, text: "Vilka områden vill ni utvärdera?", help: "Välj alla som är aktuella.", options: APP_OPTIONS },
  // Nuvarande situation
  { id: "erp", section: "current_erp", key: "erp", text: "Vilket affärssystem har ni idag?", options: [{ value: "ax2012", label: "Dynamics AX 2012" }, { value: "nav", label: "Dynamics NAV" }, { value: "sap", label: "SAP ECC/S4" }, { value: "oracle", label: "Oracle" }, { value: "ifs", label: "IFS" }, { value: "other", label: "Annat system" }, { value: "excel", label: "Excel eller inget system" }] },
  { id: "crm_system", section: "current_erp", key: "crm", text: "Vilket CRM-system har ni idag?", when: hasCrm, options: [{ value: "dynamics_onprem", label: "Dynamics CRM on-prem" }, { value: "salesforce", label: "Salesforce" }, { value: "hubspot", label: "HubSpot" }, { value: "other", label: "Annat" }, { value: "none", label: "Inget eller Excel" }] },
  { id: "contact_system", section: "current_erp", key: "contact_system", text: "Vilken växel eller kontaktcenterlösning har ni idag?", when: hasContactChannel, options: [{ value: "own_pbx", label: "Egen växel" }, { value: "aws_connect", label: "AWS Connect" }, { value: "genesys", label: "Genesys" }, { value: "five9", label: "Five9" }, { value: "freshworks", label: "Freshworks" }, { value: "other", label: "Annat" }, { value: "none", label: "Ingen" }] },
  { id: "contract_ends", section: "current_erp", key: "contract_ends", text: "När löper nuvarande avtal ut?", options: [{ value: "lt12", label: "Inom 12 månader" }, { value: "12-24", label: "Om 1–2 år" }, { value: "gt24", label: "Om mer än 2 år" }, { value: "unknown", label: "Vet inte" }] },
  // F&SCM
  { id: "production", section: "fscm", key: "production", text: "Vilken typ av produktion har ni?", when: hasFscm, options: [{ value: "discrete", label: "Diskret" }, { value: "process", label: "Process" }, { value: "lean", label: "Lean" }, { value: "none", label: "Ingen egen produktion" }] },
  { id: "wms", section: "fscm", key: "wms", text: "Behöver ni avancerad lagerstyrning (WMS)?", when: hasFscm, options: yn },
  { id: "mrp", section: "fscm", key: "mrp", text: "Behöver ni avancerad planering (MRP)?", when: hasFscm, options: yn },
  { id: "intercompany", section: "fscm", key: "intercompany", text: "Behöver ni intercompany och koncernkonsolidering?", when: hasFscm, options: yn },
  { id: "localization", section: "fscm", key: "localization", text: "Behövs lokalisering för fler länder än Sverige?", when: hasFscm, options: yn },
  // CRM
  { id: "sellers", section: "crm", key: "users", text: "Hur många säljare eller handläggare?", when: hasCrm, options: ["1-10", "11-50", "51-200", "200+"].map((v) => ({ value: v, label: v })) },
  { id: "channels", section: "crm", key: "channels", multi: true, text: "Vilka kanaler har ni med kunder?", when: hasCrm, options: [{ value: "email", label: "E-post" }, { value: "chat", label: "Chatt" }, { value: "phone", label: "Telefon" }] },
  { id: "field_service", section: "crm", key: "field_service", text: "Har ni fältservice med resursplanering?", when: hasCrm, options: yn },
  { id: "marketing", section: "crm", key: "marketing", text: "Behöver ni marknadsautomation?", when: hasCrm, options: yn },
  { id: "copilot", section: "crm", key: "copilot", text: "Är ni intresserade av Copilot i säljet eller kundservicen?", when: hasCrm, options: yn },
  // Contact Center
  { id: "cc_voice", section: "contact_center", key: "voice", text: "Behöver ni röst och telefoni med sömlös överlämning till handläggare?", when: hasCc, options: yn },
  { id: "cc_multichannel", section: "contact_center", key: "multichannel", text: "Ska flera kanaler (chatt, sms, sociala medier) hanteras i samma flöde?", when: hasCc, options: yn },
  { id: "cc_ai", section: "contact_center", key: "ai_agents", text: "Är AI-agenter eller självbetjäning aktuellt?", when: hasCc, options: yn },
  { id: "cc_sla", section: "contact_center", key: "sla", text: "Behöver ni styra tjänstenivåer och öppettider?", when: hasCc, options: yn },
  { id: "cc_pbx", section: "contact_center", key: "pbx_plan", text: "Ska kontaktfunktionen växa ur dagens växel eller ersätta den?", when: hasCc, options: [{ value: "grow", label: "Växa ur dagens växel" }, { value: "replace", label: "Ersätta den" }, { value: "unknown", label: "Vet inte" }] },
  // Integrationer och projekt
  { id: "integrations", section: "integrations", key: "critical", multi: true, text: "Vilka integrationer är kritiska?", options: [{ value: "edi", label: "EDI" }, { value: "ecom", label: "E-handel" }, { value: "plm_mes", label: "PLM/MES" }, { value: "bank", label: "Banker" }, { value: "bi", label: "BI" }, { value: "cti", label: "Telefoni/CTI" }] },
  { id: "power_platform", section: "integrations", key: "power_platform", text: "Använder ni Power Platform idag?", options: yn },
  { id: "timeline", section: "project", key: "timeline", text: "När vill ni ha ett nytt system på plats?", options: [{ value: "0-6", label: "Inom 6 månader" }, { value: "6-12", label: "Om 6–12 månader" }, { value: "12+", label: "Om mer än ett år" }, { value: "unknown", label: "Vet inte" }] },
  { id: "budget", section: "project", key: "budget", text: "Har ni en budgetram för projektet?", help: "Frivilligt. Används bara för att visa er egen ram i underlaget.", options: [{ value: "lt1", label: "Under 1 Mkr" }, { value: "1-3", label: "1–3 Mkr" }, { value: "3-10", label: "3–10 Mkr" }, { value: "10+", label: "Över 10 Mkr" }, { value: "none", label: "Ingen ram ännu" }] },
];

export const CRM_TEST_EXTRA: UQuestion[] = [
  { id: "crm_sales_process", section: "crm", key: "sales_process", text: "Hur ser er säljprocess ut?", options: [{ value: "structured", label: "Strukturerad med pipeline och prognoser" }, { value: "simple", label: "Enkel, mest kundregister" }, { value: "none", label: "Säljet är inte i fokus" }] },
  { id: "crm_service", section: "crm", key: "service", text: "Hanterar ni kundärenden i större omfattning?", options: yn },
  { id: "cc_volume", section: "contact_center", key: "volume", text: "Hur många kundkontakter har ni per månad?", options: [{ value: "lt1000", label: "Färre än 1 000" }, { value: "1000-10000", label: "1 000–10 000" }, { value: "gt10000", label: "Fler än 10 000" }, { value: "unknown", label: "Vet inte" }] },
  { id: "erp_integration", section: "integrations", key: "crm_erp", text: "Behöver CRM integreras med ert affärssystem?", options: yn },
];

const byId = Object.fromEntries([...UNDERLAG_QUESTIONS, ...CRM_TEST_EXTRA].map((q) => [q.id, q]));

export const CRM_TEST_QUESTIONS: UQuestion[] = [
  byId.crm_sales_process, byId.crm_service, byId.sellers, byId.channels, byId.field_service, byId.marketing,
  byId.crm_system, byId.cc_volume, byId.cc_voice, byId.cc_ai, byId.erp_integration,
].map((q) => ({ ...q, when: undefined }));

export function questionsFor(p: BuyerProfile, list = UNDERLAG_QUESTIONS) {
  return list.filter((q) => !q.when || q.when(p));
}

export function answerLabel(q: UQuestion, v: unknown): string {
  if (Array.isArray(v)) return v.map((x) => q.options.find((o) => o.value === x)?.label ?? x).join(", ");
  return q.options.find((o) => o.value === v)?.label ?? String(v ?? "");
}

export const findQuestion = (section: SectionKey, key: string) =>
  [...UNDERLAG_QUESTIONS, ...CRM_TEST_EXTRA].find((q) => q.section === section && q.key === key);
