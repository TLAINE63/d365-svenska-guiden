export interface Partner {
  name: string;
  logo: string;
  website: string;
  description: string;
  applications: string[];
  industries: string[];
  companySize: string[];
}

export const partners: Partner[] = [
  {
    name: "Absfront",
    logo: "https://absfront.se/wp-content/uploads/2020/11/absfront-logo.svg",
    website: "https://absfront.se",
    description: "Specialister på CRM och Customer Experience inom Dynamics 365, Power Platform och Data. Fokus på kundupplevelser utan gränser.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Accenture",
    logo: "https://www.accenture.com/content/dam/accenture/final/images/icons/symbol/Accent_Global_Subbrand_Logo.svg",
    website: "https://www.accenture.com/se-en",
    description: "Global konsultjätte och en av världens största Microsoft-partners. Omfattande Dynamics 365-praktik för stora transformationsprojekt och enterprise-kunder.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Retail", "Energisektorn", "Offentlig sektor"],
    companySize: ["Stora"]
  },
  {
    name: "Accigo",
    logo: "https://accigo.se/wp-content/uploads/2023/01/Accigo-logo.svg",
    website: "https://accigo.se",
    description: "Microsoft Dynamics 365 Partner of The Year 2024. Smart digital transformation med fokus på Customer Engagement och Power Platform.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "Bank & Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Altitude 365",
    logo: "",
    website: "https://altitude365.se",
    description: "Specialiserad Microsoft Dynamics 365 Business Central-partner som hjälper svenska företag att optimera sina affärsprocesser.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Avanade",
    logo: "https://www.avanade.com/-/media/logo/avanade-logo.svg",
    website: "https://www.avanade.com/sv-se",
    description: "Joint venture mellan Accenture och Microsoft. Världens största leverantör av Microsoft-tjänster med djup expertis inom hela Dynamics 365-plattformen.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Bank & Finans", "Retail", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Azets",
    logo: "https://www.azets.se/globalassets/azets-logo.svg",
    website: "https://www.azets.se",
    description: "Nordisk leverantör av affärssystem och redovisningstjänster med stark Dynamics 365 Business Central-kompetens. Kombinerar systemleverans med ekonomitjänster.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "B3 Consulting Group",
    logo: "https://b3.se/wp-content/uploads/2022/01/b3-logo.svg",
    website: "https://b3.se",
    description: "Svensk IT- och managementkonsult med bred Dynamics 365-kompetens. Fokus på digital transformation och affärsutveckling för medelstora och stora företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "Offentlig sektor", "Bank & Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Bedege",
    logo: "",
    website: "https://bedege.se",
    description: "Specialiserad Microsoft Dynamics 365 Business Central-partner för svenska företag.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "BE-terna",
    logo: "https://www.be-terna.com/hubfs/BE-terna%20Logo.svg",
    website: "https://www.be-terna.com/sv",
    description: "Internationell partner med fokus på digital framtid. Del av Telefónica Tech med stark kompetens inom ERP, CRM och dataanalys.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Retail", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Bisqo",
    logo: "https://bisqo.se/wp-content/uploads/2022/01/bisqo-logo.svg",
    website: "https://bisqo.se",
    description: "Microsoft Dynamics 365 Partner med fokus på Business Central och CRM. Hjälper svenska företag att växa med smarta affärssystemlösningar.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Capgemini",
    logo: "https://www.capgemini.com/wp-content/themes/capgemini2020/assets/images/logo.svg",
    website: "https://www.capgemini.com/se-en/",
    description: "Global konsultjätte med omfattande Dynamics 365-praktik. Fokus på stora transformationsprojekt och enterprise-kunder.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Retail", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Cegeka",
    logo: "https://www.cegeka.com/hubfs/Cegeka_September2022/Images/cegeka-logo.svg",
    website: "https://www.cegeka.com/sv-se",
    description: "Europeisk IT-partner med fokus på digital transformation. Stark kompetens inom Dynamics 365 och Azure för medelstora och stora företag.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Cellip",
    logo: "",
    website: "https://cellip.com",
    description: "Microsoft Dynamics 365 Business Central-partner med fokus på molnbaserade kommunikationslösningar.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Cepheo",
    logo: "https://cepheo.com/wp-content/uploads/2022/01/cepheo-logo.svg",
    website: "https://cepheo.com",
    description: "Erfaren nordisk Dynamics 365-partner med över 39 års erfarenhet. Digital Empowerment för medelstora och stora företag.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "CGI",
    logo: "https://www.cgi.com/sites/default/files/2019-12/cgi-logo.svg",
    website: "https://www.cgi.com/se",
    description: "Global IT-konsult med omfattande Dynamics 365-kompetens. Erbjuder helhetslösningar för stora organisationer och offentlig sektor.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Offentlig sektor", "Bank & Finans", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Claremont (Zington)",
    logo: "",
    website: "https://zington.se",
    description: "Microsoft Dynamics 365-partner med fokus på Finance & Supply Chain Management.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Codeunit 80",
    logo: "",
    website: "https://codeunit80.se",
    description: "Specialiserad Microsoft Dynamics 365 Business Central-partner för svenska företag.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Cognizant",
    logo: "",
    website: "https://www.cognizant.com/se/sv",
    description: "Global IT-konsult med Dynamics 365 Business Central-kompetens.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Bank & Finans"],
    companySize: ["Stora"]
  },
  {
    name: "Coligo",
    logo: "",
    website: "https://coligo.se",
    description: "Microsoft Dynamics 365 Business Central-partner med fokus på molnlösningar.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Columbus",
    logo: "https://www.columbusglobal.com/hubfs/columbus-logo-black.svg",
    website: "https://www.columbusglobal.com/sv",
    description: "Global Dynamics 365-partner med stark nordisk närvaro. Digital Value. Human Intelligence - helhetslösningar inom ERP och CRM.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Retail", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Cosmo Consult",
    logo: "https://www.cosmoconsult.com/fileadmin/_processed_/5/8/csm_COSMO_CONSULT_Logo_RGB_b35e8c5f3e.png",
    website: "https://www.cosmoconsult.com/sv-se/",
    description: "Internationell Dynamics 365-partner med stark närvaro i Norden. Specialister på Business Central med egna branschlösningar.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Tjänsteföretag", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "CRM Konsulterna",
    logo: "https://crmkonsulterna.se/wp-content/uploads/2023/01/crmk-logo.svg",
    website: "https://crmkonsulterna.se",
    description: "Vi placerar kunden i centrum. Specialister på Dynamics 365 Customer Engagement, CRM och Power Platform.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Cygate",
    logo: "",
    website: "https://cygate.se",
    description: "Microsoft Dynamics 365 Business Central-partner med fokus på IT-säkerhet och molnlösningar.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Dizparc",
    logo: "https://dizparc.com/wp-content/uploads/2023/01/dizparc-logo-white.svg",
    website: "https://dizparc.com",
    description: "Förverkliga din digitala potential. Lokala verksamheter på flera orter som hjälper dig skapa hållbara digitala lösningar.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Dynamicskonsult.se",
    logo: "",
    website: "https://dynamicskonsult.se",
    description: "Specialiserad Microsoft Dynamics 365 Business Central-konsult för svenska företag.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "ECIT",
    logo: "https://www.ecit.com/wp-content/uploads/2021/08/ecit-logo.svg",
    website: "https://www.ecit.com/se/",
    description: "Din partner - nu och i framtiden. Nordisk IT-partner med bred kompetens inom ekonomi, IT och affärslösningar.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail", "Grossist"],
    companySize: ["Små", "Medelstora", "Stora"]
  },
  {
    name: "Effekt SPU",
    logo: "",
    website: "https://effektspu.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "EG Sverige",
    logo: "",
    website: "https://eg.se",
    description: "Nordisk IT-partner med fokus på Dynamics 365 Finance & Supply Chain Management.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Engage Group",
    logo: "https://engagegroup.se/wp-content/uploads/2022/01/engage-group-logo.svg",
    website: "https://engagegroup.se",
    description: "Experts In Dynamics 365. Your Local Partner With Global Reach. Fokus på CRM och Customer Engagement.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tjänsteföretag"],
    companySize: ["Medelstora"]
  },
  {
    name: "Eventful",
    logo: "",
    website: "https://eventful.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Exsitec (Brightcom)",
    logo: "https://excitec.se/wp-content/uploads/2022/01/excitec-logo.svg",
    website: "https://excitec.se",
    description: "Del av Brightcom-gruppen. Specialister på Microsoft Dynamics 365 Business Central och Power Platform för svenska företag.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "EY",
    logo: "https://assets.ey.com/content/dam/ey-sites/ey-com/en_gl/generic/logos/20170526-ey-logo.svg",
    website: "https://www.ey.com/sv_se",
    description: "Global konsult- och revisionsjätte med omfattande Dynamics 365-praktik. Fokus på stora transformationsprojekt, finans och revision.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Fellowmind",
    logo: "https://www.fellowmind.com/globalassets/images/fellowmind-logo.svg",
    website: "https://www.fellowmind.com/sv-se/",
    description: "Microsoft EMEA Channel Partner of the Year 2025. En av Nordens största Dynamics 365-partners med bred kompetens inom ERP och CRM.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Forefront Consulting",
    logo: "",
    website: "https://forefront.se",
    description: "Microsoft Dynamics 365 Finance & Supply Chain Management-partner.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "FourOne",
    logo: "https://fourone.se/wp-content/uploads/2023/01/fourone-logo.svg",
    website: "https://fourone.se",
    description: "Nordisk CRM-specialist med fokus på Dynamics 365 Finance & Supply Chain Management.",
    applications: ["Finance & SCM"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Fujitsu",
    logo: "https://www.fujitsu.com/global/Images/fujitsu-logo.svg",
    website: "https://www.fujitsu.com/se/",
    description: "Global IT-tjänsteleverantör med omfattande Microsoft-partnerskap. Erbjuder Dynamics 365-lösningar för stora enterprise-kunder.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Goodfellows",
    logo: "https://goodfellows.se/wp-content/uploads/2021/03/goodfellows-logo.svg",
    website: "https://goodfellows.se",
    description: "Goodfellows IT, support & drift blir en del av Upheads. Välkommen till det goda livet med personlig IT-service.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Haldor",
    logo: "",
    website: "https://haldor.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "HCL Technologies",
    logo: "https://www.hcltech.com/themes/custom/flavor/logo.svg",
    website: "https://www.hcltech.com",
    description: "Global IT-tjänsteleverantör med omfattande Microsoft Dynamics 365-erfarenhet. Stark närvaro inom stora enterprise-implementationer.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Bank & Finans", "Retail"],
    companySize: ["Stora"]
  },
  {
    name: "HSO",
    logo: "https://www.hso.com/hubfs/HSO_Logo.svg",
    website: "https://www.hso.com/sv",
    description: "Global Microsoft-partner specialiserad på Dynamics 365 och molntjänster. Stark branschexpertis inom tillverkning, distribution och retail.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Implema",
    logo: "https://www.implema.se/wp-content/uploads/2021/03/implema-logo.svg",
    website: "https://www.implema.se",
    description: "Snabbt, säkert och redo för framtiden. Accelerera din affär med SAP och Microsoft Dynamics.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "InBiz",
    logo: "https://www.inbiz.se/wp-content/uploads/2021/08/inbiz-logo.png",
    website: "https://www.inbiz.se",
    description: "Din trygga partner för Microsoft Dynamics. Sedan 2005 har vi hjälpt våra kunder att få det bästa ur sitt affärssystem.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Innofactor",
    logo: "https://www.innofactor.com/hubfs/Innofactor_Logo.svg",
    website: "https://www.innofactor.com/sv",
    description: "Nordisk Microsoft-partner med fokus på digital transformation. Stark kompetens inom Dynamics 365, Azure och Power Platform.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service"],
    industries: ["Offentlig sektor", "Tjänsteföretag", "Bank & Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Itm8 (Addpro)",
    logo: "",
    website: "https://itm8.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "JMA Maskindata",
    logo: "https://jma.se/wp-content/uploads/2022/01/jma-logo.svg",
    website: "https://jma.se",
    description: "Specialister på affärssystem för tillverkande företag. Lång erfarenhet av Microsoft Dynamics och branschanpassade lösningar.",
    applications: ["Business Central"],
    industries: ["Tillverkning"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Knowit",
    logo: "https://www.knowit.se/globalassets/knowit-logo.svg",
    website: "https://www.knowit.se",
    description: "Nordisk digitaliseringskonsult med bred Microsoft-kompetens. Fokus på hållbar digitalisering och kundupplevelser.",
    applications: ["Finance & SCM"],
    industries: ["Tjänsteföretag", "Offentlig sektor", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "KPMG",
    logo: "https://assets.kpmg.com/content/dam/kpmg/share/logo/kpmg-logo.svg",
    website: "https://kpmg.com/se/sv",
    description: "Global konsult- och revisionsjätte med omfattande Dynamics 365-praktik. Fokus på finans, revision och stora transformationsprojekt.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Lumini",
    logo: "",
    website: "https://lumini.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Midpoint",
    logo: "",
    website: "https://midpoint.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "NAB Solutions",
    logo: "https://www.nabsolutions.se/wp-content/uploads/2021/03/nab-logo.png",
    website: "https://www.nabsolutions.se",
    description: "Specialister på Dynamics 365 Business Central med lång erfarenhet av implementationer för svenska företag. Fokus på tillverkning och distribution.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navcite",
    logo: "https://navcite.se/wp-content/uploads/2022/01/navcite-logo.svg",
    website: "https://navcite.se",
    description: "Small company feeling - Big company experience. Affärssystem med Infor M3 och Microsoft Business Central.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navet (Aderian Group)",
    logo: "https://navet.se/wp-content/uploads/2020/12/navet-logo.svg",
    website: "https://navet.se",
    description: "Vi skapar bättre affärer tillsammans. Vi förstår verksamheter, teknik och relationer. Del av Aderian Group.",
    applications: ["Business Central"],
    industries: ["Retail", "Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navipro",
    logo: "https://navipro.se/wp-content/uploads/2024/01/evidi-logo.svg",
    website: "https://navipro.se",
    description: "From NaviPro to Evidi - A New Era of Possibilities. Nordisk Microsoft-partner med djup expertis inom hela Microsoft-plattformen.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Nemely",
    logo: "https://nemely.se/wp-content/uploads/2022/01/nemely-logo.svg",
    website: "https://nemely.se",
    description: "Microsoft Dynamics 365 Partner specialiserad på CRM och kundengagemang. Hjälper företag att optimera sina kundrelationer.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Nexer",
    logo: "https://nexergroup.com/wp-content/uploads/2022/01/nexer-logo.svg",
    website: "https://nexergroup.com/sv",
    description: "Svensk IT-konsult med global räckvidd. Stark kompetens inom Dynamics 365 och digital transformation för medelstora och stora företag.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Retail", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "PWC",
    logo: "https://www.pwc.com/content/dam/pwc/gx/en/logos/pwc-logo.svg",
    website: "https://www.pwc.se",
    description: "Global konsult- och revisionsjätte med omfattande Dynamics 365-praktik. Fokus på finans, revision och stora enterprise-transformationer.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Regentor",
    logo: "",
    website: "https://regentor.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Releye",
    logo: "https://releye.se/wp-content/uploads/2022/01/releye-logo.svg",
    website: "https://releye.se",
    description: "Microsoft-partner med fokus på Dynamics 365 och Power Platform. Hjälper företag att automatisera processer och förbättra kundupplevelser.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Right People Group",
    logo: "",
    website: "https://rightpeoplegroup.com",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Sherpas",
    logo: "https://sherpas.se/wp-content/uploads/2022/01/sherpas-logo.svg",
    website: "https://sherpas.se",
    description: "Nordic Microsoft Expert Partner med fokus på kundupplevelser och digital transformation. Specialister på Dynamics 365 och Power Platform.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Tjänsteföretag", "E-handel", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Sirocco Group",
    logo: "https://siroccogroup.com/wp-content/uploads/2022/01/sirocco-logo.svg",
    website: "https://siroccogroup.com",
    description: "International Microsoft Dynamics 365 Partner med fokus på CRM och kundengagemang. Expert på kundupplevelser och digital transformation.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "E-handel", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Softronic",
    logo: "https://softronic.se/wp-content/uploads/2022/01/softronic-logo.svg",
    website: "https://softronic.se",
    description: "Svensk IT-konsult med lång erfarenhet av Microsoft-lösningar. Fokus på systemutveckling och digitalisering för offentlig sektor och stora företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Sogeti",
    logo: "https://www.sogeti.se/globalassets/sogeti-logo.svg",
    website: "https://www.sogeti.se",
    description: "Vi är Valuemakers. Del av Capgemini-gruppen med fokus på teknisk implementation, utveckling och Power Platform.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Tjänsteföretag", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Sopra Steria",
    logo: "https://www.soprasteria.com/~/media/soprasteria/soprasteria-logo.svg",
    website: "https://www.soprasteria.se",
    description: "Europeisk teknologikonsult med stark närvaro i Norden. Omfattande Dynamics 365-kompetens för offentlig sektor och stora företag.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Offentlig sektor", "Bank & Finans", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Stratiteq",
    logo: "",
    website: "https://stratiteq.com",
    description: "Microsoft Dynamics 365-partner med fokus på CRM och Customer Engagement.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag"],
    companySize: ["Medelstora"]
  },
  {
    name: "TCS (Tata Consultancy Services)",
    logo: "https://www.tcs.com/content/dam/tcs/images/logos/tcs-logo.svg",
    website: "https://www.tcs.com",
    description: "Global IT-tjänsteleverantör och en av världens största Microsoft-partners. Fokus på stora enterprise-transformationer och globala implementationer.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Bank & Finans", "Retail", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "TietoEvry",
    logo: "https://www.tietoevry.com/siteassets/company/images/logos/tietoevry_logo.svg",
    website: "https://www.tietoevry.com/sv",
    description: "Nordisk teknologijätte med bred Dynamics 365-kompetens. Stark inom offentlig sektor, finans och stora enterprise-kunder.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Offentlig sektor", "Bank & Finans"],
    companySize: ["Stora"]
  },
  {
    name: "Triatech",
    logo: "",
    website: "https://triatech.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Two i Sverige (CombinedX)",
    logo: "https://two.se/wp-content/uploads/2023/01/two-logo.svg",
    website: "https://two.se",
    description: "We are CombinedX. Experter på affärssystem och business intelligence. Minut för minut ser vi till att det gör det.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Update Affärssystem",
    logo: "",
    website: "https://updateab.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Xenit",
    logo: "",
    website: "https://xenit.se",
    description: "Microsoft Dynamics 365 Business Central-partner med fokus på molnlösningar.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Yellow Solutions",
    logo: "",
    website: "https://yellowsolutions.se",
    description: "Microsoft Dynamics 365 Business Central-partner.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Zelly (Aderian Group)",
    logo: "https://zelly.se/wp-content/uploads/2022/01/zelly-logo.svg",
    website: "https://zelly.se",
    description: "Microsoft Dynamics 365 Partner med fokus på CRM och kundservice. Specialister på att bygga starka kundrelationer och optimera serviceprocesser.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  }
];

// CRM applications for filtering
export const crmApplications = ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"];
