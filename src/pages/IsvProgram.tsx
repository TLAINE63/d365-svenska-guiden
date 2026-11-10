import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactFormDialog from "@/components/ContactFormDialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/StructuredData";
import IsvProfileCheck from "@/components/isv/IsvProfileCheck";
import ProgramNavigation from "@/components/ProgramNavigation";
import { ISV_FEES } from "@/lib/budget2027";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se/" },
  { name: "För ISV-leverantörer", url: "https://d365.se/isvprogram/" },
];

const faqs = [
  {
    question: "Finns vår lösning i katalogen även utan ISV Presence?",
    answer:
      "Ja. Relevanta tilläggslösningar sammanställs i katalogen utan avgift. Utan verifiering visas ingen logotyp, ingen länk till er webbplats och inga kontaktuppgifter.",
  },
  {
    question: "Vad kostar ISV Presence?",
    answer:
      "5 990 kr per år och ISV, exklusive moms, inklusive en verifierad app. Varje ytterligare verifierad app kostar 995 kr per år. Avgiften faktureras årsvis i förskott.",
  },
  {
    question: "Påverkar ISV Presence ordningen i katalogen?",
    answer:
      "Nej. Betalning ger ingen rankingvikt eller köpt placering. Verifiering beskriver hur uppgifterna har kontrollerats, inte att lösningen är bättre.",
  },
  {
    question: "Vi är redan verifierad partner på d365.se. Behöver vi ISV Presence?",
    answer:
      "Er leverantörsprofil räknas automatiskt som verifierad och era partneruppgifter kan visas på ISV-sidan. Varje produkt verifieras fortfarande för sig.",
  },
];

const programSections = [
  { id: "for-isver", label: "Översikt" },
  { id: "priser-innehall", label: "Priser & innehåll" },
  { id: "isv-profilkoll", label: "Profiler & jämförelser" },
  { id: "verifiering", label: "Verifiering" },
  { id: "formedling", label: "Möten & Affärsmöjligheter" },
  { id: "vanliga-fragor", label: "Vanliga frågor" },
];

