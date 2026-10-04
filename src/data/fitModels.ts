export type FitModelKey = "partner" | "erp" | "crm";
export interface FitDimension { dimension: string; evidence: string; interpretation: string }
export interface FitModel { name: string; method: string; dimensions: FitDimension[] }
const rows = (values: string[][]): FitDimension[] => values.map(([dimension, evidence, interpretation]) => ({ dimension, evidence, interpretation }));
export const fitModels: Record<FitModelKey, FitModel> = {
  partner: {
    name: "D365.SE Partner Fit Model",
    method: "Utgå från ert produktområde och era kritiska processer. Jämför partnerns egna produktvisa beskrivningar av typiska kunder och projekt med strukturerade uppgifter och relevanta kundcase. Tabellen beskriver vad som ska utredas, inte en automatisk poängberäkning. Bransch- och produktpassning väger tyngre i beslutet än leverantörens storlek.",
    dimensions: rows([
      ["Dynamics 365-produkt", "Produktprofil och levererade applikationer", "Kräv erfarenhet av den applikation ni faktiskt ska införa eller förvalta."],
      ["Branscherfarenhet", "Branschprofil, processbeskrivning och relevanta referenser", "Pröva era kritiska branschprocesser, inte bara branschnamnet."],
      ["Företagsstorlek", "Typiska kunder och kundernas storleksintervall", "Jämför kundprofil, inte partnerns antal anställda. Storlek ensam avgör inte."],
      ["Projektets komplexitet", "Typiska projekt, omfattning och ansvar", "Matcha beroenden, anpassningar och förändringsbehov mot dokumenterad leverans."],
      ["Geografi", "Leveransområden och lokal bemanning", "Kontrollera var teamet kan leverera och ge stöd, inte bara var kontor finns."],
      ["Internationell kapacitet", "Rollouter, språk och landsspecifika referenser", "Geografisk täckning bevisar inte kompetens i lokala regelverk."],
      ["Implementation", "Projektbeskrivning, metodik och implementationsreferenser", "Kontrollera ansvar för design, konfiguration, test och införande."],
      ["Migrering", "Källsystem, migreringsprojekt och datakvalitetsarbete", "Kräv en plan för er data och ert befintliga system."],
      ["Support/förvaltning", "Förvaltningsbeskrivning, SLA och releaseansvar", "Säkerställ namngivet ansvar och avtal efter produktionssättning."],
      ["Integration", "Levererade integrationer och arkitektur", "Pröva era systemberoenden och vem som underhåller kopplingarna."],
      ["Power Platform/Azure", "Dokumenterade projekt och kompetensunderlag", "Bedöm stödjande plattformskompetens när projektet kräver den."],
      ["Relevanta kundcase", "Produkt- och branschanknutna case, kontaktbara referenser", "Ett allmänt kundnamn bevisar inte erfarenhet av ert behov."],
      ["Teamets kompetens", "Namngivna roller, erfarenhet och tillgänglighet", "Utvärdera det föreslagna teamet, inte enbart partnerns samlade kapacitet."],
    ]),
  },
  erp: {
    name: "D365.SE ERP Fit Model",
    method: "Kartlägg processerna och skilj absoluta krav från önskemål. Pröva kraven i standardfunktioner, tillägg och integrationer samt jämför kostnad och intern förmåga att genomföra förändringen. Business Central är ofta relevant vid standardiserade behov; Finance & Supply Chain Management (F&O) blir mer relevant vid hög process- och koncernkomplexitet. Modellen kan också visa att ett enklare system eller ett annat ERP bör utredas.",
    dimensions: rows([
      ["Antal bolag", "Juridiska enheter, koncernstruktur och intercompanyflöden", "Fler bolag ökar samordningsbehovet; antal ensamt avgör inte produkt."],
      ["Antal länder", "Verksamhetsländer, språk, valutor och lokaliseringar", "Kontrollera lokala krav och gemensam styrning."],
      ["Omsättning", "Omsättning, transaktionsvolym och tillväxt", "Ekonomisk skala är bakgrund, inte en fristående produktgräns."],
      ["Antal användare", "Roller, samtidiga användare och behörigheter", "Dimensionera licenser och arbetssätt efter faktisk användning."],
      ["Produktion", "Tillverkningssätt, planering, kapacitet och spårbarhet", "Avancerad produktion kräver processprov, inte bara en modulmarkering."],
      ["Lager", "Lagerställen, plock, automation och spårbarhet", "Pröva om standardlager räcker eller avancerat WMS behövs."],
      ["Distribution", "Orderflöden, transport, handel och leveranskrav", "Bedöm sammanhängande flöden från order till leverans."],
      ["Projekt", "Projektstyrning, resursplanering och intäktsredovisning", "Pröva projektets ekonomi och operativa flöde tillsammans."],
      ["Regulatoriska krav", "Revision, branschregler, rapportering och dataskydd", "Obligatoriska krav ska kunna visas och testas innan val."],
      ["Integrationer", "Systemkarta, dataägare och gränssnitt", "Räkna in utveckling, övervakning och löpande underhåll."],
      ["Internationell komplexitet", "Globala flöden, internprissättning och landsskillnader", "Komplexa gemensamma flöden kan motivera F&O, inte bara utlandsnärvaro."],
      ["Rapportering", "Konsolidering, mått och analysbehov", "Kontrollera datakvalitet och vägen från transaktion till beslutsunderlag."],
      ["Intern IT-förmåga", "Processägare, datakompetens och förändringskapacitet", "Välj en lösning och förvaltning som organisationen kan bära."],
    ]),
  },
  crm: {
    name: "D365.SE CRM Fit Model",
    method: "Utgå från hur kunder, försäljning och service faktiskt hanteras. Prioritera användarnas arbetsflöden och datakvalitet före antal funktioner. Pröva relevanta Dynamics 365-applikationer mot ert behov och kontrollera integration, förvaltning och användning i vardagen. Vid enkla kontakt- och säljbehov kan ett enklare CRM vara mer ändamålsenligt.",
    dimensions: rows([
      ["B2B/B2C", "Kundtyper, relationer och köpbeteenden", "Skilj kontobaserad försäljning från volymbaserade konsumentflöden."],
      ["Antal säljare", "Roller, team och arbetssätt", "Antalet påverkar licenser och införande, men avgör inte produkt ensamt."],
      ["Pipelinekomplexitet", "Säljsteg, affärstyper, prognoser och godkännanden", "Pröva verkliga affärer och ansvar i lösningen."],
      ["Marketing automation", "Kundresor, samtycken, segment och kampanjer", "Kontrollera behovet av Customer Insights och tillhörande dataarbete."],
      ["Kundservice", "Ärendevolym, kanaler, SLA och kunskapsstöd", "Bedöm om Customer Service eller Contact Center behövs."],
      ["Field service", "Arbetsorder, schemaläggning, reservdelar och fältpersonal", "Field Service är relevant när operativ service kräver resursstyrning."],
      ["Microsoft 365", "Användning av Outlook, Teams och identitetshantering", "Befintlig Microsoftmiljö är en möjlig fördel, inte skäl nog att välja CRM."],
      ["ERP-integration", "Kund-, order-, pris- och fakturaflöden", "Bestäm dataägarskap och hur flöden hålls aktuella."],
      ["Datamodell", "Kunddefinitioner, relationer, kvalitet och behörighet", "Komplex data kräver tydlig modell och förvaltningsansvar."],
      ["AI/Copilot", "Konkreta användningsfall, data och åtkomstregler", "Pröva nyttan och kontrollera licensvillkor; AI ersätter inte grunddata."],
      ["Rapportering", "Säljprognoser, serviceutfall och gemensamma mått", "Verifiera att uppföljningen speglar verkliga arbetssätt."],
      ["Internationell verksamhet", "Språk, affärsenheter, valutor och dataregler", "Kontrollera global samordning och lokala variationer."],
    ]),
  },
};
