import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";

import SEOHead from "@/components/SEOHead";
import { FAQSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { resolvePriceTokens } from "@/lib/productPriceFormat";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useEffect, useState } from "react";

const QA = () => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      setOpenItem(hash);
      // Wait for accordion to expand before scrolling
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const faqs = [
    {
      id: "nar-starkt-val",
      question: "När passar Dynamics 365?",
      answer: "Dynamics 365 brukar passa bäst när några av följande stämmer:\n\n**Microsoft-stacken är redan etablerad**\n\nNi använder Microsoft 365, Teams, Azure eller Power BI. Då blir integration, identitet och rapportering enklare och billigare än med en separat stack.\n\n**Behov av både CRM och ERP på samma datamodell**\n\nSales, Customer Service, Field Service, Business Central och Finance & Supply Chain delar Dataverse. Det förenklar kund-till-faktura-flöden och rapportering över processgränser.\n\n**Regulatoriska krav på datalagring i EU**\n\nMicrosoft Cloud med EU-datacenter, GDPR-stöd och ISO 27001 gör plattformen lämplig för finans, vård, offentlig sektor och andra reglerade branscher.\n\n**Plan att använda Copilot och agenter aktivt**\n\nDelar av Copilot ingår i flera Enterprise-licenser, och Copilot Studio gör det möjligt att bygga egna agenter. Värdet är störst om du planerar förändringsledning och inte bara \"slår på\" AI.\n\n**Långsiktig roadmap snarare än snabb punktlösning**\n\nPlattformen är bred och utvecklas kontinuerligt. Det passar dig som vill bygga vidare över flera år, inte dig som söker en smal nischlösning för ett enskilt team.",
    },
    {
      id: "nar-inte-ratt",
      question: "När passar Dynamics 365 inte?",
      answer: "Det finns scenarier där en mer nischad eller enklare lösning ofta passar bättre:\n\n**Mycket små team med enkla behov**\n\nÄr du 1–10 användare med en standardiserad säljprocess kan HubSpot, Pipedrive eller liknande vara snabbare och billigare att komma igång med.\n\n**Renodlat behov av en specifik funktion**\n\nOm du bara behöver ett dedikerat supportverktyg, en e-handelsplattform eller ett marknadsföringsverktyg kan en specialiserad SaaS (t.ex. Zendesk, Shopify, Klaviyo) ge bättre djup på just det området.\n\n**Begränsad förändringskapacitet**\n\nDynamics 365 kräver tydligt ägarskap, processarbete och utbildning för att ge värde. Saknas tid eller mandat för det blir införandet ofta dyrt utan att förflytta verksamheten.\n\n**Du vill undvika Microsoft-ekosystemet strategiskt**\n\nFinns ett medvetet val att inte använda Microsoft 365/Azure faller en stor del av plattformens fördelar bort.\n\n**Förväntan om \"lågt pris och snabb leverans utan anpassning\"**\n\nDynamics 365 är konfigurerbar men sällan billigast i licens och implementation. Är priset det enda kriteriet finns enklare alternativ.",
    },
    {
      id: "kostnadsdrivare",
      question: "Vad driver kostnaden i ett Dynamics 365-projekt?",
      answer: "Licenspriset är ofta den minsta delen av totalkostnaden. Det här är de poster som brukar avgöra slutnotan:\n\n**Scope och antal applikationer**\n\nJu fler moduler (BC, F&SC, Sales, Customer Service, Field Service, Marketing) desto fler processer ska designas, testas och förvaltas. Smalt scope i fas 1 sänker kostnaden mest.\n\n**Anpassningar utöver standard**\n\nKonfiguration är billigt, kodade anpassningar och egna entiteter i Dataverse är dyrare – och fördyrar varje framtida release.\n\n**Integrationer**\n\nKopplingar mot ekonomi, lager, e-handel, lön, EDI och branschsystem kan lätt kosta lika mycket som själva D365-implementationen. Inventera tidigt.\n\n**Datamigrering och datakvalitet**\n\nGamla CRM-/ERP-data är ofta dubbletter och inaktuella. Tvätt, mappning och validering tar nästan alltid mer tid än planerat.\n\n**Copilot, agenter och Power Platform**\n\nGrund-Copilot ingår i vissa licenser, men avancerade funktioner, Copilot Studio-agenter, premiumkonnektorer och Power Apps per app-licenser prissätts separat.\n\n**Förändringsledning och utbildning**\n\nUtan utbildning, support och uppföljning faller användarna tillbaka till Excel. Räkna med 10–20 % av projektbudgeten för detta.\n\n**Förvaltning efter go-live**\n\nSLA, support, releaseplanering och vidareutveckling är en löpande kostnad – be alltid om en TCO-bild över 3 år, inte bara år 1.",
    },
    {
      id: "risker",
      question: "Vad brukar gå fel i Dynamics 365-projekt?",
      answer: "Några vanliga risker att hantera aktivt i ett Dynamics 365-projekt:\n\n**Underskattat scope**\n\nProjekt växer ofta under utredningen. Sätt tydliga must/should/could-prioriteringar och var beredd att skjuta \"nice to have\" till en fas 2.\n\n**Otydlig licensbild**\n\nGrund-Copilot ingår i vissa licenser, men avancerade funktioner, Copilot Studio-agenter, Power Platform-tillägg och premiumkonnektorer prissätts separat. Be om en komplett licensspec innan avtal.\n\n**Datakvalitet och migrering**\n\nGamla CRM-/ERP-data är ofta dubbletter, inaktuella eller dåligt strukturerade. Avsätt tid och budget för datatvätt – annars sjunker användarnas förtroende direkt vid go-live.\n\n**Integrationer**\n\nKopplingar mot ekonomi, e-handel, lager, lön och branschspecifika system kan kosta mer än själva D365-implementationen. Inventera tidigt.\n\n**Beroende av en enskild person eller partner**\n\nFå \"hjältekonsulter\" är en risk. Säkerställ dokumentation, kunskapsöverföring och att flera personer kan systemet.\n\n**Förändringsledning**\n\nDe flesta misslyckade D365-projekt misslyckas inte tekniskt utan organisatoriskt: användare faller tillbaka till Excel. Planera utbildning, support och uppföljning från dag ett.",
    },
    {
      id: "kontrollera-partner",
      question: "Vilka frågor bör du ställa partnern innan avtal?",
      answer: "Innan du skriver under, gå igenom åtminstone följande punkter med partnern:\n\n**Branscherfarenhet**\n\nBe om 2–3 referenskunder i din bransch och i din storleksklass – inte bara partnerns största logotyper. Fråga vad som gick bra och vad som gick mindre bra.\n\n**Konkret team, inte bara säljteam**\n\nVilka konsulter kommer faktiskt att arbeta i ditt projekt? Vilken erfarenhet har lösningsarkitekten, projektledaren och utvecklarna?\n\n**Metodik och leveransmodell**\n\nFast pris, löpande räkning eller hybrid? Hur hanteras ändringar (change requests)? Vilket ramverk används (Sure Step, agilt, eget)?\n\n**Licens- och totalkostnad**\n\nBegär en TCO-bild över 3 år: licenser, implementation, integrationer, förvaltning, Copilot-tillägg och Power Platform. Inte bara första årets pris.\n\n**Förvaltning efter go-live**\n\nVilket SLA gäller? Hur ser support, releaseplanering och vidareutveckling ut? Vad ingår och vad är tilläggsbeställning?\n\n**Avtalsvillkor och inlåsning**\n\nGranska uppsägningstider, ägarskap av kod och konfiguration, samt hur ett eventuellt partnerbyte hanteras. En bra partner gör det enkelt att byta – inte svårt.\n\n**Köparsidig second opinion**\n\nÖverväg att låta någon utan egen vinning i affären granska offerten, scope och avtalet innan du skriver under.",
    },
    {
      id: "nasta-steg",
      question: "Nästa steg: behovsanalys eller partnerfilter?",
      answer: "Två naturliga vägar vidare beroende på var du står:\n\n**Du är tidigt i processen – börja med behovsanalysen**\n\nOm du ännu inte vet vilken D365-applikation som passar, eller vill ha ett underlag att diskutera internt och med partners, börja här:\n\n• [ERP Behovsanalys](/ERPbehovsanalys) – Business Central vs Finance & Supply Chain\n• [CRM Behovsanalys](/CRMbehovsanalys) – Sales, Marketing och Service\n• [Beslutsmognadsindex](/beslutsmognad) – 8–10 min diagnostik som ger mognadsprofil och rekommendationer\n\n**Du vet ungefär vad du vill ha – filtrera partners**\n\nAnvänd partnerväljaren för att ta fram en kort lista att kontakta:\n\n• [Hitta D365-partner](/valjdynamics365partner) – filtrera på applikation, bransch, geografi och storlek\n• [Kravspecifikation](/kravspecifikation) – generera ett underlag att skicka till 2–4 partners\n\nRätt partner handlar om mer än ett filter – applikation, bransch, metodik, team, kemi och ansvar efter go-live väger minst lika tungt.",
    },
    {
      id: "fordelar",
      question: "Var ger Dynamics 365 mest värde i praktiken?",
      answer: "Plattformen är bred, men värdet är inte jämnt fördelat. Här är de områden där köpare oftast ser tydlig nytta – och vad du bör verifiera själva:\n\n**Gemensam datamodell mellan CRM och ERP**\n\nSales, Service, Business Central och Finance & Supply Chain delar Dataverse. Det förenklar kund-till-faktura-flöden och rapportering över processgränser – förutsatt att du faktiskt använder flera moduler.\n\n**Integration med Microsoft 365**\n\nOutlook, Teams, Excel och SharePoint kopplas in utan extra integrationsprojekt. Värdet är störst om verksamheten redan lever i Microsoft-stacken.\n\n**Copilot och agenter**\n\nDelar av Copilot ingår i flera Enterprise-licenser. Det ger tidsbesparing på mötessammanfattningar, e-postutkast och datasökning – men kräver förändringsledning och datakvalitet för att ge verkligt värde.\n\n**Skalbarhet och roadmap**\n\nSamma plattform växer från 10 till 10 000 användare och utvecklas kontinuerligt via Release Waves. Bra om du vill bygga vidare över flera år.\n\n**Säkerhet och regelefterlevnad**\n\nMicrosoft Cloud med EU-datacenter, ISO 27001 och GDPR-stöd passar reglerade branscher – men ska bedömas mot dina specifika krav, inte tas för given.\n\n**Vad du bör verifiera själva**\n\nLicens-TCO över 3 år, vilka Copilot-funktioner som ingår i just din licens, integrationskostnader mot dina befintliga system, samt om din förändringskapacitet räcker. Plattformens potential blir inte automatiskt din nytta.",
    },
    {
      id: "implementering",
      question: "Hur lång tid tar en implementering?",
      answer: "Hur lång tid en implementation av Microsoft Dynamics 365 tar beror i väldigt hög grad på omfattningen, företagets storlek, hur mycket anpassning och integration som krävs – men här kommer en ungefärlig översikt och vad du bör räkna med.\n\n⏳ **Tidsramar**\n\nFör ett relativt enkelt upplägg i ett mindre företag: ca 3-6 månader.\n\nFör medelstor organisation med måttlig komplexitet: ofta 6-12 månader.\n\nFör stora företag med många länder, många system att integrera och hög grad av anpassning: 9-24 månader eller mer.\n\nI vissa fall där krav är mycket begripliga och standardlösning räcker kan man snabbt komma igång – t.ex. \"rapid activation\" modell: 6-12 veckor för ett mycket smalt scope.\n\n🧩 **Vad påverkar hur lång tid det tar**\n\nHär är några av de viktigaste faktorerna:\n\nProjektets omfattning (scope) – Vilka applikationer i Dynamics 365 ska användas (CRM, ERP, försäljning, service, finans etc), hur många affärsprocesser ska stödjas?\n\nAnpassning och integration – Ju mer specialanpassningar, ju fler externa system som ska kopplas ihop, desto längre tid.\n\nDatamigrering – Hur mycket data, hur många system, hur komplex datakvaliteten är. Dålig datamigrering kan dra ut projektet.\n\nResurser och organisation – Tillgängliga medarbetare, interna beslut, förändringsledning, utbildning, användaracceptans spelar stor roll.\n\nMetodik och partnerkompetens – Om du har erfaren partner och standardprocesser kan det gå snabbare; om du bygger mycket från grunden tar det längre.\n\nEfterarbete och förändringsarbete (change management) – Att få användarna att använda systemet fullt ut, och att processen fortsätter efter go-live.\n\n✅ **Slutsats för dig**\n\nSätt upp ett realistiskt tidsspann: t.ex. om det är ett mindre bolag och du kan hålla dig till standardfunktioner, planera 3-6 månader från kick-off till go-live.\n\nOm det är ett större bolag eller flera affärsområden med komplexa behov, räkna med minst 6-12 månader eller mer.\n\nHa in byggstenar som: tydligt scope, minimal \"nice-to-have\" funktionalitet initialt, bra partner, datamigrering planerad tidigt, och utbildning & förändringsledning från dag 1.\n\n📋 **Läs mer om implementeringskostnader:**\n• [Dynamics 365 CRM implementering](/crm)\n• [Business Central implementering](/businesscentral)\n• [Finance & Supply Chain implementering](/finance-supply-chain)",
    },
    {
      id: "smatt-och-vaxa",
      question: "Kan vi börja smått och växa?",
      answer: "Absolut! Många kunder som börjar med Business Central kanske inte tar alla funktioner i bruk på en gång. Man väljer att växa in i systemet och utöka med fler funktioner allt eftersom. Detsamma gäller definitivt även CRM-delarna, där man kanske börjar med Sales och därefter är det naturligt att fortsätta med antingen Marketing Automation (Customer Insights) eller kanske börja använda Customer Service. Då allt är i samma databas är det enkelt att komma igång med fler applikationer och funktioner när behoven växer. Varje applikation är kraftfull i sig själv, men den överlägsna styrkan kommer i att plattformen hänger ihop. Dessutom är det en naturlig del i hela Microsoftplattformen.",
    },
    {
      id: "priser",
      question: "Vad ingår i licenspriset?",
      answer: "Licenspriset inkluderar tillgång till systemet, kontinuerliga uppdateringar, säkerhet och grundläggande support. Implementering, eventuella anpassningar, utbildning, förvaltning och utökad support beställs separat av auktoriserad partner.",
    },
    {
      id: "integration",
      question: "Kan vi integrera med våra befintliga system?",
      answer: "Ja, Dynamics 365 har utmärkta integrationsmöjligheter. Har den andra programvaruleverantören redan kopplat sig till Microsoftplattformen (Dataverse), så underlättar detta ytterligare, då \"kopplingen\" redan är gjord. Vi kan koppla ihop med de flesta moderna system via API:er, och det finns färdiga kopplingar till populära tredjepartslösningar.",
    },
    {
      id: "jamforelser",
      question: "Vad är skillnaden mellan Business Central och Finance & Supply Chain?",
      answer: "Business Central är perfekt för mindre och medelstora företag (upp till 300-500 användare) med enklare processer och begränsad budget. Det är snabbare att implementera (2-6 månader) och har lägre kostnader.\n\nFinance & Supply Chain är för stora företag och koncerner med komplexa processer, globala verksamheter och avancerade branschspecifika behov. Det erbjuder kraftfull funktionalitet, avancerad supply chain management och global finansiell hantering.\n\n💡 Se fler detaljer under rubriken [\"Hur väljer jag mellan Business Central och Finance & Supply Chain?\"](#bc-vs-fsc)",
    },
    {
      id: "support",
      question: "Vilken support får vi efter implementeringen?",
      answer: "Efter implementeringen erbjuder de flesta partners fortsatt support och förvaltning. Detta inkluderar teknisk support, användarutbildning, systemuppdateringar och löpande optimering av dina processer. Du bör få hjälp att kontinuerligt utveckla systemet i takt med att dina behov växer.",
    },
    {
      id: "copilot",
      question: "Hur fungerar Microsoft Copilot i Dynamics 365?",
      answer: "Microsoft Copilot är en AI-driven assistent integrerad i Dynamics 365. Den hjälper till att automatisera rutinuppgifter, ge intelligenta insikter och fatta snabbare beslut. Copilot kan sammanfatta leads, skriva e-postutkast, förbereda möten och ge svar på frågor i naturligt språk baserat på din affärsdata. Många grundfunktioner är inkluderade i Enterprise och Premium-licenser.",
    },
    {
      id: "test",
      question: "Kan vi testa systemet innan vi bestämmer oss?",
      answer: "Ja, det är möjligt att få en demo eller prova systemet i en testmiljö. Vi rekommenderar att börja med en workshop där vi går igenom dina specifika behov och visar hur Dynamics 365 kan lösa dina utmaningar. Kontakta oss för att boka en kostnadsfri konsultation.",
    },
    {
      id: "sales-appar",
      question: "Vad är skillnaden mellan olika Dynamics 365 Sales applikationer?",
      answer: "Dynamics 365 Sales finns i flera olika versioner anpassade för olika behov och budgetar:\n\n📊 **Sales Professional**\n\nPris: {{price:sales-professional:exact}}\n\nMålgrupp: Mindre företag och team som behöver grundläggande CRM-funktionalitet\n\nFunktioner: Leadhantering, kontakthantering, affärsmöjligheter, grundläggande rapporter och prognoser, mobil åtkomst, integration med Microsoft 365\n\nBegränsningar: Färre anpassningsmöjligheter, ingen avancerad AI eller automation\n\n🚀 **Sales Enterprise**\n\nPris: {{price:sales-enterprise:exact}}\n\nMålgrupp: Medel- till stora företag med mer komplexa säljprocesser\n\nFunktioner: Allt i Professional plus avancerad anpassning, arbetsflöden och automation, avancerade prognoser och analyser, säljinsikter och AI-rekommendationer, integration med externa system och verktyg\n\nFördelar: Full flexibilitet för att anpassa systemet efter dina behov\n\n⭐ **Sales Premium**\n\nPris: {{price:sales-premium:exact}}\n\nMålgrupp: Stora organisationer med höga krav på automation och AI\n\nFunktioner: Allt i Enterprise plus avancerade Copilot AI-funktioner, konversationsintelligens, automatisk samtalsinspelning och analys, avancerad säljacceleration, predictive scoring och insights\n\nFördelar: Mest kraftfulla AI-verktygen för att maximera säljarnas effektivitet\n\n✅ **Vilken ska du välja?**\n\nBörja med Professional om du är ett mindre team med grundläggande behov. Välj Enterprise om du behöver göra en del anpassningar, automation samt få inbyggd AI. Satsa på Premium om avancerad analys är kritiskt för din framgång.",
    },
    {
      id: "bc-vs-fsc",
      question: "Hur väljer jag mellan Business Central och Finance & Supply Chain?",
      answer: "Valet mellan Business Central och Finance & Supply Chain beror på din organisations storlek, komplexitet och framtida behov:\n\n🏢 **Business Central passar dig om:**\n\n• Du är ett mindre till medelstort företag (upp till 300-500 användare)\n• Du har relativt standardiserade affärsprocesser\n• Du vill komma igång snabbt (2-6 månaders implementering)\n• Du söker en kostnadseffektiv lösning med lägre totalkostnad\n• Du behöver grundläggande till mellanliggande funktionalitet\n• Du vill ha en allt-i-ett-lösning som är enkel att underhålla\n\n🌐 **Finance & Supply Chain passar dig om:**\n\n• Du är ett stort företag eller koncern med global verksamhet\n• Du har komplexa, branschspecifika processer\n• Du behöver avancerad supply chain management\n• Du har verksamhet i flera länder med olika valutor och regelverk\n• Du kräver omfattande anpassningar och skalbarhet\n• Du har stora datavolymer och avancerade rapporteringsbehov\n• Du behöver djup integration med andra enterprise-system\n\n💡 **Praktiska skillnader:**\n\nImplementeringstid: BC 2-6 månader vs F&SC 6-24 månader\n\nKostnad: BC lägre licenspriser vs F&SC högre men mer funktionalitet\n\nKomplexitet: BC enklare att använda vs F&SC mer omfattande men kraftfullare\n\nSkalbarhet: BC upp till 500 användare vs F&SC obegränsat\n\n✅ **Vårt råd:**\n\nOm du är osäkra, börja med att utvärdera Business Central. Det täcker de flesta företags behov och du kan alltid migrera till Finance & Supply Chain senare om verksamheten växer och blir mer komplex. Kontakta oss för en analys av just dina behov.",
    },
    {
      id: "recensioner",
      question: "Vad säger recensioner och kunder om Microsoft Dynamics 365?",
      answer: "Microsoft Dynamics 365 får genomgående höga betyg på fristående reviewsajter som Gartner Peer Insights, G2 och TrustRadius – typiskt 4,3–4,5 av 5 över Sales, Customer Service, Business Central och Finance & Supply Chain.\n\n**Vad uppskattas mest**\n\nDjup integration med Microsoft 365 (Outlook, Teams, Excel, SharePoint), inbyggd Copilot AI utan extra licens i flera Enterprise-versioner, samt möjligheten att kombinera CRM och ERP i en plattform.\n\n**Vanlig kritik**\n\nInitial konfiguration kan upplevas tung och kräver erfaren partner. Användargränssnittet är funktionsrikt men har en brantare inlärningskurva än renodlade nischverktyg som HubSpot eller Zendesk.\n\n**Kundprofiler**\n\nStark närvaro i mellanstora och stora bolag inom tillverkning, finans, professionella tjänster, offentlig sektor och hälso- och sjukvård – ofta där Microsoft-stacken redan är etablerad och regelefterlevnad är viktig.",
    },
  ];


  return (
    <div className="min-h-screen">
      <SEOHead
        title="Vanliga frågor om Microsoft Dynamics 365 – FAQ"
        description="Vanliga frågor om Microsoft Dynamics 365: tid, licenskostnader, BC vs Finance och CRM-val. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
        canonicalPath="/qa"
        keywords="Dynamics 365 frågor, Business Central pris, Dynamics 365 licenskostnad, ERP implementering tid, CRM val Microsoft"
        ogImage="https://d365.se/og-qa.png"
      />
      <FAQSchema faqs={faqs.map(f => ({ question: f.question, answer: resolvePriceTokens(f.answer).substring(0, 300) }))} />
      <BreadcrumbSchema items={[
        { name: "Hem", url: "https://d365.se" },
        { name: "Vanliga frågor", url: "https://d365.se/qa" },
      ]} />
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[300px] sm:h-[400px] md:h-[450px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2070" 
            alt="Questions and answers" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Frågorna du faktiskt behöver svar på
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95">
                Svar på det som är viktigt att förstå om Microsoft Dynamics 365 innan partnerdialogen börjar – licens, implementation, ansvar och totalkostnad.
              </p>
            </div>
          </div>
        </div>
      </header>


      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4" value={openItem} onValueChange={setOpenItem}>
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={faq.id}
                  id={faq.id}
                  className="bg-card rounded-lg px-4 sm:px-6 md:px-8  border border-border scroll-mt-24"
                >
                  <AccordionTrigger className="text-lg sm:text-xl font-bold text-card-foreground hover:no-underline py-4 sm:py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">


                    
                    <div className="text-muted-foreground whitespace-pre-line">
                      {(() => { const resolved = resolvePriceTokens(faq.answer); return resolved.split('\n').map((line, lineIndex) => {
                        const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
                        return (
                          <span key={lineIndex}>
                            {parts.map((part, partIndex) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                              }
                              const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                              if (linkMatch) {
                                return (
                                  <Link 
                                    key={partIndex} 
                                    to={linkMatch[2]} 
                                    className="text-primary hover:underline font-medium"
                                  >
                                    {linkMatch[1]}
                                  </Link>
                                );
                              }
                              return part;
                            })}
                            {lineIndex < resolved.split('\n').length - 1 && <br />}
                          </span>
                        );
                      }); })()}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Har du fler frågor?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss så hjälper vi dig gärna
            </p>
            <ContactFormDialog>
              <Button className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white h-16 sm:h-20 text-lg sm:text-xl rounded px-8 sm:px-12 font-bold transition-all" size="lg">
                Boka in en kostnadsfri rådgivning
              </Button>
            </ContactFormDialog>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QA;
