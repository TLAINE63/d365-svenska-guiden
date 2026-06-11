import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Mail, Phone, Calendar, ExternalLink, ArrowLeft } from "lucide-react";
import thomasLainePhoto from "@/assets/thomas-laine-real.jpg";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kontakt", url: "https://d365.se/kontakt" },
  { name: "Om Thomas Laine", url: "https://d365.se/om-thomas-laine" },
];

const helpAreas = [
  {
    title: "Strategisk positionering i ekosystemet",
    points: [
      "Go-to-market och differentiering",
      "Förvärv, integration och partnerstruktur",
      "Lönsamhetsanalys och affärsmodell",
    ],
  },
  {
    title: "Rådgivning till partners, ISV:er och investerare",
    points: [
      "Oberoende bedömning av marknadspositionen",
      "Relation och samspel med Microsoft",
      "Nätverk mot Microsoft, partners och investerare",
    ],
  },
  {
    title: "Styrelseuppdrag och ägarstöd",
    points: [
      "Erfarenhet av tillväxt, förändringsarbete och M&A i sektorn",
      "Konkret förståelse för hur Microsoft-ekosystemet fungerar",
      "Go-to-market-strategi och segmentering",
    ],
  },
  {
    title: "Rådgivning inom försäljning och GTM",
    points: [
      "Säljcoaching och metodutveckling",
      "Kundworkshops och kravdialog",
      "Demo-strategi och whiteboarding",
      "Stöd genom hela säljcykeln",
    ],
  },
];

