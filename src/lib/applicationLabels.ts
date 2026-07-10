const BusinessCentralIcon = "/d365-icons/BusinessCentral-new.webp";
const FinanceIcon = "/d365-icons/Finance.svg";
const SupplyChainIcon = "/d365-icons/SupplyChain.svg";
const SalesIcon = "/d365-icons/Sales.svg";
const MarketingIcon = "/d365-icons/Marketing.svg";
const CustomerServiceIcon = "/d365-icons/CustomerService.svg";
const FieldServiceIcon = "/d365-icons/FieldService.svg";
const ContactCenterIcon = "/d365-icons/ContactCenter.svg";
const ProjectOperationsIcon = "/d365-icons/ProjectOperations.svg";
const CommerceIcon = "/d365-icons/Commerce.svg";
const HumanResourcesIcon = "/d365-icons/HumanResources.svg";
const CopilotIcon = "/d365-icons/Copilot.png";

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
