import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { ORGANIZATION } from "@/data/organization";
import thomasLaine from "@/assets/thomas-laine.jpeg";
import michaelUhman from "@/assets/michael-uhman.jpg";

const D365 = "Dynamics\u00A0365";

const advisors = [
  {
    name: "Thomas Laine",
    image: thomasLaine,
    role: `Medgrundare, d365.se. Köparsidig rådgivare inom Microsoft ${D365}, ERP, CRM och partnerlandskapet.`,
    link: "/om-thomas-laine/",
    linkLabel: "Om Thomas Laine →",
  },
  {
    name: "Michael Uhman",
    image: michaelUhman,
    role: `Medgrundare, d365.se. Köparsidig rådgivare med lång erfarenhet av affärssystem, verksamhetsutveckling och ${D365}-relaterade beslut.`,
    link: "/om-michael-uhman/",
    linkLabel: "Om Michael Uhman →",
  },
];

const OmOss = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Om d365.se – köparsidig guide till Microsoft ${D365}`}
        description={`d365.se drivs av ${ORGANIZATION.legalName} och hjälper svenska företag att förstå Microsoft ${D365}, ringa in sitt behov och hitta rätt partner. Läs om vilka vi är och hur sajten finansieras.`}
        canonical="https://d365.se/om-oss/"
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="px-4 sm:px-6 py-14 sm:py-20 bg-secondary/40 border-b border-border">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-3">
              Om d365.se
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
              Vi står på köparens sida när du väljer Microsoft {D365}-partner
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Ett {D365}-val handlar sällan bara om systemfunktioner. Det handlar om rätt omfattning,
              rätt vägval och framför allt rätt partner. d365.se hjälper svenska företag in i den
              processen med bättre struktur. Det sker innan dialogen blir för bred, för teknisk eller
              för säljorienterad.
            </p>
          </div>
        </section>

        {/* Vad d365.se gör */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 border-b border-border">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vad d365.se gör</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
              d365.se är en köparsidig guide till Microsoft {D365}. Här kan du läsa dig till hur
              affärssystem, CRM och AI passar din verksamhet, göra en behovsanalys, söka efter specifik
              kompetens och jämföra partners med dokumenterad erfarenhet inom din bransch och din
              företagsstorlek.
            </p>
            <ul className="space-y-2.5 text-[15px] text-muted-foreground leading-relaxed list-none">
              <li className="flex gap-2.5">
                <span className="text-[hsl(var(--cta-orange))] font-bold">1.</span>
                Beskriv vad ni behöver, i guiden Kom igång eller i kompetenssökningen.
              </li>
              <li className="flex gap-2.5">
                <span className="text-[hsl(var(--cta-orange))] font-bold">2.</span>
                Se relevanta partners och kompetenser som matchar era val.
              </li>
              <li className="flex gap-2.5">
                <span className="text-[hsl(var(--cta-orange))] font-bold">3.</span>
                Jämför alternativen sida vid sida.
              </li>
              <li className="flex gap-2.5">
                <span className="text-[hsl(var(--cta-orange))] font-bold">4.</span>
                Be oss om introduktion när ni vill gå vidare. Er förfrågan skickas aldrig vidare utan ert godkännande.
              </li>
            </ul>
          </div>
        </section>

        {/* Så finansieras sajten */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-secondary/40 border-b border-border">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">Så finansieras d365.se</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
              Sajten drivs av {ORGANIZATION.legalName} och finansieras av partners som betalar för
              utökade profiler. Betalning påverkar inte hur partners rangordnas i guider och analyser.
              Matchningen styrs av den profilering partnern själv har lämnat om produkter, branscher,
              geografi och kompetens.
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-5">
              Vi redovisar öppet vilka intressen som finns bakom sajten, inklusive ägarförhållanden
              och kopplingar till bolag som nämns i innehållet.
            </p>
            <Link
              to="/agande-och-intressen/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Läs om ägande och intressen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Vilka vi är */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 border-b border-border">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Vilka vi är</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {advisors.map((advisor) => (
                <div key={advisor.name} className="flex items-start gap-4">
                  <img
                    src={advisor.image}
                    alt={`${advisor.name}, köparsidig rådgivare inom Microsoft ${D365}`}
                    loading="lazy"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded object-cover flex-shrink-0"
                  />
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">{advisor.name}</p>
                    <p className="text-sm text-muted-foreground leading-snug mt-0.5">{advisor.role}</p>
                    <Link
                      to={advisor.link}
                      className="inline-block mt-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      {advisor.linkLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--signature))]" />
              AI-assisterat innehåll, granskat av erfarna {D365}-rådgivare
            </p>
          </div>
        </section>

        {/* Kontakt */}
        <section className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Vill du ha hjälp att komma vidare?</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
              Beskriv kort vad ni behöver så hjälper vi er att ringa in rätt lösning och rätt partners.
              Ingen information skickas vidare utan ert godkännande.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                <Link to="/kom-igang/">Kom igång</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/kontakt/">Kontakta oss</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OmOss;
