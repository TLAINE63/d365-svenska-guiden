import type { NeedArea } from "@/lib/systemval/config";

/**
 * Sprint 1.4: första steget för besökare som utvärderar CRM- eller affärssystem (ERP).
 * Utgår från verksamhetsbehov, inte Microsofts produktstruktur. Visningen är alltid
 * "Det här kan vara relevant att utforska" eftersom ett enda behov inte räcker för en
 * definitiv rekommendation. Den befintliga behovsguiden (Systemval) gör bedömningen.
 */
export type BusinessNeedKey =
  | "ekonomi"
  | "forsaljning"
  | "supply_chain"
  | "tillverkning"
  | "service"
  | "projekt"
  | "flera"
  | "vet_inte";

export interface ExploreLink { label: string; href: string }

export interface BusinessNeed {
  key: BusinessNeedKey;
  label: string;
  /** Behovsområden som förifylls i behovsguiden. Tom lista = besökaren väljer själv där. */
  systemvalNeeds: NeedArea[];
  areas: ExploreLink[];
  guides: ExploreLink[];
  comparisons: ExploreLink[];
  industries: ExploreLink[];
}

const BC = { label: "Business Central", href: "/businesscentral/" };
const FSCM = { label: "Finance & Supply Chain Management", href: "/finance-supply-chain/" };
const ERP_GUIDE = { label: "Affärssystem (ERP): översikt och vägval", href: "/affarssystem/" };
const CRM_GUIDE = { label: "CRM: sälj, marknad och kundservice", href: "/crm/" };
const ALL_COMPARE = { label: "Jämför alternativ", href: "/jamfor/" };
const ALL_INDUSTRIES = { label: "Alla branscher", href: "/branscher/" };

export const BUSINESS_NEEDS: BusinessNeed[] = [
  {
    key: "ekonomi",
    label: "Ekonomi och rapportering",
    systemvalNeeds: ["erp"],
    areas: [BC, FSCM],
    guides: [ERP_GUIDE],
    comparisons: [{ label: "Business Central jämfört med Visma.net", href: "/jamfor/business-central-vs-visma-net/" }, ALL_COMPARE],
    industries: [ALL_INDUSTRIES],
  },
  {
    key: "forsaljning",
    label: "Försäljning och kundrelationer",
    systemvalNeeds: ["sales"],
    areas: [{ label: "Sales", href: "/d365sales/" }, { label: "Customer Insights (Marketing)", href: "/d365marketing/" }],
    guides: [CRM_GUIDE],
    comparisons: [{ label: "Dynamics 365 jämfört med Salesforce", href: "/jamfor/dynamics-365-vs-salesforce/" }, ALL_COMPARE],
    industries: [ALL_INDUSTRIES],
  },
  {
    key: "supply_chain",
    label: "Supply chain och logistik",
    systemvalNeeds: ["supply_chain"],
    areas: [BC, FSCM],
    guides: [ERP_GUIDE],
    comparisons: [{ label: "Finance & SCM jämfört med Infor M3", href: "/jamfor/fscm-vs-infor-m3/" }, ALL_COMPARE],
    industries: [{ label: "Logistik och transport", href: "/branscher/logistik-transport/" }, { label: "Grossist och distribution", href: "/branscher/grossist-distribution/" }],
  },
  {
    key: "tillverkning",
    label: "Tillverkning",
    systemvalNeeds: ["production"],
    areas: [BC, FSCM],
    guides: [ERP_GUIDE],
    comparisons: [{ label: "Business Central jämfört med Monitor ERP", href: "/jamfor/business-central-vs-monitor-erp/" }, ALL_COMPARE],
    industries: [{ label: "Tillverkning", href: "/branscher/tillverkning/" }],
  },
  {
    key: "service",
    label: "Service och fältservice",
    systemvalNeeds: ["customer_service", "field_service"],
    areas: [
      { label: "Customer Service", href: "/d365customerservice/" },
      { label: "Field Service", href: "/d365fieldservice/" },
      { label: "Contact Center", href: "/d365contactcenter/" },
    ],
    guides: [CRM_GUIDE],
    comparisons: [ALL_COMPARE],
    industries: [ALL_INDUSTRIES],
  },
  {
    key: "projekt",
    label: "Projektverksamhet",
    systemvalNeeds: ["projects"],
    areas: [{ label: "Project Operations", href: "/d365projectoperations/" }, BC],
    guides: [ERP_GUIDE],
    comparisons: [ALL_COMPARE],
    industries: [{ label: "Konsulttjänster", href: "/branscher/konsulttjanster/" }, { label: "Bygg och entreprenad", href: "/branscher/bygg-entreprenad/" }],
  },
  {
    key: "flera",
    label: "Flera områden",
    systemvalNeeds: [],
    areas: [ERP_GUIDE, CRM_GUIDE],
    guides: [{ label: "Vad är Dynamics 365?", href: "/vad-ar-dynamics-365/" }],
    comparisons: [ALL_COMPARE],
    industries: [ALL_INDUSTRIES],
  },
  {
    key: "vet_inte",
    label: "Vet inte ännu",
    systemvalNeeds: [],
    areas: [ERP_GUIDE, CRM_GUIDE],
    guides: [{ label: "Vad är Dynamics 365?", href: "/vad-ar-dynamics-365/" }],
    comparisons: [ALL_COMPARE],
    industries: [ALL_INDUSTRIES],
  },
];

export const COST_LINK: ExploreLink = { label: "Vad kostar det? Licenser, införande och TCO", href: "/kostnad/" };

/** Konkreta verksamhetsområden som kan kryssas i bedömningsunderlaget. */
export const CONCRETE_NEEDS = BUSINESS_NEEDS.filter((n) => n.key !== "flera" && n.key !== "vet_inte");

export const COMPANY_SIZES = ["Under 50 anställda", "50–249 anställda", "250–999 anställda", "1 000 anställda eller fler", "Vet inte"] as const;
export const TIME_HORIZONS = ["Inom 6 månader", "Inom 6–12 månader", "Senare än 12 månader", "Ingen bestämd tidpunkt"] as const;

export function businessNeedByKey(key: string | null | undefined): BusinessNeed | undefined {
  return BUSINESS_NEEDS.find((n) => n.key === key);
}

export interface AssessmentDraft {
  change?: string;
  currentSystem?: string;
  areas?: BusinessNeedKey[];
  size?: string;
  horizon?: string;
}

/** Rader som visas och skickas med i "Få en första bedömning". Bara ifyllda fält. */
export function assessmentLines(d: AssessmentDraft): string[] {
  const areas = (d.areas || []).map((k) => businessNeedByKey(k)?.label).filter(Boolean).join(", ");
  const rows: [string, string | undefined][] = [
    ["Vill förändra", d.change?.trim()],
    ["Nuvarande system", d.currentSystem?.trim()],
    ["Verksamhetsområden", areas || undefined],
    ["Ungefärlig storlek", d.size],
    ["Tidshorisont", d.horizon],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]).map(([l, v]) => `${l}: ${v}`);
}
