import { useState } from "react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, Building2, Globe, Boxes, Link2, Server, AlertTriangle, BarChart3, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import SelectionCard from "@/components/SelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Contact form validation schema
const contactFormSchema = z.object({
  companyName: z.string().trim().min(1, "Företagsnamn krävs").max(100, "Företagsnamn får max vara 100 tecken"),
  contactName: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
  phone: z.string().trim().min(1, "Telefonnummer krävs").max(20, "Telefonnummer får max vara 20 tecken"),
  email: z.string().trim().min(1, "E-postadress krävs").email("Ogiltig e-postadress").max(255, "E-postadress får max vara 255 tecken"),
});

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;

interface AnalysisData {
  // Step 1
  employees: string;
  revenue: string;
  // Step 2
  industry: string;
  industryOther: string;
  // Step 3
  geography: string;
  geographyOther: string;
  // Step 4
  modules: string[];
  modulesOther: string;
  // Step 5
  integrations: string[];
  integrationsOther: string;
  // Step 6
  currentSystems: { product: string; year: string }[];
  otherSystems: string[];
  otherSystemsDetails: string;
  // Step 7
  challenges: string[];
  challengesOther: string;
  // Step 8
  kpis: string[];
  kpisOther: string;
  // Step 9
  aiInterest: string;
  aiUseCases: string[];
  aiDetails: string;
  // Step 10
  additionalInfo: string;
  // Contact info
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}

const initialData: AnalysisData = {
  employees: "",
  revenue: "",
  industry: "",
  industryOther: "",
  geography: "",
  geographyOther: "",
  modules: [],
  modulesOther: "",
  integrations: [],
  integrationsOther: "",
  currentSystems: [
    { product: "", year: "" },
    { product: "", year: "" },
    { product: "", year: "" },
  ],
  otherSystems: [],
  otherSystemsDetails: "",
  challenges: [],
  challengesOther: "",
  kpis: [],
  kpisOther: "",
  aiInterest: "",
  aiUseCases: [],
  aiDetails: "",
  additionalInfo: "",
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
};

const employeeOptions = [
  "1-49 anställda",
  "50-99 anställda",
  "100-249 anställda",
  "250-999 anställda",
  "1.000-4.999 anställda",
  "Mer än 5.000 anställda",
];

const revenueOptions = [
  "1-9 MSEK",
  "10-49 MSEK",
  "50-499 MSEK",
  "500-999 MSEK",
  "1.000-4.999 MSEK",
  "> 5.000 MSEK",
];

const industryOptions = [
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
  "Nonprofit",
];

const geographyOptions = [
  "Endast Sverige",
  "Norden",
  "Europa",
  "Globalt",
  "Specifika länder",
];

const moduleOptions = [
  "Ekonomi & Redovisning",
  "Försäljning & CRM",
  "Inköp & Leverantörer",
  "Lager & Logistik",
  "Produktion & Montering",
  "Projekthantering",
  "Service & Fältservice",
  "Offert & Order",
  "E-handel",
  "Business Intelligence & Rapportering",
];

const integrationOptions = [
  "E-handelsplattform",
  "CRM-system",
  "Transportbokning",
  "Microsoft 365",
  "BI/Rapportverktyg",
  "WMS/3PL",
];

const erpSystemOptions = [
  "Microsoft Dynamics NAV",
  "Microsoft Dynamics AX",
  "SAP",
  "Oracle",
  "Visma",
  "Fortnox",
  "Pyramid",
  "Monitor",
  "Jeeves",
  "IFS",
  "Infor",
  "Sage",
  "Unit4",
];

const otherSystemOptions = [
  "Microsoft 365 (Office)",
  "Power BI",
  "CRM-system",
  "Ärendehantering/Servicesystem",
  "Microsoft Teams",
  "SharePoint",
  "CAD-system",
];

const challengeOptions = [
  "Stark tillväxt eller internationalisering",
  "Större omorganisation/koncernstruktur",
  "Förvärv/sammanslagning",
  "Bristande översikt och rapportering",
  "Manuella och tidskrävande processer",
  "Dålig integration med övriga system i verksamheten",
  "Höga underhållskostnader",
  "Föråldrad teknik utan support",
  "Bristande mobilitet och tillgänglighet",
  "Svårt att hitta kompetens",
  "Förändrade regulatoriska krav",
  "Behov av bättre kundinsikter",
  "Ekonomi och styrning funkar – men kräver för mycket manuellt jobb (bokslut tar för lång tid, många excel-kranar, bristande spårbarhet/audit trail, otydlig kostnadsfördelning)",
  "Fragmenterade system och dubbelregistrering (data i silos, sköra/dyra integrationer)",
  "Brister i lager- och leveransprecision (bristande spårbarhet batch/serie/lot, planering på känsla)",
  "Processerna är inte standardiserade eller skalbara (varje avdelning jobbar på sitt sätt, svårt att rulla ut nya produkter/marknader)",
  "Affären har ändrats – ERP:et hänger inte med (nya affärsmodeller, ökad internationell komplexitet)",
  "Bristande rapportering och beslutstöd (svårt att få prognoser, scenarioanalys, KPI:er man kan lita på)",
  "Gamla, kraftigt kundanpassade on-prem-lösningar (dyra uppgraderingar, prestanda-/driftsproblem)",
  "Order-to-cash eller procure-to-pay tar för lång tid (mycket brandsläckning, beroende av nyckelpersoner)",
];

// Common KPIs that apply to all industries
const commonKpis = [
  "Omsättning och tillväxt",
  "Bruttomarginal",
  "Kassaflöde",
  "Produktivitet per anställd",
  "Kundnöjdhet (NPS/CSAT)",
];

