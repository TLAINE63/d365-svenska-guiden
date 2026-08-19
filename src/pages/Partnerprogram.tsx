import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Check,
  Minus,
  Search,
  SlidersHorizontal,
  Columns3,
  ListChecks,
  Mail,
  Eye,
  BadgeCheck,
  Video,
  FileText,
  Users,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

import partnerData from "@/data/partnerData.json";

type SimplePartner = { slug: string; name: string; is_featured: boolean; logo_url?: string | null };

const VERIFIED_PARTNERS = (partnerData as SimplePartner[]).filter((p) => p.is_featured);
const IDENTIFIED_PARTNER_FLOOR = 83;

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se/" },
  { name: "För partners", url: "https://d365.se/partnerprogram/" },
];

const faqs = [
  {
    question: "Finns vi på d365.se även om vi inte profilerar oss?",
    answer:
      "Ja. Ambitionen är att kartlägga den relevanta svenska Dynamics 365-partnermarknaden. Skillnaden är hur mycket information som finns tillgänglig om respektive partner.",
  },
  {
    question: "Påverkar profilering vår ranking?",
    answer:
      "Nej. Matchning baseras på relevans och köparens kriterier, inte på betalning.",
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
      "En redaktionell intervju med en eller flera av partnerns experter som kan publiceras på d365.se och YouTube och användas som innehåll på partnerprofilen.",
  },
];

const comparisonRows: { label: string; basic: string; profiled: string }[] = [
  { label: "Finns med på d365.se", basic: "Ja", profiled: "Ja" },
  { label: "Grundläggande partnerinformation", basic: "Ja", profiled: "Ja" },
  { label: "Detaljerad kompetensprofil", basic: "Begränsad", profiled: "Ja" },
  { label: "Branscher och målgrupper", basic: "Begränsat", profiled: "Ja" },
  { label: "Kundcase och referenser", basic: "Begränsat", profiled: "Ja" },
  { label: "Erbjudanden och specialisering", basic: "–", profiled: "Ja" },
  { label: "Namngiven kontaktperson", basic: "–", profiled: "Ja" },
  { label: "Kontaktvägar och CTA", basic: "–", profiled: "Ja" },
  { label: "Expertintervju / video", basic: "–", profiled: "Ja" },
  { label: "Publicering på YouTube", basic: "–", profiled: "Ja" },
  { label: "Utökad indexerbar partnerprofil", basic: "Begränsad", profiled: "Ja" },
  { label: "Möjlighet att verifiera information", basic: "–", profiled: "Ja" },
];

