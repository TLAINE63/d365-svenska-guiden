import logoImage from "@/assets/dynamic-factory-logo-new.jpg";

const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface RequirementSection {
  area: string;
  items: string[];
}

interface BaseRequirement {
  category: string;
  sections: RequirementSection[];
}

interface IndustryRequirement {
  area: string;
  items: string[];
  priority: string;
  rationale: string;
}

interface KPI {
  name: string;
  target: string;
  description: string;
}

export interface RequirementsData {
  product: string;
  industry: string;
  companySize: string;
  baseRequirements: BaseRequirement[];
  aiEnrichment: {
    industryRequirements: IndustryRequirement[];
    kpis: KPI[];
    regulatoryNotes: string[];
    integrationSuggestions: string[];
    productRecommendation?: {
      recommendation: string;
      rationale: string;
    };
  };
}

const categoryLabels: Record<string, string> = {
  ekonomi: "Ekonomi & Redovisning",
  lager: "Lager & Logistik",
  produktion: "Produktion & Tillverkning",
  forsaljning: "Försäljning & Order",
  inkop: "Inköp & Anskaffning",
  projekt: "Projekt & Resurser",
  hr: "Personal & HR",
  service: "Service & Underhåll",
  transport: "Transport & Distribution",
  koncern: "Koncern & Flerbolag",
  integration: "Integrationer & Teknik",
  // Customer Service categories
  case_mgmt: "Ärendehantering",
  queues_routing: "Köer & Routing",
  knowledge: "Kunskapsbas & FAQ",
  sla_entitlements: "SLA & Serviceavtal",
  channels: "Kanaler (Chatt, E-post, Telefon)",
  contact_center: "Contact Center & Telefoni",
  copilot_ai: "Copilot & AI-assistans",
  field_service: "Fältservice & Arbetsorder",
  scheduling: "Schemaläggning & Resurser",
  analytics_cs: "Analys & Rapportering",
  self_service: "Självbetjäningsportal",
  integration_cs: "Integrationer",
  // Sales (CRM) categories
  lead_mgmt: "Lead- & Kvalificering",
  opportunity: "Affärsmöjligheter & Pipeline",
  account_contact: "Kund- & Kontakthantering",
  activities: "Aktiviteter & Uppföljning",
  quotes_orders: "Offerter & Order",
  analytics: "Analys & Rapportering",
  automation: "Automatisering & Copilot",
  email_marketing: "E-post & Kampanjer",
  // Marketing categories
  segments: "Segment & Målgrupper",
  journeys: "Kundresor & Automation",
  email: "E-postkampanjer",
  events_mgmt: "Event & Webinarier",
  forms_pages: "Formulär & Landningssidor",
  lead_scoring: "Lead Scoring & Kvalificering",
  consent: "Samtycke & GDPR",
  personalization: "Personalisering & AI",
};

const priorityLabels: Record<string, string> = {
  must: "Måste ha",
  should: "Bör ha",
  could: "Kan ha",
};

