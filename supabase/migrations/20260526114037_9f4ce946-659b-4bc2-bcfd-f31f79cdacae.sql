
INSERT INTO public.industry_pages (
  slug, name, meta_title, meta_description, intro,
  processes, challenges, roles, applications, faq,
  related_industries, is_published
) VALUES (
  'mode-sport-textil',
  'Mode, Sport & Textil',
  'Affärssystem för Mode, Sport & Textil: Dynamics 365',
  'En neutral guide till Microsoft Dynamics 365 för svenska företag inom mode, sport och textil. Läs om processer, utmaningar, roller och systemstöd.',
  E'Mode-, sport- och textilbranschen kännetecknas av korta produktcykler, säsongsdriven efterfrågan och stora variantflöden i storlek, färg och modell. Konkurrensen är global, och konsumenterna förväntar sig idag en sömlös upplevelse mellan e-handel, fysisk butik, marketplaces och sociala kanaler. Samtidigt växer kraven på hållbarhet, spårbarhet och transparens i hela värdekedjan – från råvara och produktion till retur och återvinning.\n\nFör många bolag innebär detta att äldre, fristående system inte längre räcker till. Sortimentsplanering, inköp från globala leverantörer, lagerstyrning per storlek/färg, kampanjpriser, lojalitet och returer behöver hänga ihop i ett enhetligt dataflöde. Utan det blir det svårt att fatta snabba beslut om inköp, reor, omfördelningar mellan butiker och kampanjer.\n\nMicrosoft Dynamics 365 ger en samlad plattform där ekonomi, inköp, lager, försäljning, POS, kunddata och marknadsföring kan kopplas ihop. Det skapar förutsättningar för en datadriven verksamhet som klarar både säsongstoppar, snabb modeväxling och nya hållbarhetskrav.',
  '[
    {"title":"Sortiments- och kollektionsplanering","description":"Planering av kollektioner per säsong, varugrupp och kanal med utgångspunkt i historik, trender och marginalmål."},
    {"title":"Style/SKU-hantering (storlek & färg)","description":"Hantering av artiklar i storlek/färg-matriser med varianter, streckkoder och bilder över hela sortimentet."},
    {"title":"Inköp från globala leverantörer","description":"Order, prognoser, ledtider och kvalitetskontroll mot leverantörer i Asien och Europa, ofta med långa ledtider."},
    {"title":"Lager- och butiksallokering","description":"Allokering och omfördelning av varor mellan centrallager, butiker och e-handel utifrån försäljning och säsong."},
    {"title":"POS och omnichannel-försäljning","description":"Försäljning i butik integrerat med e-handel, marketplaces och mobil, med gemensamma priser, kampanjer och lager."},
    {"title":"Kampanjer, reor och prisstrategi","description":"Hantering av ordinariepriser, kampanjer, mellandagsrea och markdowns i flera kanaler och valutor."},
    {"title":"Returer och reklamationer","description":"Effektiva returflöden för e-handel och butik – inklusive bedömning, ompackning och åter till sortiment."},
    {"title":"Hållbarhet och spårbarhet","description":"Dokumentation av material, ursprung och CO2-data per produkt för att möta CSRD och konsumenternas krav."}
  ]'::jsonb,
  '[
    {"title":"Säsongs- och trendcykler","description":"Korta säsonger och snabbt skiftande trender gör prognoser svåra och ökar risken för restlager och nedskrivningar."},
    {"title":"Variantkomplexitet (storlek/färg)","description":"Varje style finns i många varianter, vilket gör lagerstyrning, plock och påfyllnad betydligt mer komplext än i andra branscher."},
    {"title":"Hög returandel i e-handel","description":"Mode har bland de högsta returandelarna inom e-handel, vilket kräver effektiva returflöden och bra produktinformation för att minska returerna."},
    {"title":"Omnichannel utan datasilon","description":"Att ge kunder och personal en gemensam bild av lager, ordrar och kundhistorik över butik, e-handel och marketplaces."},
    {"title":"Marginalpress och valutarisk","description":"Inköp i USD/EUR, försäljning i SEK och stark priskonkurrens kräver god kontroll på kostnad, marginal och valutasäkring."},
    {"title":"Hållbarhetskrav (CSRD, EPR)","description":"Nya EU-krav på rapportering, producentansvar och spårbarhet kräver strukturerad produkt- och leverantörsdata."},
    {"title":"Integration mot e-handel & marketplaces","description":"Att koppla affärssystemet mot Shopify, Centra, Amazon, Zalando m.fl. på ett robust sätt utan dubbelarbete."}
  ]'::jsonb,
  '[
    {"role":"Inköpschef / Buyer","needs":"Behöver beslutsstöd för sortiment, budget per varugrupp, leverantörsuppföljning och prognos per säsong."},
    {"role":"Planner / Allokerare","needs":"Kräver verktyg för att fördela varor mellan kanaler och butiker samt initiera omfördelningar och markdowns i tid."},
    {"role":"E-handelschef","needs":"Behöver realtidsdata på lager, ordrar och konvertering samt smidig integration mot e-handelsplattform och marketplaces."},
    {"role":"Butikschef","needs":"Vill ha ett snabbt POS, mobil kassa, kundklubb och tydlig bild av lager i egen butik och i andra butiker."},
    {"role":"Logistik-/lagerchef","needs":"Söker effektiv plock, pack, retur och påfyllnad samt stöd för olika kanaler (B2C, B2B, butik)."},
    {"role":"Marknads-/CRM-chef","needs":"Vill segmentera kunder, driva lojalitetsprogram och personaliserade kampanjer baserat på köphistorik."},
    {"role":"Hållbarhetsansvarig","needs":"Behöver strukturerad data om material, ursprung och utsläpp för CSRD-rapportering och kundkommunikation."},
    {"role":"CFO","needs":"Kräver kontroll på marginaler per kanal/varugrupp, valutaexponering, lagervärde och nedskrivningsbehov."}
  ]'::jsonb,
  '[
    {"app":"Business Central","relevance":"Passar små och medelstora mode-, sport- och textilbolag som behöver ekonomi, inköp, lager och försäljning i ett system, ofta i kombination med specialiserade tillägg för storlek/färg och POS."},
    {"app":"Finance & Supply Chain","relevance":"Riktar sig till större kedjor och varumärken med komplex global supply chain, flera bolag/länder, avancerad lagerstyrning och behov av detaljerad finansiell uppföljning."},
    {"app":"Commerce","relevance":"Specialiserad lösning för retail och mode med integrerat POS, e-handel, kampanjer, lojalitet och clienteling – byggt för omnichannel."},
    {"app":"Customer Insights","relevance":"Samlar kunddata från e-handel, POS, lojalitet och kampanjer till en enhetlig kundprofil som grund för segmentering och personalisering."},
    {"app":"Sales","relevance":"Stöd för B2B-försäljning mot återförsäljare, agenter och nyckelkunder med offerter, orderhantering och säljpipeline."},
    {"app":"Customer Service","relevance":"Hanterar kundärenden kring ordrar, leveranser, returer och reklamationer från flera kanaler i ett gemensamt gränssnitt."}
  ]'::jsonb,
  '[
    {"q":"Hanterar Dynamics 365 storlek- och färgmatriser för mode och sport?","a":"Ja, både Business Central (ofta via branschtillägg) och Finance & Supply Chain / Commerce stödjer style/SKU-strukturer med varianter i storlek, färg och andra dimensioner, inklusive separata lager, priser och streckkoder per variant."},
    {"q":"Vilken Dynamics 365-applikation passar bäst för ett växande modevarumärke?","a":"Mindre och medelstora varumärken börjar ofta i Business Central kombinerat med ett mode-tillägg och en e-handelsplattform. Större aktörer med butikskedja, flera länder och egen produktion väljer ofta Finance & Supply Chain och/eller Commerce för full omnichannel."},
    {"q":"Hur stöttar Dynamics 365 e-handel och marketplaces?","a":"Det finns standardintegrationer och partnerkopplingar mot t.ex. Shopify, Centra, Magento, Amazon och Zalando. Lager, priser, ordrar och kunder kan synkas så att samma data används i butik, e-handel och back-office."},
    {"q":"Kan vi få stöd för returhantering och cirkulära flöden?","a":"Ja, både e-handelsreturer och butiksreturer kan hanteras i samma system, inklusive bedömning, kreditering, ompackning och åter till sortiment. Det går också att stödja secondhand- eller uthyrningsflöden via anpassningar."},
    {"q":"Hur hanteras kampanjer, reor och markdowns?","a":"Priser, rabatter och kampanjer kan styras centralt per kanal, kundgrupp och period. Det går att jobba med planerade markdowns för att frigöra lager inför nästa säsong och följa upp effekten på marginal."},
    {"q":"Hjälper systemet oss med hållbarhetsrapportering (CSRD)?","a":"Dynamics 365 är ingen ren hållbarhetsplattform, men ger strukturerad data om produkter, leverantörer, transporter och inköp som kan användas som underlag i CSRD-rapportering, ofta i kombination med Microsoft Sustainability Manager eller liknande lösningar."},
    {"q":"Hur lång tid tar ett införande inom mode och retail?","a":"En typisk implementation för ett medelstort modebolag tar 6–12 månader beroende på antal kanaler, butiker och integrationer. Större kedjor med Commerce och flera länder kan ligga på 12–24 månader."}
  ]'::jsonb,
  ARRAY[]::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  intro = EXCLUDED.intro,
  processes = EXCLUDED.processes,
  challenges = EXCLUDED.challenges,
  roles = EXCLUDED.roles,
  applications = EXCLUDED.applications,
  faq = EXCLUDED.faq,
  is_published = true,
  updated_at = now();
