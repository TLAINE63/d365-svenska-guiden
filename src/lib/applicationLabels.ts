import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";
import ProjectOperationsIcon from "@/assets/icons/ProjectOperations.svg";
import CommerceIcon from "@/assets/icons/Commerce.svg?url";
import HumanResourcesIcon from "@/assets/icons/HumanResources.svg?url";
import CopilotIcon from "@/assets/icons/Copilot.png";

/** Canonical merged name for Finance + Supply Chain Management. */
export const FSCM_DISPLAY_NAME = "Finance & Supply Chain Management";

/** All labels that should be treated as the Finance & SCM product group. */
const FSCM_ALIASES = new Set([
  "Finance",
  "Supply Chain Management",
  "Finance & Supply Chain Management",
  "Finance & SCM",
  "F&SCM",
  FSCM_DISPLAY_NAME,
]);

export function isFscmApp(app: string): boolean {
  return FSCM_ALIASES.has(app);
}

/**
 * Return the buyer-facing display label for a Dynamics 365 application.
 * Finance and Supply Chain Management are always shown as "F&SCM".
 */
export function displayApplicationName(app: string): string {
  if (isFscmApp(app)) return FSCM_DISPLAY_NAME;
  return app;
}

/** Map application names to official Dynamics 365 icons. */
export const applicationIcons: Record<string, string> = {
  "Business Central": BusinessCentralIcon,
  "Sales": SalesIcon,
  "Customer Service": CustomerServiceIcon,
  "Field Service": FieldServiceIcon,
  "Marketing": MarketingIcon,
  "Customer Insights": MarketingIcon,
  "Customer Insights (Marketing)": MarketingIcon,
  "Finance": FinanceIcon,
  "Supply Chain Management": SupplyChainIcon,
  [FSCM_DISPLAY_NAME]: FinanceIcon,
  "Finance & SCM": FinanceIcon,
  "F&SCM": FinanceIcon,
  "Copilot": CopilotIcon,
  "Contact Center": ContactCenterIcon,
  "Project Operations": ProjectOperationsIcon,
  "Commerce": CommerceIcon,
  "Human Resources": HumanResourcesIcon,
};

export function getApplicationIcon(appName: string): string | null {
  if (applicationIcons[appName]) return applicationIcons[appName];

  const lowerName = appName.toLowerCase();
  for (const [key, icon] of Object.entries(applicationIcons)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return icon;
    }
  }

  return null;
}

/**
 * Normalize a list of applications: merge Finance/SCM aliases into one F&SCM badge,
 * remove duplicates and keep a stable order.
 */
export function normalizeApplications(apps: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const app of apps) {
    const normalized = displayApplicationName(app);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      out.push(normalized);
    }
  }
  return out;
}

/** Stable product order for badges. */
const PRODUCT_ORDER = [
  "Business Central",
  FSCM_DISPLAY_NAME,
  "Sales",
  "Customer Insights (Marketing)",
  "Customer Service",
  "Field Service",
  "Contact Center",
  "Project Operations",
  "Commerce",
  "Human Resources",
  "Copilot",
];

export function sortApplications(apps: string[]): string[] {
  return [...apps].sort((a, b) => {
    const idxA = PRODUCT_ORDER.indexOf(a);
    const idxB = PRODUCT_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });
}
