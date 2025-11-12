import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-foreground">
            Dataskyddspolicy
          </h1>
          
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none space-y-6 sm:space-y-8 text-muted-foreground">
            <section>
              <p className="text-sm text-muted-foreground mb-8">
                Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
              </p>
              
              <p className="text-lg leading-relaxed">
                Dynamic Factory värnar om din integritet och är ålagda att skydda dina personuppgifter. 
                Denna dataskyddspolicy beskriver hur vi samlar in, använder och skyddar dina personuppgifter 
                i enlighet med Dataskyddsförordningen (GDPR).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Personuppgiftsansvarig</h2>
              <p className="leading-relaxed">
                Dynamic Factory är personuppgiftsansvarig för behandlingen av dina personuppgifter. 
                Om du har frågor om hur vi behandlar dina personuppgifter är du välkommen att kontakta oss.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Vilka personuppgifter samlar vi in?</h2>
              <p className="leading-relaxed mb-4">Vi kan komma att samla in följande personuppgifter:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Namn och kontaktuppgifter (e-post, telefonnummer)</li>
                <li>Företagsinformation (företagsnamn, befattning)</li>
                <li>Teknisk information (IP-adress, webbläsartyp, besökta sidor)</li>
                <li>Information som du frivilligt lämnar i formulär eller vid kontakt med oss</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Ändamål och laglig grund</h2>
              <p className="leading-relaxed mb-4">Vi behandlar dina personuppgifter för följande ändamål:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Hantering av förfrågningar och konsultationer</strong> - Laglig grund: Berättigat intresse och fullgörande av avtal</li>
                <li><strong>Marknadsföring och kommunikation</strong> - Laglig grund: Samtycke eller berättigat intresse</li>
                <li><strong>Förbättring av vår webbplats och tjänster</strong> - Laglig grund: Berättigat intresse</li>
                <li><strong>Uppfyllande av rättsliga förpliktelser</strong> - Laglig grund: Rättslig förpliktelse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Delning av personuppgifter</h2>
              <p className="leading-relaxed mb-4">
                Vi delar inte dina personuppgifter med tredje part, med undantag för:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Leverantörer som hjälper oss att tillhandahålla våra tjänster (t.ex. webbhotell, CRM-system)</li>
                <li>När vi är skyldiga enligt lag att lämna ut uppgifterna</li>
                <li>Microsoft och deras tjänster i samband med Dynamics 365-implementationer</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Vi säkerställer att alla tredje parter som behandlar personuppgifter för vår räkning 
                gör det i enlighet med GDPR och har lämpliga säkerhetsåtgärder på plats.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Lagring av personuppgifter</h2>
              <p className="leading-relaxed">
                Vi sparar dina personuppgifter endast så länge som det är nödvändigt för att uppfylla 
                de ändamål som beskrivs i denna policy eller enligt lagkrav. När personuppgifterna inte 
                längre behövs raderas eller anonymiseras de.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Dina rättigheter</h2>
              <p className="leading-relaxed mb-4">Enligt GDPR har du följande rättigheter:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Rätt till tillgång</strong> - Du har rätt att få information om vilka personuppgifter vi behandlar om dig</li>
                <li><strong>Rätt till rättelse</strong> - Du kan begära att felaktiga uppgifter rättas</li>
                <li><strong>Rätt till radering</strong> - Du kan begära att dina uppgifter raderas ("rätten att bli glömd")</li>
                <li><strong>Rätt till begränsning</strong> - Du kan begära att behandlingen av dina uppgifter begränsas</li>
                <li><strong>Rätt till dataportabilitet</strong> - Du kan begära att få ut dina uppgifter i ett strukturerat format</li>
                <li><strong>Rätt att göra invändningar</strong> - Du kan invända mot viss behandling av dina uppgifter</li>
                <li><strong>Rätt att återkalla samtycke</strong> - Om behandlingen baseras på samtycke kan du när som helst återkalla det</li>
              </ul>
              <p className="leading-relaxed mt-4">
                För att utöva dina rättigheter, kontakta oss via uppgifterna nedan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies</h2>
              <p className="leading-relaxed">
                Vår webbplats använder cookies för att förbättra användarupplevelsen och analysera 
                trafik. Du kan när som helst ändra dina cookie-inställningar i din webbläsare.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Säkerhet</h2>
              <p className="leading-relaxed">
                Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda 
                dina personuppgifter mot obehörig åtkomst, förlust eller förstöring. Detta inkluderar 
                kryptering, åtkomstkontroller och regelbundna säkerhetsgranskningar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Ändringar i dataskyddspolicyn</h2>
              <p className="leading-relaxed">
                Vi kan komma att uppdatera denna dataskyddspolicy från tid till annan. Den senaste 
                versionen finns alltid tillgänglig på vår webbplats. Väsentliga ändringar kommer 
                att meddelas på lämpligt sätt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Kontakta oss</h2>
              <p className="leading-relaxed mb-4">
                Om du har frågor om denna dataskyddspolicy eller hur vi behandlar dina personuppgifter, 
                är du välkommen att kontakta oss:
              </p>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Dynamic Factory</p>
                <p>E-post: thomas.laine@dynamicfactory.se</p>
              </div>
              <p className="leading-relaxed mt-4">
                Du har även rätt att lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY) 
                om du anser att behandlingen av dina personuppgifter strider mot GDPR.
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

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 Dynamic Factory</p>
            <p className="text-sm mb-3">
              Microsoft Business Applications Evangelister
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link to="/dataskydd" className="hover:text-foreground transition-colors">
                Dataskyddspolicy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
