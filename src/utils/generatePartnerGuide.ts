import jsPDF from "jspdf";

export const generatePartnerGuide = (): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addTitle = (text: string, size: number = 18) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += size * 0.5 + 5;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 10;
  };

  const addParagraph = (text: string) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 6 + 5;
  };

  const addBullet = (text: string) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const bulletText = `• ${text}`;
    const lines = doc.splitTextToSize(bulletText, contentWidth - 5);
    doc.text(lines, margin + 3, y);
    y += lines.length * 6 + 2;
  };

  const checkNewPage = (neededSpace: number = 40) => {
    if (y > doc.internal.pageSize.getHeight() - neededSpace) {
      doc.addPage();
      y = 20;
    }
  };

  // Title page
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Så väljer du rätt", margin, 50);
  doc.text("Dynamics 365-partner", margin, 65);
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("En praktisk guide för att hitta rätt implementeringspartner", margin, 85);
  doc.text("till ditt Dynamics 365-projekt", margin, 95);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("dynamicfactory.se", margin, 120);
  doc.setTextColor(0);

  // Page 2 - Introduction
  doc.addPage();
  y = 20;
  
  addTitle("Varför partnervalet är avgörande");
  addParagraph("Att implementera Dynamics 365 är en stor investering - både i tid och pengar. Din partner kommer att vara med dig under hela resan, från planering till go-live och långt därefter. Rätt partner kan göra skillnaden mellan ett lyckat projekt och ett som drar ut på tiden, överskrider budgeten eller inte levererar det värde du förväntade dig.");
  
  y += 5;
  addParagraph("Den här guiden hjälper dig att ställa rätt frågor, utvärdera potentiella partners och fatta ett välgrundat beslut.");

  // Section 1
  y += 10;
  addTitle("1. Förstå dina egna behov först", 16);
  addParagraph("Innan du börjar leta efter en partner, se till att du har en tydlig bild av dina behov:");
  addBullet("Vilka affärsprocesser vill du förbättra eller digitalisera?");
  addBullet("Vilka system använder ni idag och vad fungerar/fungerar inte?");
  addBullet("Hur ser er tidplan ut? Finns det externa deadlines?");
  addBullet("Vilken budget har ni avsatt för projektet?");
  addBullet("Vilka interna resurser kan ni avsätta?");

  checkNewPage();
  
  // Section 2
  y += 10;
  addTitle("2. Sök efter branschexpertis", 16);
  addParagraph("En partner som förstår din bransch kan ge enormt mervärde. De känner till vanliga utmaningar, regulatoriska krav och best practices för just din typ av verksamhet.");
  y += 3;
  addSubtitle("Frågor att ställa:");
  addBullet("Har ni genomfört liknande projekt i vår bransch?");
  addBullet("Kan ni visa referenscase från vår bransch?");
  addBullet("Har ni en färdig branschlösning som passar oss?");
  addBullet("Vilka branschspecifika utmaningar har ni löst tidigare?");

  checkNewPage();
  
  // Section 3
  y += 10;
  addTitle("3. Utvärdera teknisk kompetens", 16);
  addParagraph("Dynamics 365 är en kraftfull plattform, men kräver rätt kompetens för att implementeras framgångsrikt.");
  y += 3;
  addSubtitle("Kontrollera:");
  addBullet("Vilka Microsoft-certifieringar har partnern och deras konsulter?");
  addBullet("Hur länge har de arbetat med Dynamics 365/Dynamics NAV/AX?");
  addBullet("Har de erfarenhet av de integrationer ni behöver?");
  addBullet("Hur hanterar de uppdateringar och uppgraderingar?");

  checkNewPage();
  
  // Section 4
  y += 10;
  addTitle("4. Förstå deras projektmetodik", 16);
  addParagraph("En strukturerad metodik minskar risken för överraskningar och förseningar.");
  y += 3;
  addSubtitle("Be om svar på:");
  addBullet("Vilken projektmetodik använder ni?");
  addBullet("Hur ser en typisk projekttidplan ut?");
  addBullet("Hur hanterar ni förändringar under projektets gång?");
  addBullet("Hur involveras vi som kund i projektet?");
  addBullet("Hur ser testprocessen ut innan go-live?");

  checkNewPage();
  
  // Section 5
  y += 10;
  addTitle("5. Klargör support och underhåll", 16);
  addParagraph("Relationen slutar inte vid go-live. Förstå hur partnern stöttar er efter implementeringen.");
  y += 3;
  addSubtitle("Viktiga frågor:");
  addBullet("Hur ser er supportmodell ut efter go-live?");
  addBullet("Vilka SLA-nivåer erbjuder ni?");
  addBullet("Hur hanterar ni vidareutveckling och nya behov?");
  addBullet("Finns det olika supportpaket att välja mellan?");

  checkNewPage();
  
  // Section 6
  y += 10;
  addTitle("6. Utvärdera kulturell matchning", 16);
  addParagraph("En bra partner ska kännas som en förlängning av ert eget team. Kulturell matchning underskattas ofta men är avgörande för ett lyckat samarbete.");
  y += 3;
  addSubtitle("Tänk på:");
  addBullet("Hur kommunicerar de? Är de lyhörda och tillgängliga?");
  addBullet("Förstår de er verksamhet och era utmaningar?");
  addBullet("Känns det som att de lyssnar eller mest pratar om sin lösning?");
  addBullet("Hur är kemin med de personer som faktiskt ska arbeta med er?");

  checkNewPage();
  
  // Section 7
  y += 10;
  addTitle("7. Granska prismodellen noggrant", 16);
  addParagraph("Förstå exakt vad som ingår och vad som kostar extra. Oväntade kostnader är en vanlig orsak till missnöje.");
  y += 3;
  addSubtitle("Klargör:");
  addBullet("Är det fastpris eller löpande räkning?");
  addBullet("Vad ingår i offerten och vad är tillval?");
  addBullet("Hur hanteras förändrade krav?");
  addBullet("Finns det dolda kostnader (t.ex. licenshantering, miljöer)?");
  addBullet("Hur ser betalningsvillkoren ut?");

  checkNewPage();
  
  // Section 8
  y += 10;
  addTitle("8. Kontrollera referenser", 16);
  addParagraph("Prata med befintliga kunder - gärna i er egen bransch. Be partnern om referenskontakter och ställ ärliga frågor.");
  y += 3;
  addSubtitle("Fråga referenserna:");
  addBullet("Hur upplevde ni samarbetet under projektet?");
  addBullet("Höll de tidsplan och budget?");
  addBullet("Hur fungerar supporten efter go-live?");
  addBullet("Skulle ni anlita dem igen?");
  addBullet("Vad kunde ha gjorts bättre?");

  checkNewPage();
  
  // Red flags section
  y += 10;
  addTitle("Varningssignaler att se upp för", 16);
  doc.setTextColor(150, 0, 0);
  addBullet("Orealistiska löften om tid eller pris");
  addBullet("Ovilja att visa referenskunder");
  addBullet("Fokus på teknik snarare än era affärsbehov");
  addBullet("Svårt att få kontakt under säljprocessen");
  addBullet("Vaga svar om projektmetodik och resurser");
  addBullet("Press att skriva på snabbt utan ordentlig analys");
  doc.setTextColor(0);

  checkNewPage();
  
  // Final checklist
  y += 10;
  addTitle("Checklista inför beslutet", 16);
  addBullet("Har partnern bevisad erfarenhet inom vår bransch?");
  addBullet("Har vi pratat med referenskunder?");
  addBullet("Förstår vi prismodellen fullt ut?");
  addBullet("Vet vi vilka personer som kommer arbeta med oss?");
  addBullet("Har vi en tydlig projektplan och tidslinje?");
  addBullet("Förstår vi hur support fungerar efter go-live?");
  addBullet("Känns det rätt i magen?");

  y += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Lycka till med ditt partnersök!", margin, y);
  
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Behöver du hjälp? Besök dynamicfactory.se för att hitta", margin, y);
  doc.text("och jämföra Dynamics 365-partners i Sverige.", margin, y + 5);

  // Save the PDF
  doc.save("valj-ratt-dynamics-365-partner.pdf");
};