// Industry-specific KPIs mapping
const industryKpiMapping: Record<string, string[]> = {
  "Tillverkningsindustrin": [
    "Ledtider i produktion",
    "OEE (Overall Equipment Effectiveness)",
    "Lagervärde och omsättningshastighet",
    "Leveransprecision",
    "Produktionskostnad per enhet",
    "Kassationsgrad/spill",
    "Kapacitetsutnyttjande",
  ],
  "Handel (Retail & eCommerce)": [
    "Ordervärde (AOV)",
    "Konverteringsgrad",
    "Lagervärde och omsättningshastighet",
    "Kundlivstidsvärde (CLV)",
    "Returer och reklamationer",
    "Försäljning per kvadratmeter",
    "Webbtrafik och bounce rate",
  ],
  "Grossist/Distribution": [
    "Leveransprecision",
    "Lagervärde och omsättningshastighet",
    "Ordervärde (AOV)",
    "Fyllnadsgrad",
    "Kostnad per order",
    "Ledtid order-till-leverans",
    "Kundretention",
  ],
  "Bank & Försäkring": [
    "Skadefrekvens",
    "Combined ratio",
    "Kundanskaffningskostnad (CAC)",
    "Kundlivstidsvärde (CLV)",
    "Regelefterlevnad",
    "Handläggningstid",
    "Digital adoptionsgrad",
  ],
  "Hälso- & sjukvård": [
    "Patientnöjdhet",
    "Väntetider",
    "Beläggningsgrad",
    "Kostnad per patient",
    "Återinläggningsfrekvens",
    "Personaltäthet",
    "Kvalitetsindikatorer",
  ],
  "Life Science": [
    "Time-to-market",
    "R&D-kostnad per projekt",
    "Regulatorisk efterlevnad",
    "Batchavkastning",
    "Kvalitetsavvikelser",
    "Spårbarhet (batch/lot)",
    "Kliniska prövningsresultat",
  ],
  "Konsulttjänster": [
    "Faktureringsgrad",
    "Debiteringsgrad per konsult",
    "Projektlönsamhet",
    "Kundnöjdhet per uppdrag",
    "Personalomsättning",
    "Pipeline-värde",
    "Genomsnittlig projekttid",
  ],
  "Offentlig sektor": [
    "Handläggningstid",
    "Medborgarnöjdhet",
    "Budgetutfall",
    "Digitala tjänster (andel)",
    "Tillgänglighet",
    "Regelefterlevnad",
    "Kostnad per ärende",
  ],
  "Energi & Utilities": [
    "Leveranssäkerhet",
    "Nätförluster",
    "Kostnad per producerad enhet",
    "Hållbarhetsmål (CO2, förnybart)",
    "Kundavbrott (SAIDI/SAIFI)",
    "Underhållskostnad",
    "Kapacitetsutnyttjande",
  ],
  "Transport & Logistik": [
    "Leveransprecision",
    "Fyllnadsgrad",
    "Kostnad per km/ton",
    "Fordonsutnyttjande",
    "Bränsleförbrukning",
    "Ledtid",
    "Skadefrekvens",
  ],
  "Fastigheter": [
    "Uthyrningsgrad",
    "Hyresintäkt per kvm",
    "Driftkostnad per kvm",
    "Vakansgrad",
    "Underhållskostnad",
    "Hyresgästnöjdhet",
    "Energiförbrukning",
  ],
  "Medlemsorganisationer": [
    "Medlemstillväxt",
    "Medlemsretention",
    "Engagemangsgrad",
    "Intäkt per medlem",
    "Evenemangsdeltagande",
    "Frivilliginsatser",
    "Kommunikationsräckvidd",
  ],
  "Utbildning": [
    "Genomströmning",
    "Studentnöjdhet",
    "Kostnad per student",
    "Lärartäthet",
    "Betygssnitt",
    "Anställningsbarhet efter examen",
    "Forskningsoutput",
  ],
  "Nonprofit": [
    "Insamlade medel",
    "Administrationskostnad (%)",
    "Givarretention",
    "Projekteffektivitet",
    "Volontärengagemang",
    "Räckvidd (personer hjälpta)",
    "Transparens och rapportering",
  ],
};

// Function to get KPIs based on selected industry
const getKpisForIndustry = (selectedIndustry: string): string[] => {
  if (!selectedIndustry) {
    // If no industry selected, show all common KPIs plus a generic set
    return [
      ...commonKpis,
      "Lagervärde och omsättningshastighet",
      "Leveransprecision",
      "Ordervärde (AOV)",
      "Ledtider i produktion",
      "Kostnad per order",
    ];
  }

  const industrySpecificKpis = industryKpiMapping[selectedIndustry] || [];

  // Combine common KPIs with industry-specific ones
  return [...commonKpis, ...industrySpecificKpis];
};

// Common AI use cases that apply to all industries
const commonAiUseCases = [
  "Automatiserad fakturering och bokföring",
  "Intelligent kundservice (chatbots)",
  "Dokumenthantering och analys",
  "Automatiserad rapportgenerering",
  "Copilot för Excel och rapportering",
  "AI-assisterad budgetering och prognoser",
  "Anomalidetektering i transaktioner",
  "Intelligent leverantörsrekommendation",
];