const IsvProgram = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="För ISV-leverantörer | ISV Presence på d365.se"
        description="Visa er Dynamics 365-tilläggslösning med logotyp, webblänk och kontaktuppgifter. ISV Presence 5 990 kr/år inklusive en app, 995 kr/år per extra app."
        webPageSchema={false}
        canonicalPath="/isvprogram"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema name="För ISV-leverantörer" description="ISV Presence för leverantörer av Dynamics 365-tilläggslösningar." url="https://d365.se/isvprogram/" />
      <FAQSchema faqs={faqs} />
      <Navbar />
      <main>
        <section className="bg-primary text-primary-foreground pt-32 lg:pt-36 pb-8 lg:pb-10">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-2">För ISV-leverantörer</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-4xl">
              ISV-program för leverantörer av tilläggslösningar
            </h1>
            <p className="mt-3 text-base lg:text-lg opacity-90 max-w-3xl">
              Köpare och partners använder tilläggskatalogen för att hitta lösningar till Business Central, Finance &amp; Supply Chain, Sales och Customer Service. ISV Presence ger en utökad produktpresentation. Verifiering och abonnemang hålls isär.
            </p>
            <ContactFormDialog subject="ISV Presence" buyerForm={false}>
              <Button size="lg" variant="secondary" className="mt-5">
                Anmäl intresse <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </ContactFormDialog>
          </div>
        </section>

        <ProgramNavigation audience="isv" sections={programSections} />

        <section id="for-isver" className="py-10 md:py-14 scroll-mt-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Visa vilka behov era produkter löser</h2>
            <p className="max-w-3xl text-muted-foreground mb-6">d365.se hjälper företag att hitta rätt väg framåt med Microsoft&nbsp;Dynamics&nbsp;365 och hjälper ISV:er att komma i kontakt med företag och partners som har relevanta behov.</p>
            <ul className="grid md:grid-cols-3 gap-5">
              {[
                { title: "Produkten i rätt sammanhang", text: "Beskriv funktioner, användningsområden, målgrupp och vilka produktområden lösningen kompletterar." },
                { title: "En tydlig väg till er", text: "Logotyp, webblänk och kontakt kräver både ISV Presence och verifierad leverantör och produkt." },
                { title: "Visa lösningen i praktiken", text: "Utökad produktpresentation med bilder, demofilmer, funktioner och kundcase när material finns. Möjlighet till visning på businesscentral.se för relevanta BC-appar." },
              ].map((item) => <li key={item.title}><h3 className="text-base font-semibold mb-2">{item.title}</h3><p className="text-sm text-muted-foreground">{item.text}</p></li>)}
            </ul>
          </div>
        </section>

        <section id="priser-innehall" className="pt-8 pb-14 scroll-mt-28">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Nivåer och priser</h2>
            <div className="grid gap-5 md:grid-cols-2 items-stretch">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Grundprofil</h3>
                <p className="text-3xl font-bold text-foreground mb-3">0 kr</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lösningen sammanställs i katalogen med funktioner, produktområden och branscher. Ingen logotyp, ingen länk till er webbplats och inga kontaktuppgifter.
                </p>
              </div>
              <div className="relative rounded-xl border-2 border-primary bg-card p-6 shadow-lg flex flex-col">
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">ISV Presence</span>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary mb-1">ISV Presence</h3>
                <p className="text-base font-semibold text-foreground mb-3">Verifierad leverantör och app</p>
                <ul className="text-sm text-muted-foreground space-y-1.5 mb-3">
                  {[
                    "Verifieringsprocessen (grundkontroll) ingår",
                    "Logotyp, webblänk och kontaktuppgifter för verifierad leverantör och app",
                    "Upp till tre aktiva demofilmer från YouTube per app",
                    "Filmerna visas under Produktdemonstrationer i d365.se INSIDE",
                    "Badgen D365 Verifierad med datum när verifieringen är godkänd",
                    "Möjlighet till visning på businesscentral.se för BC-appar",
                  ].map((t) => (
                    <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Årspris exklusive moms</p>
                <ul className="text-sm text-foreground space-y-1 mb-4">
                  <li>Per ISV inklusive en app: <strong>5&nbsp;990&nbsp;kr&nbsp;/&nbsp;år</strong></li>
                  <li>Per extra app: <strong>995&nbsp;kr&nbsp;/&nbsp;år</strong></li>
                  <li>Produktion av d365.se INSIDE-film: <strong>separat offert</strong></li>
                </ul>
                <p className="text-xs text-muted-foreground leading-relaxed mt-auto">Avgiften faktureras årsvis i förskott.</p>
              </div>
            </div>
            <div id="verifiering" className="mt-8 max-w-4xl rounded-xl border border-border bg-secondary/30 p-6 scroll-mt-28">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-accent" aria-hidden="true" /> Verifiering och avtal hålls isär
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Verifieringsprocessen ingår, men verifierad status kan inte köpas eller garanteras.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span>Grundkontrollen omfattar företag, produkt och centrala uppgifter samt kopplingen till <span className="whitespace-nowrap">Dynamics 365</span>. Utökad kontroll görs bara vid behov.</span></li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Leverantör och produkt verifieras var för sig.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />En verifierad produkt betyder inte att alla länder, lokala partners eller supportuppgifter är verifierade. Varje sådan uppgift har egen källa och status.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Leverantörer som redan är verifierade partners på d365.se räknas automatiskt som verifierade leverantörer.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Betalning påverkar aldrig ordningen i katalogen eller våra rekommendationer.</li>
              </ul>
            </div>
          </div>
        </section>

        <IsvProfileCheck />

        <section id="formedling" className="py-10 md:py-14 bg-secondary/30 border-y border-border scroll-mt-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Möten &amp; Affärsmöjligheter</h2>
            <p className="max-w-3xl text-muted-foreground mb-4">Produktprofilen hjälper köpare och Solution Partners att förstå när er lösning passar. Belagda partnerrelationer kan visas på produktsidan; en relation antas aldrig enbart för att partnern arbetar med samma produktområde.</p>
            <p className="max-w-3xl text-muted-foreground mb-6">ISV Presence innebär inte garanterade leads. Eventuell förmedling och kommersiella villkor diskuteras separat och påverkar aldrig katalogordningen eller rekommendationerna.</p>
            <h3 className="text-lg font-semibold mb-3">Ersättning vid förmedling</h3>
            <div className="max-w-4xl overflow-x-auto rounded-lg border border-border bg-card mb-5">
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr>
                  <th scope="col" className="text-left font-semibold px-4 py-3">Affärstyp</th>
                  <th scope="col" className="text-right font-semibold px-4 py-3">Kundavtal tecknat</th>
                </tr></thead>
                <tbody>
                  <tr className="border-t border-border"><th scope="row" className="text-left font-normal px-4 py-3">ISV-lösningar för Business Central och CRM</th><td className="text-right px-4 py-3 whitespace-nowrap font-semibold">{ISV_FEES.introStd.toLocaleString("sv-SE")}&nbsp;kr</td></tr>
                  <tr className="border-t border-border"><th scope="row" className="text-left font-normal px-4 py-3">ISV-lösningar för Finance &amp; Supply Chain Management</th><td className="text-right px-4 py-3 whitespace-nowrap font-semibold">{ISV_FEES.introFscm.toLocaleString("sv-SE")}&nbsp;kr</td></tr>
                </tbody>
              </table>
            </div>
            <div className="max-w-3xl space-y-3 text-sm text-muted-foreground mb-6">
              <p>Den fasta ersättningen gäller en accepterad introduktion som leder till tecknat avtal. Alla belopp anges exklusive moms. ISV Presence och förmedlingsersättning är separata.</p>
              <p>Success fee på {(ISV_FEES.successRate * 100).toLocaleString("sv-SE")}&nbsp;procent tillkommer enligt separat förmedlingsavtal. Beräkningsunderlag och betalningsvillkor fastställs innan introduktionen genomförs.</p>
              <p>Ni får bedöma affärsmöjligheten och acceptera de kommersiella villkoren innan introduktionen genomförs.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ContactFormDialog subject="ISV Presence" buyerForm={false}><Button>Prata med oss om ISV Presence<ArrowRight className="w-4 h-4 ml-2" /></Button></ContactFormDialog>
              <Button asChild variant="outline"><Link to="/kunskapscenter/dynamics-365-tillagg/">Se tilläggskatalogen<ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            </div>
          </div>
        </section>

        <section id="vanliga-fragor" className="py-14 bg-muted/30 scroll-mt-28">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Vanliga frågor</h2>
            <Accordion type="single" collapsible className="max-w-4xl">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`f${i}`}>
                  <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="mt-8 text-sm text-muted-foreground">
              Se katalogen: <Link to="/kunskapscenter/dynamics-365-tillagg/" className="text-primary underline underline-offset-2">Tilläggslösningar för <span className="whitespace-nowrap">Dynamics 365</span></Link>. Partner? Se <Link to="/partnerprogram/" className="text-primary underline underline-offset-2">Partnerprogram</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IsvProgram;
