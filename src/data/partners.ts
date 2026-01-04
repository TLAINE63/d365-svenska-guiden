export interface IndustryExpertise {
  industry: string;
  application?: string; // Om tomt gäller det alla applikationer
  description: string;
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
    rankings: { bc: 1 },
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
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Handel (Retail & eCommerce)", "Konsulttjänster"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 3, crm: 1 },
    industryExpertise: [
      {
        industry: "Tillverkningsindustrin",
        application: "Business Central",
        description: "Bisqo har specialkompetens inom tillverkande företag med fokus på produktionsplanering, lagerhantering och kvalitetskontroll i Business Central."
      },
      {
        industry: "Grossist/Distribution",
        description: "Stark erfarenhet av distributions- och grossistföretag med optimerade flöden för inköp, lager och försäljning."
      }
    ]
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
    rankings: { bc: 2 },
    industryExpertise: [
      {
        industry: "Tillverkningsindustrin",
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
    industries: ["Bygg & Entreprenad", "Grossist/Distribution", "Transport & Logistik"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 2 },
    industryExpertise: [
      {
        industry: "Bygg & Entreprenad",
        application: "Business Central",
        description: "Lång erfarenhet av maskinuthyrning och byggföretag med fokus på projektredovisning och maskinhantering."
      },
      {
        industry: "Transport & Logistik",
        application: "Business Central",
        description: "Specialiserade lösningar för transport- och logistikföretag med spårbarhet och ruttoptimering."
      }
    ]
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
    rankings: { bc: 6, fsc: 1, crm: 1 },
    industryExpertise: [
      {
        industry: "Offentlig sektor",
        description: "Djup förståelse för offentlig förvaltning med erfarenhet av kommuner, regioner och statliga myndigheter. Fokus på regelefterlevnad och transparens."
      },
      {
        industry: "Hälso- & sjukvård",
        description: "Specialistkompetens inom vårdsektorn med lösningar för patienthantering, journalsystem och integrationer mot befintliga vårdplattformar."
      },
      {
        industry: "Bank & Försäkring",
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
    industries: ["Medlemsorganisationer", "Nonprofit", "Tillverkningsindustrin", "Utbildning"],
    companySize: ["1-49", "50-99", "250-999"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 1, crm: 1 },
    industryExpertise: [
      {
        industry: "Medlemsorganisationer",
        description: "Specialiserade lösningar för föreningar och medlemsorganisationer med medlemshantering, avgiftshantering och eventplanering."
      },
      {
        industry: "Nonprofit",
        description: "Erfarenhet av ideella organisationer med fokus på bidragshantering, givardatabaser och projektredovisning."
      },
      {
        industry: "Utbildning",
        application: "Business Central",
        description: "Lösningar för utbildningssektorn med kurshantering, deltagaradministration och ekonomistyrning."
      }
    ]
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
    rankings: { bc: 4 },
    industryExpertise: [
      {
        industry: "Tillverkningsindustrin",
        application: "Business Central",
        description: "Stark kompetens inom tillverkande företag med fokus på produktionsplanering och MRP."
      },
      {
        industry: "Grossist/Distribution",
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
    industries: ["Konsulttjänster", "Grossist/Distribution", "Handel (Retail & eCommerce)"],
    companySize: ["1-49", "50-99", "100-249"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK"],
    geography: "Sverige",
    rankings: { bc: 3, crm: 5 },
    industryExpertise: [
      {
        industry: "Konsulttjänster",
        description: "Expertis inom tjänsteföretag med fokus på projektredovisning, tidrapportering och resursplanering."
      },
      {
        industry: "Handel (Retail & eCommerce)",
        description: "Lösningar för handelsföretag med e-handelsintegrationer, kassasystem och omnikanal-strategier."
      }
    ]
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
    rankings: { fsc: 1, crm: 2 },
    industryExpertise: [
      {
        industry: "Tillverkningsindustrin",
        application: "Finance & SCM",
        description: "Internationell erfarenhet av komplex tillverkning med fokus på supply chain optimization, produktionsplanering och global utrullning."
      },
      {
        industry: "Transport & Logistik",
        application: "Finance & SCM",
        description: "Specialiserade lösningar för transport och logistik med warehouse management, fleet management och ruttoptimering."
      },
      {
        industry: "Handel (Retail & eCommerce)",
        description: "Omnikanalslösningar för retail med POS-integration, e-handel och kundlojalitetsprogram."
      }
    ]
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
    rankings: { fsc: 2, crm: 6 },
    industryExpertise: [
      {
        industry: "Tillverkningsindustrin",
        application: "Finance & SCM",
        description: "Djup erfarenhet av tillverkningsindustrin med fokus på processtillverkning, diskret tillverkning och lean manufacturing."
      },
      {
        industry: "Grossist/Distribution",
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
    industries: ["Offentlig sektor", "Hälso- & sjukvård", "Energi & Utilities", "Utbildning"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 1, crm: 8 },
    industryExpertise: [
      {
        industry: "Offentlig sektor",
        application: "Finance & SCM",
        description: "Ledande partner för offentlig sektor i Norden med lösningar för kommuner, regioner och statliga verk. Expertis inom upphandling och budgethantering."
      },
      {
        industry: "Hälso- & sjukvård",
        description: "Omfattande erfarenhet av vårdsektorn med fokus på patientflöden, resursoptimering och integration mot journalsystem."
      },
      {
        industry: "Energi & Utilities",
        application: "Finance & SCM",
        description: "Specialistkompetens inom energisektorn med lösningar för asset management, nätplanering och regulatorisk rapportering."
      }
    ]
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
    rankings: { fsc: 2, crm: 3 },
    industryExpertise: [
      {
        industry: "Tillverkningsindustrin",
        application: "Finance & SCM",
        description: "Global erfarenhet av tillverkningsföretag med fokus på internationella utrullningar och multi-site hantering."
      },
      {
        industry: "Offentlig sektor",
        description: "Stark närvaro inom offentlig sektor med förståelse för offentlig upphandling och compliance-krav."
      },
      {
        industry: "Handel (Retail & eCommerce)",
        application: "Sales",
        description: "Omnikanalslösningar med fokus på kundupplevelse, personalisering och e-handelsintegration."
      }
    ]
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
    rankings: { crm: 5 },
    industryExpertise: [
      {
        industry: "Konsulttjänster",
        application: "Sales",
        description: "Expertis inom säljdrivna tjänsteföretag med fokus på pipeline-hantering, offertsystem och kundvård."
      },
      {
        industry: "Offentlig sektor",
        application: "Customer Service",
        description: "Lösningar för medborgarservice med ärendehantering, självbetjäningsportaler och integration mot befintliga system."
      }
    ]
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
    rankings: { crm: 3 },
    industryExpertise: [
      {
        industry: "Handel (Retail & eCommerce)",
        application: "Customer Insights (Marketing)",
        description: "Stark kompetens inom retail-marknadsföring med fokus på kundresor, segmentering och personaliserade kampanjer."
      },
      {
        industry: "Grossist/Distribution",
        application: "Sales",
        description: "Säljlösningar för grossister med B2B-kundportaler, prislistor och orderhantering."
      }
    ]
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
    rankings: { crm: 5 },
    industryExpertise: [
      {
        industry: "Handel (Retail & eCommerce)",
        application: "Sales",
        description: "Omnikanalslösningar för handelsföretag med integration mot e-handel, kassasystem och lagerhantering."
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
    industries: ["Tillverkningsindustrin", "Energi & Utilities", "Offentlig sektor"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { crm: 1 },
    industryExpertise: [
      {
        industry: "Tillverkningsindustrin",
        application: "Sales",
        description: "CRM-lösningar för tillverkande företag med fokus på distributörshantering, konfigurationsbaserad försäljning och aftermarket."
      },
      {
        industry: "Energi & Utilities",
        application: "Customer Service",
        description: "Kundservicelösningar för energibolag med ärendehantering, avbrottsrapportering och kundportaler."
      },
      {
        industry: "Offentlig sektor",
        description: "Digital transformation för offentlig sektor med medborgarengagemang och processautomatisering."
      }
    ]
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
    rankings: { fsc: 2, crm: 1 },
    industryExpertise: [
      {
        industry: "Offentlig sektor",
        application: "Finance & SCM",
        description: "Ledande europeisk partner för offentlig sektor med erfarenhet av stora nationella implementationer och digitala transformationsprogram."
      },
      {
        industry: "Bank & Försäkring",
        application: "Finance & SCM",
        description: "Djup förståelse för finanssektorn med fokus på regulatorisk efterlevnad, riskhantering och digital kundupplevelse."
      },
      {
        industry: "Energi & Utilities",
        description: "Omfattande erfarenhet inom energisektorn med lösningar för smarta nät, kundhantering och hållbarhetsrapportering."
      }
    ]
  }
];

// CRM applications for filtering
export const crmApplications = ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"];

// All unique industries from partners
export const allIndustries = [
  "Tillverkningsindustri (Manufacturing)",
  "Bygg & Entreprenad",
  "Grossist / Distribution",
  "Detaljhandel (Retail)",
  "E-handel",
  "Professionella tjänster (Consulting / PSA)",
  "Fastighet & Facility Management",
  "Logistik & Transport",
  "Life Science / Pharma / Medtech",
  "Livsmedel & Dryck",
  "Energi & Utilities",
  "Offentlig sektor / Myndigheter",
  "Hälso- & sjukvård",
  "Utbildning",
  "Bank & Försäkring",
  "Telekom & IT-tjänster",
  "Media & Publishing",
  "Jordbruk & Skogsbruk",
  "Gruv- & Råvaruindustri",
  "Non-profit / Ideella organisationer"
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
