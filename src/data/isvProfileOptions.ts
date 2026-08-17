// Val som ISV-leverantörer kan göra i sin profileringslänk.
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

/** Dynamics 365-applikationer som en ISV-lösning kan vara byggd för. */
export const ISV_PRODUCTS: string[] = [
  "Business Central",
  "Finance & Supply Chain Management",
  "Sales",
  "Customer Insights (Marketing)",
  "Customer Service",
  "Field Service",
  "Contact Center",
  "Project Operations",
  "Commerce",
  "Human Resources",
];

/** Branscher som en ISV-lösning kan vara inriktad mot (samma lista som partners). */
export const ISV_INDUSTRIES: string[] = STANDARD_INDUSTRIES.map((i) => i.name);
