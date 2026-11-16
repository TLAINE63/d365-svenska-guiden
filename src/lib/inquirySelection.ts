const KEY = "d365_inquiry_partners";
export const INQUIRY_SELECTION_EVENT = "d365-inquiry-selection";

export function cleanInquiryPartners(values: string[]): string[] {
  return [...new Set(values.map(v => v.trim().toLowerCase()).filter(v => /^[a-z0-9-]{1,80}$/.test(v)))].slice(0, 3);
}

export function addInquiryPartner(values: string[], slug: string): string[] {
  return cleanInquiryPartners([...values, slug]);
}

export function readInquiryPartners(): string[] {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? cleanInquiryPartners(value.filter((v): v is string => typeof v === "string")) : [];
  } catch { return []; }
}

export function saveInquiryPartners(values: string[]): void {
  try { sessionStorage.setItem(KEY, JSON.stringify(cleanInquiryPartners(values))); } catch { /* Storage is optional. */ }
  window.dispatchEvent(new Event(INQUIRY_SELECTION_EVENT));
}

export function inquiryProduct(value?: string | null): string | undefined {
  const p = (value || "").toLowerCase().replace(/\u00a0/g, " ");
  if (/business.?central|^bc$/.test(p)) return "business-central";
  if (/finance|supply.?chain|^fscm?$|f&o/.test(p)) return "finance-supply-chain";
  if (/customer.?service|^cs$/.test(p)) return "customer-service";
  if (/field.?service|^fs$/.test(p)) return "field-service";
  if (/^sales$|d365sales|dynamics 365 sales/.test(p)) return "sales";
  return undefined;
}

export function inquiryHref({ product, industry, partners = [], source }: { product?: string | null; industry?: string | null; partners?: string[]; source: string }): string {
  const q = new URLSearchParams();
  const p = inquiryProduct(product);
  if (p) q.set("produkt", p);
  if (industry) q.set("bransch", industry);
  cleanInquiryPartners(partners).forEach(slug => q.append("partner", slug));
  q.set("kalla", source);
  return `/forfragan/?${q}`;
}

/** Topic-matched buying pages, never a direct form link from an article. */
export function articleBuyingStep(topic: string): { to: string; label: string } {
  const t = topic.toLowerCase();
  if (/salesforce|sälj|sales|crm/.test(t)) return { to: "/jamfor/dynamics-365-vs-salesforce/", label: "Jämför Dynamics\u00a0365 och Salesforce" };
  if (/business.?central|navision|dynamics nav/.test(t)) return { to: "/jamfor/business-central-vs-monitor-erp/", label: "Jämför Business Central och Monitor ERP" };
  if (/finance|supply.?chain|f&scm|dynamics ax/.test(t)) return { to: "/jamfor/fscm-vs-sap-s4hana/", label: "Jämför Finance & Supply Chain och SAP" };
  if (/customer.?service|kundservice/.test(t)) return { to: "/jamfor/customer-service-vs-zendesk/", label: "Jämför Customer Service och Zendesk" };
  if (/field.?service|fältservice/.test(t)) return { to: "/jamfor/field-service-vs-salesforce-field-service/", label: "Jämför alternativen för Field Service" };
  if (/contact.?center|kontaktcenter/.test(t)) return { to: "/jamfor/contact-center-vs-genesys-cloud-cx/", label: "Jämför alternativen för Contact Center" };
  return { to: "/priser/", label: "Se licenser och priser för Dynamics\u00a0365" };
}