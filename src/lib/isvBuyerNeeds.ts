/**
 * Köparbehov i tilläggskatalogen: redaktionell gruppering av tekniska kategorier
 * till svenska behov. Endast visning/filter, lagrade kategorier ändras aldrig.
 */
export interface IsvBuyerNeed {
  id: string;
  label: string;
  categories: string[];
  /** Sökord som också ska hitta behovets kategorier. */
  synonyms: string[];
}

export const ISV_BUYER_NEEDS: IsvBuyerNeed[] = [
  {
    id: "ekonomi",
    label: "Ekonomi, fakturor och betalningar",
    categories: ["AP automation", "Lokalisering", "EDI / e-faktura", "Treasury & bank", "Tax & compliance", "Subscription billing", "Banking & payments", "Finance extensions", "Expense management", "Multi-company"],
    synonyms: ["faktura", "e-faktura", "peppol", "edi", "betalning", "bank", "moms", "leverantörsreskontra", "lokalisering", "skatt", "utlägg", "koncern", "kvitto"],
  },
  {
    id: "lager",
    label: "Lager och logistik",
    categories: ["WMS", "Frakt & TA", "Supply chain collaboration", "Inventory planning"],
    synonyms: ["wms", "lager", "plock", "frakt", "transport", "tms", "leverans", "shipping", "logistik"],
  },
  {
    id: "handel",
    label: "Handel och e-handel",
    categories: ["E-handel", "Retail / POS", "PIM", "CPQ"],
    synonyms: ["e-handel", "webshop", "kassa", "pos", "butik", "pim", "produktinformation", "offert", "cpq"],
  },
  {
    id: "projekt",
    label: "Projekt, planering och produktion",
    categories: ["Projekt", "Planering & produktion", "PLM / Engineering", "Asset Management / EAM", "Rental / equipment", "MES / Shop floor", "Quality management"],
    synonyms: ["projekt", "planering", "produktion", "mrp", "underhåll", "eam", "uthyrning", "plm", "kalkyl"],
  },
  {
    id: "rapportering",
    label: "Rapportering, budget och prognos",
    categories: ["Rapportering / FP&A", "Sustainability"],
    synonyms: ["rapport", "budget", "prognos", "forecast", "power bi", "fp&a", "scenarier", "bokslut"],
  },
  {
    id: "dokument",
    label: "Dokument, avtal och e-signering",
    categories: ["Dokument & output", "Dokumentautomation", "E-signatur & avtal", "Dokument & lagring"],
    synonyms: ["dokument", "e-signering", "signatur", "avtal", "blankett", "arkiv", "sharepoint", "mall"],
  },
  {
    id: "salj",
    label: "Säljstöd och kundinsikter",
    categories: ["Sales engagement", "Sales enablement", "B2B intelligence", "CRM-produktivitet", "Relationship intelligence"],
    synonyms: ["sälj", "pipeline", "lead", "prospekt", "linkedin", "kunddata", "företagsdata"],
  },
  {
    id: "marknad",
    label: "Marknadsföring och utskick",
    categories: ["Marketing automation", "Marketing integration", "SMS & messaging"],
    synonyms: ["marknad", "nyhetsbrev", "utskick", "sms", "kampanj", "event", "whatsapp"],
  },
  {
    id: "kundservice",
    label: "Kundservice, chatt och telefoni",
    categories: ["Digital engagement / chat", "CX / Voice of Customer", "Contact Center / CCaaS", "Telephony / CTI"],
    synonyms: ["telefoni", "växel", "chatt", "kundnöjdhet", "enkät", "contact center", "kundtjänst", "samtal"],
  },
  {
    id: "falt",
    label: "Fältservice och mobilt arbete",
    categories: ["Field Service mobility", "Field Service extensions", "Inspections", "Territory & Maps", "Mobility", "Field service"],
    synonyms: ["fält", "tekniker", "inspektion", "karta", "mobil", "app", "fjärrsupport", "arbetsorder"],
  },
  {
    id: "bransch",
    label: "Branschpaket",
    categories: ["Branschpaket"],
    synonyms: ["branschlösning", "branschpaket"],
  },
  {
    id: "data",
    label: "Integration, data och säkerhet",
    categories: ["Integration / iPaaS", "MDM & datakvalitet", "CRM datakvalitet", "Backup / restore", "Security / GRC"],
    synonyms: ["integration", "api", "ipaas", "dubbletter", "datakvalitet", "backup", "säkerhet", "behörighet"],
  },
  {
    id: "ovrigt",
    label: "AI, HR och användarstöd",
    categories: ["AI / automation", "HR", "Digital adoption", "Process & implementation", "Subscription management"],
    synonyms: ["ai", "copilot", "automation", "hr", "lön", "utbildning", "onboarding"],
  },
];

const BY_CATEGORY = new Map<string, IsvBuyerNeed>();
for (const n of ISV_BUYER_NEEDS) for (const c of n.categories) BY_CATEGORY.set(c, n);

/** Behov för en kategori; okända kategorier hamnar under sista (övrigt) behovet. */
export const needForCategory = (category: string): IsvBuyerNeed =>
  BY_CATEGORY.get(category) ?? ISV_BUYER_NEEDS[ISV_BUYER_NEEDS.length - 1];

/** Kategorier som ett sökord pekar på via synonymer (minst 2 tecken). */
export function categoriesForQuery(query: string): Set<string> {
  const q = query.trim().toLowerCase();
  const out = new Set<string>();
  if (q.length < 2) return out;
  for (const n of ISV_BUYER_NEEDS) {
    if (n.synonyms.some((s) => s === q || s.startsWith(q) || q.includes(s))) n.categories.forEach((c) => out.add(c));
  }
  return out;
}
