/**
 * Köparkategorier för partnerlistan på /valjdynamics365partner/.
 * Härleds enbart från vad partnern själv anger (produkter och branscher),
 * påverkar aldrig ordning eller ranking.
 */
export type PartnerCategoryKey = "fscm" | "bc" | "crm" | "industri";

export const PARTNER_CATEGORIES: { key: PartnerCategoryKey; label: string }[] = [
  { key: "fscm", label: "F&SCM / Enterprise ERP" },
  { key: "bc", label: "Business Central" },
  { key: "crm", label: "CRM / Customer Service" },
  { key: "industri", label: "Tillverkning & Industri" },
];

const FSCM = /^(finance|supply chain management|f&scm|f&o|finance & scm|finance & supply chain)/i;
const BC = /^business central/i;
const CRM = /^(sales|customer service|field service|contact center|customer insights)/i;
const INDUSTRI = /^(tillverkningsindustri|livsmedel & processindustri)$/i;

export function partnerCategoryKeys(p: { applications?: string[] | null; industries?: string[] | null }): PartnerCategoryKey[] {
  const apps = Array.isArray(p.applications) ? p.applications : [];
  const inds = Array.isArray(p.industries) ? p.industries : [];
  const keys: PartnerCategoryKey[] = [];
  if (apps.some((a) => FSCM.test(a.trim()))) keys.push("fscm");
  if (apps.some((a) => BC.test(a.trim()))) keys.push("bc");
  if (apps.some((a) => CRM.test(a.trim()))) keys.push("crm");
  if (inds.some((i) => INDUSTRI.test(i.trim()))) keys.push("industri");
  return keys;
}

export function partnerCategoryLabel(key: PartnerCategoryKey): string {
  return PARTNER_CATEGORIES.find((c) => c.key === key)!.label;
}
