import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, Building2, Globe, Boxes, Link2, Server, AlertTriangle, BarChart3, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";

interface AnalysisData {
  // Step 1
  employees: string;
  revenue: string;
  // Step 2
  industries: string[];
  industryOther: string;
  // Step 3
  geography: string[];
  geographyOther: string;
  // Step 4
  modules: string[];
  modulesOther: string;
  // Step 5
  integrations: string[];
  integrationsOther: string;
  // Step 6
  currentERP: string;
  erpInstallYear: string;
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
  industries: [],
  industryOther: "",
  geography: [],
  geographyOther: "",
  modules: [],
  modulesOther: "",
  integrations: [],
  integrationsOther: "",
  currentERP: "",
  erpInstallYear: "",
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
  "< 10",
  "10-49",
  "50-199",
  "200-499",
  "500-999",
  "1.000-4.999",
  "> 5.000",
];

const revenueOptions = [
  "< 49 MSEK",
  "50-499 MSEK",
  "500-999 MSEK",
  "1.000-4.999 MSEK",
  "> 5.000 MSEK",
];

const industryOptions = [
  "Tillverkning",
  "Distribution & Grossist",
  "Detaljhandel",
  "Bygg & Fastighet",
  "Professionella tjänster",
  "Transport & Logistik",
  "Livsmedel & Dryck",
  "Läkemedel & Life Science",
  "Energi & Utilities",
  "Finans & Försäkring",
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
  "Tillverkning & Produktion",
  "Projekthantering",
  "Service & Fältservice",
  "HR & Lönehantering",
  "E-handel",
  "Business Intelligence & Rapportering",
];

const integrationOptions = [
  "Bank & Betalningar",
  "E-handelsplattform",
  "EDI / Peppol",
  "CRM-system",
  "Lönesystem",
  "Transportbokning",
  "Webshop",
  "API:er till kundsystem",
  "Microsoft 365",
  "Power Platform",
];

const erpSystemOptions = [
  "Microsoft Dynamics 365 Business Central",
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
  "Manuella processer / Excel",
  "Annat system",
];

const otherSystemOptions = [
  "Microsoft 365 (Office)",
  "Power BI",
  "Salesforce",
  "HubSpot",
  "Zendesk",
  "Jira",
  "Slack / Teams",
  "SharePoint",
  "Adobe Creative Cloud",
  "CAD-system",
];

const challengeOptions = [
  "Bristande översikt och rapportering",
  "Manuella och tidskrävande processer",
  "Dålig integration mellan system",
  "Svårt att skala verksamheten",
  "Höga underhållskostnader",
  "Föråldrad teknik utan support",
  "Bristande mobilitet och tillgänglighet",
  "Svårt att hitta kompetens",
  "Regulatoriska krav (GDPR, etc.)",
  "Behov av bättre kundinsikter",
];

const kpiOptions = [
  "Omsättning och tillväxt",
  "Bruttomarginal",
  "Lagervärde och omsättningshastighet",
  "Kundnöjdhet (NPS/CSAT)",
  "Leveransprecision",
  "Produktivitet per anställd",
  "Kassaflöde",
  "Ordervärde (AOV)",
  "Ledtider i produktion",
  "Kostnad per order",
];

const aiUseCaseOptions = [
  "Automatiserad fakturering och bokföring",
  "Intelligent kundservice (chatbots)",
  "Försäljningsprognoser",
  "Lageroptimering",
  "Produktionsplanering",
  "Dokumenthantering och analys",
  "Prediktivt underhåll",
  "Automatiserad rapportgenerering",
  "Personaliserade kundupplevelser",
];

const NeedsAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AnalysisData>(initialData);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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
    const manufacturingIndustries = ["Tillverkning", "Livsmedel & Dryck", "Läkemedel & Life Science"];
    const distributionIndustries = ["Distribution & Grossist", "Transport & Logistik"];
    const enterpriseIndustries = ["Energi & Utilities", "Finans & Försäkring"];

    data.industries.forEach(industry => {
      if (manufacturingIndustries.includes(industry)) {
        fscScore += 10;
        fscReasons.push(`${industry} gynnas av avancerad tillverkningshantering i F&SC`);
      }
      if (distributionIndustries.includes(industry)) {
        bcScore += 5;
        fscScore += 5;
      }
      if (enterpriseIndustries.includes(industry)) {
        fscScore += 15;
        fscReasons.push(`${industry} kräver ofta enterprise-funktionalitet`);
      }
    });

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

• **Komplett ERP-lösning** - Ekonomi, försäljning, inköp, lager och projekt i ett system
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

  const generateDocument = () => {
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
    pdf.text("Dynamics 365 ERP", margin, 35);
    
    // Date badge
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth - 60, 15, 45, 20, 3, 3, 'F');
    pdf.setTextColor(0, 150, 136);
    pdf.setFontSize(8);
    pdf.text("Genererad", pageWidth - 55, 23);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(new Date().toLocaleDateString('sv-SE'), pageWidth - 55, 31);
    
    yPos = 65;

    // Contact Information Box
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');
    pdf.setDrawColor(0, 150, 136);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 45);
    
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
    pdf.text(`Tel: ${data.phone}`, pageWidth / 2, contactY);
    pdf.text(`E-post: ${data.email}`, pageWidth / 2, contactY + 8);
    
    yPos += 55;

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
    addBulletList(data.industries, data.industryOther);

    // Section 3: Geography
    addSectionHeader("GEOGRAFI", "3");
    addBulletList(data.geography, data.geographyOther);

    // Section 4: Modules
    addSectionHeader("FUNKTIONER & MODULER", "4");
    addBulletList(data.modules, data.modulesOther);

    // Section 5: Integrations
    addSectionHeader("INTEGRATIONER", "5");
    addBulletList(data.integrations, data.integrationsOther);

    // Section 6: Current Systems
    addSectionHeader("NUVARANDE SYSTEM", "6");
    addContentRow("ERP-system:", data.currentERP);
    addContentRow("Installationsår:", data.erpInstallYear);
    if (data.otherSystems.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Övriga system:", margin, yPos);
      yPos += 7;
      addBulletList(data.otherSystems, data.otherSystemsDetails);
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

    // Footer
    addNewPageIfNeeded(30);
    yPos = pageHeight - 35;
    drawLine(yPos);
    yPos += 8;
    
    pdf.setFillColor(0, 150, 136);
    pdf.roundedRect(margin, yPos, contentWidth, 22, 3, 3, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Dynamic Factory", margin + 8, yPos + 9);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Kontakta oss för en djupare genomgång", margin + 8, yPos + 16);
    
    pdf.setFontSize(9);
    pdf.text("thomas.laine@dynamicfactory.se", pageWidth - margin - 55, yPos + 9);
    pdf.text("www.dynamicfactory.se", pageWidth - margin - 55, yPos + 16);

    // Save PDF
    pdf.save(`Behovsanalys_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    setIsComplete(true);
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
              <RadioGroup
                value={data.employees}
                onValueChange={(value) => setData({ ...data, employees: value })}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
              >
                {employeeOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`emp-${option}`} />
                    <Label htmlFor={`emp-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Omsättning</h3>
              <RadioGroup
                value={data.revenue}
                onValueChange={(value) => setData({ ...data, revenue: value })}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {revenueOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`rev-${option}`} />
                    <Label htmlFor={`rev-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Välj en eller flera branscher som bäst beskriver er verksamhet.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ind-${option}`}
                    checked={data.industries.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('industries', option)}
                  />
                  <Label htmlFor={`ind-${option}`} className="cursor-pointer">{option}</Label>
                </div>
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
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`geo-${option}`}
                    checked={data.geography.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('geography', option)}
                  />
                  <Label htmlFor={`geo-${option}`} className="cursor-pointer">{option}</Label>
                </div>
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
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mod-${option}`}
                    checked={data.modules.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('modules', option)}
                  />
                  <Label htmlFor={`mod-${option}`} className="cursor-pointer">{option}</Label>
                </div>
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
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`int-${option}`}
                    checked={data.integrations.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('integrations', option)}
                  />
                  <Label htmlFor={`int-${option}`} className="cursor-pointer">{option}</Label>
                </div>
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
              <h3 className="text-lg font-semibold mb-4">Nuvarande ERP-system</h3>
              <RadioGroup
                value={data.currentERP}
                onValueChange={(value) => setData({ ...data, currentERP: value })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {erpSystemOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`erp-${option}`} />
                    <Label htmlFor={`erp-${option}`} className="cursor-pointer text-sm">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="erpInstallYear">Installationsår (ungefärligt)</Label>
              <Input
                id="erpInstallYear"
                type="number"
                placeholder="T.ex. 2015"
                value={data.erpInstallYear}
                onChange={(e) => setData({ ...data, erpInstallYear: e.target.value })}
                className="mt-2 max-w-[150px]"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Övriga system i verksamheten</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherSystemOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`other-${option}`}
                      checked={data.otherSystems.includes(option)}
                      onCheckedChange={() => handleCheckboxChange('otherSystems', option)}
                    />
                    <Label htmlFor={`other-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="otherSystemsDetails">Övriga systemdetaljer</Label>
              <Textarea
                id="otherSystemsDetails"
                placeholder="Beskriv eventuella övriga system..."
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
            <p className="text-muted-foreground">Vilka utmaningar upplever ni som behöver hanteras i ett nytt affärssystem?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challengeOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`chal-${option}`}
                    checked={data.challenges.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('challenges', option)}
                  />
                  <Label htmlFor={`chal-${option}`} className="cursor-pointer">{option}</Label>
                </div>
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
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka nyckeltal är viktigast för er verksamhet att följa och förbättra?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kpiOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`kpi-${option}`}
                    checked={data.kpis.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('kpis', option)}
                  />
                  <Label htmlFor={`kpi-${option}`} className="cursor-pointer">{option}</Label>
                </div>
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
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hur intresserade är ni av AI i affärssystemet?</h3>
              <RadioGroup
                value={data.aiInterest}
                onValueChange={(value) => setData({ ...data, aiInterest: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mycket intresserade" id="ai-high" />
                  <Label htmlFor="ai-high" className="cursor-pointer">Mycket intresserade - Vi vill vara i framkant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ganska intresserade" id="ai-medium" />
                  <Label htmlFor="ai-medium" className="cursor-pointer">Ganska intresserade - Vi vill utforska möjligheterna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Avvaktande" id="ai-low" />
                  <Label htmlFor="ai-low" className="cursor-pointer">Avvaktande - Vi vill se konkreta användningsfall först</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inte intresserade just nu" id="ai-none" />
                  <Label htmlFor="ai-none" className="cursor-pointer">Inte intresserade just nu</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Vilka AI-användningsområden ser ni som mest intressanta?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiUseCaseOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ai-${option}`}
                      checked={data.aiUseCases.includes(option)}
                      onCheckedChange={() => handleCheckboxChange('aiUseCases', option)}
                    />
                    <Label htmlFor={`ai-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
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
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center">
              <CardContent className="pt-12 pb-8">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Tack för din behovsanalys!</h2>
                <p className="text-muted-foreground mb-6">
                  Ditt dokument har laddats ned. Vi kommer att kontakta dig inom kort för att diskutera era behov och hur vi kan hjälpa er.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-primary">
                    <a href="mailto:thomas.laine@dynamicfactory.se">
                      Kontakta oss direkt
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setData(initialData);
                      setCurrentStep(1);
                      setShowContactForm(false);
                      setIsComplete(false);
                    }}
                  >
                    Starta ny analys
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                        onChange={(e) => setData({ ...data, companyName: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactName">Ditt namn *</Label>
                      <Input
                        id="contactName"
                        placeholder="Förnamn Efternamn"
                        value={data.contactName}
                        onChange={(e) => setData({ ...data, contactName: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefonnummer *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+46 70 123 45 67"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-postadress *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="namn@foretag.se"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="mt-2"
                      />
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
