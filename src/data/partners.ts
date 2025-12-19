export interface Partner {
  name: string;
  logo: string;
  website: string;
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
}

export const partners: Partner[] = [
  // Business Central Partners (Paying)
  {
    name: "4PS Sweden",
    logo: "",
    website: "https://www.4ps.se/",
    description: "4PS är en ledande leverantör av branschspecifik ERP-programvara för bygg-, installations- och serviceföretag. Deras lösning 4PS Construct är byggd på Microsoft Dynamics 365 Business Central och erbjuder end-to-end-funktionalitet med 100% realtidsvisibilitet på projekt.",
    applications: ["Business Central"],
    industries: ["Bygg & Entreprenad"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 1 }
  },
  {
    name: "Bisqo",
    logo: "https://bisqo.se/wp-content/uploads/2022/01/bisqo-logo.svg",
    website: "https://www.bisqo.se/businesscentral/",
    description: "Bisqo är experter inom Dynamics 365 Business Central och CRM på Power Platform. Deras strategi bygger på en kraftfull kombination av ERP och CRM.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Handel (Retail & eCommerce)", "Konsulttjänster"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 3, crm: 1 }
  },
  {
    name: "InBiz",
    logo: "https://www.inbiz.se/wp-content/uploads/2021/08/inbiz-logo.png",
    website: "https://www.inbiz.se/microsoft-partner/",
    description: "InBiz är din trygga partner för Microsoft Dynamics 365 Business Central sedan 2005.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Konsulttjänster"],
    companySize: ["1-49", "50-99", "250-999"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 2 }
  },
  {
    name: "JMA Maskindata",
    logo: "https://jma.se/wp-content/uploads/2022/01/jma-logo.svg",
    website: "https://jma.se/affarssystem/",
    description: "JMA Maskindata är specialister på affärssystem för tillverkande företag med lång erfarenhet av Microsoft Dynamics.",
    applications: ["Business Central"],
    industries: ["Bygg & Entreprenad", "Grossist/Distribution", "Transport & Logistik"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 2 }
  },
  {
    name: "Knowit",
    logo: "https://www.knowit.se/globalassets/knowit-logo.svg",
    website: "https://www.knowit.se/vart-erbjudande/solutions/",
    description: "Knowit är en nordisk digitaliseringskonsult med bred Microsoft-kompetens och fokus på hållbar digitalisering.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Bank & Försäkring", "Hälso- & sjukvård", "Konsulttjänster"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 6, fsc: 1, crm: 1 }
  },
  {
    name: "NAB Solutions",
    logo: "https://www.nabsolutions.se/wp-content/uploads/2021/03/nab-logo.png",
    website: "https://www.nabsolutions.se/dynamics-365-business-central/",
    description: "NAB Solutions är specialister på Dynamics 365 Business Central och CRM med lång erfarenhet av implementationer för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Medlemsorganisationer", "Nonprofit", "Tillverkningsindustrin", "Utbildning"],
    companySize: ["1-49", "50-99", "250-999"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 1, crm: 1 }
  },
  {
    name: "Navcite",
    logo: "https://navcite.se/wp-content/uploads/2022/01/navcite-logo.svg",
    website: "https://www.navcite.com/microsoft-business-central/",
    description: "Navcite kombinerar 'Small company feeling – Big company experience' och erbjuder affärssystem med Infor M3 och Microsoft Business Central.",
    applications: ["Business Central"],
    industries: ["Konsulttjänster", "Tillverkningsindustrin", "Grossist/Distribution"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 4 }
  },
  {
    name: "Norteam",
    logo: "",
    website: "https://norteam.se/",
    description: "Norteam är en Microsoft Dynamics 365-partner med fokus på Business Central och CRM för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Grossist/Distribution", "Handel (Retail & eCommerce)"],
    companySize: ["1-49", "50-99", "100-249"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK"],
    geography: "Sverige",
    rankings: { bc: 3, crm: 5 }
  },
  // Finance & Supply Chain Partners (Paying)
  {
    name: "BE-terna",
    logo: "https://www.be-terna.com/hubfs/BE-terna%20Logo.svg",
    website: "https://www.be-terna.com/sv/losningar/microsoft",
    description: "BE-terna är en internationell partner som vägleder företag till en säker digital framtid.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Transport & Logistik", "Grossist/Distribution"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Europa",
    rankings: { fsc: 1, crm: 2 }
  },
  {
    name: "Implema",
    logo: "https://www.implema.se/wp-content/uploads/2021/03/implema-logo.svg",
    website: "https://implema.se/microsoft-dynamics/",
    description: "Implema hjälper företag att accelerera sin affär med mottot 'Snabbt, säkert och redo för framtiden'.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Handel (Retail & eCommerce)"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 2, crm: 6 }
  },
  {
    name: "Innofactor",
    logo: "https://www.innofactor.com/hubfs/Innofactor_Logo.svg",
    website: "https://www.innofactor.com/se/vad-vi-gor/losningar/dynamics-365/",
    description: "Innofactor är en Microsoft Cloud Solutions Partner med Microsofts högsta partnerbeteckning.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Hälso- & sjukvård", "Energi & Utilities", "Utbildning"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 1, crm: 8 }
  },
  {
    name: "Nexer",
    logo: "https://nexergroup.com/wp-content/uploads/2022/01/nexer-logo.svg",
    website: "https://nexergroup.com/sv/tjanster/dynamics-365/",
    description: "Nexer är en svensk IT-konsult med global räckvidd och stark kompetens inom Dynamics 365.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Offentlig sektor", "Handel (Retail & eCommerce)"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 2, crm: 3 }
  },
  // CRM Partners (Paying)
  {
    name: "CRM Konsulterna",
    logo: "https://crmkonsulterna.se/wp-content/uploads/2023/01/crmk-logo.svg",
    website: "https://www.crmkonsulterna.se/dynamics-365/",
    description: "CRM Konsulterna utsågs till Dynamics 365 Customer Engagement Partner of the Year 2023 av Microsoft Sverige.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Handel (Retail & eCommerce)", "Offentlig sektor"],
    companySize: ["1-49", "50-99", "100-249"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK"],
    geography: "Sverige",
    rankings: { crm: 5 }
  },
  {
    name: "Nemely",
    logo: "https://nemely.se/wp-content/uploads/2022/01/nemely-logo.svg",
    website: "https://nemely.se/dynamics-365/",
    description: "Nemely är en Microsoft Dynamics 365 Partner specialiserad på CRM och kundengagemang.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Handel (Retail & eCommerce)", "Grossist/Distribution", "Konsulttjänster"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { crm: 3 }
  },
  {
    name: "Releye",
    logo: "https://releye.se/wp-content/uploads/2022/01/releye-logo.svg",
    website: "https://releye.se/dynamics-365/",
    description: "Releye är en Microsoft-partner med fokus på Dynamics 365 och Power Platform.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Handel (Retail & eCommerce)", "Konsulttjänster", "Grossist/Distribution"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { crm: 5 }
  },
  {
    name: "Sirocco Group",
    logo: "https://siroccogroup.com/wp-content/uploads/2022/01/sirocco-logo.svg",
    website: "https://www.siroccogroup.com/microsoft-dynamics-365/",
    description: "Sirocco Group är en internationell boutique-konsult och utvecklingsbyrå specialiserad på CRM och digital transformation.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Energi & Utilities", "Offentlig sektor"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { crm: 1 }
  },
  {
    name: "Sopra Steria",
    logo: "https://www.soprasteria.com/~/media/soprasteria/soprasteria-logo.svg",
    website: "https://www.soprasteria.se/losningar/microsoft",
    description: "Sopra Steria är en europeisk teknologikonsult med stark närvaro i Norden och omfattande Dynamics 365-kompetens.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Bank & Försäkring", "Energi & Utilities"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Europa",
    rankings: { fsc: 2, crm: 1 }
  }
];

// CRM applications for filtering
export const crmApplications = ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"];

// All unique industries from partners
export const allIndustries = [
  "Tillverkningsindustrin",
  "Handel (Retail & eCommerce)",
  "Grossist/Distribution",
  "Bank & Försäkring",
  "Bygg & Entreprenad",
  "Hälso- & sjukvård",
  "Life Science",
  "Konsulttjänster",
  "Offentlig sektor",
  "Energi & Utilities",
  "Transport & Logistik",
  "Fastigheter",
  "Medlemsorganisationer",
  "Utbildning",
  "Nonprofit"
];

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

// Helper function to get ranking for a product
export const getPartnerRanking = (partner: Partner, product: 'bc' | 'fsc' | 'crm'): number => {
  return partner.rankings?.[product] ?? 999;
};
