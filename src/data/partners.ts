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

// Betalande partners baserat på Excel december 2025
export const partners: Partner[] = [
  // ========== BUSINESS CENTRAL PARTNERS (Betalande) ==========
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
    rankings: { bc: 1 },
    productFilters: {
      bc: {
        industries: ["Bygg & Entreprenad"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Bygg & Entreprenad",
        application: "Business Central",
        description: "4PS har utvecklat en komplett branschlösning för bygg- och entreprenadföretag med projektstyrning, resursplanering och integrerad ekonomi. Över 20 års erfarenhet inom branschen."
      }
    ]
  },
  {
    name: "Bisqo",
    logo: "https://bisqo.se/wp-content/uploads/2022/01/bisqo-logo.svg",
    website: "https://www.bisqo.se/businesscentral/",
    description: "Bisqo är experter inom Dynamics 365 Business Central och CRM på Power Platform. Deras strategi bygger på en kraftfull kombination av ERP och CRM.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Retail & E-handel", "Konsulttjänster", "Tillverkningsindustri"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 3, crm: 1 },
    productFilters: {
      bc: {
        industries: ["Grossist & Distribution", "Retail & E-handel"],
        secondaryIndustries: ["Tillverkningsindustri", "Konsulttjänster"],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 3
      },
      crm: {
        industries: ["Grossist & Distribution", "Retail & E-handel"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Grossist & Distribution",
        description: "Stark erfarenhet av distributions- och grossistföretag med optimerade flöden för inköp, lager och försäljning."
      },
      {
        industry: "Retail & E-handel",
        description: "Lösningar för handelsföretag med e-handelsintegrationer, kassasystem och omnikanal-strategier."
      }
    ]
  },
  {
    name: "InBiz",
    logo: "https://www.inbiz.se/wp-content/uploads/2021/08/inbiz-logo.png",
    website: "https://www.inbiz.se/microsoft-partner/",
    description: "InBiz är din trygga partner för Microsoft Dynamics 365 Business Central sedan 2005.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustri", "Grossist & Distribution", "Livsmedel & Processindustri", "Konsulttjänster"],
    companySize: ["1-49", "50-99", "250-999"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 2 },
    productFilters: {
      bc: {
        industries: ["Tillverkningsindustri", "Grossist & Distribution"],
        secondaryIndustries: ["Livsmedel & Processindustri", "Konsulttjänster"],
        companySize: ["1-49", "50-99", "250-999"],
        geography: "Sverige",
        ranking: 2
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        application: "Business Central",
        description: "Över 15 års erfarenhet av tillverkande företag med fokus på legotillverkning och diskret tillverkning."
      }
    ]
  },
  {
    name: "JMA Maskindata",
    logo: "https://jma.se/wp-content/uploads/2022/01/jma-logo.svg",
    website: "https://jma.se/affarssystem/",
    description: "JMA Maskindata är specialister på affärssystem för tillverkande företag med lång erfarenhet av Microsoft Dynamics.",
    applications: ["Business Central"],
    industries: ["Bygg & Entreprenad", "Grossist & Distribution"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 2 },
    productFilters: {
      bc: {
        industries: ["Bygg & Entreprenad", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 2
      }
    },
    industryExpertise: [
      {
        industry: "Bygg & Entreprenad",
        application: "Business Central",
        description: "Lång erfarenhet av maskinuthyrning och byggföretag med fokus på projektredovisning och maskinhantering."
      }
    ]
  },
  {
    name: "Knowit",
    logo: "https://www.knowit.se/globalassets/knowit-logo.svg",
    website: "https://www.knowit.se/vart-erbjudande/solutions/",
    description: "Knowit är en nordisk digitaliseringskonsult med bred Microsoft-kompetens och fokus på hållbar digitalisering.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustri", "Bygg & Entreprenad", "Finans & Försäkring", "Grossist & Distribution"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 6, fsc: 1, crm: 1 },
    productFilters: {
      bc: {
        industries: ["Tillverkningsindustri", "Bygg & Entreprenad"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 6
      },
      fsc: {
        industries: ["Tillverkningsindustri", "Finans & Försäkring"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      },
      crm: {
        industries: ["Bygg & Entreprenad", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        description: "Bred erfarenhet av tillverkande företag med fokus på digitalisering av produktion och supply chain."
      },
      {
        industry: "Finans & Försäkring",
        application: "Finance & SCM",
        description: "Expertis inom finanssektorn med fokus på compliance, riskhantering och automatiserade finansprocesser."
      }
    ]
  },
  {
    name: "NAB Solutions",
    logo: "https://www.nabsolutions.se/wp-content/uploads/2021/03/nab-logo.png",
    website: "https://www.nabsolutions.se/dynamics-365-business-central/",
    description: "NAB Solutions är specialister på Dynamics 365 Business Central och CRM med lång erfarenhet av implementationer för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Tillverkningsindustri", "Life Science / Medtech", "Konsulttjänster"],
    companySize: ["1-49", "50-99", "250-999"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 1, crm: 1 },
    productFilters: {
      bc: {
        industries: ["Grossist & Distribution", "Tillverkningsindustri"],
        secondaryIndustries: ["Life Science / Medtech", "Konsulttjänster"],
        companySize: ["1-49", "50-99", "250-999"],
        geography: "Sverige",
        ranking: 1
      },
      crm: {
        industries: ["Grossist & Distribution", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Grossist & Distribution",
        description: "Specialiserade lösningar för grossister med lagerhantering, inköpsoptimering och EDI-integrationer."
      },
      {
        industry: "Tillverkningsindustri",
        application: "Business Central",
        description: "Produktionslösningar för tillverkande företag med BOM-hantering och kapacitetsplanering."
      }
    ]
  },
  {
    name: "Navcite",
    logo: "https://navcite.se/wp-content/uploads/2022/01/navcite-logo.svg",
    website: "https://www.navcite.com/microsoft-business-central/",
    description: "Navcite kombinerar 'Small company feeling – Big company experience' och erbjuder affärssystem med Infor M3 och Microsoft Business Central.",
    applications: ["Business Central"],
    industries: ["Grossist & Distribution", "Tillverkningsindustri"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 4 },
    productFilters: {
      bc: {
        industries: ["Grossist & Distribution", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 4
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        application: "Business Central",
        description: "Stark kompetens inom tillverkande företag med fokus på produktionsplanering och MRP."
      },
      {
        industry: "Grossist & Distribution",
        application: "Business Central",
        description: "Optimerade lösningar för grossister med lagerhantering, inköpsoptimering och EDI-integrationer."
      }
    ]
  },
  {
    name: "Norteam",
    logo: "",
    website: "https://norteam.se/",
    description: "Norteam är en Microsoft Dynamics 365-partner med fokus på Business Central och CRM för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Fastighet & Förvaltning"],
    companySize: ["1-49", "50-99", "100-249"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK"],
    geography: "Sverige",
    rankings: { bc: 3, crm: 5 },
    productFilters: {
      bc: {
        industries: ["Konsulttjänster", "Fastighet & Förvaltning"],
        secondaryIndustries: [],
        companySize: ["1-49", "50-99", "100-249"],
        geography: "Sverige",
        ranking: 3
      },
      crm: {
        industries: ["Konsulttjänster", "Fastighet & Förvaltning"],
        secondaryIndustries: [],
        companySize: ["1-49", "50-99", "100-249"],
        geography: "Sverige",
        ranking: 5
      }
    },
    industryExpertise: [
      {
        industry: "Konsulttjänster",
        description: "Expertis inom tjänsteföretag med fokus på projektredovisning, tidrapportering och resursplanering."
      },
      {
        industry: "Fastighet & Förvaltning",
        description: "Lösningar för fastighetsföretag med hyresadministration, underhållsplanering och objektshantering."
      }
    ]
  },

  // ========== FINANCE & SUPPLY CHAIN PARTNERS (Betalande) ==========
  {
    name: "BE-terna",
    logo: "https://www.be-terna.com/hubfs/BE-terna%20Logo.svg",
    website: "https://www.be-terna.com/sv/losningar/microsoft",
    description: "BE-terna är en internationell partner som vägleder företag till en säker digital framtid.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Finans & Försäkring", "Tillverkningsindustri", "Livsmedel & Processindustri"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Europa",
    rankings: { fsc: 1 },
    productFilters: {
      fsc: {
        industries: ["Grossist & Distribution", "Finans & Försäkring"],
        secondaryIndustries: ["Livsmedel & Processindustri", "Tillverkningsindustri"],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Europa",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        application: "Finance & SCM",
        description: "Internationell erfarenhet av komplex tillverkning med fokus på supply chain optimization, produktionsplanering och global utrullning."
      },
      {
        industry: "Grossist & Distribution",
        application: "Finance & SCM",
        description: "Optimerade distributionslösningar med avancerad lagerhantering och leverantörssamarbete."
      }
    ]
  },
  {
    name: "Implema",
    logo: "https://www.implema.se/wp-content/uploads/2021/03/implema-logo.svg",
    website: "https://implema.se/microsoft-dynamics/",
    description: "Implema hjälper företag att accelerera sin affär med mottot 'Snabbt, säkert och redo för framtiden'.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Retail & E-handel", "Tillverkningsindustri"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 2, crm: 6 },
    productFilters: {
      fsc: {
        industries: ["Grossist & Distribution", "Retail & E-handel"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 2
      },
      crm: {
        industries: ["Tillverkningsindustri", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 6
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        application: "Finance & SCM",
        description: "Djup erfarenhet av tillverkningsindustrin med fokus på processtillverkning, diskret tillverkning och lean manufacturing."
      },
      {
        industry: "Grossist & Distribution",
        application: "Finance & SCM",
        description: "Optimerade distributionslösningar med avancerad lagerhantering, inköpsoptimering och leverantörssamarbete."
      }
    ]
  },
  {
    name: "Innofactor",
    logo: "https://www.innofactor.com/hubfs/Innofactor_Logo.svg",
    website: "https://www.innofactor.com/se/vad-vi-gor/losningar/dynamics-365/",
    description: "Innofactor är en Microsoft Cloud Solutions Partner med Microsofts högsta partnerbeteckning.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Finans & Försäkring", "Grossist & Distribution", "Offentlig sektor"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 1 },
    productFilters: {
      fsc: {
        industries: ["Finans & Försäkring", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Offentlig sektor",
        application: "Finance & SCM",
        description: "Ledande partner för offentlig sektor i Norden med lösningar för kommuner, regioner och statliga verk. Expertis inom upphandling och budgethantering."
      },
      {
        industry: "Finans & Försäkring",
        application: "Finance & SCM",
        description: "Omfattande erfarenhet av finanssektorn med fokus på regulatorisk efterlevnad och riskhantering."
      }
    ]
  },
  {
    name: "Nexer",
    logo: "https://nexergroup.com/wp-content/uploads/2022/01/nexer-logo.svg",
    website: "https://nexergroup.com/sv/tjanster/dynamics-365/",
    description: "Nexer är en svensk IT-konsult med global räckvidd och stark kompetens inom Dynamics 365.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustri", "Grossist & Distribution", "Konsulttjänster"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 2, crm: 3 },
    productFilters: {
      fsc: {
        industries: ["Tillverkningsindustri", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 2
      },
      crm: {
        industries: ["Konsulttjänster", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 3
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        application: "Finance & SCM",
        description: "Global erfarenhet av tillverkningsföretag med fokus på internationella utrullningar och multi-site hantering."
      },
      {
        industry: "Konsulttjänster",
        application: "Sales",
        description: "CRM-lösningar för konsultföretag med fokus på pipeline-hantering och resursbokning."
      }
    ]
  },

  // ========== CRM/CUSTOMER ENGAGEMENT PARTNERS (Betalande) ==========
  {
    name: "CRM Konsulterna",
    logo: "https://crmkonsulterna.se/wp-content/uploads/2023/01/crmk-logo.svg",
    website: "https://www.crmkonsulterna.se/dynamics-365/",
    description: "CRM Konsulterna utsågs till Dynamics 365 Customer Engagement Partner of the Year 2023 av Microsoft Sverige.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Grossist & Distribution"],
    companySize: ["1-49", "50-99", "100-249"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK"],
    geography: "Sverige",
    rankings: { crm: 5 },
    productFilters: {
      crm: {
        industries: ["Konsulttjänster", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["1-49", "50-99", "100-249"],
        geography: "Sverige",
        ranking: 5
      }
    },
    industryExpertise: [
      {
        industry: "Konsulttjänster",
        application: "Sales",
        description: "Expertis inom säljdrivna tjänsteföretag med fokus på pipeline-hantering, offertsystem och kundvård."
      }
    ]
  },
  {
    name: "Nemely",
    logo: "https://nemely.se/wp-content/uploads/2022/01/nemely-logo.svg",
    website: "https://nemely.se/dynamics-365/",
    description: "Nemely är en Microsoft Dynamics 365 Partner specialiserad på CRM och kundengagemang.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Tillverkningsindustri"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { crm: 3 },
    productFilters: {
      crm: {
        industries: ["Grossist & Distribution", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 3
      }
    },
    industryExpertise: [
      {
        industry: "Grossist & Distribution",
        application: "Sales",
        description: "Säljlösningar för grossister med B2B-kundportaler, prislistor och orderhantering."
      },
      {
        industry: "Tillverkningsindustri",
        application: "Sales",
        description: "CRM för tillverkande företag med fokus på distributörshantering och konfigurationsbaserad försäljning."
      }
    ]
  },
  {
    name: "Releye",
    logo: "https://releye.se/wp-content/uploads/2022/01/releye-logo.svg",
    website: "https://releye.se/dynamics-365/",
    description: "Releye är en Microsoft-partner med fokus på Dynamics 365 och Power Platform.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustri", "Konsulttjänster"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { crm: 5 },
    productFilters: {
      crm: {
        industries: ["Tillverkningsindustri", "Konsulttjänster"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 5
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        application: "Sales",
        description: "CRM-lösningar för tillverkande företag med fokus på konfigurationsbaserad försäljning och aftermarket."
      },
      {
        industry: "Konsulttjänster",
        application: "Project Operations",
        description: "Lösningar för tjänsteföretag med projekthantering, resursplanering och tidrapportering."
      }
    ]
  },
  {
    name: "Sirocco Group",
    logo: "https://siroccogroup.com/wp-content/uploads/2022/01/sirocco-logo.svg",
    website: "https://www.siroccogroup.com/microsoft-dynamics-365/",
    description: "Sirocco Group är en internationell boutique-konsult och utvecklingsbyrå specialiserad på CRM och digital transformation.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Livsmedel & Processindustri", "Tillverkningsindustri"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { crm: 1 },
    productFilters: {
      crm: {
        industries: ["Livsmedel & Processindustri", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Tillverkningsindustri",
        application: "Sales",
        description: "CRM-lösningar för tillverkande företag med fokus på distributörshantering, konfigurationsbaserad försäljning och aftermarket."
      },
      {
        industry: "Livsmedel & Processindustri",
        application: "Sales",
        description: "Specialiserade CRM-lösningar för livsmedelsindustrin med spårbarhet och kvalitetskontroll."
      }
    ]
  },
  {
    name: "Sopra Steria",
    logo: "https://www.soprasteria.com/~/media/soprasteria/soprasteria-logo.svg",
    website: "https://www.soprasteria.se/losningar/microsoft",
    description: "Sopra Steria är en europeisk teknologikonsult med stark närvaro i Norden och omfattande Dynamics 365-kompetens.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Retail & E-handel", "Offentlig sektor", "Finans & Försäkring"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Europa",
    rankings: { crm: 1 },
    productFilters: {
      crm: {
        industries: ["Retail & E-handel", "Offentlig sektor"],
        secondaryIndustries: [],
        companySize: ["250-999", "1.000-4.999", ">5.000"],
        geography: "Europa",
        ranking: 1
      }
    },
    industryExpertise: [
      {
        industry: "Offentlig sektor",
        application: "Customer Service",
        description: "Ledande europeisk partner för offentlig sektor med erfarenhet av stora nationella implementationer och digitala transformationsprogram."
      },
      {
        industry: "Retail & E-handel",
        application: "Sales",
        description: "Omnikanalslösningar för retail med kundlojalitetsprogram och personaliserade kampanjer."
      }
    ]
  }
];

// CRM applications for filtering
export const crmApplications = ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"];

// All unique industries exported at top of file

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

// Helper function to get ranking for a product
export const getPartnerRanking = (partner: Partner, product: 'bc' | 'fsc' | 'crm'): number => {
  return partner.rankings?.[product] ?? 999;
};

// Helper function to check if a partner matches product-specific filters
// Note: Only uses primary industries (industries) for filtering, NOT secondaryIndustries
export const matchesProductFilter = (
  partner: Partner,
  product: 'bc' | 'fsc' | 'crm',
  selectedIndustry?: string,
  selectedCompanySize?: string,
  selectedGeography?: string
): boolean => {
  const productFilter = partner.productFilters?.[product];
  
  // If no product filter exists, partner doesn't participate in this product
  if (!productFilter) return false;
  
  // Check industry match - ONLY uses primary industries, not secondaryIndustries
  if (selectedIndustry && !productFilter.industries.includes(selectedIndustry)) {
    return false;
  }
  
  // Check company size match
  if (selectedCompanySize && !productFilter.companySize.includes(selectedCompanySize)) {
    return false;
  }
  
  // Check geography match (hierarchical: Sverige < Norden < Europa < Internationellt)
  if (selectedGeography) {
    const geographyHierarchy = ["Sverige", "Norden", "Europa", "Internationellt"];
    const partnerGeoIndex = geographyHierarchy.indexOf(productFilter.geography);
    const selectedGeoIndex = geographyHierarchy.indexOf(selectedGeography);
    
    // Partner must cover the selected geography or broader
    if (partnerGeoIndex < selectedGeoIndex) {
      return false;
    }
  }
  
  return true;
};

// Helper function to get product-specific ranking
export const getProductRanking = (partner: Partner, product: 'bc' | 'fsc' | 'crm'): number => {
  return partner.productFilters?.[product]?.ranking ?? 999;
};
