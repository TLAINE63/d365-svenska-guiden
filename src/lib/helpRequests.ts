/**
 * Ärenden från sajtens hjälpvägar (rådgivningsärenden via PlanContactDialog advisory).
 * Härleder "valt behov" och "Dynamics 365-produkt" ur besökarens strukturerade val
 * (advisory_cases.journey_selection). Äldre ärenden utan sparade val faller tillbaka
 * på det delade underlaget och hjälpvägens rubrik. Inget gissas fram ur fritextmeddelandet.
 */
import { BUSINESS_NEEDS } from "@/lib/solutionNeeds";
import { EXISTING_OPTIONS } from "@/lib/existingDynamicsPaths";
import { PLACEMENT_LABEL } from "@/lib/advisory";

export type Selection = Record<string, unknown>;

/** Dynamics 365-produkter i den ordning de söks i underlaget. Längre namn först så att "Finance & Supply Chain Management" vinner över "Finance". */
export const D365_PRODUCT_NAMES = [
  "Finance & Supply Chain Management",
  "Supply Chain Management",
  "Business Central",
  "Customer Service",
  "Customer Insights",
  "Field Service",
  "Contact Center",
  "Project Operations",
  "Human Resources",
  "Commerce",
  "Finance",
  "Sales",
];

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

/** Valt behov, i besökarens ordval. null om hjälpvägen inte frågar efter något behov. */
export function selectedNeed(selection: Selection | null | undefined): string | null {
  const s = selection || {};
  const need = str(s.need);
  if (need) return BUSINESS_NEEDS.find((n) => n.key === need)?.label ?? need;
  const option = str(s.option);
  if (option) return EXISTING_OPTIONS.find((o) => o.key === option)?.label ?? option;
  const help = str(s.help);
  if (help) return help;
  const subject = str(s.subject);
  if (subject) return subject;
  const role = str(s.role);
  if (role) return [role, str(s.specialism)].filter(Boolean).join(", ");
  const areas = str(s.areas);
  if (areas) return areas.split(",").map((a) => a.trim()).filter(Boolean).join(", ");
  const ctx = str(s.intent_context);
  if (ctx) return ctx;
  return null;
}

/** Hittar produktnamn i en text, utan dubbletter ("Finance & Supply Chain Management" räknas inte även som "Finance"). */
export function productsInText(text: string): string[] {
  let rest = ` ${text} `;
  const found: string[] = [];
  for (const name of D365_PRODUCT_NAMES) {
    const re = new RegExp(`(^|[^\\p{L}])${name.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&")}(?![\\p{L}])`, "u");
    if (re.test(rest)) {
      found.push(name);
      rest = rest.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&"), "g"), " ");
    }
  }
  return found;
}

/**
 * Dynamics 365-produkt(er): först besökarens uttryckliga val (product, area),
 * annars produktnamn i det delade underlaget (t.ex. "Byggd för: Business Central").
 */
export function selectedProducts(selection: Selection | null | undefined, project?: Record<string, unknown> | null): string[] {
  const s = selection || {};
  const explicit = [str(s.product), str(s.area)].filter((v): v is string => !!v);
  if (explicit.length) return [...new Set(explicit)];
  const lines = Object.values(project || {}).flatMap((v) => (Array.isArray(v) ? v : [v])).filter((v): v is string => typeof v === "string");
  const byggd = lines.find((l) => /^Byggd för:/i.test(l));
  return productsInText(byggd ?? lines.join(" \n "));
}

export function helpPathLabel(placement: string | null | undefined): string {
  if (!placement) return "Min D365-plan";
  return PLACEMENT_LABEL[placement] ?? placement;
}

/** Nycklar med uppräknade värden som får sparas från hjälpvägens val. Fritext följer aldrig med här. */
export function cleanSelection(meta: Record<string, unknown> | null | undefined): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(meta || {})) {
    if (Object.keys(out).length >= 20 || !/^[a-z_]{1,40}$/.test(k)) continue;
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 120);
    else if (typeof v === "number" || typeof v === "boolean") out[k] = v;
  }
  return out;
}
