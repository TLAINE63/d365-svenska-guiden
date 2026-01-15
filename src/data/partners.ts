export interface IndustryExpertise {
  industry: string;
  application?: string; // Om tomt gäller det alla applikationer
  description: string;
}

export interface ProductFilter {
  industries: string[]; // Branschfokus 1 & 2 - används för filtrering
  secondaryIndustries?: string[]; // "Erfarenhet även inom" - visas på profil, ej filtrering
  companySize: string[];
  geography: string;
  ranking: number;
}

export interface Partner {
  name: string;
  logo: string;
  website: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  description: string;
  applications: string[];
  industries: string[];
  companySize: string[];
  revenue: string[];
  geography: string;
  rankings?: {
    bc?: number;
    fsc?: number;
    crm?: number;
  };
  industryExpertise?: IndustryExpertise[];
  // Product-specific filtering data from Excel
  productFilters?: {
    bc?: ProductFilter;
    fsc?: ProductFilter;
    crm?: ProductFilter;
  };
}

export const allIndustries = [
  "Tillverkningsindustri",
  "Livsmedel & Processindustri",
  "Grossist & Distribution",
  "Retail & E-handel",
  "Konsulttjänster",
  "Bygg & Entreprenad",
  "Fastighet & Förvaltning",
  "Energi & Utilities",
  "Finans & Försäkring",
  "Life Science / Medtech",
  "Telekom & IT-tjänster",
  "Logistik & Transport",
  "Media & Publishing",
  "Jordbruk & Skogsbruk",
  "Hälsa- & sjukvård",
  "Non-profit / Organisationer",
  "Utbildning",
  "Offentlig sektor",
];

// CRM applications for filtering
export const crmApplications = ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"];

// Company size options for filtering
export const companySizes = [
  "1-49",
  "50-99",
  "100-249",
  "250-999",
  "1.000-4.999",
  ">5.000"
];

// Revenue options for filtering
export const revenueOptions = [
  "1-24 MSEK",
  "25-99 MSEK",
  "100-499 MSEK",
  "500-999 MSEK",
  "1.000-4.999 MSEK",
  ">5.000 MSEK"
];

// Geography options for filtering
export const geographyOptions = [
  "Sverige",
  "Norden",
  "Europa",
  "Internationellt"
];

// Helper function to get cumulative geography display text
export const getCumulativeGeographyDisplay = (geography: string): string => {
  switch (geography) {
    case "Sverige":
      return "Sverige";
    case "Norden":
      return "Sverige och Norden";
    case "Europa":
      return "Sverige, Norden och Europa";
    case "Internationellt":
      return "Sverige, Norden, Europa och Internationell täckning";
    default:
      return geography;
  }
};
