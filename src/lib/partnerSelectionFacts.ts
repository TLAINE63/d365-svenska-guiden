import type { Partner } from "@/data/partners";
import type { DatabasePartner, ProductFilterInput } from "@/hooks/usePartners";
import type { DeliveryProfileValue } from "@/data/deliveryProfileFields";
import { displayApplicationName } from "@/lib/applicationLabels";
export type SelectionPartner = Partner | DatabasePartner;
export interface SelectionFact { label: string; value: string }
const labels: Record<string, string> = { bc: "Business Central", fsc: "Finance & Supply Chain Management (F&O)", sales: "Sales & Customer Insights", service: "Customer Service / Field Service / Contact Center", crm: "Sales / Customer Service" };
const unique = (values: string[]) => [...new Set(values.map(v => v.trim()).filter(Boolean))];
export function getPartnerSelectionFacts(partner: SelectionPartner, productKey?: string | null): SelectionFact[] {
  const db = "product_filters" in partner ? partner : null;
  const filters = db?.product_filters || ("productFilters" in partner ? partner.productFilters : {}) || {};
  const selected = productKey ? (filters as Record<string, ProductFilterInput | undefined>)[productKey] : undefined;
  const scoped = productKey ? (selected ? [selected] : []) : Object.values(filters).filter(Boolean) as ProductFilterInput[];
  const deliveries = scoped.map(f => (f as ProductFilterInput & { deliveryProfile?: DeliveryProfileValue }).deliveryProfile).filter((d): d is DeliveryProfileValue => !!d);
  const products = productKey ? (selected && labels[productKey] ? [labels[productKey]] : []) : unique([...(partner.applications || []).map(displayApplicationName), ...Object.keys(filters).map(k => labels[k] || "")]);
  const industries = unique(scoped.flatMap(f => f.industries || []));
  const sizes = unique(scoped.flatMap(f => f.companySize || []));
  const geos = unique(scoped.flatMap(f => typeof f.geography === "string" ? [f.geography] : f.geography || []));
  const result: SelectionFact[] = [];
  const add = (label: string, values: string[]) => { const value = unique(values).join("; "); if (value) result.push({ label, value }); };
  add("Produktområde", products);
  add("Bransch", industries.length ? industries : productKey ? [] : partner.industries || []);
  add("Typisk kundstorlek", sizes.length ? [`${sizes.join(", ")} anställda`] : deliveries.map(d => d.typicalCustomers || ""));
  add("Geografisk kapacitet", geos.length ? geos : productKey ? [] : typeof partner.geography === "string" ? [partner.geography] : partner.geography || []);
  add("Implementationskompetens", deliveries.map(d => d.typicalProjects || d.deliveryModel || ""));
  if (!result.some(r => r.label === "Implementationskompetens")) {
    const count = productKey ? db?.implementations_per_app?.[labels[productKey]] || db?.implementations_per_app?.[productKey] : db?.implementations_done;
    if (count) add("Implementationskompetens", [`Registrerad implementationserfarenhet: ${count}`]);
  }
  add("Förvaltning/support", deliveries.map(d => d.managedServices || d.furtherDevelopment || ""));
  const apps = (db?.industry_apps || []).filter(a => !productKey || selected?.industries?.includes(a.industry));
  add("Relevant specialisering", [...scoped.map(f => f.keyPoints || ""), ...apps.map(a => `${a.name} (${a.industry})`), ...(!productKey && db?.key_differentiators_source === "partner" ? db.key_differentiators || [] : [])]);
  return result;
}
