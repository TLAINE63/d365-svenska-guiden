export const PRODUCT_GROUPS = [
  "business-central",
  "finance-scm",
  "crm-sales",
  "crm-service",
  "customer-insights",
  "human-resources",
  "project-operations",
  "commerce",
  "power-platform",
  "microsoft-ai",
  "ovrigt",
] as const;

export const QUESTION_TYPES = [
  "vad-ar",
  "demo",
  "pris-licens",
  "implementering",
  "integration",
  "migrering",
  "nyheter",
  "tips-och-trick",
] as const;

export type ProductGroup = (typeof PRODUCT_GROUPS)[number];
export type QuestionType = (typeof QUESTION_TYPES)[number];
