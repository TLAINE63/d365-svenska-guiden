export const VIDEO_PRODUCT_GROUPS = [
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

export type VideoProductGroup = (typeof VIDEO_PRODUCT_GROUPS)[number];

export const VIDEO_PRODUCT_LABELS: Record<VideoProductGroup, string> = {
  "business-central": "Business Central",
  "finance-scm": "Finance & Supply Chain",
  "crm-sales": "Sales",
  "crm-service": "Customer Service",
  "customer-insights": "Customer Insights (Marketing Automation)",
  "human-resources": "Human Resources",
  "project-operations": "Project Operations",
  commerce: "Commerce",
  "power-platform": "Power Platform",
  "microsoft-ai": "AI & Copilot",
  ovrigt: "Övrigt",
};

export const VIDEO_QUESTION_TYPES = [
  "vad-ar",
  "demo",
  "pris-licens",
  "implementering",
  "integration",
  "migrering",
  "nyheter",
  "tips-och-trick",
] as const;

export type VideoQuestionType = (typeof VIDEO_QUESTION_TYPES)[number];

export const VIDEO_QUESTION_LABELS: Record<VideoQuestionType, string> = {
  "vad-ar": "Vad är det?",
  demo: "Demo & genomgång",
  "pris-licens": "Pris & licenser",
  implementering: "Implementering",
  integration: "Integration",
  migrering: "Migrering & uppgradering",
  nyheter: "Nyheter & releaser",
  "tips-och-trick": "Tips & trick",
};

export function videoProductLabel(key: string): string {
  return VIDEO_PRODUCT_LABELS[key as VideoProductGroup] ?? key;
}
export function videoQuestionLabel(key: string): string {
  return VIDEO_QUESTION_LABELS[key as VideoQuestionType] ?? key;
}