const OmThomasLaine = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Om Thomas Laine – strategisk rådgivare Dynamics 365"
        description="Nästan 30 år i Microsoft Dynamics-ekosystemet. Strategisk rådgivning, styrelseuppdrag och GTM-stöd för partners, ISV:er och investerare. Medgrundare av d365.se."
        canonicalPath="/om-thomas-laine/"
        keywords="Thomas Laine, Cloudahead, Dynamics 365, strategisk rådgivare, styrelseuppdrag, GTM"
        ogImage="https://d365.se/og-kontakt.png"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="mt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/40 to-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <Link
              to="/kontakt/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Tillbaka till Kontakt
            </Link>

            <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start max-w-5xl">
              <img
                src={thomasLainePhoto}
                alt="Thomas Laine – strategisk rådgivare Dynamics 365"
                className="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-primary/20 mx-auto lg:mx-0"
              />
              <div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Strategisk rådgivare
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Thomas Laine
                </h1>
                <p className="text-lg sm:text-xl text-foreground/90 mb-6 leading-relaxed">
                  Strategisk rådgivning i Microsoft Dynamics 365-ekosystemet — när ERP, CRM
                  och ekosystemval avgör riktningen.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:thomas.laine@dynamicfactory.se"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                  >
                    <Mail className="w-4 h-4" /> Skicka e-post
                  </a>
                  <a
                    href="tel:+46722324060"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-sm font-medium hover:bg-secondary"
                  >
                    <Phone className="w-4 h-4" /> +46 72 232 40 60
                  </a>
                  <a
                    href="https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ismsaljsauthenabled&ep=mlink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] text-white text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4" /> Boka möte
                  </a>
                  <a
                    href="https://linkedin.com/in/thomaslaine"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-sm font-medium hover:bg-secondary"
                  >
                    <img src={linkedinLogo} alt="" className="w-4 h-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bakgrund */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-6 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Bakgrund</h2>
              <p className="text-lg font-medium">
                Nästan 30 år i Microsoft Dynamics-ekosystemet. Fyra på Damgaard och Navision.
                Tretton på Microsoft — varav flera i ledningsgruppen som affärsområdeschef och
                partnerchef. Sedan 2015 som självständig rådgivare och styrelseledamot.
              </p>
              <p>
                Jag har arbetat med affärssystem sedan 1980-talet — men det är de senaste 30
                åren som format hur jag tänker.
              </p>
              <p>
                Hos Damgaard lärde jag mig produktlogiken i Axapta och XAL. När Damgaard gick
                samman med Navision, fick jag ytterligare insyn i hur ett partnerlett ekosystem
                faktiskt fungerar — varifrån tillväxten kommer och var friktionen uppstår. Sedan
                köpte Microsoft Navision, och jag följde med in.
              </p>
              <p>
                Tretton år på Microsoft gav en sällsynt kombination av perspektiv. Som
                affärsområdeschef i ledningsgruppen för Business Solutions Sverige ansvarade jag
                för marknad och strategi. Som partnerchef för Dynamics 365-kanalen arbetade jag
                tätt med de partners som idag implementerar de system som kunderna köper. Jag
                vet hur de prioriterar, hur de säljer och hur de levererar — på gott och ont.
              </p>
              <p>
                Jag har lett säljorganisationer, byggt partnerkanaler och tränat säljteam i hur
                man säljer komplexa affärssystem — inte produkten, utan förtroendet och
                beslutsförmågan hos köparen.
              </p>
              <p>
                Jag har arbetat med fler än 100 Dynamics-partners genom Dynamic Factory och
                Moveahead. Det ger en direkt och ärlig bild av vad som fungerar — och vad som
                ser bra ut på papper men inte håller i praktiken.
              </p>
              <p>
                Erfarenheten täcker hela kedjan: från produktutveckling och partnerbygge till
                kundval och styrelserummet.
              </p>
            </div>
          </div>
        </section>

        {/* Vad jag hjälper till med */}
        <section className="py-12 sm:py-16 bg-secondary/20 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
                Vad jag hjälper till med
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {helpAreas.map((area) => (
                  <div
                    key={area.title}
                    className="bg-card rounded-lg p-6 border border-border shadow-[var(--shadow-card)]"
                  >
                    <h3 className="text-lg font-bold text-card-foreground mb-4">{area.title}</h3>
                    <ul className="space-y-2">
                      {area.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Styrelseuppdrag */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-4 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Styrelseuppdrag</h2>
              <p>
                Jag tar styrelseuppdrag i bolag där ERP, CRM eller Microsoft-ekosystemet är
                affärskritiskt — som operativ plattform, som produkt eller som investeringsobjekt.
              </p>
              <p>
                Det kan handla om ett partnerbolag som ska skalas upp, ett ISV som söker tydligare
                marknadsstrategi eller en investerare som behöver sektorkompetens i styrelserummet.
              </p>
              <p className="font-medium">Nuvarande styrelseuppdrag: Kinra Group (MVI).</p>
            </div>
          </div>
        </section>

        {/* d365.se */}
        <section className="py-12 sm:py-16 bg-secondary/20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                d365.se — köparsidig guide till Dynamics 365-partners i Sverige
              </h2>
              <p className="text-foreground/90 mb-4 leading-relaxed">
                Genom Moveahead AB ligger jag bakom d365.se — en plattform för svenska bolag som
                ska välja Dynamics 365-partner och vill göra det utan att bli påverkade av
                säljintressen.
              </p>
              <p className="text-foreground/90 mb-6 leading-relaxed">
                d365.se listar och jämför partners objektivt. Inga licensintäkter. Inga provisioner.
                Platt månadsavgift från partnerna och full öppenhet mot köparen.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/valjdynamics365partner/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  Hitta rätt Dynamics 365-partner
                </Link>
                <Link
                  to="/agande-och-intressen/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-sm font-medium hover:bg-secondary"
                >
                  Ägande och intressen
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center bg-card border border-border rounded-lg p-8 sm:p-12 shadow-[var(--shadow-card)]">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Hör av dig direkt
              </h2>
              <p className="text-foreground/80 mb-8 leading-relaxed">
                Har du en fråga om ett strategiskt beslut, ett möjligt styrelseuppdrag eller
                rådgivning inom Dynamics 365-ekosystemet — hör gärna av dig direkt.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild size="lg">
                  <a href="mailto:thomas.laine@dynamicfactory.se">
                    <Mail className="w-4 h-4 mr-2" /> thomas.laine@dynamicfactory.se
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://cloudahead.se"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    cloudahead.se <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OmThomasLaine;