const journeySteps = [
  { label: "Behov / systemval", icon: Sparkles },
  { label: "Hitta relevanta partners", icon: Search },
  { label: "Filtrera", icon: SlidersHorizontal },
  { label: "Jämför", icon: Columns3 },
  { label: "Shortlist", icon: ListChecks },
  { label: "Kontakta partner", icon: Mail },
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
  const [showSticky, setShowSticky] = useState(false);

  const identifiedCount = useMemo(() => {
    const total = VERIFIED_PARTNERS.length + (basicPartners?.length ?? 0);
    return Math.max(IDENTIFIED_PARTNER_FLOOR, total);
  }, [basicPartners]);

  const matchedPartner = useMemo(() => {
    if (!partnerSlug) return null;
    const verified = VERIFIED_PARTNERS.find((p) => p.slug === partnerSlug);
    if (verified) return { name: verified.name, url: `/partner/${verified.slug}/`, verified: true };
    const basic = basicPartners?.find((p) => p.slug === partnerSlug);
    if (basic) return { name: basic.name, url: `/basic/${basic.slug}/`, verified: false };
    return null;
  }, [partnerSlug, basicPartners]);

  const profileExampleUrl = "/partner/knowit/";
  const secondaryProfileUrl = matchedPartner?.url ?? "/valjdynamics365partner/";

  // Page view + scroll depth
  useEffect(() => {
    track("partnerprogram_page_view", "content_view", partnerSlug);
    let fired50 = false;
    let fired90 = false;
    const onScroll = () => {
      setShowSticky(window.scrollY > 700);
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

  const compareRef = useSectionView("partnerprogram_basic_vs_profiled_view", partnerSlug);
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
    <ContactFormDialog>
      <Button size={size} variant={variant} className={className} onClick={() => bookClick(placement)}>
        <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
        {label}
      </Button>
    </ContactFormDialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead webPageSchema={false}
        title="För Dynamics 365-partners | Profilera er på d365.se"
        description="d365.se kartlägger Sveriges Dynamics 365-partners. Se hur en profilerad partnerprofil stärker er synlighet när kunder jämför och väljer partner."
        canonicalPath="/partnerprogram"
        keywords="Dynamics 365 partner, partnerprofil, partnerprogram, Microsoft-partner Sverige"
      />
      <WebPageSchema
        name="För Dynamics 365-partners | Profilera er på d365.se"
        description="Hur svenska Dynamics 365-partners kan verifiera och utveckla sin profil på d365.se."
        url="https://d365.se/partnerprogram/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs} />
      <Navbar />

      {/* 1. HERO */}
      <header className="pt-28 pb-14 md:pt-32 md:pb-20 bg-gradient-to-b from-secondary/40 to-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            {matchedPartner && (
              <Badge variant="secondary" className="mb-4 text-sm">
                {matchedPartner.name} finns redan på d365.se – se hur profilen kan utvecklas
              </Badge>
            )}
            <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">
              För Dynamics 365-partners
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mb-5">
              Ni finns redan på d365.se.
              <br />
              Se till att kunder och AI förstår er kompetens.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-7">
              d365.se hjälper företag att hitta och jämföra Dynamics 365-partners i Sverige. Med en
              verifierad partnerprofil kan ni säkerställa att er kompetens, specialiseringar,
              kundreferenser och erbjudanden presenteras korrekt, aktuellt och tydligt.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CheckButton placement="hero" />
              <Button asChild variant="outline" size="lg" onClick={() => profileClick("hero")}>
                <Link to={profileExampleUrl}>
                  Jämför med en verifierad partner
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-5 max-w-2xl">
              Alla relevanta partners finns med i kartläggningen. Rekommendationer baseras på köparens
              behov och relevans – verifierade partners kan komplettera sin profil med mer information,
              men betalning påverkar inte rankingen.
            </p>
            <div className="mt-5 flex flex-col gap-2 max-w-2xl">
              <p className="text-sm font-medium text-foreground border-l-4 border-primary pl-3">
                För att inkluderas i årets Partneröversikt behöver profilen vara verifierad senast
                14 november.
              </p>
              <p className="text-sm text-muted-foreground border-l-4 border-border pl-3">
                Partnerprofiler kommer även att kunna exponeras på den norska versionen av
                plattformen.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-lg border border-border bg-card px-4 py-3">
                <div className="text-2xl font-bold text-foreground">{identifiedCount}+</div>
                <div className="text-xs text-muted-foreground">
                  identifierade Dynamics 365-partners i Sverige
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card px-4 py-3">
                <div className="text-2xl font-bold text-foreground">{VERIFIED_PARTNERS.length}</div>
                <div className="text-xs text-muted-foreground">verifierade partnerprofiler</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. RISK ATT BLI BORTVALD */}
      <section className="py-14 md:py-20 bg-slate-900 text-slate-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Vad riskerar ni med att avvakta?</h2>
            <p className="text-slate-300 mb-8">
              Potentiella kunder kan redan hitta och jämföra ert företag på d365.se. Med en
              Basic-profil är beslutsunderlaget om er begränsat, samtidigt som profilerade konkurrenter
              kan visa sin specialisering, sina kundcase, sina experter och en tydlig väg till kontakt.
            </p>
            <p className="text-lg md:text-2xl font-semibold leading-snug border-l-4 border-primary pl-5 mb-8">
              Den största risken är inte att missa ett klick – utan att bli bortvald från en shortlist
              utan att veta att affärsmöjligheten fanns.
            </p>
            <Button asChild size="lg" onClick={() => checkClick("risk")}>
              <a href="#profilkoll">
                <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                Se hur ert företag presenteras idag
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. PROFILKOLL */}
      <PartnerProfileCheck initialSlug={partnerSlug} />

      {/* 4. FYRA HUVUDVÄRDEN */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Varför profilera er?</h2>
          <p className="text-base text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            En verifierad partnerprofil hjälper företag, sökmotorer och AI-tjänster att förstå er
            verksamhet, era specialistområden, er branscherfarenhet, era kundsegment och vilka Dynamics
            365-lösningar ni arbetar med – Business Central, Finance, Supply Chain Management, Customer
            Engagement (Sales, Customer Service), Power Platform och Copilot.
          </p>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Search,
                title: "Bli hittad",
                text: "Skapa fler relevanta digitala ytor där potentiella kunder kan upptäcka er – via partnerprofil, sök, filtrering, innehåll och video.",
              },
              {
                icon: BadgeCheck,
                title: "Bli rätt förstådd",
                text: "Verifiera själva vilka Dynamics 365-produkter, branscher, kundtyper och projekt ni faktiskt är bäst lämpade för.",
              },
              {
                icon: Columns3,
                title: "Bli vald",
                text: "Ge köparen ett betydligt bättre beslutsunderlag när ni jämförs sida vid sida med andra Dynamics 365-partners.",
              },
              {
                icon: Sparkles,
                title: "Stärk digital synlighet",
                text: "En unik, indexerbar tredjepartsprofil med expertinnehåll, kundcase och video ger Google och AI-tjänster mer relevant information om vilka ni är och när ni är relevanta.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <v.icon className="w-6 h-6 text-accent mb-3" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2b. BENCHMARK: Basic vs profilerad referensprofil */}
      <PartnerProgramBenchmark
        partnerSlug={partnerSlug}
        renderBookCta={(onClick) => (
          <ContactFormDialog>
            <Button
              size="lg"
              onClick={() => {
                onClick();
                bookClick("benchmark");
              }}
            >
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              Boka en 20 min partnergenomgång
            </Button>
          </ContactFormDialog>
        )}
      />

      {/* 3. KÖPRESAN */}

      <section className="py-14 md:py-20 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
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


      {/* 6. SEO + AI-SÖK */}
      <section ref={seoRef} className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
            Bygg fler relevanta signaler för sökmotorer och AI
          </h2>
          <p className="max-w-3xl text-muted-foreground mb-8">
            På er egen webbplats berättar ni själva vilka ni är. En profilerad närvaro på d365.se skapar
            ytterligare en extern, indexerbar källa i ett sammanhang helt fokuserat på Dynamics 365 –
            Business Central, Finance, Supply Chain Management, Customer Engagement (Sales, Customer
            Service, Field Service), Power Platform och Copilot.
          </p>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileText,
                title: "Partnerprofil",
                text: "Strukturerad information om produkter (Business Central, Finance, Supply Chain Management, Sales, Customer Service), branscherfarenhet, kundtyper och erbjudande.",
              },
              {
                icon: Users,
                title: "Expertinnehåll",
                text: "Förstahandsinformation och perspektiv från partnerns egna specialister inom ERP, CRM, Power Platform och Copilot.",
              },
              {
                icon: BadgeCheck,
                title: "Kundcase",
                text: "Konkreta exempel som hjälper både människor och söksystem att förstå er branscherfarenhet.",
              },

              {
                icon: Video,
                title: "Video",
                text: "Intervju publicerad på d365.se och d365.se:s YouTube-kanal, gärna tillsammans med sammanfattning eller transkription.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-card p-6">
                <c.icon className="w-6 h-6 text-accent mb-3" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-border bg-muted/40 p-5 max-w-3xl">
            <p className="text-sm text-muted-foreground">
              Google rekommenderar fortsatt högkvalitativt, unikt och användbart innehåll även för
              synlighet i generativa AI-sökresultat. d365.se lovar inte ranking eller AI-citeringar –
              men en komplett faktabaserad tredjepartsprofil skapar bättre förutsättningar att bli
              hittad och förstådd.
            </p>
          </div>
        </div>
      </section>

      {/* 6b. HUR AI ANVÄNDER PARTNERPROFILEN */}
      <section className="py-14 md:py-20 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
            Hur använder AI er partnerprofil?
          </h2>
          <div className="max-w-3xl space-y-4 text-muted-foreground">
            <p>
              AI-baserade söktjänster som Microsoft Copilot, ChatGPT, Gemini och Google AI använder
              innehållet på webbplatser för att förstå företags kompetenser, branscherfarenhet,
              specialistområden och kundsegment.
            </p>
            <p>
              En verifierad partnerprofil ger mer strukturerad information om produkter, branscher,
              kundtyper, erbjudanden och kundcase, vilket kan göra det enklare för AI-system att förstå
              när er verksamhet är relevant.
            </p>
            <p>
              I praktiken handlar det om frågor som ”vilken Dynamics 365-partner i Sverige har erfarenhet
              av Business Central inom tillverkning?”, ”vem arbetar med Finance och Supply Chain
              Management för grossister?” eller ”vilka partners kan Customer Engagement med Sales och
              Customer Service samt Power Platform och Copilot?”. Ju tydligare produkter, branscherfarenhet
              och kundcase beskrivs, desto större är chansen att era styrkor kommer med i svaret.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3 mt-8">
            {[
              {
                t: "Produkter",
                d: "Business Central, Finance, Supply Chain Management, Sales, Customer Service, Field Service, Power Platform och Copilot – namngivna, inte underförstådda.",
              },
              {
                t: "Branscherfarenhet",
                d: "Vilka branscher ni faktiskt levererat i, och vilken typ av verksamhet lösningarna stöttat.",
              },
              {
                t: "Kundsegment och case",
                d: "Storlek, komplexitet och konkreta kundexempel som gör bedömningen kontrollerbar.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{c.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
            d365.se kan inte lova att en profil citeras av en AI-tjänst. Men strukturerad, faktabaserad
            och verifierad information är en förutsättning för att bli korrekt förstådd.
          </p>
        </div>
      </section>


      {/* 7. VIDEOPROFIL */}
      <section ref={videoRef} className="py-14 md:py-20 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
              Låt era experter komma fram
            </h2>
            <p className="text-muted-foreground mb-6">
              Som profilerad partner kan ni medverka i en redaktionell intervju där vi fokuserar på er
              specialisering, marknadssyn och vilka typer av kunder och projekt ni passar bäst för.
            </p>
            <h3 className="text-base font-semibold text-foreground mb-3">Exempel på frågor</h3>
            <ul className="space-y-2">
              {[
                "Vad är ni riktigt bra på?",
                "Vilka typer av projekt passar er bäst?",
                "Vad bör en köpare tänka på innan ett Dynamics 365-projekt?",
                "När skulle ni rekommendera en annan lösning eller partner?",
                "Vilka förändringar ser ni på marknaden?",
              ].map((q) => (
                <li key={q} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-accent" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-foreground">Intervjun kan användas som</h3>
            </div>
            <ul className="space-y-2">
              {[
                "video på partnerprofilen",
                "publicering på d365.se",
                "YouTube-video",
                "textbaserad sammanfattning",
                "expertcitat",
                "framtida artiklar och guider där partnerns specialistkompetens är relevant",
              ].map((u) => (
                <li key={u} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* 9. SÅ FUNGERAR DET */}
      <section className="py-14 md:py-20 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
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
                d: "Profilen publiceras på d365.se och kan kompletteras med expertintervju, video och ytterligare innehåll.",
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
              "Uppdateringar av er profil genomförs inom 3 arbetsdagar",
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
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Partners med verifierad profil på d365.se
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            {VERIFIED_PARTNERS.length} Dynamics 365-partners har idag en verifierad profil där
            kompetens, branscherfarenhet och kundcase är granskade och publicerade.
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


      {/* 11. TRANSPARENS */}
      <section className="py-14 md:py-20 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
              Köparsidig – inte pay-to-rank
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                d365.se säljer inte Dynamics 365 och representerar inte en enskild systemleverantör
                eller konsultpartner.
              </p>
              <p>Alla relevanta svenska Dynamics 365-partners finns med på plattformen.</p>
              <p>Partners vi samarbetar med kan presentera sin verksamhet betydligt mer utförligt.</p>
              <p>
                Matchning och rekommendationer baseras på relevans för köparens behov – inte på köpt
                ranking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
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

      {/* 13. SLUT-CTA */}
      <section className="py-16 md:py-24 bg-slate-900 text-slate-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-5">
              Hur ser ert företag ut när en kund jämför er med konkurrenterna?
            </h2>
            <p className="text-slate-300 mb-8">
              {matchedPartner
                ? `${matchedPartner.name} finns redan på d365.se. Vi visar gärna hur er nuvarande profil ser ut och hur en profilerad närvaro skulle kunna utvecklas.`
                : "Vi visar gärna hur er nuvarande profil ser ut och hur en profilerad närvaro skulle kunna utvecklas."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CheckButton placement="footer" />
              <BookButton
                placement="footer"
                className="bg-transparent border-slate-500 text-slate-100 hover:bg-slate-800 hover:text-slate-50"
              />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-slate-500 text-slate-100 hover:bg-slate-800 hover:text-slate-50"
                onClick={() => profileClick("footer")}
              >
                <Link to={secondaryProfileUrl}>
                  <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                  Se vår profil på d365.se
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 14. STICKY CTA */}
      {showSticky && (
        <>
          <div className="hidden md:block fixed top-20 right-6 z-40">
            <ContactFormDialog>
              <Button size="sm" className="shadow-lg" onClick={() => bookClick("sticky_desktop")}>
                <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                Boka partnergenomgång
              </Button>
            </ContactFormDialog>
          </div>
          <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur px-3 py-2">
            <ContactFormDialog>
              <Button className="w-full h-11" onClick={() => bookClick("sticky_mobile")}>
                <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                Boka 20 min
              </Button>
            </ContactFormDialog>
          </div>
          <div className="md:hidden h-16" aria-hidden="true" />
        </>
      )}

      <Footer />
    </div>
  );
};

export default Partnerprogram;
