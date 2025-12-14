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
    website: "https://absfront.se/erbjudanden/crm/",
    description: "Absfront är specialister på CRM och Customer Experience inom Microsoft Dynamics 365, Power Platform och Data. De hjälper företag att skapa kundupplevelser utan gränser genom att kombinera strategi, teknik och förändringsledning. Med fokus på att bygga starka kundrelationer erbjuder de helhetslösningar från behovsanalys till implementation och vidareutveckling.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Accenture",
    logo: "https://www.accenture.com/content/dam/accenture/final/images/icons/symbol/Accent_Global_Subbrand_Logo.svg",
    website: "https://www.accenture.com/se-en/services/microsoft-index",
    description: "Accenture är en global konsultjätte och en av världens största Microsoft-partners med omfattande expertis inom Dynamics 365. De fokuserar på stora digitala transformationsprojekt för enterprise-kunder och kombinerar djup branschkunskap med teknisk spetskompetens. Som strategisk partner hjälper de organisationer att omforma sina affärsprocesser genom intelligent automation och AI-drivna lösningar.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Retail", "Energisektorn", "Offentlig sektor"],
    companySize: ["Stora"]
  },
  {
    name: "Accigo",
    logo: "https://accigo.se/wp-content/uploads/2023/01/Accigo-logo.svg",
    website: "https://accigo.se/microsoft-dynamics-365/",
    description: "Accigo utsågs till Microsoft Dynamics 365 Partner of The Year 2024 i Sverige. De är en nordisk Microsoft-partner som driver smart digital transformation med fokus på Customer Engagement, Power Platform och Modern Work. Med Microsoft Solutions Partner-certifiering inom Business Applications, Modern Work och Security levererar de enligt Microsofts högsta standard och hjälper företag att förflytta verksamheter genom digital förändring.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "Bank & Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Avanade",
    logo: "https://www.avanade.com/-/media/logo/avanade-logo.svg",
    website: "https://www.avanade.com/sv-se/solutions/microsoft-business-applications",
    description: "Avanade är ett joint venture mellan Accenture och Microsoft och världens största leverantör av Microsoft-tjänster. Med djup expertis inom hela Dynamics 365-plattformen levererar de end-to-end-lösningar för enterprise-kunder. De kombinerar affärsförståelse med teknisk innovation för att hjälpa organisationer att modernisera sina verksamhetskritiska processer inom försäljning, service, ekonomi och supply chain.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Bank & Finans", "Retail", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Azets",
    logo: "https://www.azets.se/globalassets/azets-logo.svg",
    website: "https://www.azets.se/affarslosningar/affarssystem/",
    description: "Azets är en nordisk leverantör av affärssystem och redovisningstjänster med stark kompetens inom Dynamics 365 Business Central. De erbjuder en unik kombination av systemleverans och ekonomitjänster, vilket ger kunder tillgång till både teknisk expertis och redovisningskompetens. Deras helhetslösning passar särskilt företag som vill ha en partner för både affärssystem och ekonomisk rådgivning.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "B3 Consulting Group",
    logo: "https://b3.se/wp-content/uploads/2022/01/b3-logo.svg",
    website: "https://b3.se/erbjudanden/microsoft/",
    description: "B3 Consulting Group är en svensk IT- och managementkonsult med bred Dynamics 365-kompetens. De fokuserar på digital transformation och affärsutveckling för medelstora och stora företag, och kombinerar strategisk rådgivning med teknisk implementation. Med erfarenhet från både privat och offentlig sektor hjälper de organisationer att realisera värdet av sina Microsoft-investeringar.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "Offentlig sektor", "Bank & Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Bedege",
    logo: "",
    website: "https://bedege.se",
    description: "Bedege är en specialiserad Microsoft Dynamics 365 Business Central-partner som hjälper svenska företag med implementation och support av affärssystem. De fokuserar på att leverera anpassade lösningar som möter kundernas specifika verksamhetsbehov och erbjuder personlig service genom hela projektets livscykel.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "BE-terna",
    logo: "https://www.be-terna.com/hubfs/BE-terna%20Logo.svg",
    website: "https://www.be-terna.com/sv/losningar/microsoft",
    description: "BE-terna är en internationell partner som vägleder företag till en säker digital framtid. Som del av Telefónica Tech erbjuder de ERP, CRM, BI, dataanalys och automationslösningar i samarbete med Microsoft, Infor, Qlik och UiPath. De levererar branschspecifika lösningar perfekt anpassade för tillverkning, retail och distribution, med fokus på att förbättra verksamhet och servicekvalitet.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Retail", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Bisqo",
    logo: "https://bisqo.se/wp-content/uploads/2022/01/bisqo-logo.svg",
    website: "https://www.bisqo.se/businesscentral/",
    description: "Bisqo är experter inom Dynamics 365 Business Central och CRM på Power Platform. Deras strategi bygger på en kraftfull kombination av ERP och CRM där de skapar smarta, skalbara och framtidssäkra lösningar. Med fokus på standardiserade system, paketlösningar och serviceavtal hjälper de svenska företag att effektivisera sina affärsprocesser och få snabb start med långsiktig utveckling.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Capgemini",
    logo: "https://www.capgemini.com/wp-content/themes/capgemini2020/assets/images/logo.svg",
    website: "https://www.capgemini.com/solutions/microsoft/",
    description: "Capgemini är en global konsultjätte med omfattande Dynamics 365-praktik och djup branschexpertis. De fokuserar på stora transformationsprojekt för enterprise-kunder och kombinerar strategisk rådgivning med teknisk implementation. Med närvaro i över 50 länder hjälper de multinationella organisationer att modernisera sina affärsprocesser genom Microsoft-teknologi och AI-drivna lösningar.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Retail", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Cegeka",
    logo: "https://www.cegeka.com/hubfs/Cegeka_September2022/Images/cegeka-logo.svg",
    website: "https://www.cegeka.com/sv-se/solutions/microsoft",
    description: "Cegeka är en europeisk IT-partner med fokus på digital transformation och stark kompetens inom Dynamics 365 och Azure. De hjälper medelstora och stora företag att optimera sina affärsprocesser genom molnbaserade lösningar och erbjuder end-to-end-tjänster från strategi till implementation och förvaltning.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Cepheo",
    logo: "https://cepheo.com/wp-content/uploads/2022/01/cepheo-logo.svg",
    website: "https://cepheo.com/solutions/erp/",
    description: "Cepheo är en av de mest erfarna Microsoft Dynamics 365-partners i Norden med över 37 års branscherfarenhet och 28 års samarbete med Microsoft. Med mer än 450 specialister på 13 platser i Skandinavien levererar de Digital Empowerment genom full-stack-lösningar baserade på Dynamics 365, Power Platform och Azure. De hjälper företag att framtidssäkra sin verksamhet och utnyttja kraften i data och teknik för bättre beslut.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Coligo",
    logo: "",
    website: "https://coligo.se",
    description: "Coligo är en Microsoft Dynamics 365 Business Central-partner med fokus på molnlösningar för svenska företag. De hjälper organisationer att migrera till molnet och optimera sina affärsprocesser genom moderna, skalbara lösningar.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Columbus",
    logo: "https://www.columbusglobal.com/hubfs/columbus-logo-black.svg",
    website: "https://www.columbusglobal.com/sv/microsoft-dynamics-365",
    description: "Columbus är en global Dynamics 365-partner med stark nordisk närvaro och mottot 'Digital Value. Human Intelligence'. De hjälper organisationer att transformera sin verksamhet genom att maximera investeringar i Microsoft-teknologi och förbereda dem för framtiden. Med djup branschexpertis inom tillverkning, retail och distribution levererar de helhetslösningar inom ERP och CRM som kombinerar kultur, processer och ny teknologi.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Retail", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Cosmo Consult",
    logo: "https://www.cosmoconsult.com/fileadmin/_processed_/5/8/csm_COSMO_CONSULT_Logo_RGB_b35e8c5f3e.png",
    website: "https://www.cosmoconsult.com/se-sv/loesningar/microsoft-dynamics-365-business-central/",
    description: "Cosmo Consult är en internationell Dynamics 365-partner med stark närvaro i Norden och specialistkompetens inom Business Central. De erbjuder egna branschlösningar för tillverkning, tjänsteföretag och distribution, och kombinerar standardfunktionalitet med anpassningar för specifika verksamhetsbehov. Med fokus på digital transformation hjälper de företag att effektivisera sina processer.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Tjänsteföretag", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "CRM Konsulterna",
    logo: "https://crmkonsulterna.se/wp-content/uploads/2023/01/crmk-logo.svg",
    website: "https://www.crmkonsulterna.se/dynamics-365/",
    description: "CRM Konsulterna utsågs till Dynamics 365 Customer Engagement Partner of the Year 2023 av Microsoft Sverige. De placerar kunden i centrum och är övertygade om att starka kundrelationer är grunden för lyckade affärer. Med specialisering på Dynamics 365 CE och Power Platform stöttar de företag genom hela kundresan – från marknad och sälj till kundservice – med inbyggd AI och automatisering.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Dizparc",
    logo: "https://dizparc.com/wp-content/uploads/2023/01/dizparc-logo-white.svg",
    website: "https://dizparc.se/erbjudande/affarssystem/",
    description: "Dizparc hjälper företag att förverkliga sin digitala potential genom lokala verksamheter på flera orter i Sverige. De skapar hållbara digitala lösningar med fokus på affärssystem, e-handel och molnbaserad infrastruktur. Med gedigen verksamhetsförståelse och förändringsledning hjälper de företag att öka lönsamhet och konkurrensfördelar genom Dynamics 365 Business Central.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "ECIT",
    logo: "https://www.ecit.com/wp-content/uploads/2021/08/ecit-logo.svg",
    website: "https://www.ecit.com/se/affarssystem/",
    description: "ECIT är en nordisk IT-partner som erbjuder hög kompetens, tjänster och produkter inom ekonomi, IT och affärslösningar. Med mottot 'Din partner – nu och i framtiden' kombinerar de systemlösningar med lön- och redovisningstjänster. De hjälper företag att välja rätt affärssystem och erbjuder långsiktigt partnerskap för både teknik och ekonomifunktion.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail", "Grossist"],
    companySize: ["Små", "Medelstora", "Stora"]
  },
  {
    name: "Engage Group",
    logo: "https://engagegroup.se/wp-content/uploads/2022/01/engage-group-logo.svg",
    website: "https://engagenow.com/our-services/",
    description: "Engage Group är 'Experts in Dynamics 365' med en bevisad meritlista inom globala utrullningar. De tillhör den exklusiva Microsoft Inner Circle – topp 1% av alla Microsoft-partners världen över. Med djup Dynamics 365-expertis levererar de skalbara lösningar som maximerar ROI för stora organisationer och hjälper dem att utnyttja kraften i Microsoft-plattformen fullt ut.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tjänsteföretag"],
    companySize: ["Medelstora"]
  },
  {
    name: "Exsitec (Brightcom)",
    logo: "https://excitec.se/wp-content/uploads/2022/01/excitec-logo.svg",
    website: "https://excitec.se/affarssystem/",
    description: "Exsitec, del av Brightcom-gruppen, är specialister på Microsoft Dynamics 365 Business Central och Power Platform för svenska företag. De kombinerar affärssystemexpertis med Power Platform-kompetens för att hjälpa kunder att automatisera processer och skapa moderna, integrerade lösningar.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "EY",
    logo: "https://assets.ey.com/content/dam/ey-sites/ey-com/en_gl/generic/logos/20170526-ey-logo.svg",
    website: "https://www.ey.com/sv_se/services/consulting/technology/microsoft",
    description: "EY är en global konsult- och revisionsjätte med omfattande Dynamics 365-praktik. De fokuserar på stora transformationsprojekt inom finans och revision för enterprise-kunder, och kombinerar djup branschkunskap med teknisk expertis. Med global räckvidd hjälper de multinationella organisationer att modernisera sina affärsprocesser och uppnå digitala ambitioner.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Fellowmind",
    logo: "https://www.fellowmind.com/globalassets/images/fellowmind-logo.svg",
    website: "https://www.fellowmind.com/sv-se/tjanster/microsoft-dynamics-365/",
    description: "Fellowmind utsågs till Microsoft EMEA Channel Partner of the Year 2025 – det mest prestigefyllda partnerpriset i Europa. Med mottot 'Creating Connected Companies' hjälper de människor att trivas med teknologi i arbetet. Som en av Nordens största Dynamics 365-partners erbjuder de bred kompetens inom både ERP och CRM, och har framgångsrikt hjälpt kunder som Fastighets AB Balder och Hässelby Blommor att digitalisera sina affärsprocesser.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Grossist", "Tjänsteföretag", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Forefront Consulting",
    logo: "",
    website: "https://forefront.se/erbjudande/microsoft/",
    description: "Forefront Consulting är en Microsoft Dynamics 365 Finance & Supply Chain Management-partner med fokus på tillverkande företag och grossister. De kombinerar teknisk expertis med affärsförståelse för att hjälpa företag att optimera sina verksamhetskritiska processer.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "FourOne",
    logo: "https://fourone.se/wp-content/uploads/2023/01/fourone-logo.svg",
    website: "https://fourone.se/erp/",
    description: "FourOne är en nordisk specialist på Dynamics 365 Finance & Supply Chain Management med fokus på tjänsteföretag och e-handel. De hjälper företag att implementera och optimera sina ERP-lösningar och erbjuder expertis inom integration och automation.",
    applications: ["Finance & SCM"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Fujitsu",
    logo: "https://www.fujitsu.com/global/Images/fujitsu-logo.svg",
    website: "https://www.fujitsu.com/se/services/application-modernization/enterprise-applications/",
    description: "Fujitsu är en global IT-tjänsteleverantör med omfattande Microsoft-partnerskap och närvaro i Sverige. De erbjuder Dynamics 365-lösningar för stora enterprise-kunder inom tillverkning, offentlig sektor och energisektorn, med fokus på kompletta digitala transformationer.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Goodfellows",
    logo: "https://goodfellows.se/wp-content/uploads/2021/03/goodfellows-logo.svg",
    website: "https://goodfellows.se/affarssystem/",
    description: "Goodfellows, som blivit en del av Upheads, erbjuder personlig IT-service med fokus på Dynamics 365 Business Central. Med mottot 'Välkommen till det goda livet' kombinerar de affärssystemexpertis med IT-support och drift för att ge kunder en helhetslösning.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Haldor",
    logo: "",
    website: "https://haldor.se",
    description: "Haldor är en Microsoft Dynamics 365 Business Central-partner som erbjuder implementation och support för svenska företag. De fokuserar på att leverera anpassade lösningar som möter specifika verksamhetsbehov.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "HCL Technologies",
    logo: "https://www.hcltech.com/themes/custom/flavor/logo.svg",
    website: "https://www.hcltech.com/technology-software-services/enterprise-application-services/microsoft-ecosystem",
    description: "HCL Technologies är en global IT-tjänsteleverantör med omfattande Microsoft Dynamics 365-erfarenhet och stark närvaro inom stora enterprise-implementationer. De hjälper multinationella organisationer att modernisera sina affärsprocesser genom end-to-end-lösningar som kombinerar affärsförståelse med teknisk innovation.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Bank & Finans", "Retail"],
    companySize: ["Stora"]
  },
  {
    name: "HSO",
    logo: "https://www.hso.com/hubfs/HSO_Logo.svg",
    website: "https://www.hso.com/solutions/microsoft-dynamics-365",
    description: "HSO utsågs till vinnare av 2025 Microsoft Dynamics 365 Sales & Customer Insights Partner of the Year Award. De är en global Microsoft-partner specialiserad på Dynamics 365 och molntjänster, med stark branschexpertis inom tillverkning, distribution och retail. Med investeringar från Bain Capital accelererar de AI-driven tillväxt och hjälper kunder att omvandla AI till verklig affärsnytta.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Implema",
    logo: "https://www.implema.se/wp-content/uploads/2021/03/implema-logo.svg",
    website: "https://implema.se/microsoft-dynamics/",
    description: "Implema hjälper företag att accelerera sin affär med mottot 'Snabbt, säkert och redo för framtiden'. De är specialister på både SAP och Microsoft Dynamics med fokus på Finance & Supply Chain Management. Med gedigen erfarenhet av ERP-implementationer hjälper de tillverkande företag och grossister att optimera sina verksamhetskritiska processer.",
    applications: ["Finance & SCM"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "InBiz",
    logo: "https://www.inbiz.se/wp-content/uploads/2021/08/inbiz-logo.png",
    website: "https://www.inbiz.se/microsoft-partner/",
    description: "InBiz är din trygga partner för Microsoft Dynamics 365 Business Central sedan 2005. De arbetar med distribuerande företag, tjänsteföretag med avtals- och projektbaserad verksamhet samt tillverkande industrier. Med färdiga lösningsförslag, tilläggslösningar och processkompetens ger de en förutsebar resa i både implementation av nya system och vidareutveckling av befintliga miljöer. Användarvänlighet, robusthet och automatisering är ledorden.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Innofactor",
    logo: "https://www.innofactor.com/hubfs/Innofactor_Logo.svg",
    website: "https://www.innofactor.com/se/vad-vi-gor/losningar/dynamics-365/",
    description: "Innofactor är en Microsoft Cloud Solutions Partner med Microsofts högsta partnerbeteckning. Med 'Years of Innovating to Make the World Work Better' som vision hjälper de företag att digitalisera och utveckla affärsprocesser genom hela Microsofts lösningsportfölj. De har expertis inom Modern Work, Business Applications, Security, Azure och AI och hjälper kunder att dra nytta av GPT och AI-teknologi.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service"],
    industries: ["Offentlig sektor", "Tjänsteföretag", "Bank & Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Itm8 (Addpro)",
    logo: "",
    website: "https://itm8.se/affarssystem/",
    description: "Itm8, tidigare Addpro, är en Microsoft Dynamics 365 Business Central-partner som hjälper svenska företag med affärssystemlösningar. De erbjuder implementation, anpassning och support för att optimera verksamhetsprocesser och stödja tillväxt.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "JMA Maskindata",
    logo: "https://jma.se/wp-content/uploads/2022/01/jma-logo.svg",
    website: "https://jma.se/affarssystem/",
    description: "JMA Maskindata är specialister på affärssystem för tillverkande företag med lång erfarenhet av Microsoft Dynamics och branschanpassade lösningar. De förstår tillverkningsindustrins unika behov och erbjuder lösningar som optimerar produktion, lager och ekonomi i en integrerad plattform.",
    applications: ["Business Central"],
    industries: ["Tillverkning"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Knowit",
    logo: "https://www.knowit.se/globalassets/knowit-logo.svg",
    website: "https://www.knowit.se/vart-erbjudande/solutions/",
    description: "Knowit är en nordisk digitaliseringskonsult med bred Microsoft-kompetens och fokus på hållbar digitalisering. Med mottot 'Building the future takes a whole set of digitalization skills' kombinerar de strategi, design och teknik för att hjälpa företag att skapa en hållbar framtid. De har erfarenhet från både privat och offentlig sektor.",
    applications: ["Finance & SCM"],
    industries: ["Tjänsteföretag", "Offentlig sektor", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "KPMG",
    logo: "https://assets.kpmg.com/content/dam/kpmg/share/logo/kpmg-logo.svg",
    website: "https://kpmg.com/se/sv/home/tjanster/advisory/microsoft.html",
    description: "KPMG är en global konsult- och revisionsjätte med omfattande Dynamics 365-praktik. De fokuserar på finans, revision och stora transformationsprojekt för enterprise-kunder och kombinerar djup branschkunskap med teknisk expertis för att hjälpa organisationer att modernisera sina verksamhetskritiska processer.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Lumini",
    logo: "",
    website: "https://lumini.se",
    description: "Lumini är en Microsoft Dynamics 365 Business Central-partner som erbjuder implementation och support för svenska företag. De fokuserar på att leverera anpassade lösningar som möter kundernas verksamhetsbehov.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Midpoint",
    logo: "",
    website: "https://midpoint.se",
    description: "Midpoint är en Microsoft Dynamics 365 Business Central-partner som hjälper svenska företag med affärssystemlösningar. De erbjuder implementation, anpassning och support för att optimera verksamhetsprocesser.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "NAB Solutions",
    logo: "https://www.nabsolutions.se/wp-content/uploads/2021/03/nab-logo.png",
    website: "https://www.nabsolutions.se/dynamics-365-business-central/",
    description: "NAB Solutions är specialister på Dynamics 365 Business Central med lång erfarenhet av implementationer för svenska företag. De har särskilt fokus på tillverkning och distribution och erbjuder både implementation av nya system och förvaltning av befintliga lösningar. Med branschkunskap och teknisk expertis hjälper de kunder att få ut maximalt värde.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navcite",
    logo: "https://navcite.se/wp-content/uploads/2022/01/navcite-logo.svg",
    website: "https://www.navcite.com/microsoft-business-central/",
    description: "Navcite kombinerar 'Small company feeling – Big company experience' och erbjuder affärssystem med Infor M3 och Microsoft Business Central. De förstår att varje företag är unikt och fokuserar på att leverera lösningar som passar specifika verksamhetsbehov. Med lokal närvaro och personlig service hjälper de tillverkande företag och grossister.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navet (Aderian Group)",
    logo: "https://navet.se/wp-content/uploads/2020/12/navet-logo.svg",
    website: "https://navet.se/affarssystem/",
    description: "Navet, del av Aderian Group, skapar bättre affärer tillsammans med sina kunder. Med mottot 'Vi förstår verksamheter, teknik och relationer' kombinerar de affärsförståelse med teknisk expertis. De hjälper företag inom retail och tjänstesektorn att välja och implementera rätt affärssystem för sina behov.",
    applications: ["Business Central"],
    industries: ["Retail", "Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navipro (Evidi)",
    logo: "https://navipro.se/wp-content/uploads/2024/01/evidi-logo.svg",
    website: "https://navipro.se/dynamics-365-business-central/",
    description: "Navipro har transformerats till Evidi – 'A New Era of Possibilities'. Som nordisk Microsoft-partner erbjuder de djup expertis inom hela Microsoft-plattformen med fokus på Dynamics 365 Business Central. De hjälper företag att modernisera sina affärsprocesser och utnyttja nya möjligheter i molnet.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Nemely",
    logo: "https://nemely.se/wp-content/uploads/2022/01/nemely-logo.svg",
    website: "https://nemely.se/dynamics-365/",
    description: "Nemely är en Microsoft Dynamics 365 Partner specialiserad på CRM och kundengagemang. De hjälper företag att optimera sina kundrelationer genom Dynamics 365 Sales, Customer Service och Marketing, med fokus på att skapa värde genom bättre kundupplevelser och effektivare processer.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Nexer",
    logo: "https://nexergroup.com/wp-content/uploads/2022/01/nexer-logo.svg",
    website: "https://nexergroup.com/sv/tjanster/dynamics-365/",
    description: "Nexer är en svensk IT-konsult med global räckvidd och stark kompetens inom Dynamics 365 och digital transformation. De erbjuder ett brett tjänsteutbud inom design, kommunikation, tech och utveckling och hjälper medelstora och stora företag att skapa konkurrensfördelar genom digitalisering.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Retail", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "PWC",
    logo: "https://www.pwc.com/content/dam/pwc/gx/en/logos/pwc-logo.svg",
    website: "https://www.pwc.se/sv/tjanster/consulting/technology/microsoft.html",
    description: "PWC är en global konsult- och revisionsjätte med omfattande Dynamics 365-praktik. De fokuserar på finans, revision och stora enterprise-transformationer och kombinerar strategisk rådgivning med teknisk implementation. Med djup branschkunskap hjälper de organisationer att modernisera sina verksamhetskritiska processer.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Bank & Finans", "Offentlig sektor", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Regentor",
    logo: "",
    website: "https://regentor.se",
    description: "Regentor är en Microsoft Dynamics 365 Business Central-partner som erbjuder implementation och support för svenska företag. De fokuserar på att leverera anpassade lösningar som möter specifika verksamhetsbehov.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Releye",
    logo: "https://releye.se/wp-content/uploads/2022/01/releye-logo.svg",
    website: "https://releye.se/dynamics-365/",
    description: "Releye är en Microsoft-partner med fokus på Dynamics 365 och Power Platform. De hjälper företag att automatisera processer och förbättra kundupplevelser genom moderna, integrerade lösningar som kombinerar CRM med Power Apps och Power Automate.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Right People Group",
    logo: "",
    website: "https://rightpeoplegroup.com/sv/it-konsult/microsoft-dynamics/",
    description: "Right People Group är en Microsoft Dynamics 365 Business Central-partner som erbjuder konsulttjänster och resursbemanning för svenska företag. De hjälper organisationer att hitta rätt kompetens för sina Dynamics 365-projekt.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Sherpas",
    logo: "https://sherpas.se/wp-content/uploads/2022/01/sherpas-logo.svg",
    website: "https://sherpas.se/plattformar/dynamics-365-f-scm/",
    description: "Sherpas hjälper företag och organisationer med data, system och digitalisering. Med kontor i Skellefteå och Stockholm påstår de att 'bära kartan är en sak, att ha någon som kan visa dig vägen är en helt annan'. De erbjuder Dynamics 365 Finance & SCM och Business Central samt egna lösningar som Sherpas Projektportal och VLS.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Tjänsteföretag", "E-handel", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Sirocco Group",
    logo: "https://siroccogroup.com/wp-content/uploads/2022/01/sirocco-logo.svg",
    website: "https://www.siroccogroup.com/microsoft-dynamics-365/",
    description: "Sirocco Group är en internationell boutique-konsult och utvecklingsbyrå specialiserad på CRM och digital transformation. Som oberoende och kundfokuserad partner överbryggar de gapet mellan affärsbehov, processer och teknologi. De är ledande inom kundrelationshantering och säljautomation för företag med höga ambitioner.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "E-handel", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Softronic",
    logo: "https://softronic.se/wp-content/uploads/2022/01/softronic-logo.svg",
    website: "https://www.softronic.se/services/microsoft-dynamics-365/",
    description: "Softronic är en svensk IT-konsult med mottot 'GoodTech – ledande teknik som gör gott i samhället'. De erbjuder innovativa digitala lösningar som skapar verklig samhällsnytta och har lång erfarenhet av Microsoft-lösningar. Med fokus på offentlig sektor och tjänsteföretag hjälper de organisationer att digitalisera för en mer hållbar framtid.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Sogeti",
    logo: "https://www.sogeti.se/globalassets/sogeti-logo.svg",
    website: "https://www.sogeti.se/tjanster/microsoft/",
    description: "Sogeti är 'Valuemakers' och del av Capgemini-gruppen med fokus på teknisk implementation, utveckling och Power Platform. De kombinerar global kraft med lokal närvaro och hjälper medelstora och stora företag att realisera värdet av sina Microsoft-investeringar genom expertis inom Dynamics 365 och Azure.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Tjänsteföretag", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Sopra Steria",
    logo: "https://www.soprasteria.com/~/media/soprasteria/soprasteria-logo.svg",
    website: "https://www.soprasteria.se/losningar/microsoft",
    description: "Sopra Steria är en europeisk teknologikonsult med stark närvaro i Norden och omfattande Dynamics 365-kompetens. De fokuserar på offentlig sektor och stora företag inom finans och energi, och erbjuder end-to-end-lösningar från strategi till implementation och förvaltning.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Offentlig sektor", "Bank & Finans", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "Stratiteq",
    logo: "",
    website: "https://stratiteq.com/solutions/microsoft-dynamics-365/",
    description: "Stratiteq är en Microsoft Dynamics 365-partner med fokus på CRM och Customer Engagement. De hjälper medelstora företag att optimera sina kundrelationer och säljprocesser genom moderna, integrerade lösningar.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag"],
    companySize: ["Medelstora"]
  },
  {
    name: "TCS (Tata Consultancy Services)",
    logo: "https://www.tcs.com/content/dam/tcs/images/logos/tcs-logo.svg",
    website: "https://www.tcs.com/what-we-do/products-platforms/microsoft-business-applications",
    description: "TCS är en global IT-tjänsteleverantör och en av världens största Microsoft-partners. De fokuserar på stora enterprise-transformationer och globala implementationer av Dynamics 365, med omfattande branscherfarenhet inom tillverkning, finans, retail och energi.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Tillverkning", "Bank & Finans", "Retail", "Energisektorn"],
    companySize: ["Stora"]
  },
  {
    name: "TietoEvry",
    logo: "https://www.tietoevry.com/siteassets/company/images/logos/tietoevry_logo.svg",
    website: "https://www.tietoevry.com/sv/tjanster/microsoft/",
    description: "TietoEvry är en nordisk teknologijätte med bred Dynamics 365-kompetens och stark position inom offentlig sektor och finans. De erbjuder helhetslösningar som kombinerar branschkunskap med teknisk expertis och hjälper stora organisationer att modernisera sina affärsprocesser.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations", "Commerce", "Human Resources"],
    industries: ["Offentlig sektor", "Bank & Finans"],
    companySize: ["Stora"]
  },
  {
    name: "Triatech",
    logo: "",
    website: "https://triatech.se",
    description: "Triatech är en Microsoft Dynamics 365 Business Central-partner som erbjuder implementation och support för svenska företag. De fokuserar på att leverera anpassade lösningar som möter specifika verksamhetsbehov.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Two i Sverige (CombinedX)",
    logo: "https://two.se/wp-content/uploads/2023/01/two-logo.svg",
    website: "https://two.se/erp-hos-two/business-central/",
    description: "Two, del av CombinedX, är experter på affärssystem och business intelligence. Med mottot 'Minut för minut ser vi till att det gör det' erbjuder de Dynamics 365 Business Central och Jeeves ERP tillsammans med Power BI. De ger företag möjlighet att ta rätt beslut i rätt tid genom insikter och lösningar som ökar tempot.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Grossist", "Retail"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Update Affärssystem",
    logo: "",
    website: "https://updateab.se",
    description: "Update Affärssystem är en Microsoft Dynamics 365 Business Central-partner som erbjuder implementation och support för svenska företag. De fokuserar på att leverera anpassade lösningar som möter specifika verksamhetsbehov.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Xenit",
    logo: "",
    website: "https://xenit.se/dynamics-365/",
    description: "Xenit är en Microsoft Dynamics 365 Business Central-partner med fokus på molnlösningar. De hjälper svenska företag att migrera till molnet och optimera sina affärsprocesser genom moderna, skalbara lösningar i Azure.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Yellow Solutions",
    logo: "",
    website: "https://yellowsolutions.se",
    description: "Yellow Solutions är en Microsoft Dynamics 365 Business Central-partner som erbjuder implementation och support för svenska företag. De fokuserar på att leverera anpassade lösningar som möter specifika verksamhetsbehov.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Zelly (Aderian Group)",
    logo: "https://zelly.se/wp-content/uploads/2022/01/zelly-logo.svg",
    website: "https://zelly.se/dynamics-365/",
    description: "Zelly, del av Aderian Group, är en Microsoft Dynamics 365 Partner med fokus på CRM och kundservice. De är specialister på att bygga starka kundrelationer och optimera serviceprocesser genom Dynamics 365 Customer Engagement och Power Platform.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tjänsteföretag", "E-handel"],
    companySize: ["Små", "Medelstora"]
  }
];

// CRM applications for filtering
export const crmApplications = ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"];

// All unique industries from partners
export const allIndustries = [
  "Alla branscher",
  "Tillverkning",
  "Tjänsteföretag", 
  "E-handel",
  "Retail",
  "Distribution",
  "Bygg & Fastighet",
  "Logistik",
  "Bank & Finans",
  "Energisektorn",
  "Offentlig sektor",
  "Tech"
];
