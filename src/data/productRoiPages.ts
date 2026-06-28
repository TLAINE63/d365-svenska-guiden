// Mappar varje produkt till sin dedikerade ROI/TCO-kalkylator-sida i Kunskapscentret.
// Knapparna på produktsidorna länkar hit, och produktsidan visar bara en CTA-sektion
// (i stil med Matchningstest-CTA:n) som leder till kalkylatorn.

import type { ProductRoiKey } from "@/data/productRoiConfigs";

export interface ProductRoiPageMeta {
  /** Kanonisk URL till ROI/TCO-kalkylatorn. */
  path: string;
  /** URL till tillhörande produktsida (för breadcrumbs). */
  productPath: string;
  /** Produktnamn använt i breadcrumbs / hero. */
  productName: string;
  /** Kort produktnamn (rubrik). */
  productShort: string;
}

export const PRODUCT_ROI_PAGES: Record<ProductRoiKey, ProductRoiPageMeta> = {
  "business-central": {
    path: "/businesscentral/roi-kalkylator/",
    productPath: "/businesscentral/",
    productName: "Business Central",
    productShort: "Business Central",
  },
  "finance-scm": {
    path: "/finance-supply-chain/roi-kalkylator/",
    productPath: "/finance-supply-chain/",
    productName: "Dynamics 365 Finance & Supply Chain Management",
    productShort: "F&SCM",
  },
  sales: {
    path: "/d365sales/roi-kalkylator/",
    productPath: "/d365sales/",
    productName: "Dynamics 365 Sales",
    productShort: "Sales",
  },
  "customer-service": {
    path: "/d365customerservice/roi-kalkylator/",
    productPath: "/d365customerservice/",
    productName: "Dynamics 365 Customer Service",
    productShort: "Customer Service",
  },
  "customer-insights": {
    path: "/d365marketing/roi-kalkylator/",
    productPath: "/d365marketing/",
    productName: "Dynamics 365 Customer Insights",
    productShort: "Customer Insights",
  },
  "contact-center": {
    path: "/d365contactcenter/roi-kalkylator/",
    productPath: "/d365contactcenter/",
    productName: "Dynamics 365 Contact Center",
    productShort: "Contact Center",
  },
  "field-service": {
    path: "/d365fieldservice/roi-kalkylator/",
    productPath: "/d365fieldservice/",
    productName: "Dynamics 365 Field Service",
    productShort: "Field Service",
  },
};
