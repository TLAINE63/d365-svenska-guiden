import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  const openCookieSettings = () => {
    window.dispatchEvent(new Event("open-cookie-settings"));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Dataskyddspolicy – GDPR och integritet"
        description="Läs om hur d365.se hanterar dina personuppgifter i enlighet med GDPR. Information om cookies, datalagring, underbiträden och dina rättigheter."
        canonicalPath="/dataskydd"
        noIndex={true}
      />
      <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-foreground">
            Dataskyddspolicy
          </h1>

          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none space-y-6 sm:space-y-8 text-muted-foreground">
            <section>
              <p className="text-sm text-muted-foreground mb-8">
                Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}
              </p>

              <p className="text-lg leading-relaxed">
                Dynamic Factory ("vi", "oss") driver d365.se och värnar om din integritet. Denna
                policy beskriver hur vi samlar in, använder, lagrar och skyddar dina personuppgifter
                i enlighet med Dataskyddsförordningen (GDPR) och lagen om elektronisk kommunikation
                (LEK).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Personuppgiftsansvarig</h2>
              <p className="leading-relaxed">
                Dynamic Factory är personuppgiftsansvarig för all behandling som beskrivs nedan.
                Kontaktuppgifter finns i avsnitt 12.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Vilka personuppgifter samlar vi in?
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Kontaktuppgifter du själv lämnar</strong> — namn, e-post, telefon,
                  företag, befattning och meddelandetext via kontaktformulär, partneransökningar,
                  e-boksnedladdningar och leadformulär.
                </li>
                <li>
                  <strong>Teknisk information</strong> — IP-adress (lagras anonymiserat, se
                  avsnitt 7), webbläsartyp, enhet, referrer och besökta sidor.
                </li>
                <li>
                  <strong>Interaktionsdata</strong> — klick på partnerlänkar, val i
                  matchningsguider, exponering för filteralternativ.
                </li>
                <li>
                  <strong>Cookies och liknande tekniker</strong> — se avsnitt 9.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Ändamål, laglig grund och lagringstid
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-foreground">
                      <th className="p-3 border-b border-border">Behandling</th>
                      <th className="p-3 border-b border-border">Laglig grund</th>
                      <th className="p-3 border-b border-border">Lagringstid</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Hantera kontaktförfrågningar och rådgivning</td>
                      <td className="p-3 align-top">
                        Berättigat intresse (svara på förfrågan) / Fullgörande av avtal
                      </td>
                      <td className="p-3 align-top">24 månader efter senaste kontakt</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Förmedla leads till partner</td>
                      <td className="p-3 align-top">
                        Samtycke (du väljer aktivt att skicka förfrågan)
                      </td>
                      <td className="p-3 align-top">36 månader (för spårbarhet och tvistlösning)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">E-bok / nyhetsbrev</td>
                      <td className="p-3 align-top">Samtycke</td>
                      <td className="p-3 align-top">Tills samtycke återkallas</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Statistik via Google Analytics 4</td>
                      <td className="p-3 align-top">Samtycke (LEK + GDPR)</td>
                      <td className="p-3 align-top">14 månader (GA4-standard)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Marknadsföring (Google Ads, Snitcher)</td>
                      <td className="p-3 align-top">Samtycke</td>
                      <td className="p-3 align-top">13 månader</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Anonymiserad klick- och besöksstatistik</td>
                      <td className="p-3 align-top">Berättigat intresse (anonymiserad data)</td>
                      <td className="p-3 align-top">36 månader</td>
                    </tr>
                    <tr>
                      <td className="p-3 align-top">Bokföring och avtal med partners</td>
                      <td className="p-3 align-top">Rättslig förpliktelse (bokföringslagen)</td>
                      <td className="p-3 align-top">7 år</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Personuppgiftsbiträden och underleverantörer
              </h2>
              <p className="leading-relaxed mb-4">
                Vi använder följande leverantörer som behandlar personuppgifter för vår räkning.
                Med samtliga finns personuppgiftsbiträdesavtal (DPA).
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-foreground">
                      <th className="p-3 border-b border-border">Leverantör</th>
                      <th className="p-3 border-b border-border">Ändamål</th>
                      <th className="p-3 border-b border-border">Datalokalisering</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Supabase (databas, autentisering)</td>
                      <td className="p-3 align-top">Lagring av leads, partnerdata, statistik</td>
                      <td className="p-3 align-top">EU (Frankfurt)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Lovable (hosting)</td>
                      <td className="p-3 align-top">Drift av webbplats</td>
                      <td className="p-3 align-top">EU / globalt CDN</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">AWS Simple Email Service (SES)</td>
                      <td className="p-3 align-top">Transaktionsmejl (leads, bekräftelser)</td>
                      <td className="p-3 align-top">EU (Stockholm/Irland)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Google (Analytics 4, Ads)</td>
                      <td className="p-3 align-top">Statistik och konverteringsmätning</td>
                      <td className="p-3 align-top">
                        USA — överförs med EU-U.S. Data Privacy Framework + SCC
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 align-top">Snitcher</td>
                      <td className="p-3 align-top">B2B-företagsidentifiering (ej individer)</td>
                      <td className="p-3 align-top">EU</td>
                    </tr>
                    <tr>
                      <td className="p-3 align-top">Lovable AI Gateway</td>
                      <td className="p-3 align-top">AI-drivna analyser och rekommendationer</td>
                      <td className="p-3 align-top">EU/USA via SCC</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="leading-relaxed mt-4">
                <strong>Överföring till tredje land (USA):</strong> När data överförs till
                USA-baserade tjänster (främst Google) sker det med stöd av EU-kommissionens
                adekvansbeslut för EU-U.S. Data Privacy Framework och, där det krävs,
                Standardavtalsklausuler (SCC) med kompletterande tekniska skyddsåtgärder.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Delning av personuppgifter</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Partners du aktivt väljer att kontakta</strong> — när du skickar en
                  förfrågan via vår plattform vidarebefordras dina uppgifter till den valda
                  Dynamics 365-partnern. Vi länkar aldrig direkt till partners webbplatser; all
                  kontakt går via vårt förmedlade leadsystem.
                </li>
                <li>
                  <strong>Underleverantörer</strong> — enligt avsnitt 4.
                </li>
                <li>
                  <strong>Myndigheter</strong> — när vi enligt lag är skyldiga att lämna ut
                  uppgifter.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Dina rättigheter</h2>
              <p className="leading-relaxed mb-4">Enligt GDPR har du rätt till:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tillgång</strong> — få besked om vilka uppgifter vi behandlar om dig.</li>
                <li><strong>Rättelse</strong> — få felaktiga uppgifter korrigerade.</li>
                <li><strong>Radering</strong> — bli glömd när uppgifterna inte längre behövs.</li>
                <li><strong>Begränsning</strong> — pausa behandlingen i vissa fall.</li>
                <li><strong>Dataportabilitet</strong> — få ut dina uppgifter i strukturerat format.</li>
                <li><strong>Invändning</strong> — invända mot behandling som grundas på berättigat intresse.</li>
                <li><strong>Återkalla samtycke</strong> — när som helst, utan att tidigare laglig behandling påverkas.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Kontakta oss enligt avsnitt 12. Du har också rätt att klaga till
                Integritetsskyddsmyndigheten (IMY).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Anonymiserad klickanalys</h2>
              <p className="leading-relaxed mb-4">
                För att förstå hur besökare använder webbplatsen samlar vi in anonymiserad
                statistik vid klick på partnerlänkar:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Maskerad IP-adress</strong> — endast de två första segmenten lagras
                  (t.ex. "192.168.x.x"), vilket gör att enskilda användare inte kan identifieras.
                </li>
                <li>
                  <strong>Klickdata</strong> — vilken partner, tidpunkt och källsida.
                </li>
              </ul>
              <p className="leading-relaxed mt-4">
                Laglig grund: berättigat intresse av att förbättra tjänsten. Eftersom data
                anonymiseras vid insamling krävs inget cookie-samtycke för denna behandling.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. B2B-besökaridentifiering</h2>
              <p className="leading-relaxed mb-4">
                Med ditt samtycke (kategori "Marknadsföring") använder vi Snitcher för att
                identifiera vilka <em>företag</em> som besöker webbplatsen — baserat på publika
                IP-register. Tjänsten identifierar inte enskilda individer, namn eller e-post.
              </p>
              <p className="leading-relaxed">
                Laglig grund: samtycke. Du kan när som helst ändra ditt val via{" "}
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="text-primary hover:underline font-medium"
                >
                  cookie-inställningarna
                </button>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Cookies och samtycke</h2>
              <p className="leading-relaxed mb-4">
                Enligt lagen om elektronisk kommunikation (LEK) krävs aktivt samtycke innan
                icke-nödvändiga cookies sätts. När du besöker webbplatsen sätts först{" "}
                <strong>endast tekniskt nödvändiga cookies</strong>. Övriga cookies aktiveras
                först när du klickat "Acceptera alla" eller valt kategorier i bannern.
              </p>
              <p className="leading-relaxed mb-4">Vi använder följande kategorier:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Nödvändiga</strong> — sessionshantering, säkerhet, sparat samtyckesval.
                  Inget samtycke krävs.
                </li>
                <li>
                  <strong>Statistik</strong> — Google Analytics 4 med anonymiserad IP. Lagras i
                  14 månader.
                </li>
                <li>
                  <strong>Marknadsföring</strong> — Google Ads konverteringsspårning och
                  Snitcher B2B-identifiering. Lagras i upp till 13 månader.
                </li>
              </ul>
              <p className="leading-relaxed mt-4">
                <Button variant="outline" size="sm" onClick={openCookieSettings}>
                  Öppna cookie-inställningar
                </Button>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Säkerhet</h2>
              <p className="leading-relaxed">
                Vi vidtar tekniska och organisatoriska åtgärder för att skydda dina
                personuppgifter: TLS-kryptering, åtkomstkontroll, Row-Level Security i databasen,
                loggning av admin-åtkomst och regelbundna säkerhetsskanningar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                11. Ändringar i dataskyddspolicyn
              </h2>
              <p className="leading-relaxed">
                Vi kan komma att uppdatera denna policy. Den senaste versionen finns alltid
                tillgänglig här. Väsentliga ändringar meddelas på lämpligt sätt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Kontakta oss</h2>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Dynamic Factory</p>
                <p>E-post: thomas.laine@dynamicfactory.se</p>
              </div>
              <p className="leading-relaxed mt-4">
                Du har även rätt att lämna in klagomål till Integritetsskyddsmyndigheten (IMY) om
                du anser att vår behandling strider mot GDPR.
              </p>
            </section>

            <div className="pt-8 border-t border-border mt-12">
              <Button asChild variant="outline">
                <Link to="/">Tillbaka till startsidan</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