export const generateRequirementsSpec = async (
  data: RequirementsData,
  returnBase64: boolean = false
): Promise<string | void> => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Colors - product-specific
  const isErp = data.product === "erp";
  const isBc = data.product === "bc";
  const isSales = data.product === "sales";
  const isMarketing = data.product === "marketing";
  const isCustomerService = data.product === "customer_service";
  const primaryColor = isCustomerService
    ? { r: 134, g: 97, b: 197 }    // Customer Service violet
    : isMarketing
      ? { r: 135, g: 50, b: 160 }   // Marketing purple
      : isSales
        ? { r: 42, g: 100, b: 168 }  // Sales blue
        : (isErp || isBc)
          ? { r: 0, g: 120, b: 212 }  // ERP / BC blue
          : { r: 16, g: 124, b: 65 }; // FSC green
  const darkColor = { r: 30, g: 41, b: 59 };
  const mutedColor = { r: 100, g: 116, b: 139 };
  const lightBg = { r: 248, g: 250, b: 252 };

  let logoBase64: string | null = null;
  let logoAspect = 1;
  try {
    logoBase64 = await getBase64FromUrl(logoImage);
    // Get natural aspect ratio
    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = logoBase64!;
    });
    if (img.naturalWidth && img.naturalHeight) {
      logoAspect = img.naturalWidth / img.naturalHeight;
    }
  } catch (e) {
    console.log("Could not load logo:", e);
  }

  const addHeader = () => {
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.5);
    doc.line(margin, 12, pageWidth - margin, 12);
    doc.setFontSize(8);
    doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
    doc.text("www.d365.se", pageWidth - margin, 10, { align: "right" });
  };

  const addFooter = (pageNum: number) => {
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFontSize(8);
    doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
    doc.text(`Sida ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: "right" });
    doc.text("Genererad via d365.se - Oberoende guide till Dynamics 365", margin, pageHeight - 10);
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - 25) {
      addFooter(doc.getNumberOfPages());
      doc.addPage();
      addHeader();
      y = 20;
    }
  };

  const addSectionTitle = (title: string) => {
    checkPageBreak(20);
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.rect(margin, y, contentWidth, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), margin + 4, y + 7);
    y += 16;
  };

  const addSubSection = (title: string) => {
    checkPageBreak(15);
    doc.setFillColor(lightBg.r, lightBg.g, lightBg.b);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    doc.text(title, margin + 3, y + 5.5);
    y += 12;
  };

  const addBulletItem = (text: string, indent: number = 0) => {
    const bulletX = margin + 4 + indent;
    const textX = bulletX + 4;
    const maxWidth = contentWidth - 8 - indent;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    checkPageBreak(lines.length * 5 + 2);
    
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.circle(bulletX + 1, y + 1.5, 1, "F");
    doc.text(lines, textX, y + 3);
    y += lines.length * 5 + 2;
  };

  // === COVER PAGE ===
  if (logoBase64) {
    try {
      const logoHeight = 30;
      const logoWidth = logoHeight * logoAspect;
      doc.addImage(logoBase64, "JPEG", margin, 25, logoWidth, logoHeight);
    } catch (e) { /* skip */ }
  }

  y = 85;
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
  doc.text("Kravspecifikation", margin, y);
  y += 14;

  const productNames: Record<string, string> = {
    erp: "Microsoft Dynamics 365 – ERP / Affärssystem",
    bc: "Microsoft Dynamics 365 Business Central",
    fsc: "Microsoft Dynamics 365 Finance & Supply Chain Management",
    sales: "Microsoft Dynamics 365 Sales",
    marketing: "Microsoft Dynamics 365 Customer Insights (Marketing)",
    customer_service: "Microsoft Dynamics 365 Customer Service, Contact Center & Field Service",
  };
  const productName = productNames[data.product] || data.product;
  const titleLines = doc.splitTextToSize(productName, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8 + 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
  doc.text(`Bransch: ${data.industry}`, margin, y);
  y += 7;
  doc.text(`Företagsstorlek: ${data.companySize || "Ej angiven"}`, margin, y);
  y += 7;
  doc.text(`Genererad: ${new Date().toLocaleDateString("sv-SE")}`, margin, y);
  y += 20;

  // Disclaimer
  doc.setFillColor(255, 248, 230);
  doc.rect(margin, y, contentWidth, 22, "F");
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 22, "S");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 80, 0);
  doc.text("OBS: Vägledande kravspecifikation", margin + 4, y + 6);
  doc.setFont("helvetica", "normal");
  const disclaimerLines = doc.splitTextToSize(
    "Denna kravspecifikation är genererad som en utgångspunkt och överblick. Den ersätter inte en fullständig förstudie eller kravanalys tillsammans med en kvalificerad Microsoft-partner. Branschspecifika tillägg är AI-genererade och bör valideras.",
    contentWidth - 8
  );
  doc.text(disclaimerLines, margin + 4, y + 11);

  addFooter(1);

  // === BASE REQUIREMENTS ===
  doc.addPage();
  addHeader();
  y = 20;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
  doc.text("Funktionella krav", margin, y);
  y += 12;

  for (const req of data.baseRequirements) {
    const label = categoryLabels[req.category] || req.category;
    addSectionTitle(label);

    for (const section of req.sections) {
      addSubSection(section.area);
      for (const item of section.items) {
        addBulletItem(item);
      }
      y += 3;
    }
    y += 5;
  }

  // === AI-ENRICHED INDUSTRY REQUIREMENTS ===
  if (data.aiEnrichment.industryRequirements.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    doc.text(`Branschspecifika krav - ${data.industry}`, margin, y);
    y += 4;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
    doc.text("AI-genererade tillägg baserat på branschens specifika behov", margin, y + 4);
    y += 12;

    for (const req of data.aiEnrichment.industryRequirements) {
      const pLabel = priorityLabels[req.priority] || req.priority;
      addSubSection(`${req.area} [${pLabel}]`);

      // Rationale
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
      const rationaleLines = doc.splitTextToSize(req.rationale, contentWidth - 8);
      checkPageBreak(rationaleLines.length * 4 + 4);
      doc.text(rationaleLines, margin + 4, y);
      y += rationaleLines.length * 4 + 4;

      for (const item of req.items) {
        addBulletItem(item);
      }
      y += 4;
    }
  }

  // === KPIs ===
  if (data.aiEnrichment.kpis.length > 0) {
    checkPageBreak(30);
    addSectionTitle("Föreslagna KPI:er");
    
    for (const kpi of data.aiEnrichment.kpis) {
      checkPageBreak(18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
      doc.text(`${kpi.name}`, margin + 4, y + 3);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text(`Mål: ${kpi.target}`, margin + 4 + doc.getTextWidth(kpi.name + "  "), y + 3);
      y += 6;
      
      doc.setFontSize(8);
      doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
      const descLines = doc.splitTextToSize(kpi.description, contentWidth - 8);
      doc.text(descLines, margin + 4, y);
      y += descLines.length * 4 + 4;
    }
  }

  // === REGULATORY NOTES ===
  if (data.aiEnrichment.regulatoryNotes.length > 0) {
    checkPageBreak(20);
    addSectionTitle("Regulatoriska krav & Efterlevnad");
    for (const note of data.aiEnrichment.regulatoryNotes) {
      addBulletItem(note);
    }
    y += 4;
  }

  // === INTEGRATION SUGGESTIONS ===
  if (data.aiEnrichment.integrationSuggestions.length > 0) {
    checkPageBreak(20);
    addSectionTitle("Rekommenderade branschintegrationer");
    for (const sug of data.aiEnrichment.integrationSuggestions) {
      addBulletItem(sug);
    }
  }

  addFooter(doc.getNumberOfPages());

  if (returnBase64) {
    return doc.output("datauristring").split(",")[1];
  }

  doc.save(`kravspecifikation-${data.product}-${data.industry.toLowerCase().replace(/[^a-zåäö0-9]/g, "-")}.pdf`);
};
