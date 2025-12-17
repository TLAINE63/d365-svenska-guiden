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
  // Business Central Partners
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
    name: "Accigo",
    logo: "https://accigo.se/wp-content/uploads/2023/01/Accigo-logo.svg",
    website: "https://accigo.se/microsoft-dynamics-365/",
    description: "Accigo utsågs till Microsoft Dynamics 365 Partner of The Year 2024 i Sverige. De är en nordisk Microsoft-partner som driver smart digital transformation med fokus på Customer Engagement, Power Platform och Modern Work.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Konsulttjänster", "Handel (Retail & eCommerce)", "Fastigheter"],
    companySize: ["50-99", "100-249", "250-999", "1.000-4.999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 2, fsc: 2, crm: 2 }
  },
  {
    name: "Azets",
    logo: "https://www.azets.se/globalassets/azets-logo.svg",
    website: "https://www.azets.se/affarslosningar/affarssystem/",
    description: "Azets är en nordisk leverantör av affärssystem och redovisningstjänster med stark kompetens inom Dynamics 365 Business Central. De erbjuder en unik kombination av systemleverans och ekonomitjänster.",
    applications: ["Business Central"],
    industries: ["Konsulttjänster", "Handel (Retail & eCommerce)", "Tillverkningsindustrin"],
    companySize: ["1-49", "50-99", "100-249"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK"],
    geography: "Norden",
    rankings: { bc: 2 }
  },
  {
    name: "B3 Consulting Group",
    logo: "https://b3.se/wp-content/uploads/2022/01/b3-logo.svg",
    website: "https://b3.se/erbjudanden/microsoft/",
    description: "B3 Consulting Group är en svensk IT- och managementkonsult med bred Dynamics 365-kompetens. De fokuserar på digital transformation och affärsutveckling för medelstora och stora företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Offentlig sektor", "Bank & Försäkring", "Hälso- & sjukvård"],
    companySize: ["50-99", "100-249", "250-999", "1.000-4.999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 1, crm: 6 }
  },
  {
    name: "Bedege",
    logo: "",
    website: "https://bedege.se",
    description: "Bedege är en specialiserad Microsoft Dynamics 365 Business Central-partner som hjälper svenska företag med implementation och support av affärssystem.",
    applications: ["Business Central"],
    industries: ["Handel (Retail & eCommerce)"],
    companySize: ["50-99", "100-249"],
    revenue: ["25-99 MSEK", "100-499 MSEK"],
    geography: "Sverige",
    rankings: { bc: 2 }
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
    name: "Cepheo",
    logo: "https://cepheo.com/wp-content/uploads/2022/01/cepheo-logo.svg",
    website: "https://cepheo.com/solutions/erp/",
    description: "Cepheo är en av de mest erfarna Microsoft Dynamics 365-partners i Norden med över 37 års branscherfarenhet och 28 års samarbete med Microsoft.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Energi & Utilities", "Handel (Retail & eCommerce)", "Tillverkningsindustrin", "Grossist/Distribution", "Offentlig sektor"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 1, fsc: 1, crm: 8 }
  },
  {
    name: "Columbus",
    logo: "https://www.columbusglobal.com/hubfs/columbus-logo-black.svg",
    website: "https://www.columbusglobal.com/sv/microsoft-dynamics-365",
    description: "Columbus är en global Dynamics 365-partner med stark nordisk närvaro och mottot 'Digital Value. Human Intelligence'. De hjälper organisationer att transformera sin verksamhet.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Life Science", "Tillverkningsindustrin", "Handel (Retail & eCommerce)"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { bc: 1, fsc: 1, crm: 1 }
  },
  {
    name: "Cosmo Consult",
    logo: "https://www.cosmoconsult.com/fileadmin/_processed_/5/8/csm_COSMO_CONSULT_Logo_RGB_b35e8c5f3e.png",
    website: "https://www.cosmoconsult.com/se-sv/loesningar/microsoft-dynamics-365-business-central/",
    description: "Cosmo Consult är en internationell Dynamics 365-partner med stark närvaro i Norden och specialistkompetens inom Business Central.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Bygg & Entreprenad"],
    companySize: ["50-99", "100-249", "1.000-4.999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "1.000-4.999 MSEK"],
    geography: "Europa",
    rankings: { bc: 1 }
  },
  {
    name: "Dizparc",
    logo: "https://dizparc.com/wp-content/uploads/2023/01/dizparc-logo-white.svg",
    website: "https://dizparc.se/erbjudande/affarssystem/",
    description: "Dizparc hjälper företag att förverkliga sin digitala potential genom lokala verksamheter på flera orter i Sverige.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Transport & Logistik"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 4 }
  },
  {
    name: "ECIT",
    logo: "https://www.ecit.com/wp-content/uploads/2021/08/ecit-logo.svg",
    website: "https://www.ecit.com/se/affarssystem/",
    description: "ECIT är en nordisk IT-partner som erbjuder hög kompetens, tjänster och produkter inom ekonomi, IT och affärslösningar.",
    applications: ["Business Central"],
    industries: ["Konsulttjänster", "Grossist/Distribution", "Hälso- & sjukvård"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Norden",
    rankings: { bc: 3 }
  },
  {
    name: "Effekt SPU",
    logo: "",
    website: "https://www.effektspu.se/",
    description: "Effekt SPU är en Microsoft Dynamics 365 Business Central-partner med fokus på tillverkningsindustrin och distribution.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Konsulttjänster"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 9 }
  },
  {
    name: "Enqore",
    logo: "",
    website: "https://enqore.se/",
    description: "Enqore är en Microsoft Dynamics 365-partner med expertis inom både Business Central och CRM. De hjälper nordiska företag med ERP och kundengagemang.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Konsulttjänster", "Energi & Utilities"],
    companySize: ["50-99", "100-249", "250-999", "1.000-4.999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 5, crm: 4 }
  },
  {
    name: "Evidi",
    logo: "https://navipro.se/wp-content/uploads/2024/01/evidi-logo.svg",
    website: "https://navipro.se/dynamics-365-business-central/",
    description: "Evidi (tidigare Navipro) är en nordisk Microsoft-partner med djup expertis inom Microsoft-plattformen med fokus på Dynamics 365 Business Central.",
    applications: ["Business Central"],
    industries: ["Konsulttjänster", "Bygg & Entreprenad"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 5 }
  },
  {
    name: "Exsitec",
    logo: "https://excitec.se/wp-content/uploads/2022/01/excitec-logo.svg",
    website: "https://excitec.se/affarssystem/",
    description: "Exsitec är specialister på Microsoft Dynamics 365 Business Central och Power Platform för svenska företag.",
    applications: ["Business Central"],
    industries: ["Grossist/Distribution", "Tillverkningsindustrin", "Handel (Retail & eCommerce)"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 2 }
  },
  {
    name: "Fellowmind",
    logo: "https://www.fellowmind.com/globalassets/images/fellowmind-logo.svg",
    website: "https://www.fellowmind.com/sv-se/tjanster/microsoft-dynamics-365/",
    description: "Fellowmind utsågs till Microsoft EMEA Channel Partner of the Year 2025 – det mest prestigefyllda partnerpriset i Europa.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist/Distribution", "Transport & Logistik", "Handel (Retail & eCommerce)", "Tillverkningsindustrin", "Offentlig sektor"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Europa",
    rankings: { bc: 1, fsc: 3, crm: 5 }
  },
  {
    name: "Goodfellows",
    logo: "https://goodfellows.se/wp-content/uploads/2021/03/goodfellows-logo.svg",
    website: "https://goodfellows.se/affarssystem/",
    description: "Goodfellows erbjuder personlig IT-service med fokus på Dynamics 365 Business Central.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Handel (Retail & eCommerce)"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 8 }
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
    name: "Itm8",
    logo: "",
    website: "https://itm8.se/affarssystem/",
    description: "Itm8 är en Microsoft Dynamics 365 Business Central-partner som hjälper svenska företag med affärssystemlösningar.",
    applications: ["Business Central"],
    industries: ["Grossist/Distribution", "Tillverkningsindustrin", "Konsulttjänster"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { bc: 3 }
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
    name: "Navet",
    logo: "https://navet.se/wp-content/uploads/2020/12/navet-logo.svg",
    website: "https://navet.se/affarssystem/",
    description: "Navet skapar bättre affärer tillsammans med sina kunder med mottot 'Vi förstår verksamheter, teknik och relationer'.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Handel (Retail & eCommerce)"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 7 }
  },
  {
    name: "Regentor",
    logo: "",
    website: "https://regentor.se",
    description: "Regentor är en Microsoft Dynamics 365-partner som erbjuder implementation och support för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Transport & Logistik", "Handel (Retail & eCommerce)", "Grossist/Distribution"],
    companySize: ["50-99", "100-249", "250-999", "1.000-4.999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 8, crm: 9 }
  },
  {
    name: "Sherpas",
    logo: "https://sherpas.se/wp-content/uploads/2022/01/sherpas-logo.svg",
    website: "https://sherpas.se/plattformar/dynamics-365-f-scm/",
    description: "Sherpas hjälper företag och organisationer med data, system och digitalisering.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Konsulttjänster", "Handel (Retail & eCommerce)"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 5 }
  },
  {
    name: "Softronic",
    logo: "https://softronic.se/wp-content/uploads/2022/01/softronic-logo.svg",
    website: "https://www.softronic.se/services/microsoft-dynamics-365/",
    description: "Softronic är en svensk IT-konsult med mottot 'GoodTech – ledande teknik som gör gott i samhället'.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Handel (Retail & eCommerce)", "Transport & Logistik", "Tillverkningsindustrin", "Offentlig sektor", "Bank & Försäkring"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 1, crm: 3 }
  },
  {
    name: "Transformant",
    logo: "",
    website: "https://www.transformant.se/",
    description: "Transformant erbjuder konsulttjänster, affärssystem och integrationer för företag som vill förändras.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Konsulttjänster", "Nonprofit", "Fastigheter", "Bygg & Entreprenad"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 1, fsc: 1, crm: 1 }
  },
  {
    name: "Update Affärssystem",
    logo: "",
    website: "https://updateab.se",
    description: "Update Affärssystem är en Microsoft Dynamics 365 Business Central-partner som erbjuder implementation och support för svenska företag.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Konsulttjänster"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 6 }
  },
  {
    name: "Yellow Solution",
    logo: "",
    website: "https://yellowsolution.se",
    description: "Yellow Solution är en Microsoft Dynamics 365 Business Central-partner med fokus på transport och logistik.",
    applications: ["Business Central"],
    industries: ["Transport & Logistik", "Grossist/Distribution", "Tillverkningsindustrin"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Sverige",
    rankings: { bc: 1 }
  },
  {
    name: "EY",
    logo: "https://assets.ey.com/content/dam/ey-sites/ey-com/en_gl/generic/logos/20170526-ey-logo.svg",
    website: "https://www.ey.com/sv_se/services/consulting/technology/microsoft",
    description: "EY är en global konsult- och revisionsjätte med omfattande Dynamics 365-praktik.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Bank & Försäkring", "Offentlig sektor", "Konsulttjänster"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { bc: 1, fsc: 4, crm: 5 }
  },
  // Finance & Supply Chain Partners
  {
    name: "Accenture",
    logo: "https://www.accenture.com/content/dam/accenture/final/images/icons/symbol/Accent_Global_Subbrand_Logo.svg",
    website: "https://www.accenture.com/se-en/services/microsoft-index",
    description: "Accenture är en global konsultjätte och en av världens största Microsoft-partners med omfattande expertis inom Dynamics 365.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Energi & Utilities", "Bank & Försäkring", "Offentlig sektor"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 1, crm: 3 }
  },
  {
    name: "Avanade",
    logo: "https://www.avanade.com/-/media/logo/avanade-logo.svg",
    website: "https://www.avanade.com/sv-se/solutions/microsoft-business-applications",
    description: "Avanade är ett joint venture mellan Accenture och Microsoft och världens största leverantör av Microsoft-tjänster.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Bank & Försäkring", "Hälso- & sjukvård", "Handel (Retail & eCommerce)"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 2, crm: 2 }
  },
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
    name: "Capgemini",
    logo: "https://www.capgemini.com/wp-content/themes/capgemini2020/assets/images/logo.svg",
    website: "https://www.capgemini.com/solutions/microsoft/",
    description: "Capgemini är en global konsultjätte med omfattande Dynamics 365-praktik och djup branschexpertis.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Energi & Utilities", "Bank & Försäkring", "Handel (Retail & eCommerce)", "Offentlig sektor"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 2, crm: 4 }
  },
  {
    name: "Cegeka",
    logo: "https://www.cegeka.com/hubfs/Cegeka_September2022/Images/cegeka-logo.svg",
    website: "https://www.cegeka.com/sv-se/solutions/microsoft",
    description: "Cegeka är en europeisk IT-partner med fokus på digital transformation och stark kompetens inom Dynamics 365 och Azure.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Life Science", "Handel (Retail & eCommerce)"],
    companySize: ["100-249", "250-999", "1.000-4.999"],
    revenue: ["100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Europa",
    rankings: { fsc: 3, crm: 3 }
  },
  {
    name: "Engage Group",
    logo: "https://engagegroup.se/wp-content/uploads/2022/01/engage-group-logo.svg",
    website: "https://engagenow.com/our-services/",
    description: "Engage Group är 'Experts in Dynamics 365' med en bevisad meritlista inom globala utrullningar. De tillhör den exklusiva Microsoft Inner Circle.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Utbildning", "Nonprofit"],
    companySize: ["50-99", "100-249", "250-999", "1.000-4.999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK"],
    geography: "Norden",
    rankings: { fsc: 1, crm: 7 }
  },
  {
    name: "Fujitsu",
    logo: "https://www.fujitsu.com/global/Images/fujitsu-logo.svg",
    website: "https://www.fujitsu.com/se/services/application-modernization/enterprise-applications/",
    description: "Fujitsu är en global IT-tjänsteleverantör med omfattande Microsoft-partnerskap och närvaro i Sverige.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Tillverkningsindustrin", "Bank & Försäkring", "Energi & Utilities"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 9, crm: 4 }
  },
  {
    name: "HCL Technologies",
    logo: "https://www.hcltech.com/themes/custom/flavor/logo.svg",
    website: "https://www.hcltech.com/technology-software-services/enterprise-application-services/microsoft-ecosystem",
    description: "HCL Technologies är en global IT-tjänsteleverantör med omfattande Microsoft Dynamics 365-erfarenhet.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Life Science", "Bank & Försäkring"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 5, crm: 5 }
  },
  {
    name: "HSO",
    logo: "https://www.hso.com/hubfs/HSO_Logo.svg",
    website: "https://www.hso.com/solutions/microsoft-dynamics-365",
    description: "HSO utsågs till vinnare av 2025 Microsoft Dynamics 365 Sales & Customer Insights Partner of the Year Award.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Handel (Retail & eCommerce)", "Tillverkningsindustrin", "Konsulttjänster", "Hälso- & sjukvård"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 5, crm: 4 }
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
    name: "KPMG",
    logo: "https://assets.kpmg.com/content/dam/kpmg/share/logo/kpmg-logo.svg",
    website: "https://kpmg.com/se/sv/home/tjanster/advisory/microsoft.html",
    description: "KPMG är en global konsult- och revisionsjätte med omfattande Dynamics 365-praktik.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Bank & Försäkring", "Offentlig sektor", "Tillverkningsindustrin", "Konsulttjänster"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 8, crm: 6 }
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
  {
    name: "Sogeti",
    logo: "https://www.sogeti.se/globalassets/sogeti-logo.svg",
    website: "https://www.sogeti.se/tjanster/microsoft/",
    description: "Sogeti är 'Valuemakers' och del av Capgemini-gruppen med fokus på teknisk implementation.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Bank & Försäkring"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Europa",
    rankings: { fsc: 3, crm: 2 }
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
  },
  {
    name: "TCS",
    logo: "https://www.tcs.com/content/dam/tcs/images/logos/tcs-logo.svg",
    website: "https://www.tcs.com/what-we-do/products-platforms/microsoft-business-applications",
    description: "TCS är en global IT-tjänsteleverantör och en av världens största Microsoft-partners.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Bank & Försäkring", "Tillverkningsindustrin", "Handel (Retail & eCommerce)"],
    companySize: ["250-999", "1.000-4.999", ">5.000"],
    revenue: ["500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"],
    geography: "Internationellt",
    rankings: { fsc: 6, crm: 7 }
  },
  // CRM Partners
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
    name: "Stratiteq",
    logo: "",
    website: "https://stratiteq.com/solutions/microsoft-dynamics-365/",
    description: "Stratiteq är en Microsoft Dynamics 365-partner med fokus på CRM och Customer Engagement.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Konsulttjänster"],
    companySize: ["50-99", "100-249", "250-999"],
    revenue: ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"],
    geography: "Norden",
    rankings: { crm: 9 }
  },
  {
    name: "Zelly",
    logo: "https://zelly.se/wp-content/uploads/2022/01/zelly-logo.svg",
    website: "https://zelly.se/dynamics-365/",
    description: "Zelly är en Microsoft Dynamics 365 Partner med fokus på CRM och kundservice.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Handel (Retail & eCommerce)", "Grossist/Distribution", "Konsulttjänster"],
    companySize: ["1-49", "50-99", "100-249"],
    revenue: ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK"],
    geography: "Sverige",
    rankings: { crm: 6 }
  }
];

// CRM applications for filtering
export const crmApplications = ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"];

// All unique industries from partners
export const allIndustries = [
  "Alla branscher",
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
