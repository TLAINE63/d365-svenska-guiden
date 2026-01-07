import jsPDF from "jspdf";
import logoImage from "@/assets/dynamic-factory-logo-new.jpg";

// Convert image to base64
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

export const generatePartnerGuide = async (): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Brand colors
  const primaryColor = { r: 16, g: 185, b: 129 }; // Emerald/teal
  const darkColor = { r: 30, g: 41, b: 59 }; // Slate-800
  const mutedColor = { r: 100, g: 116, b: 139 }; // Slate-500

  // Load logo
  let logoBase64: string | null = null;
  try {
    logoBase64 = await getBase64FromUrl(logoImage);
  } catch (e) {
    console.log("Could not load logo:", e);
  }

  const addHeader = () => {
    // Header line
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.5);
    doc.line(margin, 12, pageWidth - margin, 12);
    
    // Website in header
    doc.setFontSize(8);
    doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
    doc.text("www.d365.se", pageWidth - margin, 10, { align: "right" });
  };

  const addFooter = (pageNum: number) => {
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
    doc.text(`Sida ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text("© Dynamic Factory", margin, pageHeight - 10);
  };

  const addTitle = (text: string, size: number = 18) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    doc.text(text, margin, y);
    y += size * 0.5 + 5;
  };

  const addSectionTitle = (number: string, text: string) => {
    // Number in accent color
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.text(number, margin, y);
    
    // Title text
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    doc.text(text, margin + 8, y);
    y += 10;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    doc.text(text, margin, y);
    y += 8;
  };

  const addParagraph = (text: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  };

  const addBullet = (text: string, isWarning: boolean = false) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    if (isWarning) {
      doc.setTextColor(180, 50, 50);
    } else {
      doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    }
    
    // Bullet point in accent color
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.circle(margin + 2, y - 1.5, 1.2, "F");
    
    const bulletText = text;
    const lines = doc.splitTextToSize(bulletText, contentWidth - 10);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 2;
  };

  const addCheckbox = (text: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
    
    // Checkbox
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.3);
    doc.rect(margin, y - 3.5, 4, 4);
    
    const lines = doc.splitTextToSize(text, contentWidth - 10);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 3;
  };

  const checkNewPage = (neededSpace: number = 45, pageNum: number): number => {
    if (y > pageHeight - neededSpace) {
      addFooter(pageNum);
      doc.addPage();
      addHeader();
      y = 25;
      return pageNum + 1;
    }
    return pageNum;
  };

  let currentPage = 1;

  // ===== TITLE PAGE =====
  // Decorative top bar
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(0, 0, pageWidth, 8, "F");
  
  // Logo
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "JPEG", margin, 25, 50, 20);
    } catch (e) {
      console.log("Could not add logo to PDF:", e);
    }
  }
  
  // Main title
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
  doc.text("Så väljer du rätt", margin, 75);
  doc.text("Dynamics 365-partner", margin, 90);
  
  // Accent line under title
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(2);
  doc.line(margin, 98, margin + 60, 98);
  
  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
  doc.text("En praktisk guide för att hitta rätt", margin, 115);
  doc.text("implementeringspartner till ditt projekt", margin, 125);
  
  // Bottom section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("www.d365.se", margin, pageHeight - 30);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
  doc.setFontSize(9);
  doc.text("Din guide till Microsoft Dynamics 365 i Sverige", margin, pageHeight - 23);

  // ===== PAGE 2 - Introduction =====
  doc.addPage();
  currentPage = 2;
  addHeader();
  y = 30;
  
  addTitle("Varför partnervalet är avgörande", 20);
  y += 5;
  
  addParagraph("Att implementera Dynamics 365 är en stor investering - både i tid och pengar. Din partner kommer att vara med dig under hela resan, från planering till go-live och långt därefter.");
  
  addParagraph("Rätt partner kan göra skillnaden mellan ett lyckat projekt och ett som drar ut på tiden, överskrider budgeten eller inte levererar det värde du förväntade dig.");
  
  y += 5;
  
  // Highlight box
  doc.setFillColor(240, 253, 244); // Light green
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.roundedRect(margin, y, contentWidth, 25, 3, 3, "FD");
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
  const highlightText = doc.splitTextToSize("Den här guiden hjälper dig att ställa rätt frågor, utvärdera potentiella partners och fatta ett välgrundat beslut som passar just din verksamhet.", contentWidth - 10);
  doc.text(highlightText, margin + 5, y + 10);
  y += 35;

  // Section 1
  y += 10;
  addSectionTitle("1.", "Förstå dina egna behov först");
  addParagraph("Innan du börjar leta efter en partner, se till att du har en tydlig bild av dina behov:");
  addBullet("Vilka affärsprocesser vill du förbättra eller digitalisera?");
  addBullet("Vilka system använder ni idag och vad fungerar/fungerar inte?");
  addBullet("Hur ser er tidplan ut? Finns det externa deadlines?");
  addBullet("Vilken budget har ni avsatt för projektet?");
  addBullet("Vilka interna resurser kan ni avsätta?");

  currentPage = checkNewPage(60, currentPage);
  
  // Section 2
  y += 10;
  addSectionTitle("2.", "Sök efter branschexpertis");
  addParagraph("En partner som förstår din bransch kan ge enormt mervärde. De känner till vanliga utmaningar, regulatoriska krav och best practices för just din typ av verksamhet.");
  y += 3;
  addSubtitle("Frågor att ställa:");
  addBullet("Har ni genomfört liknande projekt i vår bransch?");
  addBullet("Kan ni visa referenscase från vår bransch?");
  addBullet("Har ni en färdig branschlösning som passar oss?");
  addBullet("Vilka branschspecifika utmaningar har ni löst tidigare?");

  currentPage = checkNewPage(60, currentPage);
  
  // Section 3
  y += 10;
  addSectionTitle("3.", "Utvärdera teknisk kompetens");
  addParagraph("Dynamics 365 är en kraftfull plattform, men kräver rätt kompetens för att implementeras framgångsrikt.");
  y += 3;
  addSubtitle("Kontrollera:");
  addBullet("Vilka Microsoft-certifieringar har partnern och deras konsulter?");
  addBullet("Hur länge har de arbetat med de Dynamics 365-applikationer som projektet avser?");
  addBullet("Har de erfarenhet av de integrationer ni behöver?");
  addBullet("Hur hanterar de uppdateringar och uppgraderingar?");

  addFooter(currentPage);
  
  // ===== PAGE 3 =====
  doc.addPage();
  currentPage = 3;
  addHeader();
  y = 30;
  
  // Section 4
  addSectionTitle("4.", "Förstå deras projektmetodik");
  addParagraph("En strukturerad metodik minskar risken för överraskningar och förseningar.");
  y += 3;
  addSubtitle("Be om svar på:");
  addBullet("Vilken projektmetodik använder ni?");
  addBullet("Hur ser en typisk projekttidplan ut?");
  addBullet("Hur hanterar ni förändringar under projektets gång?");
  addBullet("Hur involveras vi som kund i projektet?");
  addBullet("Hur ser testprocessen ut innan go-live?");

  currentPage = checkNewPage(60, currentPage);
  
  // Section 5
  y += 10;
  addSectionTitle("5.", "Klargör support och underhåll");
  addParagraph("Relationen slutar inte vid go-live. Förstå hur partnern stöttar er efter implementeringen.");
  y += 3;
  addSubtitle("Viktiga frågor:");
  addBullet("Hur ser er supportmodell ut efter go-live?");
  addBullet("Vilka SLA-nivåer erbjuder ni?");
  addBullet("Hur hanterar ni vidareutveckling och nya behov?");
  addBullet("Finns det olika supportpaket att välja mellan?");

  currentPage = checkNewPage(60, currentPage);
  
  // Section 6
  y += 10;
  addSectionTitle("6.", "Utvärdera kulturell matchning");
  addParagraph("En bra partner ska kännas som en förlängning av ert eget team. Kulturell matchning underskattas ofta men är avgörande för ett lyckat samarbete.");
  y += 3;
  addSubtitle("Tänk på:");
  addBullet("Hur kommunicerar de? Är de lyhörda och tillgängliga?");
  addBullet("Förstår de er verksamhet och era utmaningar?");
  addBullet("Känns det som att de lyssnar eller mest pratar om sin lösning?");
  addBullet("Hur är kemin med de personer som faktiskt ska arbeta med er?");

  addFooter(currentPage);
  
  // ===== PAGE 4 =====
  doc.addPage();
  currentPage = 4;
  addHeader();
  y = 30;
  
  // Section 7
  addSectionTitle("7.", "Granska prismodellen noggrant");
  addParagraph("Förstå exakt vad som ingår och vad som kostar extra. Oväntade kostnader är en vanlig orsak till missnöje.");
  y += 3;
  addSubtitle("Klargör:");
  addBullet("Är det fastpris eller löpande räkning?");
  addBullet("Vad ingår i offerten och vad är tillval?");
  addBullet("Hur hanteras förändrade krav?");
  addBullet("Finns det dolda kostnader (t.ex. licenshantering, miljöer)?");
  addBullet("Hur ser betalningsvillkoren ut?");

  currentPage = checkNewPage(60, currentPage);
  
  // Section 8
  y += 10;
  addSectionTitle("8.", "Kontrollera referenser");
  addParagraph("Prata med befintliga kunder - gärna i er egen bransch. Be partnern om referenskontakter och ställ ärliga frågor.");
  y += 3;
  addSubtitle("Fråga referenserna:");
  addBullet("Hur upplevde ni samarbetet under projektet?");
  addBullet("Höll de tidsplan och budget?");
  addBullet("Hur fungerar supporten efter go-live?");
  addBullet("Skulle ni anlita dem igen?");
  addBullet("Vad kunde ha gjorts bättre?");

  addFooter(currentPage);
  
  // ===== PAGE 5 - Red flags & Checklist =====
  doc.addPage();
  currentPage = 5;
  addHeader();
  y = 30;
  
  // Red flags section with warning styling
  doc.setFillColor(254, 242, 242); // Light red
  doc.setDrawColor(220, 38, 38); // Red
  doc.roundedRect(margin, y - 5, contentWidth, 75, 3, 3, "FD");
  
  y += 5;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 50, 50);
  doc.text("⚠ Varningssignaler att se upp för", margin + 5, y);
  y += 12;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const warnings = [
    "Orealistiska löften om tid eller pris",
    "Ovilja att visa referenskunder",
    "Fokus på teknik snarare än era affärsbehov",
    "Svårt att få kontakt under säljprocessen",
    "Vaga svar om projektmetodik och resurser",
    "Press att skriva på snabbt utan ordentlig analys"
  ];
  warnings.forEach(warning => {
    doc.setTextColor(180, 50, 50);
    doc.text("✗  " + warning, margin + 8, y);
    y += 8;
  });
  
  y += 20;
  
  // Checklist section
  addTitle("Checklista inför beslutet", 16);
  y += 5;
  addCheckbox("Har partnern bevisad erfarenhet inom vår bransch?");
  addCheckbox("Har vi pratat med referenskunder?");
  addCheckbox("Förstår vi prismodellen fullt ut?");
  addCheckbox("Vet vi vilka personer som kommer arbeta med oss?");
  addCheckbox("Har vi en tydlig projektplan och tidslinje?");
  addCheckbox("Förstår vi hur support fungerar efter go-live?");
  addCheckbox("Känns det rätt i magen?");

  y += 15;
  
  // Final call to action box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.roundedRect(margin, y, contentWidth, 35, 3, 3, "FD");
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor.r, darkColor.g, darkColor.b);
  doc.text("Lycka till med ditt partnersök!", margin + 5, y + 12);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Behöver du hjälp att hitta och jämföra Dynamics 365-partners?", margin + 5, y + 22);
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text("Besök www.d365.se", margin + 5, y + 30);

  addFooter(currentPage);

  // Save the PDF
  doc.save("valj-ratt-dynamics-365-partner.pdf");
};
