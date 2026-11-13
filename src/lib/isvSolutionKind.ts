/**
 * Lösningstyp för tilläggsprodukter (Branschlösning, Funktionellt tillägg, Teknisk integration).
 * Redaktionellt satt värde (isv_solutions.solution_kind) vinner; annars härleds typen
 * deterministiskt från kategori och leveransform. Endast visning/filter, aldrig ranking.
 */
export type IsvSolutionKind = "bransch" | "funktion" | "teknik";

export const ISV_SOLUTION_KINDS: IsvSolutionKind[] = ["bransch", "funktion", "teknik"];

export const ISV_SOLUTION_KIND_LABEL: Record<IsvSolutionKind, string> = {
  bransch: "Branschlösning",
  funktion: "Funktionellt tillägg",
  teknik: "Teknisk integration",
};

export const ISV_SOLUTION_KIND_HELP: Record<IsvSolutionKind, string> = {
  bransch: "Omfattande lösning som formar stora delar av verksamheten i en viss bransch.",
  funktion: "Avgränsat tillägg som förstärker en specifik process i standardsystemet.",
  teknik: "Integration, datakvalitet, säkerhet eller automation som stöttar plattformen.",
};

const TECH_CATEGORIES = new Set([
  "Integration / iPaaS",
  "MDM & datakvalitet",
  "CRM datakvalitet",
  "Backup / restore",
  "Security / GRC",
  "AI / automation",
]);

export function solutionKindOf(s: { solutionKind?: string | null; category?: string | null; deliveryModel?: string | null }): IsvSolutionKind {
  if (s.solutionKind && (ISV_SOLUTION_KINDS as string[]).includes(s.solutionKind)) return s.solutionKind as IsvSolutionKind;
  if (s.category === "Branschpaket" || s.deliveryModel === "industry_solution") return "bransch";
  if (s.category && TECH_CATEGORIES.has(s.category)) return "teknik";
  return "funktion";
}
