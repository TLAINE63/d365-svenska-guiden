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
import PartnerOrderDialog from "@/components/PartnerOrderDialog";
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
  { id: "priser-innehall", label: "Premium partner - Prislista" },
  { id: "profilkoll", label: "Er partnerprofil" },
  { id: "profiljamforelse", label: "Jämförelser" },
  { id: "expertinnehall", label: "Synlighet & INSIDE" },
  { id: "affarsmojligheter", label: "Finders Fee" },
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
      "En redaktionell intervju (d365.se INSIDE) med en eller flera av partnerns experter som kan publiceras på d365.se och YouTube och användas som innehåll på partnerprofilen. INSIDE gäller endast partners med Premium. Intervju och produktion kostar 4 900 kr, exklusive moms. Redaktionellt ansvar ligger hos d365.se.",
  },
  {
    question: "Kostar det att publiceras på d365.se?",
    answer:
      "Nej. En relevant Dynamics 365-partner kan finnas med med en kostnadsfri Grundprofil. Premium inkluderar fördjupad presentation, redaktionell granskning inför verifiering, kvartalsvis genomgång, profilstatistik och namngiven kontaktperson. Efter redaktionens godkännande får profilen märket Verifierad partner, verifierad av d365.se-redaktionen. Premium kostar 995 kr/månad för 1 produktområde, 1 295 kr för 2 och 1 495 kr för 3 (CE/CRM-applikationerna räknas som ett produktområde), exklusive moms. Premium År ger samma innehåll med årsvis betalning i förskott: 7 990 kr per år för ett produktområde, 9 990 kr för två och 11 990 kr för tre, exklusive moms. Betalning ger varken automatisk verifiering eller högre relevansordning.",
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
              För partners och ISV:er inom Dynamics&nbsp;365
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mb-5">
              Var med när kunderna väljer Dynamics&nbsp;365
            </h1>
            <p className="text-lg sm:text-xl font-medium leading-snug text-foreground border-l-4 border-primary pl-5 mb-6 max-w-2xl">
              d365.se hjälper företag genom olika delar av sin köpresa, från tidig orientering och utvärdering till val av lösning och partner. Genom vårt partnerprogram får Dynamics&nbsp;365-partners och ISV:er möjlighet att synas och vara relevanta när potentiella kunder söker information, jämför alternativ och planerar sina nästa steg.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#priser-innehall">Se prislistan<ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></a></Button>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Prislista</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">Ett upplägg för alla partners: Premium partner tillsammans med ett Finders Fee-avtal. Alla priser står i prislistan nedan. Betalning ger aldrig högre placering eller automatisk verifiering.</p>
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <div className="rounded-xl border-2 border-primary bg-card p-6">
              <h3 className="text-xl font-bold mb-3">Premium partner - Prislista</h3>
              <p className="text-sm text-muted-foreground mb-4">Kräver ett Finders Fee-avtal. Alla priser exklusive moms.</p>
              <div className="rounded-lg bg-secondary/40 p-4 mb-5 text-sm text-muted-foreground space-y-2">
                <h4 className="font-semibold text-foreground">Vad innebär det att vara Premiumpartner?</h4>
                <p>Som Premiumpartner får ni en fördjupad profil där köpare kan se vilka kunder, branscher och projekt ni har erfarenhet av, med kundcase, experter och möjlighet till video.</p>
                <p><strong className="font-semibold text-foreground">Vi verifierar uppgifterna.</strong> Innan profilen får märket Verifierad partner går d365.se-redaktionen igenom produktområden, branscher, kundcase och experter och stämmer av dem med er. Först när uppgifterna håller publiceras märket. Betalningen i sig ger aldrig verifiering.</p>
                <p>Därefter följer vi upp tillsammans varje kvartal, med profilstatistik och en namngiven kontaktperson hos oss.</p>
              </div>
              <h4 className="font-semibold mb-2">Det här ingår</h4>
              <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Redaktionell granskning och märket Verifierad partner, verifierad av d365.se-redaktionen, efter godkännande.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Fördjupad profil med kundcase, experter och möjlighet till video.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Kvartalsvis genomgång, profilstatistik och namngiven kontaktperson.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />Ingen mötesavgift vid förmedlade kundmöten.</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />INSIDE är endast för Premiumpartners och köps separat (4&nbsp;900&nbsp;kr, exklusive moms).</li>
              </ul>
              <div className="overflow-x-auto border border-border rounded-lg mb-3">
                <table className="w-full text-sm">
                  <caption className="sr-only">Premiumpriser per produktområde, exklusive moms</caption>
                  <thead className="bg-muted/50"><tr><th scope="col" className="text-left px-3 py-2">Områden</th><th scope="col" className="text-right px-3 py-2">Månad</th><th scope="col" className="text-right px-3 py-2">År <span className="block text-xs text-primary">Populärast</span></th></tr></thead>
                  <tbody>
                    <tr className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">1</th><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">995&nbsp;kr/mån</td><td className="text-right px-3 py-2 font-semibold"><span className="whitespace-nowrap">7&nbsp;990&nbsp;kr/år</span><span className="block text-xs font-normal text-muted-foreground">Spara <span className="whitespace-nowrap">3&nbsp;950&nbsp;kr</span> (33&nbsp;%)</span></td></tr>
                    <tr className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">2</th><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">1&nbsp;295&nbsp;kr/mån</td><td className="text-right px-3 py-2 font-semibold"><span className="whitespace-nowrap">9&nbsp;990&nbsp;kr/år</span><span className="block text-xs font-normal text-muted-foreground">Spara <span className="whitespace-nowrap">5&nbsp;550&nbsp;kr</span> (36&nbsp;%)</span></td></tr>
                    <tr className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">3</th><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">1&nbsp;495&nbsp;kr/mån</td><td className="text-right px-3 py-2 font-semibold"><span className="whitespace-nowrap">11&nbsp;990&nbsp;kr/år</span><span className="block text-xs font-normal text-muted-foreground">Spara <span className="whitespace-nowrap">5&nbsp;950&nbsp;kr</span> (33&nbsp;%)</span></td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mb-5">Prislista 2027, gäller från 2026-11-10. Månad faktureras i efterskott med 3 månaders uppsägningstid, meddelad i god tid före varje kvartals början. År faktureras i förskott. CE/CRM-applikationerna räknas som ett produktområde; upp till tre branscher per område.</p>
              <h4 className="font-semibold mb-2">Finders Fee: ersättning vid tecknat kundavtal</h4>
              <div className="overflow-x-auto border border-border rounded-lg mb-3">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50"><tr><th scope="col" className="text-left px-3 py-2">Affärstyp</th><th scope="col" className="text-right px-3 py-2">Kundavtal tecknat</th><th scope="col" className="text-right px-3 py-2">Success fee*</th></tr></thead>
                  <tbody>
                    <tr className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">Business Central, Customer Engagement, Power Platform och andra lösningar</th><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">5&nbsp;000&nbsp;kr</td><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">2,5&nbsp;%</td></tr>
                    <tr className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">Finance &amp; Supply Chain Management</th><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">10&nbsp;000&nbsp;kr</td><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">2,5&nbsp;%</td></tr>
                    <tr className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">Förmedling av expertkonsulter</th><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">50&nbsp;kr/timme</td><td className="text-right px-3 py-2 text-muted-foreground">–</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground mb-5">
                <p>*För affärer där partnerns konsult- och projektintäkter överstiger 100&nbsp;000 kronor utgår även en <strong className="font-semibold text-foreground">success fee på 2,5 procent av intäkterna</strong> från första kronan under de första nio månaderna från projektstart.</p>
                <p>Expertavgiften gäller faktiskt debiterade timmar; partnern tecknar kundavtalet, debiterar kunden och har leveransansvaret. Den dubbelräknas inte med avtalsersättning eller success fee för samma uppdrag.</p>
                <p>Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte. Alla belopp exklusive moms. Fullständiga villkor regleras i partner- och förmedlingsavtalet.</p>
              </div>
              <h4 className="font-semibold mb-2">Processen</h4>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground mb-5">
                <li>Ni beställer Premium och tecknar Finders Fee-avtalet.</li>
                <li>Ni kompletterar profilen med produktområden, branscher, kundcase och experter.</li>
                <li>Redaktionen granskar uppgifterna och beslutar om verifiering.</li>
                <li>Profilen publiceras med märket Verifierad partner.</li>
                <li>Löpande profilstatistik och kvartalsvis genomgång.</li>
              </ol>
              <PartnerOrderDialog />
            </div>
            <div id="affarsmojligheter" className="rounded-xl border border-border bg-card p-6 scroll-mt-64">
              <h3 className="text-xl font-bold mb-3">Finders Fee</h3>
              <p className="text-sm text-muted-foreground mb-4">När vi identifierar ett konkret projekt med tydlig avsikt att gå vidare kan det erbjudas som en kvalificerad affärsmöjlighet. Partnern bedömer möjligheten och accepterar villkoren innan introduktionen.</p>
              <h4 className="font-semibold mb-2">Processen</h4>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground mb-5">
                <li>Köparen definierar sitt behov med d365.se.</li>
                <li>Vi presenterar en kvalificerad affärsmöjlighet för relevanta partners.</li>
                <li>Partnern bedömer möjligheten och accepterar villkoren.</li>
                <li>Introduktion och kundmöte genomförs, med köparens samtycke.</li>
                <li>Ersättning faktureras när kundavtal tecknats.</li>
              </ol>
              <ContactFormDialog
                buyerForm={false}
                title="Begär Finders Fee-avtal"
                description="Fyll i era kontaktuppgifter så skickar vi partner- och förmedlingsavtalet."
                subject="Ansökan: Finders Fee-avtal"
              >
                <Button size="lg" variant="outline" onClick={() => bookClick("affarsmojligheter")}>
                  <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                  Begär Finders Fee-avtal
                </Button>
              </ContactFormDialog>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-sm text-muted-foreground">Kommersiella avtal påverkar aldrig vilka lösningar eller partners som bedöms relevanta för köparen. Verifiering beslutas manuellt av d365.se-redaktionen, aldrig automatiskt genom betalning.</p>
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
                <p>INSIDE gäller endast partners med Premium. Produktion och distribution kostar 4&nbsp;900 kr, exklusive moms. Redaktionellt ansvar ligger hos d365.se; betalning köper inte en viss slutsats.</p>
              </div></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

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
                d: "Nya profiler granskas av d365.se innan de publiceras. Därefter syns verifierade partners egna ändringar direkt. För Premiumpartners kan profilen kompletteras med expertintervju i d365.se INSIDE.",
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
