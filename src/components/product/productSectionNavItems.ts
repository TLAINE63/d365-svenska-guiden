import type { ProductSectionNavItem } from "./ProductSectionNav";

// "På sidan"-menyer för produktsidorna. `match` = början av sektionens h2-text.
const tail = (product: string): ProductSectionNavItem[] => [
  { id: "vanliga-fragor", label: "Vanliga frågor", match: "Vanliga frågor" },
  { id: "pricing", label: "Pris och licenser" },
  { id: "kostnad", label: "Vad kostar det?", match: "Vad kostar det" },
  { id: "jamfor-alternativ", label: "Jämför alternativ", match: `Jämför ${product}` },
  { id: "tillaggslosningar", label: "Tilläggslösningar", match: "Vad hanterar" },
  { id: "partners", label: "Hitta partner" },
];

export const FSCM_SECTIONS: ProductSectionNavItem[] = [
  { id: "oversikt", label: "Översikt", match: "Kort svar" },
  { id: "fscm-beslut", label: "Var står ni i beslutet?", match: "Var befinner ni er" },
  { id: "fscm-passform", label: "Passar F&SCM?", match: "Passar Finance" },
  { id: "vanliga-fragor", label: "Vanliga frågor", match: "Vanliga frågor" },
  { id: "ai-agenter", label: "AI och agenter", match: "AI & Agenter" },
  { id: "pricing", label: "Pris och licenser" },
  { id: "kostnad", label: "Vad kostar det?", match: "Vad kostar det" },
  { id: "jamfor-alternativ", label: "Jämför alternativ", match: "Jämför Finance" },
  { id: "roi-tco", label: "Totalkostnad och payback" },
  { id: "tillaggslosningar", label: "Tilläggslösningar", match: "Vad hanterar" },
  { id: "partners", label: "Hitta partner" },
];

export const SALES_SECTIONS: ProductSectionNavItem[] = [
  { id: "oversikt", label: "Översikt", match: "Behöver vi byta" },
  { id: "vad-ar", label: "Vad är Sales?", match: "Vad är Dynamics 365 Sales" },
  ...tail("D365 Sales"),
];

export const SERVICE_SECTIONS: ProductSectionNavItem[] = [
  { id: "oversikt", label: "Översikt", match: "Var fastnar" },
  { id: "vad-ar", label: "Vad är Customer Service?", match: "Vad är Dynamics 365 Customer Service" },
  ...tail("D365 Customer Service"),
];

export const FIELD_SECTIONS: ProductSectionNavItem[] = [
  { id: "oversikt", label: "Översikt", match: "Var fastnar" },
  { id: "vad-ar", label: "Vad är Field Service?", match: "Vad är Dynamics 365 Field Service" },
  { id: "implementation", label: "Tid och införande", match: "Hur lång tid tar" },
  ...tail("D365 Field Service"),
];

export const CONTACT_SECTIONS: ProductSectionNavItem[] = [
  { id: "oversikt", label: "Översikt", match: "Var fastnar" },
  { id: "vad-ar", label: "Vad är Contact Center?", match: "Vad är Dynamics 365 Contact Center" },
  { id: "implementation", label: "Tid och införande", match: "Hur lång tid tar" },
  ...tail("D365 Contact Center"),
];

export const INSIGHTS_SECTIONS: ProductSectionNavItem[] = [
  { id: "oversikt", label: "Översikt", match: "När passar lösningen" },
  { id: "ci-beslut", label: "Journeys, Data eller båda?", match: "Journeys, Data" },
  { id: "vad-ar", label: "Vad är Customer Insights?", match: "Vad är Dynamics 365 Customer Insights" },
  { id: "implementation", label: "Tid och införande", match: "Hur lång tid tar" },
  ...tail("Customer Insights"),
];

const standalone = (name: string, extra: ProductSectionNavItem[] = []): ProductSectionNavItem[] => [
  { id: "oversikt", label: "Översikt", match: `Vad är Dynamics 365 ${name}` },
  ...extra,
  { id: "kopmanual", label: "Köparmanual", match: "Köparmanual" },
  { id: "kostnad", label: "Vad kostar det?", match: "Vad kostar det" },
  { id: "partners", label: "Hitta partner" },
  { id: "fortsatt-utvardering", label: "Fortsätt utvärderingen", match: "Fortsätt er utvärdering" },
];

export const COMMERCE_SECTIONS = standalone("Commerce");
export const HR_SECTIONS = standalone("Human Resources");
export const PROJOPS_SECTIONS = standalone("Project Operations", [
  { id: "passform", label: "Passar Project Operations?", match: "När passar Project Operations" },
  { id: "behov", label: "Vilka behov stöds?", match: "Vilka behov" },
  { id: "risker", label: "Risker", match: "Risker att tänka på" },
]);
