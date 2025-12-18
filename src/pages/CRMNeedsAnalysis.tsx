import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, Users, Headphones, Wrench, Megaphone, Target, Building2, BarChart3, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import SelectionCard from "@/components/SelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Contact form validation schema
const contactFormSchema = z.object({
  companyName: z.string().trim().min(1, "Företagsnamn krävs").max(100, "Företagsnamn får max vara 100 tecken"),
  contactName: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
  phone: z.string().trim().max(20, "Telefonnummer får max vara 20 tecken").optional(),
  email: z.string().trim().min(1, "E-postadress krävs").email("Ogiltig e-postadress").max(255, "E-postadress får max vara 255 tecken"),
});

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;

interface CRMAnalysisData {
  // Step 1 - Company size and industry
  employees: string;
  industries: string[];
  industryOther: string;
  salesTeamSize: string;
  serviceTeamSize: string;
  // Step 2 - Current situation
  currentCRM: string;
  currentCRMOther: string;
  crmChallenges: string[];
  challengesOther: string;
  // Step 3 - Sales needs
  salesNeeds: string[];
  salesNeedsOther: string;
  salesProcessComplexity: string;
  // Step 4 - Customer Service needs
  currentServiceSystem: string;
  currentServiceSystemOther: string;
  serviceNeeds: string[];
  serviceNeedsOther: string;
  serviceChannels: string[];
  // Step 5 - Field Service needs
  hasFieldService: string;
  fieldServiceNeeds: string[];
  fieldServiceNeedsOther: string;
  // Step 6 - Marketing needs
  marketingNeeds: string[];
  marketingNeedsOther: string;
  marketingChannels: string[];
  // Step 7 - Integrations
  integrations: string[];
  integrationsOther: string;
  // Step 8 - KPIs
  kpis: string[];
  kpisOther: string;
  // Step 9 - AI & Automation
  aiInterest: string;
  aiUseCases: string[];
  aiDetails: string;
  // Step 10 - Additional info
  additionalInfo: string;
  currentPartners: string;
  // Contact info
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}

