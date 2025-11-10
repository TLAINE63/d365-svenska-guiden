import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QA = () => {
  const faqs = [
    {
      id: "fordelar",
      question: "Vilka är de verkliga fördelarna med Microsoft Dynamics 365?",
      answer: "Microsoft Dynamics 365 erbjuder flera konkreta fördelar som kan transformera hur din organisation arbetar:\n\n**Allt i molnet**\n\nIngen egen serverhantering, automatiska uppdateringar och säkerhetspatchar. Tillgång var som helst, när som helst.\n\n**En plattform för allt**\n\nAlla applikationer (Sales, Service, Marketing) delar samma databas och integrerar sömlöst. Ingen dubbelregistrering av data mellan system. Dessutom integrerat med övriga Microsoftplattformen.\n\n**Kraftfull AI med Copilot**\n\nInbyggd AI som hjälper till med allt från att sammanfatta kundinformation till att föreslå nästa bästa åtgärd. Många AI-funktioner ingår i Dynamics 365 licensen.\n\n**Microsoft-ekosystemet**\n\nDjup integration med verktyg ni redan använder: Teams, Outlook, Excel, Word, Power BI. Användarna slipper växla mellan system.\n\n**Skalbar och flexibel**\n\nBörja smått och väx. Lägg till fler applikationer och användare i takt med att behoven ökar. Passar både för 10 och 10,000 användare.\n\n**Säkerhet i världsklass**\n\nMicrosoft investerar miljarder i säkerhet. Certifierad enligt ISO 27001, GDPR-kompatibel, och geografisk datalagringsval.\n\n**Mobilitet**\n\nFullständiga mobilappar för iOS och Android. Jobba lika effektivt från kontoret, hemmet eller i fält.\n\n**Lägre totalkostnad**\n\nIngen hårdvara att köpa, färre konsulter att underhålla integrations-spagetti, snabbare implementering än traditionella system.\n\n**Ingen teknisk skuld**\n\nAlltid senaste versionen, inga dyra uppgraderingar vart tredje år. Microsoft släpper nya funktioner löpande.\n\n**Moderna gränssnitt**\n\nAnvändarvänliga, intuitiva gränssnitt som användarna faktiskt vill använda. Mindre utbildningsbehov.\n\n**Vem passar det för?**\n\nSmå företag som vill växa utan att byta system, medelstora företag som behöver professionell infrastruktur, och stora företag som kräver global skalbarhet. Microsoft Dynamics 365 passar alla som vill modernisera sin affärsverksamhet.",
    },
    {
      id: "implementering",
      question: "Hur lång tid tar en implementering?",
      answer: "Hur lång tid en implementation av Microsoft Dynamics 365 tar beror i väldigt hög grad på omfattningen, företagets storlek, hur mycket anpassning och integration som krävs – men här kommer en ungefärlig översikt och vad du bör räkna med.\n\n⏳ **Tidsramar**\n\nFör ett relativt enkelt upplägg i ett mindre företag: ca 3-6 månader.\n\nFör medelstor organisation med måttlig komplexitet: ofta 6-12 månader.\n\nFör stora företag med många länder, många system att integrera och hög grad av anpassning: 9-24 månader eller mer.\n\nI vissa fall där krav är mycket begripliga och standardlösning räcker kan man snabbt komma igång – t.ex. \"rapid activation\" modell: 6-12 veckor för ett mycket smalt scope.\n\n🧩 **Vad påverkar hur lång tid det tar**\n\nHär är några av de viktigaste faktorerna:\n\nProjektets omfattning (scope) – Vilka moduler i Dynamics 365 ska användas (CRM, ERP, försäljning, service, finans etc), hur många affärsprocesser ska stödjas?\n\nAnpassning och integration – Ju mer specialanpassningar, ju fler externa system som ska kopplas ihop, desto längre tid.\n\nDatamigrering – Hur mycket data, hur många system, hur komplex datakvaliteten är. Dagra migrering kan dra ut projektet.\n\nResurser och organisation – Tillgängliga medarbetare, interna beslut, förändringsledning, utbildning, användaracceptans spelar stor roll.\n\nMetodik och partnerkompetens – Om du har erfaren partner och standardprocesser kan det gå snabbare; om du bygger mycket från grunden tar det längre.\n\nEfterarbete och förändringsarbete (change management) – Att få användarna att använda systemet fullt ut, och att processen fortsätter efter go-live.\n\n✅ **Slutsats för dig**\n\nSätt upp ett realistiskt tidsspann: t.ex. om det är ett mindre bolag och ni kan hålla er till standardfunktioner, planera 3-6 månader från kick-off till go-live.\n\nOm det är ett större bolag eller flera affärsområden med komplexa behov, räkna med minst 6-12 månader eller mer.\n\nHa in byggstenar som: tydligt scope, minimal \"nice-to-have\" funktionalitet initialt, bra partner, datamigrering planerad tidigt, och utbildning & förändringsledning från dag 1.\n\n📋 **Läs mer om implementeringskostnader:**\n• [Dynamics 365 CRM implementering](/crm)\n• [Business Central implementering](/business-central)\n• [Finance & Supply Chain implementering](/finance-supply-chain)",
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
      answer: "Efter implementeringen erbjuder de flesta partners fortsatt support och förvaltning. Detta inkluderar teknisk support, användarutbildning, systemuppdateringar och löpande optimering av era processer. Ni bör få hjälp att kontinuerligt utveckla systemet i takt med att era behov växer.",
    },
    {
      id: "copilot",
      question: "Hur fungerar Microsoft Copilot i Dynamics 365?",
      answer: "Microsoft Copilot är en AI-driven assistent integrerad i Dynamics 365. Den hjälper till att automatisera rutinuppgifter, ge intelligenta insikter och fatta snabbare beslut. Copilot kan sammanfatta leads, skriva e-postutkast, förbereda möten och ge svar på frågor i naturligt språk baserat på din affärsdata. Många grundfunktioner är inkluderade i Enterprise och Premium-licenser.",
    },
    {
      id: "test",
      question: "Kan vi testa systemet innan vi bestämmer oss?",
      answer: "Ja, det är möjligt att få en demo eller prova systemet i en testmiljö. Vi rekommenderar att börja med en workshop där vi går igenom era specifika behov och visar hur Dynamics 365 kan lösa era utmaningar. Kontakta oss för att boka en kostnadsfri konsultation.",
    },
    {
      id: "risker",
      question: "Vilka risker finns i CRM/ERP projekt?",
      answer: "CRM/ERP-projekt är stora investeringar och det finns flera risker att vara medveten om:\n\n⚠️ **Vanliga risker**\n\n**Scope creep** – Projektet växer utanför den ursprungliga planen vilket leder till förseningar och ökade kostnader. Lösning: Tydlig projektplan och change management process.\n\n**Dålig datakvalitet** – Gammal eller felaktig data som migreras in i nya systemet skapar problem. Lösning: Noggrann datarensning och validering innan migrering.\n\n**Bristande användaracceptans** – Medarbetare vill inte använda det nya systemet. Lösning: Involvera användare tidigt, utbildning och tydlig förändringsledning.\n\n**Tekniska integrationsproblem** – Svårigheter att koppla samman med befintliga system. Lösning: Teknisk due diligence och erfaren implementationspartner.\n\n**Otillräckliga resurser** – Både interna och externa resurser kan vara underdimensionerade. Lösning: Realistisk resursplanering från start.\n\n**Bristande ledningsengagemang** – Utan stöd från ledningen tappar projektet momentum. Lösning: Säkerställ executive sponsorship och regelbunden kommunikation.\n\n✅ **Hur ni minimerar riskerna**\n\nSäkerställ att ni får en partner som använder beprövade metodiker, involverar era användare tidigt, har tydliga milstolpar och kommunicerar öppet om utmaningar. Med rätt partner och realistiska förväntningar kan de flesta risker hanteras effektivt.",
    },
    {
      id: "sales-appar",
      question: "Vad är skillnaden mellan olika Dynamics 365 Sales applikationer?",
      answer: "Dynamics 365 Sales finns i flera olika versioner anpassade för olika behov och budgetar:\n\n📊 **Sales Professional**\n\nPris: Ca 750 kr/användare/månad\n\nMålgrupp: Mindre företag och team som behöver grundläggande CRM-funktionalitet\n\nFunktioner: Leadhantering, kontakthantering, affärsmöjligheter, grundläggande rapporter och prognoser, mobil åtkomst, integration med Microsoft 365\n\nBegränsningar: Färre anpassningsmöjligheter, ingen avancerad AI eller automation\n\n🚀 **Sales Enterprise**\n\nPris: Ca 1,150 kr/användare/månad\n\nMålgrupp: Medel- till stora företag med mer komplexa säljprocesser\n\nFunktioner: Allt i Professional plus avancerad anpassning, arbetsflöden och automation, avancerade prognoser och analyser, säljinsikter och AI-rekommendationer, integration med externa system och verktyg, LinkedIn Sales Navigator integration\n\nFördelar: Full flexibilitet för att anpassa systemet efter era behov\n\n⭐ **Sales Premium**\n\nPris: Ca 1,850 kr/användare/månad\n\nMålgrupp: Stora organisationer med höga krav på automation och AI\n\nFunktioner: Allt i Enterprise plus avancerade Copilot AI-funktioner, konversationsintelligens, automatisk samtalsinspelning och analys, avancerad säljacceleration, predictive scoring och insights\n\nFördelar: Mest kraftfulla AI-verktygen för att maximera säljarnas effektivitet\n\n✅ **Vilken ska ni välja?**\n\nBörja med Professional om ni är ett mindre team med grundläggande behov. Välj Enterprise om ni behöver anpassningar och automation. Satsa på Premium om AI och avancerad analys är kritiskt för er framgång.",
    },
    {
      id: "bc-vs-fsc",
      question: "Hur väljer jag mellan Business Central och Finance & Supply Chain?",
      answer: "Valet mellan Business Central och Finance & Supply Chain beror på er organisations storlek, komplexitet och framtida behov:\n\n🏢 **Business Central passar er om:**\n\n• Ni är ett mindre till medelstort företag (upp till 300-500 användare)\n• Ni har relativt standardiserade affärsprocesser\n• Ni vill komma igång snabbt (2-6 månaders implementering)\n• Ni söker en kostnadseffektiv lösning med lägre totalkostnad\n• Ni behöver grundläggande till mellanliggande funktionalitet\n• Ni vill ha en allt-i-ett-lösning som är enkel att underhålla\n\n🌐 **Finance & Supply Chain passar er om:**\n\n• Ni är ett stort företag eller koncern med global verksamhet\n• Ni har komplexa, branschspecifika processer\n• Ni behöver avancerad supply chain management\n• Ni har verksamhet i flera länder med olika valutor och regelverk\n• Ni kräver omfattande anpassningar och skalbarhet\n• Ni har stora datavolymer och avancerade rapporteringsbehov\n• Ni behöver djup integration med andra enterprise-system\n\n💡 **Praktiska skillnader:**\n\nImplementeringstid: BC 2-6 månader vs F&SC 6-24 månader\n\nKostnad: BC lägre licenspriser vs F&SC högre men mer funktionalitet\n\nKomplexitet: BC enklare att använda vs F&SC mer omfattande men kraftfullare\n\nSkalbarhet: BC upp till 500 användare vs F&SC obegränsat\n\n✅ **Vårt råd:**\n\nOm ni är osäkra, börja med att utvärdera Business Central. Det täcker de flesta företags behov och ni kan alltid migrera till Finance & Supply Chain senare om verksamheten växer och blir mer komplex. Kontakta oss för en analys av just era behov.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[400px] md:h-[450px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2070" 
            alt="Questions and answers" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Vanliga Frågor
              </h1>
              <p className="text-xl md:text-2xl text-white/95">
                Svar på de vanligaste frågorna om Dynamics 365
              </p>
              <p className="text-lg md:text-xl text-white/80 mt-2">
                (...om man frågar Copilot)
              </p>
            </div>
          </div>
        </div>
      </header>


      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={faq.id}
                  id={faq.id}
                  className="bg-card rounded-lg px-8 shadow-[var(--shadow-card)] border border-border scroll-mt-24"
                >
                  <AccordionTrigger className="text-xl font-bold text-card-foreground hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">
                    {/* Visual advantages grid for the first FAQ */}
                    {faq.id === "fordelar" && (
                      <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                        <h4 className="text-lg font-semibold text-card-foreground mb-4 text-center">Översikt av fördelar</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                          {[
                            { icon: "☁️", title: "Allt i molnet" },
                            { icon: "🔗", title: "En plattform för allt" },
                            { icon: "🤖", title: "Kraftfull AI med Copilot" },
                            { icon: "🏢", title: "Microsoft-ekosystemet" },
                            { icon: "📈", title: "Skalbar och flexibel" },
                            { icon: "🔒", title: "Säkerhet i världsklass" },
                            { icon: "📱", title: "Mobilitet" },
                            { icon: "💰", title: "Lägre totalkostnad" },
                            { icon: "🔄", title: "Ingen teknisk skuld" },
                            { icon: "✨", title: "Moderna gränssnitt" },
                          ].map((advantage, idx) => (
                            <div key={idx} className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-all hover:shadow-md text-center">
                              <div className="text-3xl mb-2">{advantage.icon}</div>
                              <div className="text-xs font-medium text-card-foreground">{advantage.title}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-muted-foreground whitespace-pre-line">
                      {faq.answer.split('\n').map((line, lineIndex) => {
                        const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
                        return (
                          <span key={lineIndex}>
                            {parts.map((part, partIndex) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                              }
                              // Handle markdown links [text](url)
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
                            {lineIndex < faq.answer.split('\n').length - 1 && <br />}
                          </span>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Har du fler frågor?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss så hjälper vi dig gärna
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              <Link to="/kontakt">Boka Gratis Konsultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QA;
