import { nowrapBrand } from "@/lib/nowrapBrand";
import { priceSources } from "@/lib/guideSources";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import EditorialSource from "@/components/EditorialSource";
import Navbar from "@/components/Navbar";
import SourceNote from "@/components/SourceNote";
import PageOfferBanner from "@/components/PageOfferBanner";
import Footer from "@/components/Footer";
import AktuelltContextSection from "@/components/aktuellt/AktuelltContextSection";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FALLBACK_PRICES } from "@/data/productPricesFallback";
import { useProductPrices, formatPrice } from "@/hooks/useProductPrices";
import { BC_TIERS, BC_DAY_RATE, fmtBcRange } from "@/data/bcProjectEstimates";
import { CTA } from "@/data/ctaLabels";

const D365 = "Dynamics\u00A0365";

const priserFaqs = [
  {
    question: "Är priserna på den här sidan vad jag faktiskt betalar?",
    answer:
      "Nej. Tabellen visar Microsofts listpriser exklusive moms. Ditt faktiska pris sätts av avtalsform (CSP eller Enterprise Agreement), antal licenser och förhandling med partnern. Listpriset är taket du utgår från, inte slutpriset.",
  },
  {
    question: "Vad är skillnaden mellan Business Central Essentials och Premium?",
    answer:
      "Essentials täcker ekonomi, försäljning, inköp, lager och projekt. Premium lägger till tillverkning och serviceorderhantering. Alla användare i samma miljö måste ha samma nivå, så behöver produktionen Premium får hela företaget Premium-licenser.",
  },
  {
    question: "När räcker en Team Members-licens?",
    answer:
      "Team Members passar användare som främst läser data, rapporterar tid och utlägg, godkänner i flöden och registrerar enklare poster. Så snart användaren skapar order, bokför eller arbetar operativt i ekonomi- eller lagerprocessen krävs en full licens.",
  },
  {
    question: "Vad är skillnaden mellan bas- och tilläggslicens i Finance & Supply Chain Management?",
    answer:
      "Den första Dynamics 365-applikationen en användare licensieras för köps som baslicens. Behöver samma användare fler kvalificerade applikationer, till exempel både Finance och Supply Chain Management, köps de som tilläggslicenser till ett lägre pris. Vilka kombinationer som kvalificerar styrs av Microsofts licensguide.",
  },
  {
    question: "Ingår Copilot och AI-agenter i licenspriset?",
    answer:
      "Grundläggande Copilot-funktioner ingår i flera Dynamics 365-licenser, medan agenter och utökad AI-användning debiteras per konsumtion via Copilot Studio-krediter. Räkna därför AI som en separat, rörlig post i budgeten.",
  },
  {
    question: "Hur ofta uppdateras prislistan här?",
    answer:
      "Snapshotet stäms av mot Microsofts publicerade prislista och datumet står under tabellen. Microsoft prissätter i USD, vilket innebär att beloppet i SEK varierar med valutakurs och avtalsform.",
  },
];

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Prislista", url: "https://d365.se/priser/" },
];

type PriceRow = {
  product_key: string;
  product_name: string;
  category: string;
  price_sek: number | null;
  price_unit: string;
  price_note: string | null;
  is_quote: boolean;
};

const priceDrivers = [
  {
    t: "Användartyp",
    d: "Fulla användare som arbetar operativt kräver full licens. Användare som främst läser, godkänner och rapporterar tid kan ofta klara sig med Team Members.",
  },
  {
    t: "Applikation och nivå",
    d: "Business Central är byggt för små och medelstora företag. Finance & Supply Chain Management är enterprise-ERP med högre pris per användare. Båda har en standard- och en Premium-nivå.",
  },
  {
    t: "Bas- och tilläggslicenser",
    d: "En användare som behöver flera applikationer betalar fullt pris för den första och ett lägre tilläggspris för de följande, när kombinationen kvalificerar.",
  },
  {
    t: "Införande kontra drift",
    d: "Licensen är en löpande månadskostnad. Införandet är en engångsinsats från partnern och står oftast för den största delen av första årets kostnad.",
  },
];

/**
 * Fristående, fullt prerendererad prislista för Microsoft Dynamics 365.
 * Använder FALLBACK_PRICES vid SSR/initial render så att hela tabellen
 * finns i HTML:en som crawlers ser. Klienten hydratiserar med live-data
 * från `product_prices` när den är redo.
 */
