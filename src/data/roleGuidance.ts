import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, ChartNoAxesCombined, Factory, ServerCog } from "lucide-react";

export type RoleGuidanceKey = "vd" | "cfo" | "coo" | "it";

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

export const ROLE_GUIDANCE: RoleGuidance[] = [
  {
    key: "vd",
    title: "VD",
    buttonLabel: "Jag är VD",
    description: "Ansvarig för tillväxt, förändring, investeringar och verksamhetsutveckling.",
    icon: BriefcaseBusiness,
    priorities: ["Tillväxt", "Affärssystem", "CRM", "Beslutsstöd", "Effektivisering"],
    areas: [
      { label: "Business Central", path: "/businesscentral/" },
      { label: "Finance & Supply Chain Management", path: "/finance-supply-chain/" },
      { label: "Dynamics 365 Sales", path: "/d365sales/" },
      { label: "Dynamics 365 Customer Service", path: "/d365customerservice/" },
    ],
    guides: [
      { label: "Välja Dynamics 365-partner", path: "/guider/valja-dynamics-365-partner/" },
      { label: "ERP: Business Central eller Finance & Supply Chain Management (F&O)?", path: "/erp/" },
    ],
    partnerLinks: [
      { label: "Jämför Dynamics 365-partners", path: "/valjdynamics365partner/#hitta-partners" },
      { label: "Se partners per bransch", path: "/partners-per-bransch/" },
    ],
  },
  {
    key: "cfo",
    title: "CFO / Ekonomichef",
    buttonLabel: "Jag är CFO",
    description: "Ansvarig för ekonomi, rapportering, budget, koncernstruktur och kontroll.",
    icon: ChartNoAxesCombined,
    priorities: ["Ekonomi", "Rapportering", "Budget", "Prognos", "Compliance"],
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
    key: "coo",
    title: "COO / Verksamhetschef",
    buttonLabel: "Jag är COO",
    description: "Ansvarig för processer, lager, logistik, produktion och verksamhetsstyrning.",
    icon: Factory,
    priorities: ["Lager", "Logistik", "Produktion", "Service"],
    areas: [
      { label: "Business Central", path: "/businesscentral/" },
      { label: "Supply Chain Management", path: "/finance-supply-chain/" },
      { label: "Dynamics 365 Field Service", path: "/d365fieldservice/" },
    ],
    guides: [
      { label: "Välja Business Central-partner", path: "/guider/valja-business-central-partner/" },
      { label: "Välja Finance & Supply Chain Management (F&O)-partner", path: "/guider/valja-finance-supply-chain-partner/" },
      { label: "Välja Field Service-partner", path: "/guider/valja-customer-service-field-service-partner/" },
    ],
    partnerLinks: [
      { label: "Finance & Supply Chain Management (F&O)-partners", path: "/finance-supply-chain-partners-sverige/" },
      { label: "Field Service-partners", path: "/dynamics-365-field-service-partners-sverige/" },
    ],
  },
  {
    key: "it",
    title: "IT-chef",
    buttonLabel: "Jag är IT-chef",
    description: "Ansvarig för integrationer, säkerhet, data, plattformar och arkitektur.",
    icon: ServerCog,
    priorities: ["Integrationer", "Data", "AI", "Automation", "Säkerhet"],
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
      { label: "Jämför Dynamics 365-partners", path: "/valjdynamics365partner/#hitta-partners" },
    ],
  },
];

export const getRoleGuidance = (key: string | null) =>
  ROLE_GUIDANCE.find((role) => role.key === key);