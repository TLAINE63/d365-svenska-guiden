// ==================== TYPES ====================

export interface IndustryExpertise {
  industry: string;
  application?: string;
  description: string;
}

export interface ProductFilter {
  industries: string[];
  secondaryIndustries?: string[];
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
  productFilters?: {
    bc?: ProductFilter;
    fsc?: ProductFilter;
    crm?: ProductFilter;
  };
}

// ==================== CONSTANTS ====================

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
  "Medlemsorganisationer",
  "Utbildning",
  "Offentlig sektor",
  "Uthyrningsverksamhet",
];

// CRM applications for filtering
export const crmApplications = [
  "Sales",
  "Customer Service",
  "Customer Insights (Marketing)",
  "Field Service",
  "Contact Center",
  "Project Operations",
];

// Company size options for filtering
export const companySizes = [
  "1-49",
  "50-99",
  "100-249",
  "250-999",
  "1.000-4.999",
  ">5.000",
];

// Revenue options for filtering
export const revenueOptions = [
  "1-24 MSEK",
  "25-99 MSEK",
  "100-499 MSEK",
  "500-999 MSEK",
  "1.000-4.999 MSEK",
  ">5.000 MSEK",
];

// Geography options for filtering
export const geographyOptions = [
  "Sverige",
  "Norden",
  "Europa",
  "Övriga världen",
];

// ==================== HELPER FUNCTIONS ====================

// Helper function to get cumulative geography display text
export const getCumulativeGeographyDisplay = (geography: string): string => {
  switch (geography) {
    case "Sverige":
      return "Sverige";
    case "Norden":
      return "Sverige och Norden";
    case "Europa":
      return "Sverige, Norden och Europa";
    case "Övriga världen":
      return "Sverige, Norden, Europa och övriga världen";
    case "Internationellt":
      return "Sverige, Norden, Europa och övriga världen";
    default:
      return geography;
  }
};
