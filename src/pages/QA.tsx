import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import BigFiveSection from "@/components/BigFiveSection";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const QA = () => {
  const faqs = [
    {
      id: "implementering",
      question: "Hur lång tid tar en implementering?",
      answer: "Hur lång tid en implementation av Microsoft Dynamics 365 tar beror i väldigt hög grad på omfattningen, företagets storlek, hur mycket anpassning och integration som krävs – men här kommer en ungefärlig översikt och vad du bör räkna med.\n\n⏳ **Tidsramar**\n\nFör ett relativt enkelt upplägg i ett mindre företag: ca 3-6 månader.\n\nFör medelstor organisation med måttlig komplexitet: ofta 6-12 månader.\n\nFör stora företag med många länder, många system att integrera och hög grad av anpassning: 9-24 månader eller mer.\n\nI vissa fall där krav är mycket begripliga och standardlösning räcker kan man snabbt komma igång – t.ex. \"rapid activation\" modell: 6-12 veckor för ett mycket smalt scope.\n\n🧩 **Vad påverkar hur lång tid det tar**\n\nHär är några av de viktigaste faktorerna:\n\nProjektets omfattning (scope) – Vilka moduler i Dynamics 365 ska användas (CRM, ERP, försäljning, service, finans etc), hur många affärsprocesser ska stödjas?\n\nAnpassning och integration – Ju mer specialanpassningar, ju fler externa system som ska kopplas ihop, desto längre tid.\n\nDatamigrering – Hur mycket data, hur många system, hur komplex datakvaliteten är. Dagra migrering kan dra ut projektet.\n\nResurser och organisation – Tillgängliga medarbetare, interna beslut, förändringsledning, utbildning, användaracceptans spelar stor roll.\n\nMetodik och partnerkompetens – Om du har erfaren partner och standardprocesser kan det gå snabbare; om du bygger mycket från grunden tar det längre.\n\nEfterarbete och förändringsarbete (change management) – Att få användarna att använda systemet fullt ut, och att processen fortsätter efter go-live.\n\n✅ **Slutsats för dig**\n\nEftersom du jobbar som Business Developer – och om du funderar på att implementera Dynamics 365 i din organisation – mitt råd är:\n\nSätt upp ett realistiskt tidsspann: t.ex. om det är ett mindre bolag och ni kan hålla er till standardfunktioner, planera 3-6 månader från kick-off till go-live.\n\nOm det är ett större bolag eller flera affärsområden med komplexa behov, räkna med minst 6-12 månader eller mer.\n\nHa in byggstenar som: tydligt scope, minimal \"nice-to-have\" funktionalitet initialt, bra partner, datamigrering planerad tidigt, och utbildning & förändringsledning från dag 1.",
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
      answer: "Business Central är perfekt för mindre och medelstora företag (upp till 300-500 användare) med enklare processer och begränsad budget. Det är snabbare att implementera (2-6 månader) och har lägre kostnader.\n\nFinance & Supply Chain är för stora företag och koncerner med komplexa processer, globala verksamheter och avancerade branschspecifika behov. Det erbjuder kraftfull funktionalitet, avancerad supply chain management och global finansiell hantering.",
    },
    {
      id: "support",
      question: "Vilken support får vi efter implementeringen?",
      answer: "Efter implementeringen erbjuder vi fortsatt support och förvaltning. Detta inkluderar teknisk support, användarutbildning, systemuppdateringar och löpande optimering av era processer. Vi hjälper er att kontinuerligt utveckla systemet i takt med att era behov växer.",
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
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(198,80%,45%)] to-[hsl(var(--accent))] text-primary-foreground relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMlMwIDIyLjYyNyAwIDE2em0zNiAzNmMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyek0wIDUyYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTJTMCA1OC42MjcgMCA1MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Vanliga Frågor
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Svar på de vanligaste frågorna om Dynamics 365
            </p>
          </div>
        </div>
      </header>

      {/* Big Five Section */}
      <BigFiveSection />

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} id={faq.id} className="bg-card rounded-lg p-8 shadow-[var(--shadow-card)] border border-border scroll-mt-24">
                  <h3 className="text-xl font-bold text-card-foreground mb-4">{faq.question}</h3>
                  <div className="text-muted-foreground whitespace-pre-line">{faq.answer}</div>
                </div>
              ))}
            </div>
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
            <Button className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0" size="lg">
              Boka Gratis Konsultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QA;