export default function Priser() {
  const { data: livePrices } = useProductPrices();

  const prices = (livePrices && livePrices.length > 0 ? livePrices : FALLBACK_PRICES) as PriceRow[];
  const byKey = new Map(prices.map((p) => [p.product_key, p]));
  const price = (key: string) => {
    const p = byKey.get(key);
    return p ? formatPrice(p) : "Se Microsofts prislista";
  };

  const erp = prices.filter((p) => p.category === "ERP");
  const crm = prices.filter((p) => p.category === "CRM");

  const Section = ({ title, rows }: { title: string; rows: PriceRow[] }) => (
    <section className="mb-12">
      <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Produkt</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Pris</th>
              <th className="px-4 py-3 font-semibold">Kommentar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.product_name + i} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{p.product_name}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium">{formatPrice(p)}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.price_note || "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const bcPlans = [
    {
      key: "bc-essentials",
      name: "Essentials",
      d: "Ekonomi, försäljning, inköp, lager, projekt och grundläggande service. Räcker för de flesta handels- och tjänsteföretag.",
    },
    {
      key: "bc-premium",
      name: "Premium",
      d: "Allt i Essentials plus tillverkning och serviceorderhantering. Alla fulla användare i samma miljö måste ha samma nivå.",
    },
    {
      key: "bc-team-members",
      name: "Team Members",
      d: "För användare som läser data, godkänner, rapporterar tid och utlägg eller gör enklare registreringar. Ingen bokföring eller orderhantering.",
    },
  ];

  const fscmBase = [
    { key: "finance", name: "Finance" },
    { key: "finance-premium", name: "Finance Premium" },
    { key: "supply-chain-management", name: "Supply Chain Management" },
    { key: "scm-premium", name: "Supply Chain Management Premium" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Dynamics 365 priser – Licenser, kostnader & prisexempel | d365.se"
        titleMaxLength={70}
        description="Se vad Microsoft Dynamics 365 kostar. Jämför licenser, användartyper och vanliga kostnadsposter för Business Central, Sales, Customer Service och Finance."
        canonicalPath="/priser/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={priserFaqs} />
      <Navbar />

      <main className="pt-10">
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/kunskapscenter/" className="hover:text-foreground">Kunskapscenter</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Prislista</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 max-w-4xl">
              {nowrapBrand("Dynamics 365 priser, licenser och kostnader")}
            </h1>
            <div className="max-w-4xl">
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                Vad kostar Microsoft {D365}? Det beror på vilka appar ni behöver, hur många användare som ska arbeta i systemet och hur implementationen ska genomföras. Här får du en översikt över licenser, löpande kostnader och faktorer som påverkar den totala investeringen.
              </p>
              <h2 className="text-xl font-bold mb-3">Kort svar</h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Microsoft {D365} licensieras per användare och månad. Business Central kostar från {price("bc-essentials")} och Finance & Supply Chain Management från {price("finance")} (listpris, SEK exkl. moms). Det faktiska priset beror på avtalsform (EA, CSP), volym och förhandling, och licensen är bara en del av totalkostnaden. Införande, integration och förvaltning står normalt för en betydligt större andel över tid.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Vill ni se hela kostnaden med införande och förvaltning?{" "}
                <Link to="/kostnad/" className="font-medium text-primary hover:underline">Se kostnadsguiden</Link>
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{nowrapBrand("Vad påverkar priset för Dynamics 365?")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Priset för {D365} består normalt av licenser, implementation, anpassningar, integrationer, utbildning och löpande förvaltning. En enkel start med standardfunktioner har andra kostnader än ett upplägg med flera bolag, avancerade processer eller kopplingar till exempelvis e-handel, lager, BI och andra verksamhetssystem.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                När du jämför offerter är det därför viktigt att skilja på licenskostnaden per användare och den totala kostnaden för att införa, driva och vidareutveckla lösningen över tid. Det gäller både <Link to="/businesscentral/" className="font-medium text-primary hover:underline">Business Central</Link> och <Link to="/d365sales/" className="font-medium text-primary hover:underline">{D365} Sales</Link>.
              </p>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Jämför licenser och kostnader innan ni väljer lösning</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Börja med att definiera vilka användare som behöver full funktionalitet, vilka som bara ska läsa eller registrera information och vilka processer som kräver tillägg eller integrationer. Be sedan om en tydlig kostnadsbild som inkluderar både licenser och införande, så att ni kan <Link to="/valjdynamics365partner/" className="font-medium text-primary hover:underline">jämföra offerter och välja rätt partner</Link>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                En bra partner kan hjälpa er att välja rätt nivå från början, så att ni inte betalar för mer funktionalitet än verksamheten använder, men heller inte bygger in begränsningar som blir dyra att lösa senare. <Link to="/dynamics-365-crm-partners-sverige/" className="font-medium text-primary hover:underline">{nowrapBrand("Hitta en Dynamics 365-partner")}</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Snabb översikt */}
        <section className="py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Snabb översikt: vad avgör priset?</h2>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Fyra saker styr vad {D365} kostar för er. Börja med dem innan ni jämför offerter.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {priceDrivers.map((c) => (
                <div key={c.t} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-base font-semibold text-foreground mb-2">{c.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Central */}
        <section id="business-central" className="scroll-mt-32 py-10 sm:py-12 border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Business Central: Essentials, Premium och Team Members
            </h2>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Business Central har tre licenstyper. Valet mellan Essentials och Premium gäller hela miljön, medan Team Members kan blandas in för användare med begränsade behov.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {bcPlans.map((p) => (
                <div key={p.key} className="rounded-lg border border-border bg-card p-5 flex flex-col">
                  <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                  <p className="mt-1 mb-3 text-base font-bold text-foreground">{price(p.key)}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Läs mer om funktioner och passform på{" "}
              <Link to="/businesscentral/" className="font-medium text-primary hover:underline">Business Central-sidan</Link>.
            </p>
          </div>
        </section>

        {/* F&SCM */}
        <section id="finance-supply-chain" className="scroll-mt-32 py-10 sm:py-12 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Finance & Supply Chain Management: bas- och tilläggslicenser
            </h2>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Finance och Supply Chain Management säljs som separata applikationer, var och en med en standard- och en Premium-nivå.
            </p>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-lg font-semibold text-foreground mb-3">Baslicenser (listpris)</h3>
                <ul className="divide-y divide-border">
                  {fscmBase.map((b) => (
                    <li key={b.key} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
                      <span className="text-foreground">{b.name}</span>
                      <span className="font-medium text-foreground whitespace-nowrap">{price(b.key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-lg font-semibold text-foreground mb-3">Så fungerar tilläggslicenser</h3>
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                  <li>Den första {D365}-applikationen en användare behöver köps som baslicens.</li>
                  <li>Behöver samma användare fler kvalificerade applikationer, till exempel både Finance och Supply Chain Management, köps de som tilläggslicenser (attach) till ett lägre pris.</li>
                  <li>Användare med smalare uppgifter kan licensieras med begränsade licenser, till exempel Team Members.</li>
                  <li>Kontrollera kvalificerade kombinationer och eventuellt minsta antal licenser i Microsofts licensguide innan ni budgeterar.</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Läs mer om passform och partners på{" "}
              <Link to="/finance-supply-chain/" className="font-medium text-primary hover:underline">Finance & Supply Chain-sidan</Link>.
            </p>
          </div>
        </section>

        {/* Implementering */}
        <section id="implementering" className="scroll-mt-32 py-10 sm:py-12 border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Implementering: konsultinsats kontra licenskostnad</h2>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              Licensen är en löpande månadskostnad till Microsoft, oftast via partnern. Införandet är partnerns konsultarbete: analys, konfiguration, datamigrering, integrationer, utbildning och driftstart. Det är en engångskostnad som ofta är större än flera års licenser.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-lg font-semibold text-foreground mb-3">Business Central</h3>
                <ul className="divide-y divide-border text-sm">
                  <li className="flex flex-wrap justify-between gap-2 py-2">
                    <span className="text-foreground">Snabbstart, fast pris</span>
                    <span className="font-medium whitespace-nowrap">från 50 000 kr</span>
                  </li>
                  {(Object.keys(BC_TIERS) as (keyof typeof BC_TIERS)[]).map((k) => (
                    <li key={k} className="flex flex-wrap justify-between gap-2 py-2">
                      <span className="text-foreground">{BC_TIERS[k].label} ({BC_TIERS[k].days[0]}–{BC_TIERS[k].days[1]} konsultdagar)</span>
                      <span className="font-medium whitespace-nowrap">{fmtBcRange(BC_TIERS[k].days)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Räkneexempel med {BC_DAY_RATE.toLocaleString("sv-SE")} kr per konsultdag. Inte en offert.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-lg font-semibold text-foreground mb-3">Finance & Supply Chain Management</h3>
                <ul className="divide-y divide-border text-sm">
                  <li className="flex flex-wrap justify-between gap-2 py-2"><span className="text-foreground">Litet projekt</span><span className="font-medium whitespace-nowrap">2–6 MSEK</span></li>
                  <li className="flex flex-wrap justify-between gap-2 py-2"><span className="text-foreground">Medelstort projekt</span><span className="font-medium whitespace-nowrap">6–15 MSEK</span></li>
                  <li className="flex flex-wrap justify-between gap-2 py-2"><span className="text-foreground">Stort projekt</span><span className="font-medium whitespace-nowrap">från 15 MSEK</span></li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  d365.se:s redaktionella spann utifrån svenska partnerofferter, inte Microsoft-uppgifter.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Hela kostnadsbilden med förvaltning och vidareutveckling finns i{" "}
              <Link to="/kostnad/" className="font-medium text-primary hover:underline">kostnadsguiden</Link>.
            </p>
          </div>
        </section>

        <section id="konsultpris" className="scroll-mt-32 py-10 sm:py-12 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Vad kostar en <span className="whitespace-nowrap">Dynamics&nbsp;365</span>-konsult? Priser och timarvoden i Sverige</h2>
            <p className="text-muted-foreground mb-4 max-w-3xl">
              Utöver de månatliga licenskostnaderna från Microsoft utgörs investeringen av konsulttid för implementering, integrationer, kundanpassning och löpande support.
            </p>
            <p className="text-muted-foreground mb-4 max-w-3xl">
              I Sverige ligger timpriset för en <span className="whitespace-nowrap">Dynamics&nbsp;365</span>-konsult ofta på <strong className="text-foreground">1 100–1 700 kr per timme</strong> (exkl. moms). Var i spannet priset hamnar beror främst på roll, erfarenhet och hur specialiserad kompetensen är, till exempel om det gäller verksamhetskonsult, utvecklare eller lösningsarkitekt.
            </p>
            <SourceNote
              source="d365.se:s redaktionella bedömning utifrån svenska partnerofferter"
              updated="2026-10-22"
              method="Spannet är detsamma som i sajtens kalkylatorer. Det är inte ett pris från någon enskild partner; be alltid om timpris och estimerat antal timmar per roll i offerten."
              className="mb-6 max-w-3xl"
            />
            <h3 className="text-lg font-semibold text-foreground mb-3">Vad påverkar det totala konsultpriset?</h3>
            <ul className="grid gap-3 md:grid-cols-3 text-sm">
              <li className="rounded-lg border border-border bg-card p-4"><strong className="block text-foreground mb-1">Graden av standardisering</strong><span className="text-muted-foreground">Att välja standardprocesser i Business Central håller nere konsulttimmarna avsevärt jämfört med skräddarsydda anpassningar.</span></li>
              <li className="rounded-lg border border-border bg-card p-4"><strong className="block text-foreground mb-1">Kvaliteten på befintlig data</strong><span className="text-muted-foreground">Ju bättre tvättad och strukturerad er data är inför migreringen, desto färre timmar krävs för datamigrering.</span></li>
              <li className="rounded-lg border border-border bg-card p-4"><strong className="block text-foreground mb-1">Förvaltnings- och supportavtal (SLA)</strong><span className="text-muted-foreground">Många partners erbjuder rabatterade timpriser om ni tecknar ett löpande månatligt supportavtal.</span></li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-8">
              <Link to="/valjdynamics365partner/" className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"><span>Jämför <span className="whitespace-nowrap">Dynamics&nbsp;365</span>-partners och begär prisuppskattning</span><ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link>
              <Link to="/implementationskalkylator/" className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"><span>Räkna på konsulttimmar i kalkylatorn</span><ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link>
            </div>
          </div>
        </section>

        {/* Full prislista */}
        <section id="prislista" className="scroll-mt-32 py-10 sm:py-12 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Fullständig prislista för {D365}</h2>
            <Section title="ERP – Business Central, Finance & Supply Chain Management (F&O)" rows={erp} />
            <Section title="CRM – Sales, Service, Customer Insights m.fl." rows={crm} />
            <SourceNote
              className="mt-6"
              source="Microsofts officiella prislista för Dynamics 365"
              href="https://www.microsoft.com/sv-se/dynamics-365/pricing"
              updated="2026-06-11"
              method="Priserna är listpriser i SEK exkl. moms. Faktiskt pris sätts av avtalsform, volym och förhandling."
            />
            <p className="text-xs text-muted-foreground mt-3">
              Se även produktsidorna för{" "}
              <Link to="/businesscentral/" className="underline">Business Central pris</Link>,{" "}
              <Link to="/finance-supply-chain/" className="underline">Finance &amp; Supply Chain</Link>{" "}
              och <Link to="/crm/" className="underline">CRM</Link>.
            </p>
          </div>
        </section>

        {/* Nästa steg */}
        <section className="py-10 sm:py-12 border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Nästa steg</h2>
              <p className="text-muted-foreground mb-6 max-w-3xl">
                Licenspriset är detsamma oavsett partner, men införandet skiljer sig mycket. Jämför partners som levererat i er bransch, eller räkna på er egen omfattning först.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-auto min-h-11 whitespace-normal">
                  <Link to={CTA.findPartnerTo}>
                    Hitta rätt {D365}-partner <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal">
                  <Link to="/implementationskalkylator/">Få prisuppskattning</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Vanliga frågor om {D365}-priser
            </h2>
            <div className="space-y-5">
              {priserFaqs.map((faq) => (
                <div key={faq.question} className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{nowrapBrand(faq.question)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{nowrapBrand(faq.answer)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <AktuelltContextSection placement="priser" heading="Aktuellt om licenser och priser" />
      </main>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <PageOfferBanner />
        </div>
      </section>
      <SourcesAndMethod externalSources={priceSources} />
      <EditorialSource sourceType="Köpguide" />
      <Footer />
    </div>
  );
}
