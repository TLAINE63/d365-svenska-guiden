/**
 * Redaktionella affärssystemsavsnitt per bransch (manuellt underhållna, aldrig genererade).
 * Visas på /branscher/:slug/ när sluggen finns här.
 */
/** Fördjupande H2-avsnitt som visas efter huvudavsnittet på branschsidan. */
export interface IndustryErpSubSection {
  id: string;
  h2: string;
  paragraphs: string[];
  links?: { text: string; to: string }[];
}

export interface IndustryErpSection {
  heading: string;
  intro: string;
  points: { title: string; text: string }[];
  packagesNote: string;
  packagesLink: { text: string; to: string };
  /** Extra internlänkar under paketnoten. */
  extraLinks?: { text: string; to: string }[];
  cta: { text: string; to: string };
  /** Redogör för branschens faktiska standardval, visas under ingressen. */
  marketStandard?: string;
  /** Egna H2-avsnitt under huvudavsnittet. */
  subSections?: IndustryErpSubSection[];
}

export const INDUSTRY_ERP_SECTIONS: Record<string, IndustryErpSection> = {
  "bygg-entreprenad": {
    heading: "Affärssystem för byggföretag, entreprenad och anläggning",
    intro:
      "Ett verksamhetssystem för entreprenad behöver samla kalkyl, projekt, inköp, personal och ekonomi. För små och medelstora bygg-, entreprenad- och installationsföretag är Business Central med ett branschpaket ofta det naturliga spåret. Det gäller även system för anläggningsföretag och för serviceföretag inom bygg och installation med serviceavtal och arbetsorder, där projektrapportering för entreprenörer behöver fungera ute på arbetsplatsen. Större entreprenadkoncerner med många bolag jämför även med Finance & Supply Chain Management, ibland tillsammans med Project Operations.",
    marketStandard:
      "För svenska bygg-, entreprenad- och installationsföretag har kombinationen Microsoft Dynamics 365 Business Central och branschpaketet 4PS Construct blivit ett av de mest använda spåren, och beskrivs ofta som standardvalet i branschen. Business Central ger redovisning, lager, ekonomi och projekt, och 4PS Construct lägger på de byggspecifika delarna: kalkyl, mängdberäkning, ÄTA-arbeten, resurs- och maskinplanering, service och KMA. Kombinationen är alltså inte två parallella system utan ett affärssystem med ett branschpaket ovanpå, vilket brukar innebära färre gränssnitt och samma huvudbok för projekt och ekonomi.",
    points: [
      {
        title: "Projektredovisning och successiv vinstavräkning",
        text: "Budget, prognos, kostnader och intäkter samlas per projekt. Successiv vinstavräkning, där resultatet redovisas i takt med färdigställandegraden, hanteras i projektmodulen eller i branschpaketet.",
      },
      {
        title: "Service och underhåll",
        text: "Serviceföretag inom bygg och installation behöver serviceavtal, arbetsorder, felanmälan och mobil rapportering för tekniker, kopplat till samma ekonomi som projekten.",
      },
      {
        title: "ÄTA-arbeten",
        text: "Ändrings- och tilläggsarbeten registreras, prissätts och faktureras mot ursprungsavtalet så att avvikelser syns i projektets resultat.",
      },
      {
        title: "KMA",
        text: "Dokumentation för kvalitet, miljö och arbetsmiljö hanteras oftast i branschpaketet eller i ett kopplat KMA-system, inte i standardversionen av Business Central.",
      },
      {
        title: "Resursplanering",
        text: "Personal, maskiner och underentreprenörer planeras mot projekt och arbetsorder, med tidrapportering som går direkt till projektets kostnader.",
      },
    ],
    packagesNote:
      "Vanliga branschpaket för Business Central är bland annat 4PS Construct, som täcker projekt, service, maskiner, inköp och planering för bygg och installation. Ett branschpaket kortar ofta införandet men styr också en del av lösningens riktning.",
    packagesLink: { text: "Se branschpaket för Business Central", to: "/business-central/tillagg/branschlosningar/" },
    extraLinks: [
      { text: "4PS Construct från 4PS Sweden", to: "/partner/4ps-sweden/" },
      { text: "Projektredovisning och successiv vinstavräkning i Project Operations", to: "/d365projectoperations/" },
    ],
    cta: {
      text: "Jämför partners med specialistkompetens inom bygg och entreprenad",
      to: "/valjdynamics365partner/?industry=bygg-entreprenad#hitta-partners",
    },
    subSections: [
      {
        id: "vinstavrakning",
        h2: "Stöd för successiv vinstavräkning och projektredovisning i byggbranschen",
        paragraphs: [
          "Successiv vinstavräkning innebär att intäkt och resultat redovisas i takt med att projektet blir klart, i stället för först vid slutfakturan. Underlaget är upparbetade kostnader, färdigställandegrad och aktuell prognos per projekt. Kravet brukar komma från att projekt behöver följas löpande och att bokslutet ska visa verklig marginal, inte bara fakturerade belopp.",
          "I Microsoft Dynamics 365 Business Central samlas budget, prognos, kostnader och intäkter per projekt. Branschpaketet ovanpå, till exempel 4PS Construct, lägger till det byggbranschen saknar i standardversionen: arbetsorder, tidrapportering ute från arbetsplatsen, underentreprenörsfakturor, ÄTA-arbeten och avräkning mot ursprungsavtalet. Då blir projektredovisningen en löpande uppföljning i stället för en månadsvis sammanställning i Excel.",
          "Vill ni ha avräkningen i en egen projektplattform finns den beskriven i guiden om Dynamics 365 Project Operations, där work in progress och intäktsavräkning beräknas på nedlagd tid eller upparbetad kostnad. För många byggföretag är dock Business Central med branschpaket det kortaste spåret, eftersom ekonomin och projekten redan finns i samma system.",
        ],
        links: [
          { text: "Läs om 4PS Construct från 4PS Sweden", to: "/partner/4ps-sweden/" },
          { text: "Jämför partners för bygg och entreprenad", to: "/valjdynamics365partner/?industry=bygg-entreprenad#hitta-partners" },
        ],
      },
      {
        id: "kalkyl-och-mangdberakning",
        h2: "Integrerat kalkylprogram och mängdberäkning",
        paragraphs: [
          "Kalkyl och mängdberäkning är ofta den första flaskhalsen i ett byggföretag. Räknas mängderna i ett separat kalkylprogram och förs över till projektet manuellt uppstår fel, dubbelarbete och avvikelser som är svåra att spåra tillbaka. Ett integrerat flöde gör kalkylens poster till grund för projektets budget, så att en ändrad mängd syns i prognosen i stället för i en separat fil.",
          "Kalkyl är en del av 4PS Construct, som bygger priser, artiklar, arbetsmoment och resurser i samma system som projekt och ekonomi. Hur själva mängdberäkningen läggs upp beror på vilka moduler ni väljer och om ni räknar i externt verktyg eller från underlag i BIM och CAD, och det är en fråga att ta med i utvärderingen av partnern.",
          "Punkter som brukar avgöra om lösningen fungerar i praktiken: vilka kalkylprogram ni använder i dag, om mängderna ska kunna hämtas från BIM eller CAD, och hur en ändrad mängd eller ett ÄTA-arbete ska påverka projektets budget, prognos och slutliga fakturering.",
        ],
        links: [
          { text: "4PS Construct från 4PS Sweden", to: "/partner/4ps-sweden/" },
          { text: "Boka 20 minuters rådgivning om kalkyl och mängdberäkning", to: "/valjdynamics365partner/?industry=bygg-entreprenad#hitta-partners" },
        ],
      },
    ],
  },
  "mode-sport-textil": {
    heading: "Affärssystem för mode och modebranschen: säsong, varianter och handel",
    intro:
      "Ett affärssystem för mode behöver hålla samman kollektioner, inköp, lager och försäljning i flera kanaler. För modeföretag i Stockholm och resten av Sverige är säsongsplanering, färg- och storleksmatriser samt integrationer mot B2B-portal, retail och e-handel centrala delar av utvärderingen.",
    points: [
      {
        title: "Säsongsplanering och kollektioner",
        text: "Planera inköp, leveranser och sortiment per säsong och kollektion. Följ sedan försäljning och lagervärde så att nästa inköpsbeslut bygger på aktuella utfall.",
      },
      {
        title: "Färg- och storleksmatriser",
        text: "Hantera varianter av modell, färg och storlek utan att tappa kontrollen över artiklar, priser, lagersaldo och inköpsbehov.",
      },
      {
        title: "B2B, retail och e-handel",
        text: "Koppla B2B-portal, butiker och e-handel till samma order- och lagerflöde. Prislistor, kundorder och returer behöver följas konsekvent i alla kanaler.",
      },
    ],
    packagesNote:
      "Business Central kan passa mindre och medelstora modebolag, medan Finance & Supply Chain Management och Commerce blir aktuella vid större variantflöden, flera lager eller mer omfattande omnikanalhandel.",
    packagesLink: { text: "Läs om Dynamics 365 Commerce", to: "/d365commerce/" },
    cta: {
      text: "Jämför partners med erfarenhet av mode och textil",
      to: "/valjdynamics365partner/?industry=mode-sport-textil#hitta-partners",
    },
  },
  "grossist-distribution": {
    heading: "Affärssystem för grossister och distributionsbolag",
    intro:
      "När ni jämför affärssystem för grossister är prissättning, lageromsättning och leveranssäkerhet lika viktiga som ekonomin. Systemet behöver hantera pris- och rabattmatriser, EDI-ordrar och inköpsprognoser utan att informationen fastnar i separata kalkyler.",
    points: [
      {
        title: "Pris- och rabattmatriser",
        text: "Styr kundpriser, avtalspriser, volymrabatter och kampanjer med tydliga regler. Följ marginalen per kund, artikel och order.",
      },
      {
        title: "Lageromsättning och inköpsprognoser",
        text: "Använd efterfrågan, säsong och leveranstider som underlag för inköp. Målet är tillgängliga varor utan onödigt bundet kapital.",
      },
      {
        title: "EDI-ordrar och distributionsflöden",
        text: "Ta emot order elektroniskt och koppla bekräftelse, plock, leverans och faktura till samma flöde. Integrationsbehoven skiljer sig mellan kunder och handelsplattformar.",
      },
    ],
    packagesNote:
      "Business Central med handels- och integrationstillägg är vanligt för mindre och medelstora grossister. Finance & Supply Chain Management passar bättre vid avancerad lagerstyrning, stora transaktionsvolymer eller flera distributionscentraler.",
    packagesLink: { text: "Läs om Business Central för handel och lager", to: "/businesscentral/" },
    cta: {
      text: "Jämför partners för grossist och distribution",
      to: "/valjdynamics365partner/?industry=grossist-distribution#hitta-partners",
    },
  },
  "retail-ehandel": {
    heading: "Affärssystem för detaljhandel, retail och e-handel",
    intro:
      "Ett affärssystem för detaljhandel ska ge samma bild av kundorder, lager och ekonomi oavsett försäljningskanal. I en retail-lösning behöver omnikanal, integration mot kassasystem (POS) och realtidssynkronisering av lagersaldon samspela med det e-handelssystem ni använder.",
    points: [
      {
        title: "Omnikanal och enhetliga orderflöden",
        text: "Samla order, reservation, leverans, retur och byte över butik och e-handel. Kunden ska inte behöva påverkas av vilken kanal som hanterar steget.",
      },
      {
        title: "Kassasystem och POS-integration",
        text: "Integrationen mot kassasystemet behöver hantera försäljning, betalning, retur och prisändringar på ett kontrollerbart sätt.",
      },
      {
        title: "Lagersaldo i realtid",
        text: "Synkronisera tillgänglighet mellan lager, butiker och e-handel så att produkter inte lovas flera gånger eller blir osynliga i en kanal.",
      },
    ],
    packagesNote:
      "Commerce är relevant för större omnikanalflöden, medan Business Central kan vara ekonomi- och ordernavet för mindre handelsbolag. Rätt kombination beror på befintliga kassor, e-handel och lager.",
    packagesLink: { text: "Utforska Dynamics 365 Commerce", to: "/d365commerce/" },
    cta: {
      text: "Jämför partners för retail och e-handel",
      to: "/valjdynamics365partner/?industry=retail-ehandel#hitta-partners",
    },
  },
  "livsmedel-processindustri": {
    heading: "Affärssystem för livsmedel och processindustri",
    intro:
      "Ett affärssystem för livsmedel behöver stödja spårbarhet och kvalitet genom hela flödet från råvara till kund. Batch- och lotspårbarhet, bäst-före-datum, recepturhantering och relevanta livsmedelsstandarder bör därför prövas i konkreta processer, inte bara i en funktionslista.",
    points: [
      {
        title: "Batch, lot och bäst-före-datum",
        text: "Följ partier genom mottagning, produktion, lager och leverans. Datumstyrning och spårbarhet behöver fungera även vid ompackning och återkallelse.",
      },
      {
        title: "Receptur och produktion",
        text: "Hantera recept, ingredienser, avfall och kvalitetskontroller i produktionen. Utfallet ska kunna följas per batch och produktionsorder.",
      },
      {
        title: "Livsmedelsstandarder och dokumentation",
        text: "Kartlägg vilka kontroller och dokument era kunder, certifieringar och myndighetskrav kräver. Systemstödet ska ge spårbara underlag för verksamhetens rutiner.",
      },
    ],
    packagesNote:
      "Finance & Supply Chain Management har funktioner för processtillverkning. För mindre producenter kan Business Central med ett livsmedelsanpassat tillägg vara tillräckligt, beroende på kraven på recept, kvalitet och spårning.",
    packagesLink: { text: "Läs om Finance & Supply Chain Management", to: "/finance-supply-chain/" },
    cta: {
      text: "Jämför partners för livsmedel och processindustri",
      to: "/valjdynamics365partner/?industry=livsmedel-processindustri#hitta-partners",
    },
  },
  "life-science-medtech": {
    heading: "Affärssystem för läkemedel och life science",
    intro:
      "För läkemedels- och life science-företag behöver affärssystemet stödja kontrollerade processer och spårbar dokumentation. GMP, datoriserad systemvalidering, FDA 21 CFR Part 11 och serialisering ska bedömas utifrån er verksamhet och ert kvalitetssystem, inte antas följa med automatiskt.",
    points: [
      {
        title: "GMP och kvalitetsprocesser",
        text: "Kartlägg hur avvikelser, ändringar, godkännanden och dokumentation ska styras. Roller, arbetsflöden och spårbarhet behöver motsvara era kvalitetsrutiner.",
      },
      {
        title: "Validering och elektroniska signaturer",
        text: "Planera valideringen av den datoriserade lösningen och pröva krav från FDA 21 CFR Part 11 där de är tillämpliga, inklusive signaturer och revisionsspår.",
      },
      {
        title: "Serialisering och spårbarhet",
        text: "Följ serienummer, batcher och distribution där regelverket kräver det. Integrationer med produktion och externa spårbarhetstjänster behöver ingå i utvärderingen.",
      },
    ],
    packagesNote:
      "Valet mellan Business Central och Finance & Supply Chain Management beror på produktion, volymer och processkomplexitet. Validering och regelefterlevnad kräver alltid ett egenansvar och ett dokumenterat införande.",
    packagesLink: { text: "Läs om Finance & Supply Chain Management", to: "/finance-supply-chain/" },
    cta: {
      text: "Jämför partners för life science och medtech",
      to: "/valjdynamics365partner/?industry=life-science-medtech#hitta-partners",
    },
  },
  "fastighet-forvaltning": {
    heading: "Affärssystem för fastighet och fastighetsbolag",
    intro:
      "Ett affärssystem för fastighetsbolag behöver koppla avtal och ekonomi till den tekniska förvaltningen. Hyresavisering, kontraktsregister och fastighetsekonomi bör därför bedömas tillsammans med integrationen till drift- och felanmälningssystem.",
    points: [
      {
        title: "Hyresavisering och avtal",
        text: "Hantera hyresperioder, indexering, tillägg och fakturaunderlag från aktuella avtal. Ändringar ska vara spårbara och ge rätt underlag vid nästa avisering.",
      },
      {
        title: "Kontraktsregister och fastighetsekonomi",
        text: "Samla villkor, kostnader och intäkter per fastighet, objekt eller kontrakt. Uppföljningen behöver anpassas till ägare, förvaltning och redovisning.",
      },
      {
        title: "Drift och felanmälan",
        text: "Integrera felanmälan, arbetsorder och underhåll så att tekniska åtgärder kan följas ekonomiskt utan dubbelregistrering.",
      },
    ],
    packagesNote:
      "Business Central eller Finance kan utgöra ekonomikärnan, medan fastighetsspecifika avtal och teknisk förvaltning ofta kräver branschtillägg eller integrationer. Be partnern visa hela flödet från avtal till faktura och arbetsorder.",
    packagesLink: { text: "Läs om Business Central", to: "/businesscentral/" },
    cta: {
      text: "Jämför partners för fastighet och förvaltning",
      to: "/valjdynamics365partner/?industry=fastighet-forvaltning#hitta-partners",
    },
  },
  "energi-utilities": {
    heading: "Affärssystem för energibolag och utilities",
    intro:
      "Ett affärssystem för energibolag behöver förena ekonomi, investeringar, tekniska tillgångar och kundprocesser. Projektredovisning för nätinvesteringar, anläggningsregister och kundfakturering är därför viktiga delar av både systemvalet och integrationsarkitekturen.",
    points: [
      {
        title: "Projektredovisning för nätinvesteringar",
        text: "Följ budget, kostnader och färdigställande för investeringsprojekt. Koppla material, entreprenader och nedlagd tid till rätt projekt och anläggning.",
      },
      {
        title: "Anläggningsregister och underhåll",
        text: "Skapa en sammanhållen bild av tillgångar, service och underhåll. Klargör vad som ska ligga i affärssystemet och vad som hanteras i tekniska system.",
      },
      {
        title: "Kundfakturering och integrationer",
        text: "Kartlägg hur avtal, mätvärden och kundärenden ska möta faktureringen. Branschspecifika kund- och mätvärdessystem kräver ofta väldefinierade integrationer.",
      },
    ],
    packagesNote:
      "Finance & Supply Chain Management och Field Service kan täcka ekonomi, projekt och underhåll i större energibolag. Fakturering och mätvärdeshantering behöver utvärderas mot de branschsystem som redan används.",
    packagesLink: { text: "Läs om Finance & Supply Chain Management", to: "/finance-supply-chain/" },
    cta: {
      text: "Jämför partners för energi och utilities",
      to: "/valjdynamics365partner/?industry=energi-utilities#hitta-partners",
    },
  },
  "offentlig-sektor": {
    heading: "Affärssystem för offentlig sektor: LOU, e-faktura och säkerhet",
    intro:
      "Ett affärssystem för offentlig sektor behöver stödja både ekonomistyrning och rättssäkra processer. LOU-krav, e-fakturering med Peppol, budgetuppföljning och informationssäkerhet ska beskrivas konkret i upphandlingen och prövas med leverantören.",
    points: [
      {
        title: "LOU och spårbar upphandling",
        text: "Definiera krav, utvärderingsgrunder och dokumentation så att systemvalet kan följas upp. Be leverantören svara på funktion, införande och ansvar.",
      },
      {
        title: "E-fakturering med Peppol",
        text: "Pröva inkommande och utgående elektroniska fakturor, attest och koppling till ekonomin. Kontrollera format, accesspunkt och befintliga integrationsflöden.",
      },
      {
        title: "Budget och informationssäkerhet",
        text: "Följ budget och utfall på rätt nivå samtidigt som behörigheter, loggning, dataskydd och åtkomst hanteras enligt organisationens krav.",
      },
    ],
    packagesNote:
      "Business Central, Finance och applikationer för kundservice kan kombineras utifrån verksamheten. Juridiska och säkerhetsmässiga krav behöver utvärderas för varje organisation och implementation.",
    packagesLink: { text: "Läs guiden om affärssystem och upphandling", to: "/affarssystem/" },
    cta: {
      text: "Jämför partners med erfarenhet av offentlig sektor",
      to: "/valjdynamics365partner/?industry=offentlig-sektor#hitta-partners",
    },
  },
  tillverkning: {
    heading: "Affärssystem för verkstad och markentreprenad",
    intro:
      "Ett affärssystem för verkstad behöver stödja både produktion och eftermarknad, medan markentreprenad ställer större vikt vid projekt, maskiner och arbete på plats. Gemensamt är behovet av ekonomisk uppföljning, men serviceverkstad och projektredovisning för anläggning och entreprenad kräver olika arbetsflöden.",
    points: [
      {
        title: "Eftermarknad och serviceverkstad",
        text: "Hantera serviceavtal, arbetsorder, reservdelar och tid per maskin eller kundobjekt. Verkstadens arbete ska kunna faktureras och följas tillsammans med ekonomin.",
      },
      {
        title: "Projektredovisning för anläggning",
        text: "Följ budget, prognos, material, maskiner och arbete per projekt. Projektresultatet behöver spegla både pågående arbete och slutfakturering.",
      },
      {
        title: "Rätt arbetssätt för varje verksamhet",
        text: "Tillverkning, service och entreprenad kan finnas i samma bolag men ska inte tvingas in i samma process. Be partnern demonstrera varje flöde med era egna exempel.",
      },
    ],
    packagesNote:
      "Business Central med tillägg kan passa mindre verkstäder och entreprenader. Finance & Supply Chain Management, Project Operations och Field Service blir relevanta vid mer komplex produktion, projektstyrning eller fältservice.",
    packagesLink: { text: "Jämför affärssystem för bygg och entreprenad", to: "/branscher/bygg-entreprenad/" },
    cta: {
      text: "Jämför partners för tillverkning och verkstad",
      to: "/valjdynamics365partner/?industry=tillverkning#hitta-partners",
    },
  },
  uthyrning: {
    heading: "Viktiga funktioner i ett modernt uthyrningssystem",
    intro:
      "Affärssystem för uthyrning och maskinuthyrning behöver visa vad som är tillgängligt, var varje maskinindivid befinner sig och hur hyran ska faktureras. Pröva hela flödet från bokning och utlämning till retur, skadehantering och service.",
    points: [
      {
        title: "Grafisk depå- och bokningsöversikt",
        text: "Planera uthyrning per depå, period och objekt. Översikten ska visa ledig kapacitet, reservationer och kommande returer utan manuella sammanställningar.",
      },
      {
        title: "Serienummer och maskinindivider",
        text: "Följ varje maskin eller utrustning individuellt med historik för uthyrning, placering, service och underhåll.",
      },
      {
        title: "Transport, utlämning och returkontroll",
        text: "Koppla leverans och hämtning till hyresordern. Vid retur behöver kontroll, avvikelser och åtgärder dokumenteras innan objektet blir tillgängligt igen.",
      },
      {
        title: "Flexibel hyrestaxa och periodisering",
        text: "Hantera priser per dygn, vecka och månad samt avtalade kundpriser. Hyresintäkten ska periodiseras och faktureras enligt avtalets villkor.",
      },
      {
        title: "Skadehantering",
        text: "Registrera skador, ansvar och kostnader vid retur. Koppla debitering och reparation till rätt kund, hyresavtal och maskinindivid.",
      },
    ],
    packagesNote:
      "Standardfunktioner för ekonomi och lager behöver kompletteras med rental-logik för bokning, maskinindivider och hyresfakturering. Be leverantören visa vilka delar som ingår i tillägget och vilka som kräver anpassning.",
    packagesLink: { text: "Läs om Business Central", to: "/businesscentral/" },
    extraLinks: [
      { text: "Så väljer ni Dynamics 365-partner", to: "/valjdynamics365partner/" },
    ],
    cta: {
      text: "Jämför partners för uthyrning och rental",
      to: "/valjdynamics365partner/?industry=uthyrning#hitta-partners",
    },
    subSections: [
      {
        id: "dynamics-365-uthyrning",
        h2: "Microsoft Dynamics 365 för uthyrningsbranschen",
        paragraphs: [
          "Microsoft Dynamics 365 kan utgöra plattformen för ekonomi, lager, kundrelationer och service, medan dedikerade rental-tillägg hanterar den uthyrningsspecifika logiken. För mindre och medelstora företag är Business Central med branschlösning ett vanligt spår. Större eller mer komplexa verksamheter kan även behöva Finance & Supply Chain Management.",
          "När certifierade rental-tillägg integreras direkt med ekonomi och lager kan hyresorder, avtal och fakturering använda samma affärsunderlag. Field Service eller verkstadsfunktioner kan koppla serviceavtal, arbetsorder och reservdelar till maskinindividen. Låt leverantören visa integrationen och ansvarsfördelningen mellan standardprodukt, tillägg och eventuella externa system.",
        ],
        links: [
          { text: "Utforska Business Central", to: "/businesscentral/" },
          { text: "Läs guiden om att välja Dynamics 365-partner", to: "/valjdynamics365partner/" },
        ],
      },
      {
        id: "valja-partner-uthyrning",
        h2: "Hur väljer man rätt partner för uthyrning?",
        paragraphs: [
          "Välj en partner som kan visa dokumenterad erfarenhet av maskinparker, periodisk fakturering och serviceavtal. Be om en genomgång av er egen process från bokning till retur och kontrollera att konsulterna förstår både rental-flödet och ekonomin bakom det.",
          "Be även om referenser från liknande uthyrningsverksamheter och tydliggör vem som ansvarar för rental-tillägget, integrationerna och den löpande förvaltningen. Det gör det lättare att jämföra både genomförande och långsiktig leverans.",
        ],
        links: [
          { text: "Jämför partners och dokumenterad branscherfarenhet", to: "/valjdynamics365partner/?industry=uthyrning#hitta-partners" },
        ],
      },
    ],
  },
};
