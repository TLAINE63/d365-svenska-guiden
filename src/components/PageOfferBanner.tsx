import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCtaTracking } from "@/hooks/useCtaTracking";

interface Offer {
  /** Route prefix the offer applies to. Longest match wins. */
  prefix: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
}

/**
 * Page-specific lead offers. Instead of showing the same generic partner
 * guide everywhere, each pillar page points to the tool that matches the
 * visitor's intent on that page.
 */
const OFFERS: Offer[] = [
  {
    prefix: "/business-central",
    eyebrow: "Nästa steg för Business Central",
    title: "Skapa er kravspecifikation för Business Central",
    body: "Svara på ett antal frågor så får ni ett färdigt underlag som går att skicka direkt till partners – utan att ni behöver skriva det själva.",
    cta: "Skapa kravspecifikation",
    to: "/kravspecifikation/",
  },
  {
    prefix: "/finance-supply-chain",
    eyebrow: "Nästa steg för Finance & Supply Chain",
    title: "Testa om Finance & SCM matchar er verksamhet",
    body: "Ett kort matchningstest visar om F&SCM eller Business Central passar er storlek och komplexitet – och vilka partners som levererar det.",
    cta: "Gör matchningstestet",
    to: "/finance-supply-chain-management/matchningstest/",
  },
  {
    prefix: "/crm",
    eyebrow: "Nästa steg för Sales, Service & Marketing",
    title: "Matcha er säljprocess mot rätt CRM-upplägg",
    body: "Testet visar vilka Dynamics 365-appar som täcker ert behov och vilka partners som har erfarenhet av liknande processer.",
    cta: "Gör CRM-matchningstestet",
    to: "/d365sales/matchningstest/",
  },
  {
    prefix: "/kostnad",
    eyebrow: "Nästa steg",
    title: "Räkna på er egen implementation",
    body: "Kalkylatorn ger en uppskattning av tid och kostnad utifrån er omfattning – och en nedladdningsbar PDF att ta med till ledningsgruppen.",
    cta: "Öppna kalkylatorn",
    to: "/implementationskalkylator/",
  },
  {
    prefix: "/priser",
    eyebrow: "Nästa steg",
    title: "Från licenspris till total kostnad",
    body: "Licenser är bara en del. Räkna på införandet också, så ni jämför äpplen med äpplen när offerterna kommer.",
    cta: "Öppna kalkylatorn",
    to: "/implementationskalkylator/",
  },
  {
    prefix: "/branschlosningar",
    eyebrow: "Nästa steg för er bransch",
    title: "Hitta partners med erfarenhet från er bransch",
    body: "Guiden rankar partners utifrån bransch först, därefter produkt, storlek och geografi – och ni kan skicka ert underlag direkt.",
    cta: "Hitta matchande partners",
    to: "/valjdynamics365partner/",
  },
  {
    prefix: "/erp",
    eyebrow: "Nästa steg",
    title: "Jämför affärssystem på riktiga kriterier",
    body: "Sätt ihop er kravbild först – då blir jämförelsen mellan systemen och partnernas offerter faktiskt jämförbar.",
    cta: "Skapa kravspecifikation",
    to: "/kravspecifikation/",
  },
  {
    prefix: "/affarssystem",
    eyebrow: "Nästa steg",
    title: "Vad kostar ett affärssystem för er?",
    body: "Kalkylatorn räknar på licenser, införande och löpande kostnad utifrån er storlek och omfattning.",
    cta: "Räkna på kostnaden",
    to: "/implementationskalkylator/",
  },
];

function offerFor(pathname: string): Offer | null {
  const matches = OFFERS.filter((o) => pathname.startsWith(o.prefix));
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.prefix.length - a.prefix.length)[0];
}

interface Props {
  /** Override automatic route matching. */
  prefix?: string;
}

const PageOfferBanner = ({ prefix }: Props) => {
  const location = useLocation();
  const offer = offerFor(prefix ?? location.pathname);
  const { ref, trackClick } = useCtaTracking<HTMLDivElement>("page_offer", {
    page: location.pathname,
    offer: offer?.to,
  });

  if (!offer) return null;

  return (
    <Card ref={ref} className="border-[hsl(var(--cta-orange))]/30 bg-[hsl(var(--cta-orange))]/5">
      <CardContent className="p-6 sm:p-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--cta-orange))] mb-1">
            {offer.eyebrow}
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5">{offer.title}</h3>
          <p className="text-sm text-muted-foreground">{offer.body}</p>
        </div>
        <Button
          asChild
          className="whitespace-nowrap bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white"
        >
          <Link to={offer.to} onClick={() => trackClick()}>
            {offer.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PageOfferBanner;
