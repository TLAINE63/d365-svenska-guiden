import { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Check,
  Search,
  SlidersHorizontal,
  Columns3,
  ListChecks,
  Mail,
  Eye,
  BadgeCheck,
  Video,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramNavigation from "@/components/ProgramNavigation";
import SEOHead from "@/components/SEOHead";
import ContactFormDialog from "@/components/ContactFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/StructuredData";
import { trackFunnelEvent, type FunnelEventType } from "@/utils/trackFunnelEvent";
import { useBasicPartners } from "@/hooks/useBasicPartners";
import PartnerProgramBenchmark from "@/components/partner/PartnerProgramBenchmark";
import PartnerProfileCheck from "@/components/partner/PartnerProfileCheck";
import VerifiedPartnerBadgeEmbed from "@/components/partner/VerifiedPartnerBadgeEmbed";

import partnerData from "@/data/partnerData.json";
import { PARTNER_BOOKING_URL } from "@/data/organization";

type SimplePartner = { slug: string; name: string; is_featured: boolean; logo_url?: string | null };

const VERIFIED_PARTNERS = (partnerData as SimplePartner[]).filter((p) => p.is_featured);

const programSections = [
  { id: "for-partners", label: "Översikt" },
  { id: "priser-innehall", label: "Priser & innehåll" },
  { id: "profilkoll", label: "Er partnerprofil" },
  { id: "profiljamforelse", label: "Jämförelser" },
  { id: "expertinnehall", label: "Synlighet & INSIDE" },
  { id: "affarsmojligheter", label: "Möten & Affärsmöjligheter" },
  { id: "kom-igang", label: "Kom igång" },
  { id: "vanliga-fragor", label: "Vanliga frågor" },
];

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se/" },
  { name: "För partners", url: "https://d365.se/partnerprogram/" },
];

const faqs = [
  {
    question: "Finns vi på d365.se även om vi inte profilerar oss?",
    answer:
      "Ja. Ambitionen är att kartlägga den relevanta svenska Dynamics 365-partnermarknaden. Skillnaden är hur mycket information som finns tillgänglig om respektive partner.",
  },
  {
    question: "Påverkar profilering vår ranking?",
    answer:
      "Nej. Betalning ger ingen rankingvikt, bonuspoäng eller köpt placering. Mer komplett och partnerverifierad information kan däremot göra det möjligt för d365.se att bedöma er relevans mer precist.",
  },
  {
    question: "Kan vi själva påverka innehållet?",
    answer:
      "Ja. Profilerade partners får en egen profileringslänk och kan när som helst gå in och uppdatera sina delar – beskrivningar, kompetenser, branscher, kundexempel och kontaktvägar. Utöver det lägger d365.se till en egen AI-baserad analys och sammanfattning för att göra profiler jämförbara; den delen är redaktionell och godkänns inte av partnern, men bygger på den information ni själva lagt in och kan alltid kommenteras eller korrigeras vid faktafel.",
  },
  {
    question: "Kan ni garantera leads?",
    answer:
      "Nej. d365.se kommunicerar inte garanterade leadvolymer. Värdet består av synlighet i köpresan, ett rikare beslutsunderlag, kontaktmöjligheter och ökad digital närvaro.",
  },
  {
    question: "Kan profilen hjälpa vår SEO eller synlighet i AI-sök?",
    answer:
      "En indexerbar tredjepartsprofil, expertinnehåll och video skapar fler relevanta källor om ert företag. Det kan stärka förutsättningarna att bli hittad och förstådd, men d365.se garanterar aldrig Google-ranking eller AI-citeringar.",
  },
  {
    question: "Vad innebär videointervjun?",
    answer:
      "En redaktionell intervju (d365.se INSIDE) med en eller flera av partnerns experter som kan publiceras på d365.se och YouTube och användas som innehåll på partnerprofilen. Intervju och produktion kostar 4 900 kr för verifierade partners med Premium och 8 900 kr för övriga, exklusive moms. Redaktionellt ansvar ligger hos d365.se.",
  },
  {
    question: "Kostar det att publiceras på d365.se?",
    answer:
      "Nej. En relevant Dynamics 365-partner kan publiceras som Standard utan avgift. Premium är en betald utökad presentation: 995 kr/månad för 1 produktområde, 1 295 kr för 2 och 1 495 kr för 3 (CE/CRM-applikationerna räknas som ett produktområde), exklusive moms. Premium År ger samma innehåll med årsvis betalning i förskott: 7 990 kr per år för ett produktområde, 9 990 kr för två och 11 990 kr för tre, exklusive moms. Premium påverkar inte relevansordningen och ger aldrig verifieringsstatus.",
  },
];

