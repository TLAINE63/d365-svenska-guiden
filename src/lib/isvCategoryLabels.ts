/**
 * Svenska visningsnamn för tekniska ISV-kategorier. Lagrade kategorier ändras aldrig;
 * grupperingen i huvudområden återanvänder köparbehoven i isvBuyerNeeds.ts.
 */
import { ISV_BUYER_NEEDS } from "@/lib/isvBuyerNeeds";

export const ISV_CATEGORY_LABEL_SV: Record<string, string> = {
  "AP automation": "Leverantörsfakturor och OCR",
  "Lokalisering": "Svensk lokalisering",
  "EDI / e-faktura": "EDI och e-faktura (Peppol)",
  "Treasury & bank": "Likviditet och bank",
  "Tax & compliance": "Skatt och regelefterlevnad",
  "Subscription billing": "Abonnemangsfakturering",
  "Banking & payments": "Bank och betalningar",
  "Finance extensions": "Utökad redovisning",
  "Expense management": "Utlägg och resor",
  "Multi-company": "Koncern och flera bolag",
  "WMS": "Lagerstyrning (WMS)",
  "Frakt & TA": "Frakt och transportadministration",
  "Supply chain collaboration": "Samarbete i leverantörskedjan",
  "Inventory planning": "Lager- och inköpsplanering",
  "E-handel": "E-handel",
  "Retail / POS": "Butik och kassa",
  "PIM": "Produktinformation (PIM)",
  "CPQ": "Offert och produktkonfiguration (CPQ)",
  "Projekt": "Projektstyrning",
  "Planering & produktion": "Planering och produktion",
  "PLM / Engineering": "Produktutveckling (PLM)",
  "Asset Management / EAM": "Underhåll och anläggningar (EAM)",
  "Rental / equipment": "Uthyrning och utrustning",
  "MES / Shop floor": "Produktionsuppföljning (MES)",
  "Quality management": "Kvalitetsstyrning",
  "Rapportering / FP&A": "Rapportering, budget och prognos",
  "Sustainability": "Hållbarhetsrapportering",
  "Dokument & output": "Dokumentutskick och utskrift",
  "Dokumentautomation": "Dokumentautomation",
  "E-signatur & avtal": "E-signering och avtal",
  "Dokument & lagring": "Dokumentlagring",
  "Sales engagement": "Säljaktiviteter",
  "Sales enablement": "Säljstöd och säljmaterial",
  "B2B intelligence": "Företagsdata och prospektering",
  "CRM-produktivitet": "Effektivare CRM-arbete",
  "Relationship intelligence": "Relationsinsikter",
  "Marketing automation": "Marknadsautomation",
  "Marketing integration": "Kopplingar till marknadsverktyg",
  "SMS & messaging": "SMS och meddelanden",
  "Digital engagement / chat": "Chatt och digitala kanaler",
  "CX / Voice of Customer": "Kundnöjdhet och enkäter",
  "Contact Center / CCaaS": "Kontaktcenter",
  "Telephony / CTI": "Telefoni och växel",
  "Field Service mobility": "Mobil fältservice",
  "Field Service extensions": "Utökad fältservice",
  "Field service": "Fältservice",
  "Inspections": "Inspektioner och protokoll",
  "Territory & Maps": "Kartor och distrikt",
  "Mobility": "Mobila appar",
  "Branschpaket": "Branschlösning",
  "Integration / iPaaS": "Systemintegration",
  "MDM & datakvalitet": "Masterdata och datakvalitet",
  "CRM datakvalitet": "Datakvalitet i CRM",
  "Backup / restore": "Säkerhetskopiering",
  "Security / GRC": "Säkerhet och behörigheter",
  "AI / automation": "AI och automation",
  "HR": "HR och lön",
  "Digital adoption": "Användarstöd och utbildning",
  "Process & implementation": "Process och implementation",
  "Subscription management": "Licens- och abonnemangshantering",
};

export const categoryLabelSv = (c: string | null | undefined): string => (c ? ISV_CATEGORY_LABEL_SV[c] || c : "");

/** Kategorier grupperade per huvudområde (köparbehov) för val i formulär. Okända hamnar sist. */
export function groupedCategories(categories: readonly string[]): { label: string; categories: string[] }[] {
  const left = new Set(categories);
  const groups = ISV_BUYER_NEEDS.map((n) => {
    const cats = n.categories.filter((c) => left.has(c));
    cats.forEach((c) => left.delete(c));
    return { label: n.label, categories: cats.sort((a, b) => categoryLabelSv(a).localeCompare(categoryLabelSv(b), "sv")) };
  }).filter((g) => g.categories.length);
  if (left.size) groups.push({ label: "Övrigt", categories: [...left] });
  return groups;
}
