import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, ChartNoAxesCombined, Factory, FolderKanban, Headset, Megaphone, ServerCog, TrendingUp } from "lucide-react";

// Keys vd/cfo/coo/it are kept so existing ?roll= links keep working.
export type RoleGuidanceKey = "vd" | "cfo" | "it" | "salj" | "marknad" | "service" | "coo" | "projekt";

export interface RoleGuidanceLink {
  label: string;
  path: string;
}

export interface RoleGuidance {
  key: RoleGuidanceKey;
  title: string;
  buttonLabel: string;
  description: string;
  icon: LucideIcon;
  priorities: string[];
  areas: RoleGuidanceLink[];
  guides: RoleGuidanceLink[];
  partnerLinks: RoleGuidanceLink[];
}

const compare = { label: "Jämför Dynamics 365-partners", path: "/valjdynamics365partner/#hitta-partners" };
const crmPartners = { label: "CRM-partners", path: "/dynamics-365-crm-partners-sverige/" };

export const ROLE_GUIDANCE: RoleGuidance[] = [
  {
    key: "vd",
    title: "Företagsledning och affärsutveckling",
    buttonLabel: "Utforska företagsledning",
    description: "Tillväxt, affärsmodell, investeringar, förändring och verksamhetens långsiktiga utveckling.",
    icon: BriefcaseBusiness,
    priorities: ["Tillväxt", "Affärsmodell", "Investeringar", "Förändring", "Beslutsstöd"],
    areas: [
      { label: "Business Central", path: "/businesscentral/" },
      { label: "Finance & Supply Chain Management", path: "/finance-supply-chain/" },
      { label: "Dynamics 365 Sales", path: "/d365sales/" },
      { label: "Dynamics 365 Customer Service", path: "/d365customerservice/" },
    ],
    guides: [
      { label: "Välja Dynamics 365-partner", path: "/guider/valja-dynamics-365-partner/" },
      { label: "ERP: Business Central eller Finance & Supply Chain Management (F&O)?", path: "/affarssystem/" },
      { label: "Vad kostar Dynamics 365?", path: "/kostnad/" },
    ],
    partnerLinks: [compare, { label: "Se partners per bransch", path: "/partners-per-bransch/" }],
  },
  {
    key: "cfo",
    title: "Ekonomi och finans",
    buttonLabel: "Utforska ekonomi",
    description: "Redovisning, rapportering, budget, prognos, kassaflöde, koncernstruktur och ekonomisk styrning.",
    icon: ChartNoAxesCombined,
    priorities: ["Redovisning", "Rapportering", "Budget och prognos", "Kassaflöde", "Koncernstruktur"],
    areas: [
      { label: "Business Central", path: "/businesscentral/" },
      { label: "Finance & Supply Chain Management", path: "/finance-supply-chain/" },
      { label: "Power BI och beslutsstöd", path: "/kunskapscenter/" },
    ],
    guides: [
      { label: "Välja Business Central-partner", path: "/guider/valja-business-central-partner/" },
      { label: "Välja Finance & Supply Chain Management (F&O)-partner", path: "/guider/valja-finance-supply-chain-partner/" },
    ],
    partnerLinks: [
      { label: "Business Central-partners", path: "/business-central-partners-sverige/" },
      { label: "Finance & Supply Chain Management (F&O)-partners", path: "/finance-supply-chain-partners-sverige/" },
    ],
  },
  {
    key: "it",
    title: "IT, data och digitalisering",
    buttonLabel: "Utforska IT och data",
    description: "Systemarkitektur, integrationer, data, säkerhet, plattformar, AI och systemförvaltning.",
    icon: ServerCog,
    priorities: ["Systemarkitektur", "Integrationer", "Data", "Säkerhet", "AI"],
    areas: [
      { label: "Power Platform och Dataverse", path: "/kunskapscenter/" },
      { label: "Copilot och AI-agenter", path: "/aioversikt/" },
      { label: "Dynamics 365-översikt", path: "/" },
    ],
    guides: [
      { label: "AI Readiness Assessment", path: "/ai-readiness/" },
      { label: "Hitta rätt Dynamics 365-kompetens", path: "/kompetens/" },
    ],
    partnerLinks: [
      { label: "AI- och Copilot-partners", path: "/dynamics-365-ai-copilot-partners-sverige/" },
      compare,
    ],
  },
  {
    key: "salj",
    title: "Försäljning och kommersiell utveckling",
    buttonLabel: "Utforska försäljning",
    description: "Kundbearbetning, säljprocesser, pipeline, offerter, prognoser och kommersiell uppföljning.",
    icon: TrendingUp,
    priorities: ["Säljprocess", "Pipeline", "Offerter", "Prognoser", "Uppföljning"],
    areas: [
      { label: "Dynamics 365 Sales", path: "/d365sales/" },
      { label: "CRM-översikt", path: "/crm/" },
    ],
    guides: [
      { label: "Välja Dynamics 365 Sales-partner", path: "/guider/valja-dynamics-365-sales-partner/" },
      { label: "Kravspecifikation för Sales", path: "/kravspecifikation-sales/" },
      { label: "Dynamics 365 eller Salesforce?", path: "/jamfor/dynamics-365-vs-salesforce/" },
    ],
    partnerLinks: [{ label: "Sales-partners", path: "/dynamics-365-sales-partners-sverige/" }, crmPartners],
  },
  {
    key: "marknad",
    title: "Marknad och kundutveckling",
    buttonLabel: "Utforska marknad",
    description: "Kundresor, segmentering, leads, kampanjer, marknadsautomation och kunddata.",
    icon: Megaphone,
    priorities: ["Kundresor", "Segmentering", "Leads", "Kampanjer", "Kunddata"],
    areas: [
      { label: "Dynamics 365 Customer Insights", path: "/d365marketing/" },
      { label: "CRM-översikt", path: "/crm/" },
    ],
    guides: [
      { label: "Kravspecifikation för marknad", path: "/kravspecifikation-marketing/" },
      { label: "Behovsanalys för sälj och marknad", path: "/salj-marknad-behovsanalys/" },
    ],
    partnerLinks: [{ label: "Marketing-partners", path: "/dynamics-365-marketing-partners-sverige/" }, crmPartners],
  },
  {
    key: "service",
    title: "Kundservice, eftermarknad och fältservice",
    buttonLabel: "Utforska service",
    description: "Kundärenden, kontaktcenter, serviceavtal, tekniker, reservdelar och kundupplevelse.",
    icon: Headset,
    priorities: ["Kundärenden", "Kontaktcenter", "Serviceavtal", "Fältservice", "Kundupplevelse"],
    areas: [
      { label: "Dynamics 365 Customer Service", path: "/d365customerservice/" },
      { label: "Dynamics 365 Contact Center", path: "/d365contactcenter/" },
      { label: "Dynamics 365 Field Service", path: "/d365fieldservice/" },
    ],
    guides: [
      { label: "Välja Customer Service- och Field Service-partner", path: "/guider/valja-customer-service-field-service-partner/" },
      { label: "Kravspecifikation för kundservice", path: "/kravspecifikation-customer-service/" },
    ],
    partnerLinks: [
      { label: "Customer Service-partners", path: "/dynamics-365-customer-service-partners-sverige/" },
      { label: "Field Service-partners", path: "/dynamics-365-field-service-partners-sverige/" },
    ],
  },
  {
    key: "coo",
    title: "Produktion, inköp och leveransflöden",
    buttonLabel: "Utforska verksamhetsflöden",
    description: "Produktion, planering, inköp, lager, logistik, kvalitet och leveranser.",
    icon: Factory,
    priorities: ["Produktion", "Planering", "Inköp", "Lager och logistik", "Kvalitet"],
    areas: [
      { label: "Business Central", path: "/businesscentral/" },
      { label: "Supply Chain Management", path: "/finance-supply-chain/" },
    ],
    guides: [
      { label: "Välja Business Central-partner", path: "/guider/valja-business-central-partner/" },
      { label: "Välja Finance & Supply Chain Management (F&O)-partner", path: "/guider/valja-finance-supply-chain-partner/" },
    ],
    partnerLinks: [
      { label: "Business Central-partners", path: "/business-central-partners-sverige/" },
      { label: "Finance & Supply Chain Management (F&O)-partners", path: "/finance-supply-chain-partners-sverige/" },
    ],
  },
  {
    key: "projekt",
    title: "Projekt, resurser och tjänsteleverans",
    buttonLabel: "Utforska projekt och resurser",
    description: "Projektstyrning, resursplanering, tidrapportering, kostnader, fakturering och projektmarginaler.",
    icon: FolderKanban,
    priorities: ["Projektstyrning", "Resursplanering", "Tidrapportering", "Fakturering", "Projektmarginaler"],
    areas: [
      { label: "Dynamics 365 Project Operations", path: "/d365projectoperations/" },
      { label: "Business Central", path: "/businesscentral/" },
    ],
    guides: [
      { label: "Välja Dynamics 365-partner", path: "/guider/valja-dynamics-365-partner/" },
      { label: "Hitta rätt Dynamics 365-kompetens", path: "/kompetens/" },
    ],
    partnerLinks: [compare],
  },
];

export const getRoleGuidance = (key: string | null) =>
  ROLE_GUIDANCE.find((role) => role.key === key);
