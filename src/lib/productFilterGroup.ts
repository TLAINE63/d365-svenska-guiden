// Shared mapping between D365 application names and the coarser
// "product filter" groups used by the partner-compare page URL.

export const PRODUCT_FILTER_GROUP = {
  bc: {
    label: "Business Central",
    apps: ["Business Central"],
  },
  fsc: {
    label: "Finance & Supply Chain Management",
    apps: ["Finance", "Supply Chain Management", "Finance & Supply Chain Management"],
  },
  sales: {
    label: "Sales & Customer Insights",
    apps: ["Sales", "Customer Insights (Marketing)", "Marketing"],
  },
  service: {
    label: "Customer Service / Field Service / Contact Center",
    apps: ["Customer Service", "Field Service", "Contact Center"],
  },
} as const;

export type ProductFilterKey = keyof typeof PRODUCT_FILTER_GROUP;

export const appToProductFilterKey = (app: string): ProductFilterKey | null => {
  const a = app.trim();
  for (const [key, group] of Object.entries(PRODUCT_FILTER_GROUP) as [
    ProductFilterKey,
    (typeof PRODUCT_FILTER_GROUP)[ProductFilterKey],
  ][]) {
    if ((group.apps as readonly string[]).includes(a)) return key;
  }
  return null;
};

/** Given a list of application names, return the unique product filter keys. */
export const appsToProductFilterKeys = (apps: string[]): ProductFilterKey[] => {
  const keys = new Set<ProductFilterKey>();
  for (const app of apps) {
    const k = appToProductFilterKey(app);
    if (k) keys.add(k);
  }
  return Array.from(keys);
};