// Industry-specific AI use cases mapping
const industryAiUseCaseMapping: Record<string, string[]> = {
  "Tillverkningsindustrin": [
    "Produktionsplanering med AI",
    "Prediktivt underhåll",
    "Kvalitetskontroll med datorseende",
    "Efterfrågeprognos",
    "Lageroptimering",
  ],
  "Handel (Retail & eCommerce)": [
    "Personaliserade kundupplevelser",
    "Dynamisk prissättning",
    "Efterfrågeprognos",
    "Lageroptimering",
    "Rekommendationsmotorer",
    "Kundsegmentering",
  ],
  "Grossist/Distribution": [
    "Lageroptimering",
    "Ruttplanering och logistik",
    "Efterfrågeprognos",
    "Leverantörsanalys",
    "Automatiserad orderhantering",
  ],
  "Bank & Försäkring": [
    "Bedrägeridetektering",
    "Riskbedömning",
    "Automatiserad skadehantering",
    "Kundanalys och segmentering",
    "Compliance-övervakning",
  ],
  "Hälso- & sjukvård": [
    "Patientflödesoptimering",
    "Diagnosstöd",
    "Resursplanering",
    "Medicinsk bildanalys",
    "Prediktiv hälsoanalys",
  ],
  "Life Science": [
    "Forskningsdataanalys",
    "Kvalitetskontroll",
    "Regulatorisk efterlevnad",
    "Klinisk prövningsoptimering",
    "Batch-optimering",
  ],
  "Konsulttjänster": [
    "Projektprognos",
    "Resursallokering",
    "Kompetensmatching",
    "Automatiserad tidrapportering",
    "Försäljningsprognoser",
  ],
  "Offentlig sektor": [
    "Ärendehantering med AI",
    "Medborgarservice chatbots",
    "Resursoptimering",
    "Prediktiv analys för planering",
    "Automatiserad compliance",
  ],
  "Energi & Utilities": [
    "Prediktivt underhåll",
    "Efterfrågeprognos",
    "Nätoptimering",
    "Energieffektiviseringsanalys",
    "Feldetektering",
  ],
  "Transport & Logistik": [
    "Ruttoptimering",
    "Prediktivt underhåll av fordon",
    "Lastplanering",
    "Efterfrågeprognos",
    "Realtidsspårning och ETA",
  ],
  "Fastigheter": [
    "Fastighetsvärdeprognoser",
    "Hyresgästanalys",
    "Prediktivt underhåll",
    "Energioptimering",
    "Marknadsanalys",
  ],
  "Medlemsorganisationer": [
    "Medlemsengagemangsprediktion",
    "Personaliserad kommunikation",
    "Eventplanering",
    "Churn-analys",
    "Automatiserad medlemsservice",
  ],
  "Utbildning": [
    "Studentprognoser",
    "Personaliserat lärande",
    "Schemaoptimering",
    "Automatiserad bedömning",
    "Tidiga varningssystem",
  ],
  "Nonprofit": [
    "Givarbeteendeanalys",
    "Kampanjoptimering",
    "Resursallokering",
    "Effektmätning",
    "Automatiserad kommunikation",
  ],
};

// Function to get AI use cases based on selected industry
const getAiUseCasesForIndustry = (selectedIndustry: string): string[] => {
  if (!selectedIndustry) {
    // If no industry selected, show common use cases plus generic ones
    return [
      ...commonAiUseCases,
      "Försäljningsprognoser",
      "Lageroptimering",
      "Prediktivt underhåll",
      "Personaliserade kundupplevelser",
    ];
  }

  const industrySpecificUseCases = industryAiUseCaseMapping[selectedIndustry] || [];

  // Combine common use cases with industry-specific ones
  return [...commonAiUseCases, ...industrySpecificUseCases];
};

const NeedsAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AnalysisData>(initialData);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [
    Building2, Globe, Globe, Boxes, Link2, Server, AlertTriangle, BarChart3, Sparkles, FileText
  ];

  const stepTitles = [
    "Företagsstorlek",
    "Bransch",
    "Geografi",
    "Funktioner & Moduler",
    "Integrationer",
    "Nuvarande System",
    "Utmaningar",
    "Nyckeltal",
    "AI & Framtid",
    "Övrig Information",
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowContactForm(true);
    }
  };

  const handleBack = () => {
    if (showContactForm) {
      setShowContactForm(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (field: keyof AnalysisData, value: string) => {
    const currentValues = data[field] as string[];
    if (currentValues.includes(value)) {
      setData({ ...data, [field]: currentValues.filter((v) => v !== value) });
    } else {
      setData({ ...data, [field]: [...currentValues, value] });
    }
  };

  // ERP Recommendation Logic
  const getERPRecommendation = (): { product: string; score: number; reasons: string[]; description: string } => {
    let bcScore = 0;
    let fscScore = 0;
    const bcReasons: string[] = [];
    const fscReasons: string[] = [];

    // Company size analysis
    const smallCompany = ["< 10", "10-49", "50-199"].includes(data.employees);
    const mediumCompany = ["200-499", "500-999"].includes(data.employees);
    const largeCompany = ["1.000-4.999", "> 5.000"].includes(data.employees);

    if (smallCompany) {
      bcScore += 30;
      bcReasons.push("Företagsstorlek passar utmärkt för Business Central");
    } else if (mediumCompany) {
      bcScore += 15;
      fscScore += 15;
      bcReasons.push("Medelstort företag - båda alternativen kan passa");
      fscReasons.push("Medelstort företag - kan dra nytta av avancerade funktioner");
    } else if (largeCompany) {
      fscScore += 30;
      fscReasons.push("Stor organisation passar utmärkt för Finance & Supply Chain");
    }

    // Revenue analysis
    const lowRevenue = ["< 49 MSEK", "50-499 MSEK"].includes(data.revenue);
    const highRevenue = ["1.000-4.999 MSEK", "> 5.000 MSEK"].includes(data.revenue);

    if (lowRevenue) {
      bcScore += 20;
      bcReasons.push("Omsättningsnivå är typisk för Business Central-kunder");
    } else if (highRevenue) {
      fscScore += 20;
      fscReasons.push("Hög omsättning motiverar investeringen i F&SC");
    }

    // Industry analysis
    const manufacturingIndustries = ["Tillverkning", "Livsmedel & Dryck", "Läkemedel & Life Science", "Tillverkningsindustrin", "Life Science"];
    const distributionIndustries = ["Distribution & Grossist", "Transport & Logistik", "Grossist/Distribution"];
    const enterpriseIndustries = ["Energi & Utilities", "Finans & Försäkring", "Bank & Försäkring"];

    if (data.industry) {
      if (manufacturingIndustries.includes(data.industry)) {
        fscScore += 10;
        fscReasons.push(`${data.industry} gynnas av avancerad tillverkningshantering i F&SC`);
      }
      if (distributionIndustries.includes(data.industry)) {
        bcScore += 5;
        fscScore += 5;
      }
      if (enterpriseIndustries.includes(data.industry)) {
        fscScore += 15;
        fscReasons.push(`${data.industry} kräver ofta enterprise-funktionalitet`);
      }
    }

    // Geography analysis
    if (data.geography.includes("Globalt") || data.geography.includes("Europa")) {
      fscScore += 15;
      fscReasons.push("Global verksamhet kräver avancerad multi-site hantering");
    }
    if (data.geography.includes("Endast Sverige") || data.geography.includes("Norden")) {
      bcScore += 10;
      bcReasons.push("Regional verksamhet hanteras väl av Business Central");
    }

    // Module complexity analysis
    const complexModules = ["Tillverkning & Produktion", "Service & Fältservice"];
    const basicModules = ["Ekonomi & Redovisning", "Försäljning & CRM", "Inköp & Leverantörer"];

    data.modules.forEach(module => {
      if (complexModules.includes(module)) {
        fscScore += 10;
        fscReasons.push(`${module} har starkare stöd i F&SC`);
      }
      if (basicModules.includes(module)) {
        bcScore += 5;
      }
    });

    // Module count - more modules often means more complexity
    if (data.modules.length > 6) {
      fscScore += 10;
      fscReasons.push("Stort antal moduler indikerar komplex verksamhet");
    }

    // Challenge analysis
    if (data.challenges.includes("Svårt att skala verksamheten")) {
      fscScore += 10;
      fscReasons.push("Skalbarhetsbehov gynnas av F&SC");
    }
    if (data.challenges.includes("Höga underhållskostnader")) {
      bcScore += 10;
      bcReasons.push("Business Central har generellt lägre TCO");
    }

    // Determine recommendation
    const isBC = bcScore >= fscScore;
    
    const bcDescription = `**Dynamics 365 Business Central** är Microsofts molnbaserade affärssystem för små och medelstora företag. Det erbjuder:

• **Komplett Affärssystem (ERP)-lösning** - Ekonomi, försäljning, inköp, lager och projekt i ett system
• **Smidig implementation** - Snabbare uppstart och lägre implementationskostnad
• **Microsoft-integration** - Sömlös koppling till Microsoft 365, Power BI och Teams
• **Flexibel prissättning** - Licensmodell anpassad för mindre organisationer
• **Stort partnernätverk** - Många svenska partners med branschexpertis
• **Copilot AI** - Inbyggd AI-assistent för ökad produktivitet

Business Central passar företag som vill ha ett kraftfullt men lättanvänt affärssystem med snabb avkastning på investeringen.`;

    const fscDescription = `**Dynamics 365 Finance & Supply Chain Management** är Microsofts enterprise-plattform för komplexa organisationer. Det erbjuder:

• **Avancerad ekonomistyrning** - Koncernredovisning, budgetering och finansiell analys
• **Komplex tillverkning** - Stöd för make-to-order, processproduktion och lean manufacturing
• **Global Supply Chain** - Multi-site, multi-warehouse och avancerad logistik
• **Prediktiv analys** - AI-driven efterfrågeprognos och lageroptimering
• **Regulatorisk efterlevnad** - Stöd för internationella redovisningsstandarder
• **Enterprise-skalbarhet** - Hanterar stora transaktionsvolymer och komplex organisationsstruktur

Finance & Supply Chain passar organisationer med höga krav på funktionalitet, global närvaro och komplexa affärsprocesser.`;

    return {
      product: isBC ? "Business Central" : "Finance & Supply Chain Management",
      score: isBC ? bcScore : fscScore,
      reasons: isBC ? bcReasons.slice(0, 5) : fscReasons.slice(0, 5),
      description: isBC ? bcDescription : fscDescription
    };
  };

  const generateDocument = async () => {
    if (!validateContactForm()) {
      return;
    }
    
    const recommendation = getERPRecommendation();
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Helper functions
    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    const drawLine = (y: number, color: [number, number, number] = [0, 150, 136]) => {
      pdf.setDrawColor(...color);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
    };

    const addSectionHeader = (title: string, number: string) => {
      addNewPageIfNeeded(25);
      pdf.setFillColor(0, 150, 136);
      pdf.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${number}. ${title}`, margin + 5, yPos + 8);
      yPos += 18;
      pdf.setTextColor(51, 51, 51);
    };

    const addContentRow = (label: string, value: string) => {
      addNewPageIfNeeded(12);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text(label, margin, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      
      const valueLines = pdf.splitTextToSize(value || "Ej angivet", contentWidth - 50);
      pdf.text(valueLines, margin + 50, yPos);
      yPos += Math.max(8, valueLines.length * 5) + 4;
    };

    const addBulletList = (items: string[], otherText?: string) => {
      if (items.length === 0 && !otherText) {
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text("Inga val gjorda", margin + 5, yPos);
        yPos += 8;
        return;
      }
      
      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      items.forEach((item) => {
        addNewPageIfNeeded(8);
        pdf.setFillColor(0, 150, 136);
        pdf.circle(margin + 3, yPos - 1.5, 1.5, 'F');
        pdf.text(item, margin + 8, yPos);
        yPos += 7;
      });
      
      if (otherText) {
        addNewPageIfNeeded(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        const otherLines = pdf.splitTextToSize(`Övrigt: ${otherText}`, contentWidth - 10);
        pdf.text(otherLines, margin + 5, yPos);
        yPos += otherLines.length * 5 + 3;
        pdf.setFont("helvetica", "normal");
      }
      yPos += 5;
    };

    // Header with gradient-like effect
    pdf.setFillColor(0, 150, 136);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    pdf.setFillColor(0, 120, 110);
    pdf.rect(0, 45, pageWidth, 5, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("BEHOVSANALYS", margin, 25);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Dynamics 365 Affärssystem (ERP)", margin, 35);
    
    // Date badge
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth - 60, 15, 45, 20, 3, 3, 'F');
    pdf.setTextColor(0, 150, 136);
    pdf.setFontSize(8);
    pdf.text("Genererad", pageWidth - 55, 23);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(new Date().toLocaleDateString('sv-SE'), pageWidth - 55, 31);
    
    yPos = 60;

    // Introduction text
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    const introText = "Detta dokument sammanfattar er behovsanalys för ett nytt affärssystem (ERP) baserat på Microsoft Dynamics 365. Analysen har genomförts via Dynamic Factorys digitala verktyg och ger en första indikation på vilket system som passar era behov bäst.";
    const introLines = pdf.splitTextToSize(introText, contentWidth);
    pdf.text(introLines, margin, yPos);
    yPos += introLines.length * 5 + 8;

    // Contact Information Box
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(margin, yPos, contentWidth, 50, 3, 3, 'F');
    pdf.setDrawColor(0, 150, 136);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 50);
    
    pdf.setTextColor(0, 150, 136);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("KONTAKTINFORMATION", margin + 8, yPos + 12);
    
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const contactY = yPos + 22;
    pdf.setFont("helvetica", "bold");
    pdf.text(data.companyName, margin + 8, contactY);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.contactName, margin + 8, contactY + 8);
    pdf.text(`Tel: ${data.phone || "Ej angivet"}`, margin + 8, contactY + 16);
    pdf.text(`E-post: ${data.email}`, pageWidth / 2, contactY);
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Analys genomförd: ${new Date().toLocaleDateString('sv-SE')}`, pageWidth / 2, contactY + 8);
    
    yPos += 60;

    // RECOMMENDATION SECTION - Prominent placement
    addNewPageIfNeeded(100);
    
    // Recommendation box with golden/highlight color
    const recommendationColor: [number, number, number] = recommendation.product === "Business Central" 
      ? [25, 118, 210] // Blue for BC
      : [156, 39, 176]; // Purple for F&SC
    
    pdf.setFillColor(...recommendationColor);
    pdf.roundedRect(margin, yPos, contentWidth, 18, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("VÅR REKOMMENDATION", margin + 5, yPos + 12);
    yPos += 25;
    
    // Product name
    pdf.setTextColor(...recommendationColor);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Microsoft Dynamics 365 ${recommendation.product}`, margin, yPos);
    yPos += 12;
    
    // Reasons box
    if (recommendation.reasons.length > 0) {
      pdf.setFillColor(245, 245, 250);
      const reasonsBoxHeight = recommendation.reasons.length * 8 + 15;
      addNewPageIfNeeded(reasonsBoxHeight + 10);
      pdf.roundedRect(margin, yPos, contentWidth, reasonsBoxHeight, 2, 2, 'F');
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Baserat på er behovsanalys:", margin + 5, yPos + 10);
      yPos += 18;
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      recommendation.reasons.forEach((reason) => {
        pdf.setFillColor(...recommendationColor);
        pdf.circle(margin + 8, yPos - 1.5, 1.5, 'F');
        const reasonLines = pdf.splitTextToSize(reason, contentWidth - 20);
        pdf.text(reasonLines, margin + 13, yPos);
        yPos += reasonLines.length * 5 + 3;
      });
      yPos += 5;
    }
    
    // Description section
    addNewPageIfNeeded(80);
    yPos += 5;
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Om ${recommendation.product}:`, margin, yPos);
    yPos += 8;
    
    // Parse and render the description (handle markdown-like formatting)
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const descriptionLines = recommendation.description.split('\n');
    descriptionLines.forEach((line) => {
      addNewPageIfNeeded(8);
      
      // Handle bold text markers
      let cleanLine = line.replace(/\*\*/g, '');
      
      if (line.startsWith('•')) {
        pdf.setFillColor(...recommendationColor);
        pdf.circle(margin + 3, yPos - 1.5, 1.5, 'F');
        const textLines = pdf.splitTextToSize(cleanLine.substring(2), contentWidth - 10);
        pdf.text(textLines, margin + 8, yPos);
        yPos += textLines.length * 5 + 2;
      } else if (cleanLine.trim()) {
        const textLines = pdf.splitTextToSize(cleanLine, contentWidth);
        pdf.text(textLines, margin, yPos);
        yPos += textLines.length * 5 + 2;
      } else {
        yPos += 3;
      }
    });
    
    yPos += 10;
    drawLine(yPos, recommendationColor);
    yPos += 15;

    // Section 1: Company Size
    addSectionHeader("FÖRETAGSSTORLEK", "1");
    addContentRow("Anställda:", data.employees);
    addContentRow("Omsättning:", data.revenue);
    yPos += 5;

    // Section 2: Industry
    addSectionHeader("BRANSCH", "2");
    addBulletList(data.industry ? [data.industry] : [], data.industryOther);

    // Section 3: Geography
    addSectionHeader("GEOGRAFI", "3");
    addBulletList(data.geography ? [data.geography] : [], data.geographyOther);

    // Section 4: Modules
    addSectionHeader("FUNKTIONER & MODULER", "4");
    addBulletList(data.modules, data.modulesOther);

    // Section 5: Integrations
    addSectionHeader("INTEGRATIONER", "5");
    addBulletList(data.integrations, data.integrationsOther);

    // Section 6: Current Systems
    addSectionHeader("NUVARANDE SYSTEM", "6");
    const filledSystems = data.currentSystems.filter(s => s.product.trim());
    if (filledSystems.length > 0) {
      filledSystems.forEach((system, index) => {
        const yearText = system.year ? ` (driftsattes ${system.year})` : "";
        addContentRow(`System ${index + 1}:`, `${system.product}${yearText}`);
      });
    } else {
      addContentRow("System:", "Ej angivet");
    }
    if (data.otherSystemsDetails) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Övriga system:", margin, yPos);
      yPos += 7;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(data.otherSystemsDetails, contentWidth - 10);
      pdf.text(lines, margin + 5, yPos);
      yPos += lines.length * 5 + 3;
    }

    // Section 7: Challenges
    addSectionHeader("UTMANINGAR", "7");
    addBulletList(data.challenges, data.challengesOther);

    // Section 8: KPIs
    addSectionHeader("NYCKELTAL", "8");
    addBulletList(data.kpis, data.kpisOther);

    // Section 9: AI & Future
    addSectionHeader("AI & FRAMTID", "9");
    addContentRow("Intresse:", data.aiInterest);
    if (data.aiUseCases.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Användningsområden:", margin, yPos);
      yPos += 7;
      addBulletList(data.aiUseCases);
    }
    if (data.aiDetails) {
      addNewPageIfNeeded(15);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 100, 100);
      const detailLines = pdf.splitTextToSize(data.aiDetails, contentWidth - 10);
      pdf.text(detailLines, margin + 5, yPos);
      yPos += detailLines.length * 5 + 5;
    }

    // Section 10: Additional Info
    addSectionHeader("ÖVRIG INFORMATION", "10");
    if (data.additionalInfo) {
      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      const infoLines = pdf.splitTextToSize(data.additionalInfo, contentWidth - 10);
      addNewPageIfNeeded(infoLines.length * 5 + 10);
      pdf.text(infoLines, margin + 5, yPos);
      yPos += infoLines.length * 5 + 10;
    } else {
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Ingen övrig information angiven.", margin + 5, yPos);
      yPos += 10;
    }

    // Next Steps Section
    addNewPageIfNeeded(60);
    yPos += 5;
    pdf.setFillColor(255, 248, 225);
    pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');
    pdf.setDrawColor(255, 193, 7);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 45);
    
    pdf.setTextColor(180, 130, 0);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("NÄSTA STEG", margin + 8, yPos + 12);
    
    pdf.setTextColor(100, 80, 0);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const nextStepsY = yPos + 20;
    pdf.text("1. Vi kontaktar er inom 1-2 arbetsdagar för att diskutera resultatet", margin + 8, nextStepsY);
    pdf.text("2. Gemensam genomgång av era behov och vår rekommendation", margin + 8, nextStepsY + 6);
    pdf.text("3. Presentation av lämpliga implementationspartners", margin + 8, nextStepsY + 12);
    pdf.text("4. Detaljerad offert och projektplan vid fortsatt intresse", margin + 8, nextStepsY + 18);
    
    yPos += 55;

    // Recommendation to contact and visit partner section
    addNewPageIfNeeded(45);
    pdf.setFillColor(232, 245, 233);
    pdf.roundedRect(margin, yPos, contentWidth, 38, 3, 3, 'F');
    pdf.setDrawColor(76, 175, 80);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 38);
    
    pdf.setTextColor(46, 125, 50);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("REKOMMENDATION", margin + 8, yPos + 11);
    
    pdf.setTextColor(56, 95, 58);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("• Kontakta oss på Dynamic Factory för en kostnadsfri rådgivning", margin + 8, yPos + 20);
    pdf.text("• Besök vår partnerkatalog på d365.se/valj-partner för att hitta rätt", margin + 8, yPos + 27);
    pdf.text("  implementationspartner som matchar era behov", margin + 8, yPos + 33);
    
    yPos += 45;

    // Disclaimer
    addNewPageIfNeeded(25);
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    const disclaimerText = "Denna analys ger en första indikation baserat på de uppgifter ni angett. En fullständig behovsanalys bör genomföras tillsammans med en certifierad Microsoft-partner för att säkerställa optimal lösning.";
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth);
    pdf.text(disclaimerLines, margin, yPos);
    yPos += disclaimerLines.length * 4 + 5;

    // Footer
    addNewPageIfNeeded(35);
    yPos = pageHeight - 40;
    drawLine(yPos);
    yPos += 8;
    
    pdf.setFillColor(0, 150, 136);
    pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Dynamic Factory", margin + 8, yPos + 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Din oberoende guide till rätt Dynamics 365-lösning", margin + 8, yPos + 18);
    
    pdf.setFontSize(9);
    pdf.text("thomas.laine@d365.se", pageWidth - margin - 55, yPos + 10);
    pdf.text("www.d365.se", pageWidth - margin - 55, yPos + 18);

    // Generate PDF as base64 for email attachment
    const pdfFilename = `Behovsanalys_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    const pdfBase64 = pdf.output('datauristring').split(',')[1]; // Get base64 part only
    
    // Save PDF locally
    pdf.save(`${pdfFilename}.pdf`);
    
    // Send email notification with PDF attachment
    setIsSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke("send-analysis-email", {
        body: {
          analysisType: "ERP",
          companyName: data.companyName,
          contactName: data.contactName,
          phone: data.phone,
          email: data.email,
          analysisData: {
            "Anställda": data.employees,
            "Omsättning": data.revenue,
            "Bransch": data.industry || "Ej angivet",
            "Geografi": data.geography || "Ej angivet",
            "Moduler": data.modules.join(", ") || "Ej angivet",
            "Integrationer": data.integrations.join(", ") || "Ej angivet",
            "Nuvarande system": data.currentSystems.filter(s => s.product.trim()).map(s => s.product).join(", ") || "Ej angivet",
            "Utmaningar": data.challenges.join(", ") || "Ej angivet",
            "KPI:er": data.kpis.join(", ") || "Ej angivet",
            "AI-intresse": data.aiInterest || "Ej angivet",
            "Övrig info": data.additionalInfo || "Ej angivet",
          },
          recommendation: {
            product: recommendation.product,
            reasons: recommendation.reasons,
          },
          pdfBase64: pdfBase64,
          pdfFilename: pdfFilename,
        },
      });

      if (error) {
        console.error("Error sending analysis email:", error);
      } else {
        console.log("Analysis email sent successfully");
      }
    } catch (error) {
      console.error("Failed to send analysis email:", error);
    } finally {
      setIsSendingEmail(false);
    }
    
    setIsComplete(true);
  };

  const validateContactForm = (): boolean => {
    const result = contactFormSchema.safeParse({
      companyName: data.companyName,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email,
    });

    if (!result.success) {
      const errors: ContactFormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormErrors;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setContactErrors(errors);
      return false;
    }

    setContactErrors({});
    return true;
  };

  const isContactFormValid = () => {
    return data.companyName && data.contactName && data.phone && data.email;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Antal anställda</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {employeeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.employees === option}
                    onClick={() => setData({ ...data, employees: option })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Omsättning</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {revenueOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.revenue === option}
                    onClick={() => setData({ ...data, revenue: option })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Välj den bransch som bäst beskriver er verksamhet.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industryOptions.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={data.industry === option}
                  onClick={() => setData({ ...data, industry: option })}
                  type="radio"
                />
              ))}
            </div>
            <div>
              <Label htmlFor="industryOther">Annan bransch</Label>
              <Input
                id="industryOther"
                placeholder="Ange annan bransch..."
                value={data.industryOther}
                onChange={(e) => setData({ ...data, industryOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Var bedriver ni er verksamhet?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {geographyOptions.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={data.geography === option}
                  onClick={() => setData({ ...data, geography: option })}
                  type="radio"
                />
              ))}
            </div>
            <div>
              <Label htmlFor="geographyOther">Specifika länder/marknader</Label>
              <Input
                id="geographyOther"
                placeholder="Ange specifika marknader..."
                value={data.geographyOther}
                onChange={(e) => setData({ ...data, geographyOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka funktioner och moduler är viktigast för er verksamhet?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moduleOptions.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={data.modules.includes(option)}
                  onClick={() => handleCheckboxChange('modules', option)}
                  type="checkbox"
                />
              ))}
            </div>
            <div>
              <Label htmlFor="modulesOther">Övriga funktioner</Label>
              <Textarea
                id="modulesOther"
                placeholder="Beskriv övriga funktioner ni behöver..."
                value={data.modulesOther}
                onChange={(e) => setData({ ...data, modulesOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka integrationer behöver ni mot andra system?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {integrationOptions.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={data.integrations.includes(option)}
                  onClick={() => handleCheckboxChange('integrations', option)}
                  type="checkbox"
                />
              ))}
            </div>
            <div>
              <Label htmlFor="integrationsOther">Övriga integrationer</Label>
              <Textarea
                id="integrationsOther"
                placeholder="Beskriv övriga integrationsbehov..."
                value={data.integrationsOther}
                onChange={(e) => setData({ ...data, integrationsOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nuvarande Affärssystem/ERP</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-muted/50 border-b">
                  <div className="p-3 font-medium text-sm">Produkt</div>
                  <div className="p-3 font-medium text-sm border-l">Driftsattes år</div>
                </div>
                {data.currentSystems.map((system, index) => (
                  <div key={index} className={`grid grid-cols-2 ${index < data.currentSystems.length - 1 ? 'border-b' : ''}`}>
                    <div className="p-2">
                      <Input
                        placeholder="T.ex. SAP, Visma, NAV..."
                        value={system.product}
                        onChange={(e) => {
                          const newSystems = [...data.currentSystems];
                          newSystems[index] = { ...newSystems[index], product: e.target.value };
                          setData({ ...data, currentSystems: newSystems });
                        }}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="p-2 border-l">
                      <Input
                        type="number"
                        placeholder="T.ex. 2015"
                        value={system.year}
                        onChange={(e) => {
                          const newSystems = [...data.currentSystems];
                          newSystems[index] = { ...newSystems[index], year: e.target.value };
                          setData({ ...data, currentSystems: newSystems });
                        }}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 max-w-[120px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="otherSystemsDetails">Övriga system som används i verksamheten</Label>
              <Textarea
                id="otherSystemsDetails"
                placeholder="Beskriv vilka övriga system som används i verksamheten, t.ex. Microsoft 365, Power BI, CRM-system, ärendehantering, CAD-system..."
                value={data.otherSystemsDetails}
                onChange={(e) => setData({ ...data, otherSystemsDetails: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka utmaningar upplever ni idag i ert nuvarande?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challengeOptions.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={data.challenges.includes(option)}
                  onClick={() => handleCheckboxChange('challenges', option)}
                  type="checkbox"
                />
              ))}
            </div>
            <div>
              <Label htmlFor="challengesOther">Övriga utmaningar</Label>
              <Textarea
                id="challengesOther"
                placeholder="Beskriv övriga utmaningar..."
                value={data.challengesOther}
                onChange={(e) => setData({ ...data, challengesOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 8:
        const dynamicKpis = getKpisForIndustry(data.industry);
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka nyckeltal är viktigast för er verksamhet att följa och förbättra?</p>
            {data.industry && (
              <p className="text-sm text-primary">
                Nyckeltalen nedan är anpassade efter din valda bransch: {data.industry}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dynamicKpis.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={data.kpis.includes(option)}
                  onClick={() => handleCheckboxChange('kpis', option)}
                  type="checkbox"
                />
              ))}
            </div>
            <div>
              <Label htmlFor="kpisOther">Övriga nyckeltal</Label>
              <Textarea
                id="kpisOther"
                placeholder="Beskriv övriga nyckeltal..."
                value={data.kpisOther}
                onChange={(e) => setData({ ...data, kpisOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 9:
        const aiInterestOptions = [
          { value: "Mycket intresserade", label: "Mycket intresserade - Vi vill vara i framkant" },
          { value: "Ganska intresserade", label: "Ganska intresserade - Vi vill utforska möjligheterna" },
          { value: "Avvaktande", label: "Avvaktande - Vi vill se konkreta användningsfall först" },
          { value: "Inte intresserade just nu", label: "Inte intresserade just nu" }
        ];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hur intresserade är ni av AI i affärssystemet?</h3>
              <div className="grid grid-cols-1 gap-3">
                {aiInterestOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    selected={data.aiInterest === option.value}
                    onClick={() => setData({ ...data, aiInterest: option.value })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Vilka AI-användningsområden ser ni som mest intressanta?</h3>
              {data.industry && (
                <p className="text-sm text-primary mb-4">
                  AI-användningsområdena nedan är anpassade efter din valda bransch: {data.industry}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getAiUseCasesForIndustry(data.industry).map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.aiUseCases.includes(option)}
                    onClick={() => handleCheckboxChange('aiUseCases', option)}
                    type="checkbox"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="aiDetails">Beskriv hur AI skulle kunna hjälpa er verksamhet</Label>
              <Textarea
                id="aiDetails"
                placeholder="Beskriv era tankar om AI..."
                value={data.aiDetails}
                onChange={(e) => setData({ ...data, aiDetails: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Finns det något övrigt ni vill berätta om ert projekt eller era behov?</p>
            <Textarea
              placeholder="Skriv fritt om era tankar, frågor eller specifika krav..."
              value={data.additionalInfo}
              onChange={(e) => setData({ ...data, additionalInfo: e.target.value })}
              className="min-h-[200px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    const recommendation = getERPRecommendation();
    const isBC = recommendation.product === "Business Central";
    
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Success Message */}
            <Card className="text-center mb-8">
              <CardContent className="pt-8 pb-6">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Tack för din behovsanalys!</h2>
                <p className="text-muted-foreground">
                  Ditt dokument har laddats ned. Vi kommer att kontakta dig inom kort.
                </p>
              </CardContent>
            </Card>

            {/* Recommendation Card */}
            <Card className={`mb-8 border-2 ${isBC ? 'border-blue-500' : 'border-purple-500'}`}>
              <CardHeader className={`${isBC ? 'bg-blue-500' : 'bg-purple-500'} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Sparkles className="w-6 h-6" />
                  Vår Rekommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${isBC ? 'text-blue-600' : 'text-purple-600'}`}>
                  Microsoft Dynamics 365 {recommendation.product}
                </h3>
                
                {/* Reasons */}
                {recommendation.reasons.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                      Baserat på er behovsanalys:
                    </h4>
                    <ul className="space-y-2">
                      {recommendation.reasons.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isBC ? 'text-blue-500' : 'text-purple-500'}`} />
                          <span className="text-sm">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Description */}
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold mb-3">Om {recommendation.product}:</h4>
                  <div className="space-y-2 text-muted-foreground">
                    {recommendation.description.split('\n').map((line, index) => {
                      const cleanLine = line.replace(/\*\*/g, '');
                      if (line.startsWith('•')) {
                        return (
                          <div key={index} className="flex items-start gap-2">
                            <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isBC ? 'bg-blue-500' : 'bg-purple-500'}`} />
                            <span>{cleanLine.substring(2)}</span>
                          </div>
                        );
                      } else if (cleanLine.trim()) {
                        return <p key={index} className="text-foreground">{cleanLine}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button 
                    asChild 
                    className={`flex-1 ${isBC ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                  >
                    <a href={isBC ? "/business-central" : "/finance-supply-chain"}>
                      Läs mer om {recommendation.product}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="mailto:thomas.laine@d365.se">
                      Kontakta oss direkt
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setData(initialData);
                  setCurrentStep(1);
                  setShowContactForm(false);
                  setIsComplete(false);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Starta ny analys
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Behovsanalys för Dynamics 365 ERP
            </h1>
            <p className="text-muted-foreground text-lg">
              Svara på frågorna nedan för att få en personlig rekommendation och analys
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {showContactForm ? "Kontaktuppgifter" : `Steg ${currentStep} av ${totalSteps}`}
              </span>
              <span className="text-sm text-muted-foreground">
                {showContactForm ? "100%" : `${Math.round(progress)}%`}
              </span>
            </div>
            <Progress value={showContactForm ? 100 : progress} className="h-2" />
          </div>

          {/* Step indicators */}
          {!showContactForm && (
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {stepTitles.map((title, index) => {
                const Icon = stepIcons[index];
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(stepNum)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{title}</span>
                    <span className="sm:hidden">{stepNum}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {showContactForm ? (
                  <>
                    <Download className="w-6 h-6 text-primary" />
                    Ladda ned din behovsanalys
                  </>
                ) : (
                  <>
                    {(() => {
                      const Icon = stepIcons[currentStep - 1];
                      return <Icon className="w-6 h-6 text-primary" />;
                    })()}
                    {stepTitles[currentStep - 1]}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showContactForm ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Fyll i dina kontaktuppgifter för att ladda ned din personliga behovsanalys.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Företagsnamn *</Label>
                      <Input
                        id="companyName"
                        placeholder="Ditt företag AB"
                        value={data.companyName}
                        onChange={(e) => {
                          setData({ ...data, companyName: e.target.value });
                          if (contactErrors.companyName) {
                            setContactErrors({ ...contactErrors, companyName: undefined });
                          }
                        }}
                        className={`mt-2 ${contactErrors.companyName ? 'border-destructive' : ''}`}
                      />
                      {contactErrors.companyName && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.companyName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contactName">Ditt namn *</Label>
                      <Input
                        id="contactName"
                        placeholder="Förnamn Efternamn"
                        value={data.contactName}
                        onChange={(e) => {
                          setData({ ...data, contactName: e.target.value });
                          if (contactErrors.contactName) {
                            setContactErrors({ ...contactErrors, contactName: undefined });
                          }
                        }}
                        className={`mt-2 ${contactErrors.contactName ? 'border-destructive' : ''}`}
                      />
                      {contactErrors.contactName && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.contactName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefonnummer *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+46 70 123 45 67"
                        value={data.phone}
                        onChange={(e) => {
                          setData({ ...data, phone: e.target.value });
                          if (contactErrors.phone) {
                            setContactErrors({ ...contactErrors, phone: undefined });
                          }
                        }}
                        className={`mt-2 ${contactErrors.phone ? 'border-destructive' : ''}`}
                      />
                      {contactErrors.phone && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">E-postadress *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="namn@foretag.se"
                        value={data.email}
                        onChange={(e) => {
                          setData({ ...data, email: e.target.value });
                          if (contactErrors.email) {
                            setContactErrors({ ...contactErrors, email: undefined });
                          }
                        }}
                        className={`mt-2 ${contactErrors.email ? 'border-destructive' : ''}`}
                      />
                      {contactErrors.email && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                renderStep()
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 && !showContactForm}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tillbaka
                </Button>
                {showContactForm ? (
                  <Button
                    onClick={generateDocument}
                    disabled={!isContactFormValid()}
                    className="bg-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Ladda ned dokument
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-primary">
                    {currentStep === totalSteps ? "Slutför" : "Nästa"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NeedsAnalysis;
