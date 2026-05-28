/**
 * Centraliserad data för YouTube Shorts i Kunskapscenter.
 * Används både av Kunskapscenter (kort + VideoObject JSON-LD) och
 * landningssidan /kunskapscenter/video/:slug (egen sida för indexering).
 *
 * Format för uploadDate: ISO 8601 (YYYY-MM-DD).
 * Format för duration: ISO 8601 (PT#M#S) – krävs av schema.org VideoObject.
 */

export interface KnowledgeVideo {
  /** URL-slug (också används som id i STATIC_TOOLS) */
  slug: string;
  /** YouTube-videons ID (shorts) */
  youtubeId: string;
  title: string;
  /** Kort beskrivning (visas på kort + meta description) */
  description: string;
  /** Längre beskrivning / transkript-sammanfattning för landningssidan */
  longDescription: string;
  /** Vilka produkter videon berör (för filter) */
  products: string[];
  /** ISO 8601 datum, t.ex. "2026-04-26" */
  uploadDate: string;
  /** ISO 8601 duration, t.ex. "PT1M30S" */
  duration: string;
  /** Kort transkribering/sammanfattning som brödtext på landningssidan */
  transcript: string[];
}

export const KNOWLEDGE_VIDEOS: KnowledgeVideo[] = [
  {
    slug: "byta-affarssystem",
    youtubeId: "CjU7ner8888",
    title: "Vad föranleder beslutet att byta affärssystem?",
    description:
      "Kort film där Thomas Laine resonerar kring de vanligaste drivkrafterna bakom ett byte av affärssystem (ERP).",
    longDescription:
      "I den här korta filmen går Thomas Laine igenom de vanligaste signalerna och drivkrafterna bakom att en organisation beslutar sig för att byta affärssystem (ERP). Det handlar ofta om en kombination av att det gamla systemet inte längre stödjer verksamhetens processer, att integrationer blir kostsamma att underhålla, att rapportering och uppföljning är otillräcklig och att molnbaserade lösningar som Microsoft Dynamics 365 Business Central eller Finance & Supply Chain Management öppnar nya möjligheter. Filmen ger en kort introduktion till hur du själv kan börja kartlägga om er nuvarande lösning är mogen att bytas ut.",
    products: ["Business Central", "Finance & SCM"],
    uploadDate: "2026-04-26",
    duration: "PT1M30S",
    transcript: [
      "Det vanligaste skälet till att en organisation börjar utvärdera ett nytt affärssystem är att det befintliga inte längre håller jämna steg med verksamheten. Processer har förändrats, nya bolag har tillkommit, och systemet kräver allt fler manuella arbetssätt vid sidan om.",
      "En annan tydlig drivkraft är kostnaden för integrationer och anpassningar. När varje förändring kräver en utvecklare, och uppgraderingar blir dyra projekt i sig, börjar molnbaserade alternativ som Microsoft Dynamics 365 Business Central eller Finance & Supply Chain Management framstå som mer förutsägbara.",
      "Slutligen handlar det ofta om rapportering och beslutsstöd. När ledningen inte längre litar på siffrorna, eller när controllern lägger halva månaden i Excel, är det ett tecken på att grundplattformen behöver bytas snarare än lappas.",
    ],
  },
  {
    slug: "crm-affarssystem-byte",
    youtubeId: "-MnQUYiIOU0",
    title: "När vet man att CRM och/eller Affärssystemet behöver bytas ut?",
    description:
      "Kort film som hjälper dig identifiera signalerna på att det är dags att byta ut ditt CRM eller affärssystem.",
    longDescription:
      "Hur vet man egentligen att ett CRM eller affärssystem har nått vägs ände? I den här korta filmen går vi igenom de tydligaste signalerna: dubbelarbete mellan system, manuella exporter till Excel, brist på en gemensam kunddatabas, svårigheter att få ut tillförlitlig rapportering samt att säljare och servicemedarbetare väljer egna verktyg vid sidan om. När flera av dessa indikatorer förekommer samtidigt är det ofta dags att utvärdera Microsoft Dynamics 365 Sales, Customer Insights, Business Central eller Finance & Supply Chain Management som ersättning.",
    products: ["Sales", "Customer Insights", "Business Central", "Finance & SCM"],
    uploadDate: "2026-05-03",
    duration: "PT1M45S",
    transcript: [
      "Ett CRM eller affärssystem behöver sällan bytas över en natt – det är oftast en gradvis insikt. Signalerna brukar börja med dubbelarbete: samma kund läggs upp i flera system, och uppgifter måste hållas synkade manuellt.",
      "Nästa varningsklocka är när Excel tar över. Säljteamet bygger sina egna pipelines, ekonomi exporterar rapporter till kalkylblad och servicepersonalen för anteckningar utanför systemet. Då finns ingen gemensam sanning längre.",
      "När ledningen inte kan få fram tillförlitliga nyckeltal i realtid, och när nya medarbetare har svårt att förstå arbetsflödena, är det dags att utvärdera Microsoft Dynamics 365 Sales, Customer Insights, Business Central eller Finance & Supply Chain Management som en samlad plattform.",
    ],
  },
  {
    slug: "inspirerad-personal",
    youtubeId: "bKN7_JXQlJs",
    title: "Håll personalen inspirerad med moderna affärssystem",
    description:
      "Kort film om hur moderna affärssystem kan engagera och inspirera medarbetarna genom bättre verktyg och arbetsflöden.",
    longDescription:
      "Ett modernt affärssystem handlar inte bara om processer och rapporter – det handlar också om hur medarbetarna upplever sin arbetsdag. I den här korta filmen pratar vi om hur lösningar som Microsoft Dynamics 365 Business Central och Finance & SCM tillsammans med Copilot och AI-agenter kan ta bort repetitivt arbete, förenkla informationssökning och ge personalen mer tid till värdeskapande uppgifter. Resultatet blir både högre produktivitet och en mer inspirerad och engagerad organisation.",
    products: ["Business Central", "Finance & SCM", "AI/Copilot/Agents"],
    uploadDate: "2026-05-10",
    duration: "PT1M20S",
    transcript: [
      "Ett affärssystem är inte bara ett verktyg för ledning och ekonomi – det är den miljö där medarbetarna tillbringar en stor del av sin arbetsdag. Om systemet känns långsamt, fragmenterat och svårt att lära sig påverkar det engagemanget direkt.",
      "Moderna lösningar som Microsoft Dynamics 365 Business Central och Finance & SCM, kombinerade med Copilot och AI-agenter, kan ta bort mycket av det repetitiva arbetet. Att slippa leta information i fem system, eller mata in samma data två gånger, frigör tid till mer värdeskapande uppgifter.",
      "När personalen får verktyg som faktiskt hjälper dem stiger både produktiviteten och arbetsglädjen. Det blir lättare att attrahera nya medarbetare, och de som redan finns på plats orkar engagera sig i förbättringar och nya initiativ.",
    ],
  },
  {
    slug: "partners-skillnader",
    youtubeId: "71hzvTRWF_0",
    title: "Alla Dynamics 365-partners är inte likadana och skillnaderna är större än man tror",
    description:
      "Kort film om vikten av att förstå att alla Dynamics 365-partners skiljer sig åt – och varför rätt val av partner är avgörande för projektets framgång.",
    longDescription:
      "Valet av Dynamics 365-partner är ett av de viktigaste strategiska besluten i ett IT-projekt, men många underskattar hur stora skillnaderna faktiskt är mellan olika partners. I den här korta filmen går vi igenom varför partners inte är utbytbara: kompetensdjup, branscherfarenhet, certifieringar, organisationens storlek och vilken plattform de primärt jobbar med. Oavsett om du ska implementera Microsoft Dynamics 365 Business Central, Finance & Supply Chain Management, Sales, Customer Service eller AI/Copilot-lösningar, är det avgörande att välja en partner som matchar er specifika situation.",
    products: ["Business Central", "Finance & SCM", "Sales", "Customer Insights", "Customer Service", "Field Service", "Contact Center", "AI/Copilot/Agents"],
    uploadDate: "2026-05-17",
    duration: "PT1M35S",
    transcript: [
      "Många utgår från att Dynamics 365-partners är ungefär likvärdiga – att det främst handlar om timpris och geografisk närhet. I praktiken är skillnaderna betydligt större och påverkar både projektets risk och slutresultat.",
      "Den viktigaste skillnaden ligger i kompetensdjup och branscherfarenhet. En partner som genomfört tio implementationer i din bransch hittar fallgroparna direkt, medan en generalist behöver lära sig dem på din bekostnad. Certifieringar, referensprojekt och vilken Dynamics 365-applikation de fokuserar på säger mer än storlek.",
      "Även arbetssätt skiljer sig: vissa partners är vassa på Business Central för medelstora bolag, andra på Finance & Supply Chain Management i större koncerner, och en tredje grupp på Sales, Customer Service eller AI och Copilot. Att välja en partner som matchar just er situation är ofta det enskilt viktigaste beslutet i hela projektet.",
    ],
  },
];

export const getVideoBySlug = (slug: string): KnowledgeVideo | undefined =>
  KNOWLEDGE_VIDEOS.find((v) => v.slug === slug);

/**
 * Bygger schema.org VideoObject JSON-LD för en video.
 * embedUrl används av Google för att förstå att videon är inbäddningsbar.
 */
export const buildVideoObjectSchema = (video: KnowledgeVideo) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.title,
  description: video.description,
  thumbnailUrl: [
    `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`,
  ],
  uploadDate: video.uploadDate,
  duration: video.duration,
  contentUrl: `https://youtube.com/shorts/${video.youtubeId}`,
  embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
  publisher: {
    "@type": "Organization",
    name: "d365.se",
    logo: {
      "@type": "ImageObject",
      url: "https://d365.se/d365guide-logo.png",
    },
  },
});