const initialData: CRMAnalysisData = {
  employees: "",
  industries: [],
  industryOther: "",
  salesTeamSize: "",
  serviceTeamSize: "",
  currentCRM: "",
  currentCRMOther: "",
  crmChallenges: [],
  challengesOther: "",
  salesNeeds: [],
  salesNeedsOther: "",
  salesProcessComplexity: "",
  currentServiceSystem: "",
  currentServiceSystemOther: "",
  serviceNeeds: [],
  serviceNeedsOther: "",
  serviceChannels: [],
  hasFieldService: "",
  fieldServiceNeeds: [],
  fieldServiceNeedsOther: "",
  marketingNeeds: [],
  marketingNeedsOther: "",
  marketingChannels: [],
  integrations: [],
  integrationsOther: "",
  kpis: [],
  kpisOther: "",
  aiInterest: "",
  aiUseCases: [],
  aiDetails: "",
  additionalInfo: "",
  currentPartners: "",
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

const industryOptions = [
  "Tillverkningsindustrin",
  "Handel (Retail & eCommerce)",
  "Grossist/Distribution",
  "Bank & Försäkring",
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

const teamSizeOptions = [
  "1-5",
  "6-15",
  "16-50",
  "51-100",
  "100+",
  "Ej tillämpligt",
];

const currentCRMOptions = [
  "Microsoft Dynamics 365",
  "Salesforce",
  "HubSpot",
  "Pipedrive",
  "Lime CRM",
  "SuperOffice",
  "Zoho CRM",
  "Excel",
  "Inget CRM-system/manuella processer",
];

const currentServiceSystemOptions = [
  "Microsoft Dynamics 365 Customer Service",
  "Salesforce Service Cloud",
  "Zendesk",
  "Freshdesk",
  "ServiceNow",
  "Puzzel",
  "Genesys",
  "Telia ACE",
  "Talkdesk",
  "NICE",
  "Mitel",
  "Avaya",
  "TopDesk",
  "Jira Service Management",
  "Inget system/manuella processer",
];

// Common challenges (always shown)
const commonChallengeOptions = [
  "Dålig översikt över kunder och affärsmöjligheter",
  "Saknar integration med andra system",
  "Manuellt och tidskrävande arbete",
  "Bristande rapportering och analys",
  "Svårt att skala med verksamheten",
  "Dålig mobilupplevelse",
  "Saknar AI och automationsfunktioner",
];

// Sales-specific challenges (hidden when salesTeamSize is "Ej tillämpligt")
const salesChallengeOptions = [
  "Ineffektiv säljprocess",
  "Svårt att samordna sälj och marknad",
];

// Service-specific challenges (hidden when serviceTeamSize is "Ej tillämpligt")
const serviceChallengeOptions = [
  "Bristande kundservice och uppföljning",
];

const salesNeedOptions = [
  "Lead-hantering och kvalificering",
  "Opportunity management",
  "Säljprognoser och pipeline-hantering",
  "Offerthantering",
  "Account management",
  "Territory management",
  "Säljaktiviteter och uppgifter",
  "Produktkatalog och prissättning",
  "Konkurrensspårning",
  "Partner/Kanalförsäljning",
];

const salesComplexityOptions = [
  "Enkel (kort säljcykel, få steg)",
  "Medel (viss komplexitet, flera beslutsfattare)",
  "Komplex (lång säljcykel, många intressenter)",
  "Mycket komplex (stora projekt, upphandlingar)",
];

const serviceNeedOptions = [
  "Ärendehantering (case management)",
  "Knowledge base / FAQ",
  "SLA-hantering",
  "Omnichannel support",
  "Självbetjäningsportal",
  "Ärendeeskalering och routing",
  "Kundundersökningar och feedback",
  "Live chat",
  "Chatbot / virtuell agent",
  "360° kundvy",
];

const serviceChannelOptions = [
  "Telefon",
  "E-post",
  "Live chat",
  "Social media",
  "Självbetjäningsportal",
  "SMS",
  "WhatsApp / Messenger",
];

const fieldServiceNeedOptions = [
  "Arbetsorderhantering",
  "Schemaläggning och resursplanering",
  "Mobil app för tekniker",
  "Reservdelshantering",
  "Preventivt underhåll",
  "Tidsrapportering",
  "Kundunderskrift på plats",
  "IoT-integration",
  "GPS och ruttoptimering",
  "Fakturaunderlag",
];

const marketingNeedOptions = [
  "E-postmarknadsföring",
  "Marketing automation",
  "Lead scoring och nurturing",
  "Kampanjhantering",
  "Event management",
  "Landningssidor och formulär",
  "Social media marketing",
  "Kundresor (customer journeys)",
  "Segmentering",
  "A/B-testning",
];

const marketingChannelOptions = [
  "E-post",
  "Social media",
  "Webbsida",
  "SMS",
  "Events/Webinars",
  "Digital annonsering",
  "Print/Direct mail",
];

const integrationOptions = [
  "Microsoft 365 (Outlook, Teams)",
  "LinkedIn Sales Navigator",
  "ERP-system",
  "Ekonomisystem",
  "E-handelsplattform",
  "Telefoni/Växel (CTI)",
  "Marketing automation-verktyg",
  "Power BI",
  "Azure / molntjänster",
];

const kpiOptions = [
  "Säljkonvertering (lead to close)",
  "Genomsnittligt ordervärde",
  "Customer Lifetime Value (CLV)",
  "Kundnöjdhet (NPS/CSAT)",
  "Första svarstid",
  "Ärendelösningstid",
  "Win rate",
  "Pipeline-värde",
  "Churn rate",
  "Marketing ROI",
];

const aiUseCaseOptions = [
  "Prediktiv lead scoring",
  "Intelligenta säljrekommendationer",
  "Automatiserad ärendeklassificering",
  "Chatbot för kundservice",
  "Nästa bästa åtgärd (NBA)",
  "E-postassistent (AI-genererad text)",
  "Insikter från kunddata",
  "Automatiserade arbetsflöden",
  "Sentimentanalys",
];

const CRMNeedsAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CRMAnalysisData>(initialData);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [
    Building2, Target, Users, Headphones, Wrench, Megaphone, Target, BarChart3, Sparkles, FileText
  ];

  const stepTitles = [
    "Företagsstorlek",
    "Nuvarande Situation",
    "Försäljning",
    "Kundservice",
    "Fältservice",
    "Marknadsföring",
    "Integrationer",
    "Nyckeltal",
    "AI & Automation",
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

  const handleCheckboxChange = (field: keyof CRMAnalysisData, value: string) => {
    const currentValues = data[field] as string[];
    if (currentValues.includes(value)) {
      setData({ ...data, [field]: currentValues.filter((v) => v !== value) });
    } else {
      setData({ ...data, [field]: [...currentValues, value] });
    }
  };

  // CRM Recommendation Logic
  const getCRMRecommendation = (): { products: { name: string; score: number; reasons: string[]; description: string; icon: string }[] } => {
    const recommendations: { [key: string]: { score: number; reasons: string[] } } = {
      sales: { score: 0, reasons: [] },
      customerService: { score: 0, reasons: [] },
      fieldService: { score: 0, reasons: [] },
      marketing: { score: 0, reasons: [] },
    };

    // Sales scoring
    if (data.salesNeeds.length > 0) {
      recommendations.sales.score += data.salesNeeds.length * 5;
      recommendations.sales.reasons.push(`${data.salesNeeds.length} säljfunktioner identifierade som behov`);
    }
    if (data.salesProcessComplexity === "Komplex (lång säljcykel, många intressenter)" || 
        data.salesProcessComplexity === "Mycket komplex (stora projekt, upphandlingar)") {
      recommendations.sales.score += 20;
      recommendations.sales.reasons.push("Komplex säljprocess kräver avancerat säljstöd");
    }
    if (data.salesTeamSize && data.salesTeamSize !== "Ej tillämpligt") {
      recommendations.sales.score += 15;
      recommendations.sales.reasons.push("Dedikerat säljteam behöver strukturerat CRM-stöd");
    }
    if (data.crmChallenges.includes("Ineffektiv säljprocess")) {
      recommendations.sales.score += 15;
      recommendations.sales.reasons.push("Nuvarande säljutmaningar motiverar Sales-investering");
    }
    if (data.kpis.some(k => ["Säljkonvertering (lead to close)", "Win rate", "Pipeline-värde", "Genomsnittligt ordervärde"].includes(k))) {
      recommendations.sales.score += 10;
      recommendations.sales.reasons.push("Fokus på säljrelaterade KPI:er");
    }

    // Customer Service scoring
    if (data.serviceNeeds.length > 0) {
      recommendations.customerService.score += data.serviceNeeds.length * 5;
      recommendations.customerService.reasons.push(`${data.serviceNeeds.length} servicefunktioner identifierade`);
    }
    if (data.serviceChannels.length >= 3) {
      recommendations.customerService.score += 15;
      recommendations.customerService.reasons.push("Multichannel-support kräver robust ärendehantering");
    }
    if (data.serviceTeamSize && data.serviceTeamSize !== "Ej tillämpligt" && data.serviceTeamSize !== "1-5") {
      recommendations.customerService.score += 15;
      recommendations.customerService.reasons.push("Större serviceteam behöver strukturerad ärendehantering");
    }
    if (data.crmChallenges.includes("Bristande kundservice och uppföljning")) {
      recommendations.customerService.score += 15;
      recommendations.customerService.reasons.push("Identifierade utmaningar inom kundservice");
    }
    if (data.kpis.some(k => ["Kundnöjdhet (NPS/CSAT)", "Första svarstid", "Ärendelösningstid"].includes(k))) {
      recommendations.customerService.score += 10;
      recommendations.customerService.reasons.push("Fokus på servicerelaterade KPI:er");
    }

    // Field Service scoring
    if (data.hasFieldService === "Ja" || data.hasFieldService === "Planerar att starta") {
      recommendations.fieldService.score += 25;
      recommendations.fieldService.reasons.push("Verksamhet med fältservice");
    }
    if (data.fieldServiceNeeds.length > 0) {
      recommendations.fieldService.score += data.fieldServiceNeeds.length * 5;
      recommendations.fieldService.reasons.push(`${data.fieldServiceNeeds.length} fältservicefunktioner identifierade`);
    }
    if (data.fieldServiceNeeds.includes("Schemaläggning och resursplanering")) {
      recommendations.fieldService.score += 10;
      recommendations.fieldService.reasons.push("Behov av avancerad schemaläggning");
    }
    if (data.fieldServiceNeeds.includes("IoT-integration")) {
      recommendations.fieldService.score += 15;
      recommendations.fieldService.reasons.push("IoT-behov stöds av Field Service");
    }

    // Marketing scoring
    if (data.marketingNeeds.length > 0) {
      recommendations.marketing.score += data.marketingNeeds.length * 5;
      recommendations.marketing.reasons.push(`${data.marketingNeeds.length} marknadsföringsfunktioner identifierade`);
    }
    if (data.marketingChannels.length >= 3) {
      recommendations.marketing.score += 15;
      recommendations.marketing.reasons.push("Multichannel-marknadsföring kräver centraliserad plattform");
    }
    if (data.crmChallenges.includes("Svårt att samordna sälj och marknad")) {
      recommendations.marketing.score += 20;
      recommendations.marketing.reasons.push("Behov av sälj-marknad-integration");
    }
    if (data.marketingNeeds.includes("Marketing automation") || data.marketingNeeds.includes("Kundresor (customer journeys)")) {
      recommendations.marketing.score += 15;
      recommendations.marketing.reasons.push("Behov av automation och kundresor");
    }
    if (data.kpis.includes("Marketing ROI")) {
      recommendations.marketing.score += 10;
      recommendations.marketing.reasons.push("Fokus på marketing ROI");
    }

    const productDetails = {
      sales: {
        name: "Dynamics 365 Sales",
        icon: "💼",
        description: `**Dynamics 365 Sales** är Microsofts ledande säljplattform för moderna säljteam.

• **Lead & Opportunity Management** - Strukturerad hantering av affärsmöjligheter från första kontakt till avslut
• **Pipeline-hantering** - Visualisera och prognostisera din säljpipeline
• **Relationship Intelligence** - AI-driven insikter om kundrelationer
• **LinkedIn Integration** - Sömlös koppling till LinkedIn Sales Navigator
• **Mobil säljare** - Fullständig funktionalitet i fält via mobilapp
• **Copilot för Sales** - AI-assistans för e-post, sammanfattningar och nästa steg`
      },
      customerService: {
        name: "Dynamics 365 Customer Service",
        icon: "🎧",
        description: `**Dynamics 365 Customer Service** levererar enastående kundservice i alla kanaler.

• **Omnichannel Support** - Telefon, e-post, chat, social media i ett gränssnitt
• **Case Management** - Komplett ärendehantering med SLA-stöd
• **Knowledge Base** - AI-driven kunskapsbank för snabbare lösningar
• **Självbetjäning** - Kundportaler och chatbots
• **Agent Experience** - Optimerat agentgränssnitt med 360° kundvy
• **Copilot för Service** - AI-assistans för agenter och automatiserade svar`
      },
      fieldService: {
        name: "Dynamics 365 Field Service",
        icon: "🔧",
        description: `**Dynamics 365 Field Service** optimerar fältserviceverksamheten från planering till utförande.

• **Intelligent Schemaläggning** - AI-optimerad resursplanering
• **Mobil App** - Fullständig offline-kapacitet för tekniker i fält
• **Arbetsorderhantering** - End-to-end hantering av serviceärenden
• **Reservdelslogistik** - Spårning och hantering av reservdelar
• **Preventivt Underhåll** - Schemalagt underhåll och IoT-integration
• **Customer Communication** - Automatiserade uppdateringar till kund`
      },
      marketing: {
        name: "Dynamics 365 Customer Insights (Marketing)",
        icon: "📣",
        description: `**Dynamics 365 Customer Insights (Marketing)** (Customer Insights - Journeys) skapar personaliserade kundupplevelser i stor skala.

• **Marketing Automation** - Automatiserade kampanjer och workflows
• **Customer Journeys** - Visuell design av kundresor
• **Event Management** - Webinars och fysiska events
• **Lead Scoring** - AI-driven prioritering av leads
• **Segmentering** - Målgruppsanalys och mikrosegmentering
• **Copilot för Marketing** - AI-assisterad content och kampanjskapande`
      },
    };

    // Filter and sort products by score
    const scoredProducts = Object.entries(recommendations)
      .filter(([_, rec]) => rec.score > 15)
      .sort((a, b) => b[1].score - a[1].score)
      .map(([key, rec]) => ({
        name: productDetails[key as keyof typeof productDetails].name,
        icon: productDetails[key as keyof typeof productDetails].icon,
        score: rec.score,
        reasons: rec.reasons.slice(0, 4),
        description: productDetails[key as keyof typeof productDetails].description,
      }));

    return { products: scoredProducts };
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

  const generateDocument = async () => {
    if (!validateContactForm()) {
      return;
    }
    
    const recommendation = getCRMRecommendation();
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    const addSectionHeader = (title: string, number: string) => {
      addNewPageIfNeeded(25);
      pdf.setFillColor(30, 58, 138); // CRM blue
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
        pdf.setFillColor(30, 58, 138);
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

    // Header
    pdf.setFillColor(30, 58, 138);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    pdf.setFillColor(20, 40, 100);
    pdf.rect(0, 45, pageWidth, 5, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("CRM BEHOVSANALYS", margin, 25);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Dynamics 365 Customer Engagement", margin, 35);
    
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth - 60, 15, 45, 20, 3, 3, 'F');
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(8);
    pdf.text("Datum", pageWidth - 55, 22);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(new Date().toLocaleDateString('sv-SE'), pageWidth - 55, 30);

    yPos = 60;

    // Introduction text
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    const introText = "Detta dokument sammanfattar er CRM-behovsanalys för Dynamics 365 Customer Engagement. Analysen ger en första indikation på vilka CRM-applikationer som passar era behov bäst och ligger till grund för vidare diskussion.";
    const introLines = pdf.splitTextToSize(introText, contentWidth);
    pdf.text(introLines, margin, yPos);
    yPos += introLines.length * 5 + 8;

    // Contact Information Box
    pdf.setFillColor(240, 245, 255);
    pdf.roundedRect(margin, yPos, contentWidth, 50, 3, 3, 'F');
    pdf.setDrawColor(30, 58, 138);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 50);
    
    pdf.setTextColor(30, 58, 138);
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
    
    yPos += 58;

    // Recommendation section
    if (recommendation.products.length > 0) {
      pdf.setFillColor(30, 58, 138);
      pdf.roundedRect(margin, yPos, contentWidth, 16, 3, 3, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("REKOMMENDERADE DYNAMICS 365 CE-APPLIKATIONER", margin + 5, yPos + 11);
      yPos += 22;

      recommendation.products.forEach((product, index) => {
        addNewPageIfNeeded(55);
        
        pdf.setFillColor(240, 245, 255);
        pdf.roundedRect(margin, yPos, contentWidth, 42, 2, 2, 'F');
        
        pdf.setTextColor(30, 58, 138);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${index + 1}. ${product.name}`, margin + 5, yPos + 10);
        
        // Add score indicator
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Matchningspoäng: ${product.score}%`, pageWidth - margin - 40, yPos + 10);
        
        pdf.setTextColor(51, 51, 51);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        let reasonY = yPos + 18;
        product.reasons.slice(0, 4).forEach(reason => {
          pdf.text(`• ${reason}`, margin + 8, reasonY);
          reasonY += 5;
        });
        
        yPos += 47;
      });
      yPos += 5;
    }

    // Sections with enhanced formatting
    addSectionHeader("Företagsstorlek & Bransch", "1");
    addContentRow("Anställda:", data.employees);
    pdf.setFont("helvetica", "bold");
    pdf.text("Bransch:", margin, yPos);
    yPos += 6;
    addBulletList(data.industries, data.industryOther);
    addContentRow("Säljteam:", data.salesTeamSize);
    addContentRow("Serviceteam:", data.serviceTeamSize);

    addSectionHeader("Nuvarande Situation", "2");
    addContentRow("Nuvarande CRM:", data.currentCRMOther || data.currentCRM);
    pdf.setFont("helvetica", "bold");
    pdf.text("Utmaningar:", margin, yPos);
    yPos += 6;
    addBulletList(data.crmChallenges, data.challengesOther);

    addSectionHeader("Försäljningsbehov", "3");
    addContentRow("Komplexitet:", data.salesProcessComplexity);
    pdf.setFont("helvetica", "bold");
    pdf.text("Behov:", margin, yPos);
    yPos += 6;
    addBulletList(data.salesNeeds, data.salesNeedsOther);

    addSectionHeader("Kundservicebehov", "4");
    addContentRow("Nuvarande kundservicesystem:", data.currentServiceSystemOther || data.currentServiceSystem);
    pdf.setFont("helvetica", "bold");
    pdf.text("Kanaler:", margin, yPos);
    yPos += 6;
    addBulletList(data.serviceChannels);
    pdf.setFont("helvetica", "bold");
    pdf.text("Behov:", margin, yPos);
    yPos += 6;
    addBulletList(data.serviceNeeds, data.serviceNeedsOther);

    addSectionHeader("Fältservice", "5");
    addContentRow("Fältservice:", data.hasFieldService);
    if (data.hasFieldService === "Ja" || data.hasFieldService === "Planerar att starta") {
      pdf.setFont("helvetica", "bold");
      pdf.text("Behov:", margin, yPos);
      yPos += 6;
      addBulletList(data.fieldServiceNeeds, data.fieldServiceNeedsOther);
    }

    addSectionHeader("Marknadsföring", "6");
    pdf.setFont("helvetica", "bold");
    pdf.text("Kanaler:", margin, yPos);
    yPos += 6;
    addBulletList(data.marketingChannels);
    pdf.setFont("helvetica", "bold");
    pdf.text("Behov:", margin, yPos);
    yPos += 6;
    addBulletList(data.marketingNeeds, data.marketingNeedsOther);

    addSectionHeader("Integrationer", "7");
    addBulletList(data.integrations, data.integrationsOther);

    addSectionHeader("Nyckeltal (KPI:er)", "8");
    addBulletList(data.kpis, data.kpisOther);

    addSectionHeader("AI & Automation", "9");
    addContentRow("AI-intresse:", data.aiInterest);
    if (data.aiUseCases.length > 0) {
      pdf.setFont("helvetica", "bold");
      pdf.text("Use cases:", margin, yPos);
      yPos += 6;
      addBulletList(data.aiUseCases);
    }
    if (data.aiDetails) {
      addContentRow("Detaljer:", data.aiDetails);
    }

    addSectionHeader("Övrig Information", "10");
    if (data.currentPartners) {
      pdf.setFont("helvetica", "bold");
      pdf.text("Microsoft-partners:", margin, yPos);
      yPos += 6;
      const partnerLines = pdf.splitTextToSize(data.currentPartners, contentWidth);
      pdf.setFont("helvetica", "normal");
      pdf.text(partnerLines, margin, yPos);
      yPos += partnerLines.length * 5 + 5;
    }
    if (data.additionalInfo) {
      pdf.setFont("helvetica", "bold");
      pdf.text("Övrigt:", margin, yPos);
      yPos += 6;
      const infoLines = pdf.splitTextToSize(data.additionalInfo, contentWidth);
      pdf.setFont("helvetica", "normal");
      pdf.text(infoLines, margin, yPos);
      yPos += infoLines.length * 5 + 5;
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
    pdf.text("2. Gemensam genomgång av era CRM-behov och vår rekommendation", margin + 8, nextStepsY + 6);
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
    pdf.text("• Besök vår partnerkatalog på dynamicfactory.se/valj-partner för att hitta rätt", margin + 8, yPos + 27);
    pdf.text("  implementationspartner som matchar era CRM-behov", margin + 8, yPos + 33);
    
    yPos += 45;

    // Disclaimer
    addNewPageIfNeeded(25);
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    const disclaimerText = "Denna analys ger en första indikation baserat på de uppgifter ni angett. En fullständig behovsanalys bör genomföras tillsammans med en certifierad Microsoft-partner för att säkerställa optimal CRM-lösning.";
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth);
    pdf.text(disclaimerLines, margin, yPos);
    yPos += disclaimerLines.length * 4 + 5;

    // Footer
    addNewPageIfNeeded(35);
    yPos = pageHeight - 40;
    pdf.setDrawColor(30, 58, 138);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    pdf.setFillColor(30, 58, 138);
    pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Dynamic Factory", margin + 8, yPos + 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Din oberoende guide till rätt Dynamics 365-lösning", margin + 8, yPos + 18);
    
    pdf.setFontSize(9);
    pdf.text("thomas.laine@dynamicfactory.se", pageWidth - margin - 55, yPos + 10);
    pdf.text("www.dynamicfactory.se", pageWidth - margin - 55, yPos + 18);

    pdf.save(`CRM_Behovsanalys_${data.companyName || 'Analys'}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    // Send email notification
    setIsSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke("send-analysis-email", {
        body: {
          analysisType: "CRM",
          companyName: data.companyName,
          contactName: data.contactName,
          phone: data.phone || "",
          email: data.email,
          analysisData: {
            "Anställda": data.employees,
            "Bransch": data.industries.join(", ") || "Ej angivet",
            "Säljteam": data.salesTeamSize,
            "Serviceteam": data.serviceTeamSize,
            "Nuvarande CRM": data.currentCRMOther || data.currentCRM || "Ej angivet",
            "Utmaningar": data.crmChallenges.join(", ") || "Ej angivet",
            "Säljbehov": data.salesNeeds.join(", ") || "Ej angivet",
            "Nuvarande kundservicesystem": data.currentServiceSystemOther || data.currentServiceSystem || "Ej angivet",
            "Servicebehov": data.serviceNeeds.join(", ") || "Ej angivet",
            "Fältservice": data.hasFieldService || "Ej angivet",
            "Marknadsföring": data.marketingNeeds.join(", ") || "Ej angivet",
            "Integrationer": data.integrations.join(", ") || "Ej angivet",
            "KPI:er": data.kpis.join(", ") || "Ej angivet",
            "AI-intresse": data.aiInterest || "Ej angivet",
            "Microsoft-partners": data.currentPartners || "Ej angivet",
            "Övrig info": data.additionalInfo || "Ej angivet",
          },
          recommendation: recommendation.products.length > 0 ? {
            product: recommendation.products.map(p => p.name).join(", "),
            reasons: recommendation.products.flatMap(p => p.reasons).slice(0, 5),
          } : undefined,
        },
      });

      if (error) {
        console.error("Error sending CRM analysis email:", error);
      } else {
        console.log("CRM analysis email sent successfully");
      }
    } catch (error) {
      console.error("Failed to send CRM analysis email:", error);
    } finally {
      setIsSendingEmail(false);
    }
    
    setIsComplete(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Antal anställda i företaget</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              <Label className="text-base font-semibold mb-3 block">Bransch</Label>
              <p className="text-sm text-muted-foreground mb-3">Välj en eller flera branscher som bäst beskriver er verksamhet.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industryOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.industries.includes(option)}
                    onClick={() => handleCheckboxChange('industries', option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <div className="mt-3">
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
            <div>
              <Label className="text-base font-semibold mb-3 block">Storlek på säljteam</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {teamSizeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.salesTeamSize === option}
                    onClick={() => setData({ ...data, salesTeamSize: option })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Storlek på kundservice-/Contact Centerteam</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {teamSizeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.serviceTeamSize === option}
                    onClick={() => setData({ ...data, serviceTeamSize: option })}
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
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka utmaningar upplever ni idag? (välj alla som stämmer)</Label>
              <div className="grid grid-cols-1 gap-3">
                {commonChallengeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.crmChallenges.includes(option)}
                    onClick={() => handleCheckboxChange("crmChallenges", option)}
                    type="checkbox"
                  />
                ))}
                {data.salesTeamSize !== "Ej tillämpligt" && salesChallengeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.crmChallenges.includes(option)}
                    onClick={() => handleCheckboxChange("crmChallenges", option)}
                    type="checkbox"
                  />
                ))}
                {data.serviceTeamSize !== "Ej tillämpligt" && serviceChallengeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.crmChallenges.includes(option)}
                    onClick={() => handleCheckboxChange("crmChallenges", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga utmaningar..."
                value={data.challengesOther}
                onChange={(e) => setData({ ...data, challengesOther: e.target.value })}
                className="mt-3"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilket CRM-system (inom kategorin försäljning) använder ni idag?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentCRMOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.currentCRM === option}
                    onClick={() => setData({ ...data, currentCRM: option })}
                    type="radio"
                  />
                ))}
              </div>
              <div className="mt-4">
                <Label htmlFor="currentCRMOther">Annat system</Label>
                <Input
                  id="currentCRMOther"
                  placeholder="Skriv namnet på ert nuvarande CRM-system..."
                  value={data.currentCRMOther}
                  onChange={(e) => setData({ ...data, currentCRMOther: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur komplex är er säljprocess?</Label>
              <div className="grid grid-cols-1 gap-3">
                {salesComplexityOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.salesProcessComplexity === option}
                    onClick={() => setData({ ...data, salesProcessComplexity: option })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka säljfunktioner behöver ni? (välj alla som stämmer)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {salesNeedOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.salesNeeds.includes(option)}
                    onClick={() => handleCheckboxChange("salesNeeds", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga säljbehov..."
                value={data.salesNeedsOther}
                onChange={(e) => setData({ ...data, salesNeedsOther: e.target.value })}
                className="mt-3"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilket system använder ni idag inom kategorin kundservice/ärendehantering/Contact Center?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentServiceSystemOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.currentServiceSystem === option}
                    onClick={() => setData({ ...data, currentServiceSystem: option })}
                    type="radio"
                  />
                ))}
              </div>
              <div className="mt-4">
                <Label htmlFor="currentServiceSystemOther">Annat system</Label>
                <Input
                  id="currentServiceSystemOther"
                  placeholder="Skriv namnet på ert nuvarande kundservice-system..."
                  value={data.currentServiceSystemOther}
                  onChange={(e) => setData({ ...data, currentServiceSystemOther: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka kanaler använder ni för kundservice?</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {serviceChannelOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.serviceChannels.includes(option)}
                    onClick={() => handleCheckboxChange("serviceChannels", option)}
                    type="checkbox"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka kundservicefunktioner behöver ni? (välj alla som stämmer)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceNeedOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.serviceNeeds.includes(option)}
                    onClick={() => handleCheckboxChange("serviceNeeds", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga servicebehov..."
                value={data.serviceNeedsOther}
                onChange={(e) => setData({ ...data, serviceNeedsOther: e.target.value })}
                className="mt-3"
              />
            </div>
          </div>
        );

      case 5:
        const fieldServiceRadioOptions = [
          { value: "Ja", label: "Ja" },
          { value: "Nej", label: "Nej" },
          { value: "Planerar att starta", label: "Planerar att starta" }
        ];
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Har ni fältserviceverksamhet?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {fieldServiceRadioOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    selected={data.hasFieldService === option.value}
                    onClick={() => setData({ ...data, hasFieldService: option.value })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            {(data.hasFieldService === "Ja" || data.hasFieldService === "Planerar att starta") && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Vilka fältservicefunktioner behöver ni?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fieldServiceNeedOptions.map((option) => (
                    <SelectionCard
                      key={option}
                      label={option}
                      selected={data.fieldServiceNeeds.includes(option)}
                      onClick={() => handleCheckboxChange("fieldServiceNeeds", option)}
                      type="checkbox"
                    />
                  ))}
                </div>
                <Textarea
                  placeholder="Övriga fältservicebehov..."
                  value={data.fieldServiceNeedsOther}
                  onChange={(e) => setData({ ...data, fieldServiceNeedsOther: e.target.value })}
                  className="mt-3"
                />
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka marknadsföringskanaler använder ni?</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {marketingChannelOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.marketingChannels.includes(option)}
                    onClick={() => handleCheckboxChange("marketingChannels", option)}
                    type="checkbox"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka marknadsföringsfunktioner behöver ni?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {marketingNeedOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.marketingNeeds.includes(option)}
                    onClick={() => handleCheckboxChange("marketingNeeds", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga marknadsföringsbehov..."
                value={data.marketingNeedsOther}
                onChange={(e) => setData({ ...data, marketingNeedsOther: e.target.value })}
                className="mt-3"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka integrationer är viktiga för er?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrationOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.integrations.includes(option)}
                    onClick={() => handleCheckboxChange("integrations", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga integrationer..."
                value={data.integrationsOther}
                onChange={(e) => setData({ ...data, integrationsOther: e.target.value })}
                className="mt-3"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka nyckeltal (KPI:er) är viktigast för er?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {kpiOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.kpis.includes(option)}
                    onClick={() => handleCheckboxChange("kpis", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga KPI:er..."
                value={data.kpisOther}
                onChange={(e) => setData({ ...data, kpisOther: e.target.value })}
                className="mt-3"
              />
            </div>
          </div>
        );

      case 9:
        const aiInterestOptions = [
          { value: "Mycket intresserade", label: "Mycket intresserade" },
          { value: "Ganska intresserade", label: "Ganska intresserade" },
          { value: "Lite intresserade", label: "Lite intresserade" },
          { value: "Ej intresserade just nu", label: "Ej intresserade just nu" }
        ];
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur intresserade är ni av AI och automation?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <Label className="text-base font-semibold mb-3 block">Vilka AI-användningsområden är intressanta?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiUseCaseOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.aiUseCases.includes(option)}
                    onClick={() => handleCheckboxChange("aiUseCases", option)}
                    type="checkbox"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Berätta mer om era AI-ambitioner</Label>
              <Textarea
                placeholder="Beskriv era tankar kring AI och automation..."
                value={data.aiDetails}
                onChange={(e) => setData({ ...data, aiDetails: e.target.value })}
              />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Har ni kontakt med några Microsoftpartners idag? Vilka är det?</Label>
              <Textarea
                placeholder="Ange vilka Microsoft-partners ni eventuellt har kontakt med..."
                value={data.currentPartners}
                onChange={(e) => setData({ ...data, currentPartners: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Övrig information</Label>
              <Textarea
                placeholder="Berätta mer om era behov, utmaningar, tidplan eller andra relevanta faktorer..."
                value={data.additionalInfo}
                onChange={(e) => setData({ ...data, additionalInfo: e.target.value })}
                className="min-h-[150px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContactForm = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Fyll i era kontaktuppgifter för att få tillgång till er personliga CRM-rekommendation och analys.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Företagsnamn *</Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => {
              setData({ ...data, companyName: e.target.value });
              if (contactErrors.companyName) {
                setContactErrors({ ...contactErrors, companyName: undefined });
              }
            }}
            placeholder="Ert företagsnamn"
            className={contactErrors.companyName ? 'border-destructive' : ''}
          />
          {contactErrors.companyName && (
            <p className="text-sm text-destructive mt-1">{contactErrors.companyName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="contactName">Ditt namn *</Label>
          <Input
            id="contactName"
            value={data.contactName}
            onChange={(e) => {
              setData({ ...data, contactName: e.target.value });
              if (contactErrors.contactName) {
                setContactErrors({ ...contactErrors, contactName: undefined });
              }
            }}
            placeholder="För- och efternamn"
            className={contactErrors.contactName ? 'border-destructive' : ''}
          />
          {contactErrors.contactName && (
            <p className="text-sm text-destructive mt-1">{contactErrors.contactName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => {
              setData({ ...data, phone: e.target.value });
              if (contactErrors.phone) {
                setContactErrors({ ...contactErrors, phone: undefined });
              }
            }}
            placeholder="Telefonnummer"
            className={contactErrors.phone ? 'border-destructive' : ''}
          />
          {contactErrors.phone && (
            <p className="text-sm text-destructive mt-1">{contactErrors.phone}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">E-post *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
              if (contactErrors.email) {
                setContactErrors({ ...contactErrors, email: undefined });
              }
            }}
            placeholder="din.email@foretag.se"
            className={contactErrors.email ? 'border-destructive' : ''}
          />
          {contactErrors.email && (
            <p className="text-sm text-destructive mt-1">{contactErrors.email}</p>
          )}
        </div>
      </div>
    </div>
  );

  const recommendation = getCRMRecommendation();

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-2 border-crm/30">
              <CardHeader className="text-center bg-gradient-to-r from-crm/10 to-crm/5">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-crm rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-crm">Tack för din CRM-behovsanalys!</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Din analys har sparats och PDF:en har laddats ner.
                </p>
              </CardHeader>
              <CardContent className="pt-8">
                {/* Recommendation Display */}
                {recommendation.products.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-center mb-6">Rekommenderade Dynamics 365 CE-applikationer</h3>
                    <div className="space-y-6">
                      {recommendation.products.map((product, index) => (
                        <Card key={product.name} className={`border-2 ${index === 0 ? 'border-crm bg-crm/5' : 'border-border'}`}>
                          <CardHeader className={index === 0 ? 'bg-gradient-to-r from-crm/20 to-crm/10' : ''}>
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{product.icon}</span>
                              <div>
                                <CardTitle className={`text-lg ${index === 0 ? 'text-crm' : ''}`}>
                                  {index === 0 && <span className="text-xs font-normal bg-crm text-white px-2 py-0.5 rounded mr-2">Primär</span>}
                                  {product.name}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="mb-4">
                              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Varför detta val:</h4>
                              <ul className="space-y-1">
                                {product.reasons.map((reason, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-crm mt-0.5 flex-shrink-0" />
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="prose prose-sm max-w-none text-muted-foreground">
                              {product.description.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-sm mb-2">
                                  {paragraph.split(/(\*\*.*?\*\*|• )/).map((part, j) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                      return <strong key={j}>{part.slice(2, -2)}</strong>;
                                    }
                                    if (part === '• ') {
                                      return <><br key={j} />• </>;
                                    }
                                    return part;
                                  })}
                                </p>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Vi kommer att kontakta dig inom kort för att diskutera hur Dynamics 365 kan hjälpa er verksamhet.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-crm hover:bg-crm/90">
                      <Link to="/crm">Läs mer om Dynamics 365 CRM</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/kontakt">Kontakta oss direkt</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const StepIcon = stepIcons[currentStep - 1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              CRM Behovsanalys
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Svara på frågorna för att få en personlig rekommendation om vilka Dynamics 365 Customer Engagement-applikationer som passar er bäst.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {showContactForm ? "Kontaktuppgifter" : `Steg ${currentStep} av ${totalSteps}`}
              </span>
              <span className="text-sm font-medium text-crm">
                {showContactForm ? "100%" : `${Math.round(progress)}%`}
              </span>
            </div>
            <Progress value={showContactForm ? 100 : progress} className="h-2" />
          </div>

          {/* Step indicators */}
          {!showContactForm && (
            <div className="hidden md:flex justify-between mb-8 overflow-x-auto pb-2">
              {stepTitles.map((title, index) => {
                const Icon = stepIcons[index];
                const isActive = currentStep === index + 1;
                const isCompleted = currentStep > index + 1;
                return (
                  <div key={index} className="flex flex-col items-center min-w-[80px]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isActive ? 'bg-crm text-white' : 
                      isCompleted ? 'bg-crm/20 text-crm' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs text-center ${isActive ? 'text-crm font-medium' : 'text-muted-foreground'}`}>
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Main Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-crm/10 to-crm/5 border-b">
              <div className="flex items-center gap-3">
                {showContactForm ? (
                  <FileText className="w-6 h-6 text-crm" />
                ) : (
                  <StepIcon className="w-6 h-6 text-crm" />
                )}
                <CardTitle className="text-xl text-crm">
                  {showContactForm ? "Kontaktuppgifter" : stepTitles[currentStep - 1]}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {showContactForm ? renderContactForm() : renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
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
                disabled={!data.companyName || !data.contactName || !data.email}
                className="bg-crm hover:bg-crm/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Ladda ner analys
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-crm hover:bg-crm/90">
                {currentStep === totalSteps ? "Nästa" : "Nästa"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CRMNeedsAnalysis;
