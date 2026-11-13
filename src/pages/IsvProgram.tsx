import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Calendar, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactFormDialog from "@/components/ContactFormDialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/StructuredData";
import IsvProfileCheck from "@/components/isv/IsvProfileCheck";
import IsvOrderDialog from "@/components/IsvOrderDialog";
import ProgramNavigation from "@/components/ProgramNavigation";
import { PARTNER_BOOKING_URL } from "@/data/organization";

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
      "5 990 kr per år och ISV, exklusive moms, inklusive en verifierad app. Varje ytterligare verifierad app kostar 995 kr per år. Introduktionserbjudande: 2 990 kr för första året för de första 20 nya ISV-leverantörerna. Avgiften faktureras årsvis i förskott.",
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
  { id: "priser-innehall", label: "Prislista" },
  { id: "finders-fee", label: "Finder’s fee" },
  { id: "isv-profilkoll", label: "Profiler & jämförelser" },
  { id: "verifiering", label: "Verifiering" },
  { id: "formedling", label: "Synlighet & Affärsmöjligheter" },
  { id: "vanliga-fragor", label: "Vanliga frågor" },
];

const IsvProgram = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="För ISV-leverantörer | ISV Presence på d365.se"
        description="Visa er Dynamics 365-tilläggslösning med logotyp, webblänk och kontaktuppgifter. ISV Presence 5 990 kr/år inkl. en app, introduktionspris 2 990 kr första året."
        webPageSchema={false}
        canonicalPath="/isvprogram"
        dateModified="2026-11-13"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema name="För ISV-leverantörer" description="ISV Presence för leverantörer av Dynamics 365-tilläggslösningar." url="https://d365.se/isvprogram/" />
      <FAQSchema faqs={faqs} />
      <Navbar />
      <main>
        <section className="bg-primary text-primary-foreground pt-32 lg:pt-36 pb-8 lg:pb-10">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-2">För ISV-leverantörer inom Dynamics&nbsp;365</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-4xl">
              Gör din tilläggslösning synlig under kundens köpresa
            </h1>
            <p className="mt-3 text-base lg:text-lg opacity-90 max-w-3xl">
              d365.se hjälper företag att upptäcka och utvärdera tilläggslösningar för Microsoft&nbsp;Dynamics&nbsp;365. Genom vårt ISV-program kan du presentera din lösning för potentiella kunder och partners som söker information, jämför alternativ och undersöker hur de kan utveckla sin Dynamics&nbsp;365-miljö.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ContactFormDialog subject="ISV Presence" buyerForm={false}>
                <Button size="lg" variant="secondary">
                  Anmäl intresse <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </ContactFormDialog>
              <Button asChild size="lg" variant="secondary">
                <a href={PARTNER_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  Boka möte med Thomas
                </a>
              </Button>
            </div>
          </div>
        </section>

        <ProgramNavigation audience="isv" sections={programSections} />

        <section id="for-isver" className="py-10 md:py-14 scroll-mt-64">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Visa vilka behov era produkter löser</h2>
            <p className="max-w-3xl text-muted-foreground mb-6">d365.se hjälper företag att hitta rätt väg framåt med Microsoft&nbsp;Dynamics&nbsp;365 och hjälper ISV-leverantörer att komma i kontakt med företag och partners som har relevanta behov.</p>
            <ul className="grid md:grid-cols-3 gap-5">
              {[
                { title: "Produkten i rätt sammanhang", text: "Beskriv funktioner, användningsområden, målgrupp och vilka produktområden lösningen kompletterar." },
                { title: "En tydlig väg till er", text: "Logotyp, webblänk och kontakt kräver både ISV Presence och verifierad leverantör och produkt." },
                { title: "Visa lösningen i praktiken", text: "Utökad produktpresentation med bilder, demofilmer, funktioner och kundcase när material finns. Möjlighet till visning på businesscentral.se för relevanta BC-appar." },
              ].map((item) => <li key={item.title}><h3 className="text-base font-semibold mb-2">{item.title}</h3><p className="text-sm text-muted-foreground">{item.text}</p></li>)}
            </ul>
          </div>
        </section>

        <section id="priser-innehall" className="pt-8 pb-14 scroll-mt-64">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Prislista</h2>
            <p className="max-w-3xl text-muted-foreground mb-8 -mt-3">ISV Presence och ett frivilligt Finder’s fee-avtal. Betalning ger aldrig högre placering eller automatisk verifiering.</p>
            <div className="grid gap-6 lg:grid-cols-2 items-start">
              <div className="rounded-xl border-2 border-primary bg-card p-6 md:p-8 flex flex-col">
                <h3 className="text-2xl font-bold text-foreground mb-2">ISV Presence - Prislista</h3>
                <p className="text-sm text-muted-foreground mb-5">Finder’s fee-avtalet är frivilligt. Alla priser exklusive moms.</p>
                <div className="rounded-lg bg-secondary/30 p-5 mb-6 space-y-3 text-sm text-muted-foreground">
                  <h4 className="text-base font-semibold text-foreground">Vad innebär ISV Presence?</h4>
                  <p>Med ISV Presence får er app en utökad produktpresentation där köpare och Dynamics&nbsp;365-partners ser vilka behov lösningen löser, med logotyp, webblänk, kontakt och demofilmer.</p>
                  <p><strong className="font-semibold text-foreground">Vi verifierar uppgifterna.</strong> Innan märkena Verifierad ISV och Verifierad tilläggslösning visas går d365.se-redaktionen igenom leverantör, produkt och kopplingen till Dynamics&nbsp;365. Betalningen i sig ger aldrig verifiering.</p>
                  <p>Utan ISV Presence finns lösningen kvar som grundprofil (0 kr) i katalogen, utan logotyp, länk eller kontaktuppgifter.</p>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Det här ingår</h4>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  {[
                    "Verifieringsprocessen (grundkontroll) ingår",
                    "Logotyp, webblänk och kontaktuppgifter för verifierad leverantör och app",
                    "Upp till tre aktiva demofilmer från YouTube per app",
                    "Filmerna visas under Produktdemonstrationer i d365.se INSIDE",
                    "Märkena Verifierad ISV och Verifierad tilläggslösning med datum när respektive verifiering är godkänd",
                    "Möjlighet till visning på businesscentral.se för BC-appar",
                  ].map((t) => (
                    <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Årspris exklusive moms</p>
                <ul className="text-sm text-foreground space-y-1 mb-4">
                  <li className="rounded-md bg-primary/10 px-3 py-2">Introduktionspris första året: <strong>2&nbsp;990&nbsp;kr</strong> <span className="text-muted-foreground">(de första 20 nya ISV-leverantörerna)</span></li>
                  <li>Ordinarie pris per ISV inklusive en app: <strong>5&nbsp;990&nbsp;kr&nbsp;/&nbsp;år</strong></li>
                  <li>Per extra app: <strong>995&nbsp;kr&nbsp;/&nbsp;år</strong></li>
                  <li>Produktion av d365.se INSIDE-film: <strong>separat offert</strong></li>
                </ul>
                <p className="text-xs text-muted-foreground leading-relaxed mt-auto">Avgiften faktureras årsvis i förskott.</p>
                <IsvOrderDialog />
              </div>
              <div id="finders-fee" className="rounded-xl border border-border bg-card p-6 md:p-8 scroll-mt-64">
              <h3 className="text-2xl font-bold mb-3">Finder’s fee (Business Referral) - så fungerar det</h3>
              <p className="text-sm text-muted-foreground mb-5">Finder’s fee-avtalet gör att vi kan introducera er för köpare som redan har ett konkret behov. Avtalet är frivilligt och separat från ISV Presence: ni kan ha båda, ett av dem eller inget. Ni betalar bara när det leder till en genomförd affär.</p>
              <ol className="space-y-4 mb-6">
<li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span><div><p className="font-semibold text-foreground">Köparen beskriver sitt behov</p><p className="text-sm text-muted-foreground">Ett företag använder d365.se för att förstå sitt behov, till exempel via guider, tilläggskatalogen, en kravspecifikation eller ett samtal med oss.</p></div></li>
<li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span><div><p className="font-semibold text-foreground">Vi kvalificerar affären</p><p className="text-sm text-muted-foreground">Vi går igenom behov, tidplan och budget. Bara konkreta projekt med tydlig avsikt att gå vidare blir en affärsmöjlighet.</p></div></li>
<li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span><div><p className="font-semibold text-foreground">Ni får frågan först</p><p className="text-sm text-muted-foreground">Vi beskriver möjligheten för er. Ni bedömer om den passar och accepterar villkoren innan något händer. Affären registreras med datum och berörda parter.</p></div></li>
<li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">4</span><div><p className="font-semibold text-foreground">Köparen säger ja</p><p className="text-sm text-muted-foreground">Köparen lämnar sitt samtycke. Därefter introducerar vi kunden för er. Finder’s fee gäller när ni säljer direkt till kunden.</p></div></li>
<li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">5</span><div><p className="font-semibold text-foreground">Ersättning bara vid affär</p><p className="text-sm text-muted-foreground">Ni betalar först när affären är genomförd och kunden har betalat. Blir det ingen affär kostar det ingenting.</p></div></li>
</ol>
              <h4 className="font-semibold text-foreground mb-2">Ersättning</h4>
              <div className="overflow-x-auto rounded-lg border border-border mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50"><tr>
                    <th scope="col" className="text-left font-semibold px-4 py-3">Intäkt</th>
                    <th scope="col" className="text-right font-semibold px-4 py-3">Success fee</th>
                  </tr></thead>
                  <tbody>
                    <tr className="border-t border-border"><th scope="row" className="text-left font-normal px-4 py-3">ISV:ns nettointäkter från licenser eller abonnemang, affärens första 12 månader</th><td className="text-right px-4 py-3 whitespace-nowrap font-semibold">5&nbsp;%</td></tr>
                    <tr className="border-t border-border"><th scope="row" className="text-left font-normal px-4 py-3">Nettointäkter från ett separat förmedlat implementations- eller konsultuppdrag</th><td className="text-right px-4 py-3 whitespace-nowrap font-semibold">2,5&nbsp;%</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Ingen fast avgift och ingen mötesavgift. <strong className="font-semibold text-foreground">Success fee på 5 procent av licensintäkterna under första året och 2,5 procent av konsultintäkterna</strong>, exklusive moms.</p>
              <h4 className="font-semibold text-foreground mb-2">Villkor i korthet</h4>
              <ul className="space-y-2 text-sm text-muted-foreground mb-5">
<li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Gäller bara nya, registrerade och av er godkända affärsmöjligheter.</li>
<li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Beräknas på betalade intäkter exklusive moms, rabatter, återbetalningar och vidarefakturerade tredjepartskostnader.</li>
<li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span>Gäller bara när ni säljer <strong className="font-semibold text-foreground">direkt till slutkunden</strong>. Säljs produkten via en återförsäljande Dynamics&nbsp;365-partner som får marginal eller provision av er utgår ingen Finder’s fee.</span></li>
<li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Gäller normalt första affären, inte förnyelser eller tilläggsbeställningar. Samma intäkt provisionsbeläggs aldrig dubbelt.</li>
<li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Ingen ersättning uppstår av enbart ett formulär, ett klick eller en obesvarad förfrågan.</li>
<li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Köparen informeras när en förmedling kan ge ersättning till d365.se.</li>
</ul>
              <p className="text-xs text-muted-foreground mb-5">Introduktioner påverkar aldrig ordningen i katalogen eller våra rekommendationer.</p>
              <ContactFormDialog buyerForm={false} title="Begär Finder’s fee-avtal för ISV" description="Fyll i era kontaktuppgifter så skickar vi förmedlingsavtalet." subject="Ansökan: Finder’s fee-avtal (ISV)">
                <Button size="lg" variant="outline">Begär Finder’s fee-avtal<ArrowRight className="w-4 h-4 ml-2" /></Button>
              </ContactFormDialog>
            </div>
            </div>
            <div id="verifiering" className="mt-8 max-w-4xl rounded-xl border border-border bg-secondary/30 p-6 scroll-mt-64">
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

        <section id="formedling" className="py-10 md:py-14 bg-secondary/30 border-y border-border scroll-mt-64">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Synlighet &amp; Affärsmöjligheter</h2>
            <p className="max-w-3xl text-muted-foreground mb-4">Produktprofilen hjälper köpare och Dynamics&nbsp;365-partners att förstå när er lösning passar. Belagda partnerrelationer kan visas på produktsidan; en relation antas aldrig enbart för att partnern arbetar med samma produktområde.</p>
            <p className="max-w-3xl text-muted-foreground mb-6">ISV Presence innebär inte garanterade leads. Eventuell förmedling och kommersiella villkor diskuteras separat och påverkar aldrig katalogordningen eller rekommendationerna.</p>
            
            <div className="flex flex-wrap gap-3">
              <ContactFormDialog subject="Business Referral (ISV)" buyerForm={false}><Button>Diskutera affärssamarbete<ArrowRight className="w-4 h-4 ml-2" /></Button></ContactFormDialog>
              <Button asChild variant="outline"><Link to="/kunskapscenter/dynamics-365-tillagg/">Se tilläggskatalogen<ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            </div>
          </div>
        </section>

        <section id="vanliga-fragor" className="py-14 bg-muted/30 scroll-mt-64">
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
