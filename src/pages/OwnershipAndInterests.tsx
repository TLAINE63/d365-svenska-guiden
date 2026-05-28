import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Shield, Users, Mail, ExternalLink } from "lucide-react";

export default function OwnershipAndInterests() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Ägande och intressen – så finansieras d365.se"
        description="Full transparens om vem som äger d365.se, hur sajten finansieras och i vilka bolag i Microsoft-ekosystemet ägaren har ekonomiska intressen. Köparsidig vägledning inför val av Dynamics 365 och partner."
        canonicalPath="/agande-och-intressen"
      />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="h-4 w-4" /> Radikal transparens
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ägande, intressen och hur d365.se finansieras
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Vi positionerar oss som en <strong>köparsidig</strong> vägledning för svenska företag
            som väljer Microsoft Dynamics 365 och partner. För att den positioneringen ska vara
            trovärdig måste du veta exakt vem som driver sajten, hur den finansieras och vilka
            ekonomiska intressen som finns i bakgrunden. Det här är den sidan.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Vem driver d365.se?
          </h2>
          <ul className="space-y-2 text-muted-foreground leading-relaxed">
            <li>
              <strong className="text-foreground">Ägare:</strong> Moveahead AB äger och driver
              d365.se. Cloud Ahead AB äger 50 % av Moveahead AB och har därigenom ett indirekt
              ägarintresse i sajten samt i flera aktörer i Microsoft-ekosystemet (se nedan).
            </li>
            <li>
              <strong className="text-foreground">Operativ avsändare:</strong> Dynamic Factory AB,
              som ansvarar för redaktion, partneravtal och drift av plattformen.
            </li>
            <li>
              <strong className="text-foreground">Rådgivare:</strong> Thomas Laine och Michael Uhman –
              tillsammans 25+ års erfarenhet av Microsoft Dynamics 365 i Sverige.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground">
            Ekonomiska intressen i Microsoft-ekosystemet
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Cloud Ahead har ägarintressen i, eller pågående uppdrag åt, följande aktörer som
            verkar inom Microsoft Dynamics 365-marknaden:
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Aktör</th>
                  <th className="text-left p-3 font-semibold text-foreground">Relation</th>
                  <th className="text-left p-3 font-semibold text-foreground">Typ av verksamhet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-medium text-foreground">Nectar / MVI</td>
                  <td className="p-3 text-muted-foreground">Ägarintresse via Cloud Ahead</td>
                  <td className="p-3 text-muted-foreground">Microsoft-partner i D365-ekosystemet</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Aimplan</td>
                  <td className="p-3 text-muted-foreground">Ägarintresse via Cloud Ahead</td>
                  <td className="p-3 text-muted-foreground">Konsultbolag i D365-sfären</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Knowit</td>
                  <td className="p-3 text-muted-foreground">Pågående rådgivningsuppdrag</td>
                  <td className="p-3 text-muted-foreground">Konsultbolag, inget ägarintresse</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground">
            Så hanterar vi intressekonflikten
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            För att den köparsidiga positioneringen ska vara trovärdig följer vi tre principer:
          </p>
          <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-foreground">Synlig markering.</strong> Partners som Cloud
              Ahead har ekonomiska intressen i markeras tydligt med en{" "}
              <em>"Närstående bolag"</em>-badge i alla partnerlistor, sökresultat och
              profilsidor. Du ska aldrig behöva gissa.
            </li>
            <li>
              <strong className="text-foreground">Transparent ranking.</strong> AI-matchningen
              rankar partners utifrån bransch (40%), produktområde (30%), geografi och storlek –
              aldrig utifrån ägarrelation. Logiken är dokumenterad och påverkas inte av vem som
              äger vad.
            </li>
            <li>
              <strong className="text-foreground">Lika villkor.</strong> Partners som syns på
              d365.se betalar samma månadsavgift (1 990 kr/månad per produktområde) oavsett
              ägarrelation. Vi tar inga kickbacks per lead.
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground">Så finansieras d365.se</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sajten finansieras genom att Microsoft-certifierade Dynamics 365-partners betalar en
            fast månadsavgift för att vara synliga i partnerkatalogen och få ta emot
            kvalificerade leads. Vi tar inte betalt per lead, vi rangordnar inte mot betalning,
            och vi tar inte emot provision från Microsoft.
          </p>
        </section>

        <section className="mb-10 rounded-lg border border-border bg-muted/30 p-6">
          <h2 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Frågor om transparens eller intressekonflikt?
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Hör av dig till oss om något känns oklart eller om du ser något som borde redovisas
            tydligare. Vi tar transparens på allvar.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="mailto:info@d365.se"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail className="h-4 w-4" /> info@d365.se
            </a>
            <Link
              to="/kontakt/"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Till kontaktsidan
            </Link>
          </div>
        </section>

        <p className="text-xs text-muted-foreground italic">
          Senast uppdaterad: 2026-05-28. d365.se är fristående från Microsoft Corporation. Dynamics 365,
          Business Central och andra Microsoft-produktnamn är varumärken som tillhör Microsoft.
        </p>
      </main>
      <Footer />
    </div>
  );
}