const journeySteps = [
  { label: "Behov / systemval", icon: Sparkles },
  { label: "Hitta relevanta partners", icon: Search },
  { label: "Filtrera", icon: SlidersHorizontal },
  { label: "Jämför", icon: Columns3 },
  { label: "Kortlista", icon: ListChecks },
  { label: "Be om introduktion", icon: Mail },
];

/** Fire one analytics event per page load. */
function track(
  eventName: string,
  eventType: FunnelEventType,
  partnerSlug?: string | null,
  extra?: Record<string, unknown>,
) {
  trackFunnelEvent({
    event_type: eventType,
    event_name: eventName,
    metadata: { ...(partnerSlug ? { partner: partnerSlug } : {}), ...extra },
  });
}

/** Observes a section and fires a single content_view event when it becomes visible. */
function useSectionView(eventName: string, partnerSlug?: string | null) {
  const ref = useRef<HTMLDivElement | null>(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            track(eventName, "content_view", partnerSlug);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [eventName, partnerSlug]);
  return ref;
}


const Partnerprogram = () => {
  const [searchParams] = useSearchParams();
  const partnerSlug = searchParams.get("partner");
  const { data: basicPartners } = useBasicPartners();





  const matchedPartner = useMemo(() => {
    if (!partnerSlug) return null;
    const verified = VERIFIED_PARTNERS.find((p) => p.slug === partnerSlug);
    if (verified) return { name: verified.name, url: `/partner/${verified.slug}/`, verified: true };
    const basic = basicPartners?.find((p) => p.slug === partnerSlug);
    if (basic) return { name: basic.name, url: `/basic/${basic.slug}/`, verified: false };
    return null;
  }, [partnerSlug, basicPartners]);


  // Page view + scroll depth
  useEffect(() => {
    track("partnerprogram_page_view", "content_view", partnerSlug);
    let fired50 = false;
    let fired90 = false;
    const onScroll = () => {

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      if (!fired50 && pct >= 50) {
        fired50 = true;
        track("partnerprogram_scroll_50", "content_view", partnerSlug);
      }
      if (!fired90 && pct >= 90) {
        fired90 = true;
        track("partnerprogram_scroll_90", "content_view", partnerSlug);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [partnerSlug]);

  const seoRef = useSectionView("partnerprogram_seo_section_view", partnerSlug);
  const videoRef = useSectionView("partnerprogram_video_section_view", partnerSlug);

  const bookClick = (placement: string) => track("partnerprogram_book_demo_click", "cta_click", partnerSlug, { placement });
  const profileClick = (placement: string) => track("partnerprogram_view_profile_click", "cta_click", partnerSlug, { placement });
  const checkClick = (placement: string) => track("partnerprogram_profile_check_click", "cta_click", partnerSlug, { placement });

  /** Primär CTA: låg tröskel – visa nuvarande presentation i stället för att be om möte. */
  const CheckButton = ({
    placement,
    className = "",
    size = "lg",
    label = "Se hur ert företag presenteras idag",
  }: {
    placement: string;
    className?: string;
    size?: "default" | "lg" | "sm";
    label?: string;
  }) => (
    <Button asChild size={size} className={className} onClick={() => checkClick(placement)}>
      <a href="#profilkoll">
        <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
        {label}
      </a>
    </Button>
  );

  const BookButton = ({
    placement,
    className = "",
    size = "lg",
    variant = "outline",
    label = "Boka en 20-minuters genomgång",
  }: {
    placement: string;
    className?: string;
    size?: "default" | "lg" | "sm";
    variant?: "default" | "outline";
    label?: string;
  }) => (
    <ContactFormDialog buyerForm={false}>
      <Button size={size} variant={variant} className={className} onClick={() => bookClick(placement)}>
        <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
        {label}
      </Button>
    </ContactFormDialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead webPageSchema={false}
        title="Solution Partners | Priser och innehåll på d365.se"
        description="Visa er kompetens för företag som utvärderar Dynamics 365. Se priser, partnerprofiler, jämförelser och förmedling för Solution Partners på d365.se."
        canonicalPath="/partnerprogram"
        keywords="Dynamics 365 partner, partnerprofil, partnerprogram, Microsoft-partner Sverige"
      />
      <WebPageSchema
        name="Solution Partners | Priser och innehåll på d365.se"
        description="Erbjudanden, priser och innehåll för Solution Partners på d365.se."
        url="https://d365.se/partnerprogram/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs} />
      <Navbar />
      <main>

      {/* 1. HERO */}
      <header className="pt-28 pb-14 md:pt-32 md:pb-20 bg-gradient-to-b from-secondary/40 to-background border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            {matchedPartner && (
              <Badge variant="secondary" className="mb-4 text-sm">
                {matchedPartner.name} finns redan på d365.se – se hur profilen kan utvecklas
              </Badge>
            )}
            <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">
              För Solution Partners inom Dynamics&nbsp;365
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mb-5">
              Partnerprogram för Solution Partners
            </h1>
            <p className="text-lg sm:text-xl font-medium leading-snug text-foreground border-l-4 border-primary pl-5 mb-6 max-w-2xl">
              d365.se hjälper företag att hitta rätt väg framåt med Microsoft&nbsp;Dynamics&nbsp;365,
              och hjälper partners och ISV:er att komma i kontakt med företag som har relevanta behov.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#priser-innehall">Se priser och innehåll<ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></a></Button>
              <Button asChild size="lg" variant="outline" onClick={() => bookClick("hero")}>
                <a href={PARTNER_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  Boka möte med Thomas
                </a>
              </Button>
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-3 text-sm text-foreground">
              {["Bli hittad i köpresan", "Visa rätt kompetens och lösningar", "Möt företag med relevanta behov"].map((text) => (
                <li key={text} className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />{text}</li>
              ))}
            </ul>


          </div>
        </div>
      </header>

      <ProgramNavigation audience="partners" sections={programSections} />

      <section id="for-partners" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">För partners: visa när er kompetens passar</h2>
          <p className="max-w-3xl text-muted-foreground mb-6">Hjälp företag som utvärderar CRM- och affärssystem (ERP) att förstå vilka kunder, branscher och projekt ni har erfarenhet av. Er profil blir ett underlag när köparen söker, jämför och skapar sin kortlista.</p>
          <ul className="grid md:grid-cols-3 gap-5 mb-6">
            {[
              { title: "Kompetens och specialisering", text: "Produktområden, branscher och era egna beskrivningar av typiska kunder och projekt." },
              { title: "Belägg och människor", text: "Kundcase, expertprofiler, nyheter och events som visar vad ni kan bidra med." },
              { title: "En aktuell presentation", text: "Egen profileringslänk. Med Premium ingår kvartalsvis genomgång, profilstatistik och en namngiven kontaktperson." },
            ].map((item) => <li key={item.title}><h3 className="text-base font-semibold mb-2">{item.title}</h3><p className="text-sm text-muted-foreground">{item.text}</p></li>)}
          </ul>
          <div className="flex flex-wrap gap-3">
            <CheckButton placement="partner_intro" size="default" />
            <Button asChild variant="outline" onClick={() => profileClick("partner_intro")}><Link to="/valjdynamics365partner/">Se hur kunder jämför partners<ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></Link></Button>
          </div>
        </div>
      </section>

      <section id="priser-innehall" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Priser &amp; innehåll</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">Grundpublicering är kostnadsfri. Premium är en frivillig utökad presentation. Betalning ger aldrig högre placering, och verifierad status kan inte köpas.</p>
          <h3 className="text-lg font-semibold mb-4">Partners: Standard eller Premium</h3>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="border-l-2 border-border pl-5"><h4 className="font-semibold mb-2">Grundprofil, 0 kr</h4><p className="text-sm text-muted-foreground">Partnerprofil med produktområden, branscher, geografi och egna beskrivningar. Synlig i partnerväljaren, filtren och jämförelsen.</p></div>
            <div className="border-l-2 border-primary pl-5"><h4 className="font-semibold mb-2">Premium, utökad presentation</h4><p className="text-sm text-muted-foreground">Mer innehåll med kundcase, experter och möjlighet till video. Kvartalsvis genomgång, profilstatistik och namngiven kontaktperson ingår. INSIDE-produktion köps separat.</p></div>
          </div>
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full table-fixed text-sm [&_th]:px-2 [&_td]:px-2 sm:[&_th]:px-4 sm:[&_td]:px-4">
              <caption className="sr-only">Premiumpriser per produktområde, exklusive moms</caption>
              <thead className="bg-muted/50"><tr><th scope="col" className="text-left px-4 py-3">Antal områden</th><th scope="col" className="text-right px-4 py-3">Premium Månad</th><th scope="col" className="text-right px-4 py-3">Premium År <span className="block text-xs text-primary">Populärast</span></th></tr></thead>
              <tbody>{[
                ["1 produktområde", "995", "7 990"],
                ["2 produktområden", "1 295", "9 990"],
                ["3 produktområden", "1 495", "11 990"],
              ].map(([label, month, year]) => <tr key={label} className="border-t border-border"><th scope="row" className="text-left px-4 py-3 font-normal"><span className="sm:hidden">{label?.split(" ")[0]}</span><span className="hidden sm:inline">{label}</span></th><td className="text-right px-4 py-3 font-semibold"><span className="whitespace-nowrap">{month} kr</span><span className="block sm:inline text-xs font-normal"> /mån</span></td><td className="text-right px-4 py-3 font-semibold"><span className="whitespace-nowrap">{year} kr</span><span className="block sm:inline text-xs font-normal"> /år</span></td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Alla priser exklusive moms. Månad faktureras i efterskott med 3 månaders uppsägningstid, meddelad i god tid före varje kvartals början. År faktureras i förskott. CE/CRM-applikationerna räknas som ett produktområde; upp till tre branscher per område.</p>
          <div className="mt-8 max-w-4xl rounded-xl border border-border bg-secondary/30 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Informationsstatus och kommersiella avtal hålls isär</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Varje profil visar en informationsstatus: D365 Verifierad eller Automatiskt sammanställd. Statusen beskriver hur uppgifterna har kontrollerats.</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Premium ger aldrig verifieringsstatus, och information som tagits fram med AI-stöd blir aldrig automatiskt verifierad.</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Resultatbaserade förmedlingsavtal och outboundsamarbeten är separata avtal. De kan kombineras fritt med Standard eller Premium och påverkar inte vilka partners som visas eller i vilken ordning.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8 bg-secondary/30 border-y border-border"><div className="container mx-auto max-w-6xl px-4 sm:px-6"><h2 className="text-2xl font-bold mb-3">Bli hittad utan köpt placering</h2><p className="max-w-3xl text-muted-foreground">Kommersiella avtal påverkar aldrig relevansordningen eller rekommendationerna. Mer komplett information hjälper oss att bedöma när ni passar. En relevant partner kan finnas med utan ett betalt avtal.</p></div></section>
      <PartnerProfileCheck initialSlug={partnerSlug} />
      <VerifiedPartnerBadgeEmbed />
      <details id="profiljamforelse" className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 scroll-mt-64">
        <summary className="cursor-pointer text-lg font-semibold py-3 scroll-mt-64">Se skillnaden mellan profiler och följ kundens köpresa</summary>
      {/* 2b. BENCHMARK: Basic vs profilerad referensprofil */}
      <PartnerProgramBenchmark
        partnerSlug={partnerSlug}
        renderBookCta={(onClick) => (
          <ContactFormDialog buyerForm={false}
            title="Ansök om en egen profileringslänk"
            description="Fyll i era kontaktuppgifter så skickar vi en profileringslänk där ni kan uppdatera er partnerprofil på d365.se."
            subject="Profileringslänk"
          >
            <Button
              size="lg"
              onClick={() => {
                onClick();
                bookClick("benchmark");
              }}
            >
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              Ansök om en egen profileringslänk
            </Button>
          </ContactFormDialog>
        )}
      />

      {/* 3. KÖPRESAN */}

      <section className="py-14 md:py-20 bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Var i köpresan kommer d365.se in?
          </h2>
          <ol className="flex flex-col md:flex-row md:items-stretch gap-3">
            {journeySteps.map((s, i) => (
              <li key={s.label} className="flex md:flex-col md:flex-1 items-center gap-3">
                <div className="flex-1 w-full rounded-lg border border-border bg-card p-4 text-center">
                  <s.icon className="w-5 h-5 text-accent mx-auto mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                </div>
                {i < journeySteps.length - 1 && (
                  <ArrowRight
                    className="w-4 h-4 text-muted-foreground shrink-0 rotate-90 md:rotate-0 md:hidden"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-base md:text-lg text-foreground font-medium border-l-4 border-primary pl-4">
            Er egen webbplats är viktig när kunden redan känner till er. d365.se har en annan roll: att
            hjälpa företag som fortfarande försöker förstå vilka partners som är relevanta.
          </p>
        </div>
      </section>


      </details>

      <section id="expertinnehall" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Fördjupning om synlighet och expertinnehåll</h2>
          <Accordion type="multiple">
            <AccordionItem value="synlighet">
              <AccordionTrigger>Hur kan er profil bidra till sök- och AI-synlighet?</AccordionTrigger>
              <AccordionContent><div ref={seoRef} className="max-w-3xl space-y-3 text-muted-foreground">
                <p>En indexerbar profil med tydliga produktområden, branscher, kundcase och expertinnehåll ger sökmotorer och AI-tjänster ytterligare en källa om er verksamhet. Era egna beskrivningar av kunder och projekt är grunden.</p>
                <p>d365.se garanterar inte sökplaceringar, AI-citeringar eller leadvolymer. Värdet är ett mer komplett och kontrollerbart underlag för företag som utvärderar lösningar och partners.</p>
              </div></AccordionContent>
            </AccordionItem>
            <AccordionItem value="inside">
              <AccordionTrigger>Vad innebär d365.se INSIDE?</AccordionTrigger>
              <AccordionContent><div ref={videoRef} className="max-w-3xl space-y-3 text-muted-foreground">
                <p>En redaktionell intervju med era experter om specialisering, kundbehov och erfarenheter. Den kan publiceras på d365.se, på partnerprofilen och på YouTube, med sammanfattning och expertcitat.</p>
                <p>Produktion och distribution kostar 4&nbsp;900 kr för verifierade partners med Premium och 8&nbsp;900 kr för övriga, exklusive moms. Redaktionellt ansvar ligger hos d365.se; betalning köper inte en viss slutsats.</p>
              </div></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 8c. KVALIFICERADE AFFÄRSMÖJLIGHETER (Thomas 2026-11-04) */}
      <section id="affarsmojligheter" className="scroll-mt-64 py-10 md:py-14 bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Möten &amp; Affärsmöjligheter
          </h2>
          <div className="max-w-3xl space-y-3 text-muted-foreground mb-8">
            <p>
              d365.se hjälper köpare att definiera sina behov och hitta relevanta lösningar och
              leveranspartners. När vi identifierar ett konkret projekt med en tydlig avsikt att gå vidare
              kan det erbjudas som en kvalificerad affärsmöjlighet.
            </p>
            <p className="text-foreground font-medium border-l-4 border-primary pl-4">
              Partnern får bedöma möjligheten och acceptera de kommersiella villkoren innan introduktionen
              genomförs.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-3">Ersättning</h3>
          <div className="max-w-4xl overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="text-left font-semibold text-foreground px-4 py-3">Affärstyp</th>
                  <th scope="col" className="text-right font-semibold text-foreground px-4 py-3">Genomfört kundmöte<br /><span className="text-xs font-normal">Gäller endast partners med grundprofil</span></th>
                  <th scope="col" className="text-right font-semibold text-foreground px-4 py-3">Kundavtal tecknat</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <th scope="row" className="text-left font-normal text-foreground px-4 py-3">
                    Business Central, Customer Engagement, Power Platform och andra lösningar
                  </th>
                  <td className="text-right px-4 py-3 whitespace-nowrap font-semibold text-foreground">3&nbsp;500&nbsp;kr</td>
                  <td className="text-right px-4 py-3 whitespace-nowrap font-semibold text-foreground">5&nbsp;000&nbsp;kr</td>
                </tr>
                <tr className="border-t border-border">
                  <th scope="row" className="text-left font-normal text-foreground px-4 py-3">
                    Finance &amp; Supply Chain Management
                  </th>
                  <td className="text-right px-4 py-3 whitespace-nowrap font-semibold text-foreground">5&nbsp;000&nbsp;kr</td>
                  <td className="text-right px-4 py-3 whitespace-nowrap font-semibold text-foreground">10&nbsp;000&nbsp;kr</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="max-w-3xl mt-5 space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Mötesavgift: Gäller endast partners med grundprofil.</strong> Premiumpartners betalar ingen mötesavgift. För grundprofiler avräknas den betalda mötesavgiften från avtalsersättningen. För Premium gäller hela avtalsersättningen vid tecknat avtal. Alla belopp anges exklusive moms.</p>
            <p>
              För affärer där partnerns konsult- och projektintäkter överstiger 100&nbsp;000 kronor utgår även
              en success fee på 2,5 procent av intäkterna från den första kronan under de första nio
              månaderna från projektstart.
            </p>
            <p>
              Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår
              inte i beräkningsunderlaget. Fullständiga villkor regleras i partner- och förmedlingsavtalet.
            </p>
          </div>

          <div className="mt-8 max-w-4xl">
            <h3 className="text-lg font-semibold text-foreground mb-3">Förmedling av Expertkonsulter</h3>
            <p className="max-w-3xl text-sm text-muted-foreground mb-4">
              Vi förmedlar en eller flera expertkonsulter till partnern utifrån kundens behov.
              Partnern tecknar kundavtalet, debiterar kunden och har leveransansvaret.
              Ersättningen för förmedlingen är en fast avgift per debiterad experttimme.
            </p>
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="text-left font-semibold text-foreground px-4 py-3">Partnernivå</th>
                    <th scope="col" className="text-right font-semibold text-foreground px-4 py-3">Avgift per debiterad experttimme</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <th scope="row" className="text-left font-normal text-foreground px-4 py-3">Premium</th>
                    <td className="text-right px-4 py-3 whitespace-nowrap font-semibold text-foreground">40&nbsp;kr</td>
                  </tr>
                  <tr className="border-t border-border">
                    <th scope="row" className="text-left font-normal text-foreground px-4 py-3">Grundprofil</th>
                    <td className="text-right px-4 py-3 whitespace-nowrap font-semibold text-foreground">80&nbsp;kr</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="max-w-3xl mt-4 text-sm text-muted-foreground">
              Avgiften beräknas på faktiskt debiterade timmar, exklusive moms. Villkoren avtalas skriftligt
              före uppdragsstart. Expertförmedlingen hålls separat från projektförmedling och ersättningen
              dubbelräknas inte med mötesavgift, avtalsersättning eller success fee för samma expertuppdrag.
            </p>
          </div>

          <div className="mt-8 max-w-3xl rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Köparens behov styr rekommendationerna</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kommersiella avtal och partnernivå påverkar aldrig vilka lösningar eller partners som bedöms
              vara relevanta för köparen. Matchningen utgår alltid från köparens behov och projektets
              förutsättningar.
            </p>
          </div>

          <div className="mt-8">
            <ContactFormDialog
              buyerForm={false}
              title="Ansök om att ta emot affärsmöjligheter"
              description="Fyll i era kontaktuppgifter så återkommer vi med partner- och förmedlingsavtalet och hur kvalificerade affärsmöjligheter går till."
              subject="Ansökan: kvalificerade affärsmöjligheter"
            >
              <Button size="lg" onClick={() => bookClick("affarsmojligheter")}>
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                Ansök om att ta emot affärsmöjligheter
              </Button>
            </ContactFormDialog>
          </div>
        </div>
      </section>

      {/* 9. SÅ FUNGERAR DET */}
      <section id="kom-igang" className="py-14 md:py-20 bg-secondary/30 border-y border-border scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Enkelt att komma igång</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Vi tar fram ett första underlag",
                d: "d365.se utgår från information som redan finns på er webbplats, publika källor och det material ni skickar till oss.",
              },
              {
                n: "2",
                t: "Ni verifierar och kompletterar",
                d: "Ni säkerställer att produkter, kompetenser, branscher, kundtyper, case och kontaktinformation är korrekta.",
              },
              {
                n: "3",
                t: "Vi publicerar och utvecklar profilen",
                d: "Nya profiler granskas av d365.se innan de publiceras. Därefter syns verifierade partners egna ändringar direkt. Profilen kan kompletteras med expertintervju, video och ytterligare innehåll.",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-6">
                <span className="inline-flex w-8 h-8 rounded-full bg-primary text-primary-foreground items-center justify-center font-bold mb-3">
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-foreground mt-10 mb-4">Vad vi åtar oss</h3>
          <ul className="grid gap-3 md:grid-cols-2 max-w-4xl">
            {[
              "Publicering inom 10 arbetsdagar från att underlaget är komplett",
              "Verifierade partners ändringar i profilen syns direkt",
              "Kvartalsvis genomgång av profilen tillsammans med er",
              "Statistik över profilvisningar",
              "En namngiven kontaktperson på d365.se",
            ].map((i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <CheckButton placement="process" />
            <BookButton placement="process" label="Boka en genomgång" />
          </div>
        </div>
      </section>

      {/* 10. SOCIAL PROOF */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Partners med partnerverifierad profil på d365.se
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            {VERIFIED_PARTNERS.length} Dynamics&nbsp;365-partners har idag en partnerverifierad profil där
            kompetens, branscherfarenhet och kundcase är verifierade av partnern själv och publicerade.
          </p>
          <ul className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {VERIFIED_PARTNERS.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/partner/${p.slug}/`}
                  onClick={() => profileClick("social_proof")}
                  className="h-full flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-3 hover:border-accent/60 transition-colors"
                >
                  <BadgeCheck className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground leading-tight">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
            d365.se utvecklar successivt mer statistik kring hur partners hittas och jämförs.
          </p>
        </div>
      </section>


      {/* 12. FAQ */}
      <section id="vanliga-fragor" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Vanliga frågor</h2>
          <Accordion
            type="single"
            collapsible
            className="max-w-3xl"
            onValueChange={(v) => {
              if (v) track("partnerprogram_faq_open", "content_view", partnerSlug, { question: v });
            }}
          >
            {faqs.map((f) => (
              <AccordionItem key={f.question} value={f.question}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-secondary/30 border-t border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Vilken närvaro passar ert företag?</h2>
          <p className="text-muted-foreground max-w-3xl mb-6">Vi går gärna igenom er partnerprofil och hjälper er att förstå vad som ingår.</p>
          <BookButton placement="footer" variant="default" label="Prata med oss om er närvaro" />
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Partnerprogram;
