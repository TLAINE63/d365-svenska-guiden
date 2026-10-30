import { COMPETENCY_AREAS, LEVEL_META, type CompetencyArea, type CompetencyLevel } from "@/lib/extendedCompetencies";
import { SUPPORT_LEVEL_META, type SupportLevel, type DeliveryProfileValue } from "@/data/deliveryProfileFields";

/**
 * Sprint 1.1: extra filter i partnerväljaren som återanvänder befintliga partneruppgifter.
 * - Uppdragstyp: partnerns egna leveransbeskrivningar per produkt (typiska projekt, vidareutveckling, förvaltning).
 * - Leveransform: d365.se:s bedömda supportnivå per produkt (Projektfokus, Förvaltningserbjudande, Livscykelpartner).
 * - Kompetens: d365.se:s utökade kompetensområden med dokumenterad nivå (inte "Ej bekräftad").
 * Inga kommersiella fält används.
 */
export type AssignmentType = "projekt" | "vidareutveckling" | "forvaltning";

export const ASSIGNMENT_TYPES: { value: AssignmentType; label: string; field: keyof DeliveryProfileValue }[] = [
  { value: "projekt", label: "Införande och projekt", field: "typicalProjects" },
  { value: "vidareutveckling", label: "Vidareutveckling", field: "furtherDevelopment" },
  { value: "forvaltning", label: "Support och förvaltning", field: "managedServices" },
];

export const DELIVERY_FORMS: { value: SupportLevel; label: string }[] = (
  ["project_focus", "managed_offering", "lifecycle_partner"] as SupportLevel[]
).map((v) => ({ value: v, label: SUPPORT_LEVEL_META[v].label }));

export const COMPETENCE_OPTIONS: { value: CompetencyArea; label: string }[] = COMPETENCY_AREAS.map((a) => ({ value: a.key, label: a.label }));

const MIN_TEXT = 40;
const LEVEL_RANK: Record<SupportLevel, number> = { project_focus: 1, managed_offering: 2, lifecycle_partner: 3 };

interface FilterablePartner {
  product_filters?: Record<string, { deliveryProfile?: DeliveryProfileValue | null } | null | undefined> | null;
  extended_competencies?: Partial<Record<CompetencyArea, CompetencyLevel | null>> | null;
}

function profiles(p: FilterablePartner, productKeys: string[]): DeliveryProfileValue[] {
  const pf = p.product_filters || {};
  const keys = productKeys.length ? productKeys : Object.keys(pf);
  return keys.map((k) => pf[k]?.deliveryProfile).filter((v): v is DeliveryProfileValue => !!v);
}

export function matchesAssignmentType(p: FilterablePartner, type: AssignmentType | null, productKeys: string[] = []): boolean {
  if (!type) return true;
  const field = ASSIGNMENT_TYPES.find((a) => a.value === type)!.field;
  return profiles(p, productKeys).some((dp) => String(dp[field] ?? "").trim().length >= MIN_TEXT);
}

/** Kumulativt: Förvaltningserbjudande matchar även Livscykelpartner. */
export function matchesDeliveryForm(p: FilterablePartner, form: SupportLevel | null, productKeys: string[] = []): boolean {
  if (!form) return true;
  return profiles(p, productKeys).some((dp) => !!dp.supportLevel && LEVEL_RANK[dp.supportLevel] >= LEVEL_RANK[form]);
}

/** Bara dokumenterad nivå räknas, aldrig "Ej bekräftad". */
export function matchesCompetence(p: FilterablePartner, area: CompetencyArea | null): boolean {
  if (!area) return true;
  const lvl = p.extended_competencies?.[area];
  return !!lvl && LEVEL_META[lvl].rank >= 2;
}
