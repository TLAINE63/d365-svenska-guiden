/**
 * Lead context & profile helpers.
 *
 * - `deriveLeadContext(pathname)` reads the page's own context (product area
 *   and industry) from the route so a lead form can be pre-filled without
 *   asking the visitor to repeat what the page already knows.
 * - `getLeadProfile()` / `saveLeadProfile()` remember name, company and work
 *   e-mail locally (localStorage) so returning visitors only confirm and send.
 *
 * No personal data is sent anywhere from these helpers – they only feed the
 * form the visitor is about to submit themselves.
 */

import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

const PROFILE_KEY = "d365_lead_profile_v1";

export interface LeadProfile {
  contact_name: string;
  company_name: string;
  email: string;
}

export interface LeadContext {
  /** Human readable Dynamics 365 product area for the current page, if any. */
  product?: string;
  /** Standard industry name for the current page, if any. */
  industry?: string;
}

const PRODUCT_BY_PREFIX: ReadonlyArray<[string, string]> = [
  ["/business-central", "Business Central"],
  ["/businesscentral", "Business Central"],
  ["/finance-supply-chain", "Finance & Supply Chain Management"],
  ["/d365sales", "Dynamics 365 Sales"],
  ["/dynamics365sales", "Dynamics 365 Sales"],
  ["/customer-service", "Dynamics 365 Customer Service"],
  ["/field-service", "Dynamics 365 Field Service"],
  ["/contact-center", "Dynamics 365 Contact Center"],
  ["/marketing", "Dynamics 365 Customer Insights"],
  ["/commerce", "Dynamics 365 Commerce"],
  ["/human-resources", "Dynamics 365 Human Resources"],
  ["/project-operations", "Dynamics 365 Project Operations"],
  ["/copilot", "Microsoft AI & Copilot"],
  ["/ai-oversikt", "Microsoft AI & Copilot"],
  ["/crm", "CRM (Sales, Service & Marketing)"],
];

export function deriveLeadContext(pathname: string): LeadContext {
  const path = (pathname || "").toLowerCase();

  const productMatch = PRODUCT_BY_PREFIX.filter(([prefix]) => path.startsWith(prefix)).sort(
    (a, b) => b[0].length - a[0].length,
  )[0];

  const industry = STANDARD_INDUSTRIES.find(
    (i) => path.includes(`/branscher/${i.slug}`) || path.includes(`/${i.slug}`),
  )?.name;

  return {
    product: productMatch?.[1],
    industry,
  };
}

export function getLeadProfile(): LeadProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LeadProfile>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      contact_name: String(parsed.contact_name || "").slice(0, 100),
      company_name: String(parsed.company_name || "").slice(0, 100),
      email: String(parsed.email || "").slice(0, 255),
    };
  } catch {
    return null;
  }
}

export function saveLeadProfile(profile: LeadProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* storage disabled – not critical */
  }
}

/** Best-effort company guess from a work e-mail domain (e.g. acme.se → Acme). */
export function companyFromEmail(email: string): string {
  const domain = (email || "").trim().toLowerCase().split("@")[1] || "";
  const base = domain.split(".")[0] || "";
  if (!base || base.length < 2) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
