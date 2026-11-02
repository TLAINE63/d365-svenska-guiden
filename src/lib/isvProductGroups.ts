/** Synliga produktgrupper i tilläggskatalogen så befintliga kunder känner igen sitt system direkt. */
export const ISV_PRODUCT_GROUPS: { label: string; products: string[]; collapsed?: boolean }[] = [
  { label: "Affärssystem (ERP)", products: ["Business Central", "Finance & Supply Chain Management"] },
  {
    label: "CRM och kundmöte",
    products: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Field Service", "Contact Center"],
  },
  { label: "Fler appar", products: ["Project Operations", "Commerce", "Human Resources"], collapsed: true },
];

/** Antal behov som visas direkt; resten ligger bakom "Fler behov". */
export const ISV_TOP_NEEDS = 8;
