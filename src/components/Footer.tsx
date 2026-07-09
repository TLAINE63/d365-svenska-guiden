import { Link } from "react-router-dom";

const siteLogo = "/d365-logo.svg";

const Footer = () => {
  return (
    <footer
      className="bg-[hsl(var(--hero-dark))] py-12 text-[hsl(var(--muted-dark))]"
      style={{ borderTop: "3px solid hsl(var(--signature))" }}
    >
      <div className="container mx-auto px-4">
        {/* Trust-modul: Så fungerar d365.se */}
        <div className="grid md:grid-cols-2 gap-6 mb-10 pb-8 border-b border-[hsl(var(--line-dark))]">
          <div>
            <h3 className="font-semibold text-white mb-3 text-base">Om d365.se</h3>
            <p className="text-sm text-[hsl(var(--muted-dark))] leading-relaxed">
              d365.se är en köparorienterad plattform för Microsoft Dynamics 365. Vi förmedlar kunskap – inte kontrakt – och står på köparens sida i valet av system och partner.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3 text-base">Så fungerar partnersamarbetet</h3>
            <p className="text-sm text-[hsl(var(--muted-dark))] leading-relaxed">
              Vi säljer inte system eller implementation. Alla partners betalar samma avgift. Rekommendationer baseras på relevans – inte betalning.{" "}
              <Link to="/agande-och-intressen/" className="text-white underline hover:text-[hsl(var(--signature))]">
                Läs hela metodiken
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-8 items-start mb-8">


          {/* Column 2: ERP */}
          <div>
            <h3 className="font-semibold text-white mb-4">Affärssystem (ERP)</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/erp/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Affärssystem & ERP – guide</Link></li>
              <li><Link to="/erp/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Business Central vs F&SCM</Link></li>
              <li><Link to="/businesscentral/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Business Central</Link></li>
              <li><Link to="/finance-supply-chain/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Finance & SCM</Link></li>
              <li><Link to="/business-central-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Business Central-partners</Link></li>
              <li><Link to="/finance-supply-chain-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Finance & Supply Chain-partners</Link></li>
              <li><Link to="/d365projectoperations/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Project Operations</Link></li>
              <li><Link to="/d365commerce/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Commerce</Link></li>
              <li><Link to="/d365humanresources/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Human Resources</Link></li>
              <li><Link to="/ERPbehovsanalys/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">ERP Behovsanalys</Link></li>
            </ul>
          </div>

          {/* Column 3: CRM / Marknad & Sälj */}
          <div>
            <h3 className="font-semibold text-white mb-4">CRM / Marknad & Sälj</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/crm/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">CRM Översikt</Link></li>
              <li><Link to="/d365sales/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Sales</Link></li>
              <li><Link to="/d365marketing/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Customer Insights</Link></li>
              <li><Link to="/dynamics-365-sales-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Sales-partners</Link></li>
              <li><Link to="/dynamics-365-marketing-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Customer Insights-partners</Link></li>
              <li><Link to="/CRMbehovsanalys/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Behovsanalys Sälj & Marknad</Link></li>
            </ul>
          </div>

          {/* Column 4: Kundservice */}
          <div>
            <h3 className="font-semibold text-white mb-4">CRM / Kundservice</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/d365customerservice/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Customer Service</Link></li>
              <li><Link to="/d365fieldservice/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Field Service</Link></li>
              <li><Link to="/d365contactcenter/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Contact Center</Link></li>
              <li><Link to="/kundservice-behovsanalys/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Behovsanalys Kundservice</Link></li>
              <li><Link to="/dynamics-365-customer-service-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Customer Service-partners</Link></li>
              <li><Link to="/dynamics-365-field-service-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Field Service-partners</Link></li>
              <li><Link to="/dynamics-365-contact-center-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 Contact Center-partners</Link></li>
            </ul>
          </div>

          {/* Column 5: Kunskapscenter */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kunskapscenter</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kunskapscenter/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Kunskapscenter (Q&A & fördjupningar)</Link></li>
              <li><Link to="/events/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Events & Webinars</Link></li>
              <li><Link to="/beslutsmognad/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Beslutsmognadsindex</Link></li>
              <li><Link to="/kravspecifikation/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Kravspecifikationer</Link></li>
              <li><Link to="/qa/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Vanliga frågor</Link></li>
              <li><Link to="/branscher/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Hitta din bransch</Link></li>
              <li><Link to="/valjdynamics365partner/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Hitta din partner</Link></li>
              <li><Link to="/alla-d365-partners/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Alla D365-partners</Link></li>
              <li><Link to="/partners-per-bransch/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Partners per bransch</Link></li>
              <li><Link to="/partners-sitemap/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Partners-sitemap</Link></li>
            </ul>
          </div>

          {/* Column 5: AI & Partner */}
          <div>
            <h3 className="font-semibold text-white mb-4">AI & Partner</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/copilot/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Microsoft Copilot</Link></li>
              <li><Link to="/agents/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Microsoft Agenter</Link></li>
              <li><Link to="/aioversikt/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">AI Översikt</Link></li>
              <li><Link to="/ai-readiness/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">AI Readiness Assessment</Link></li>
              <li><Link to="/valjdynamics365partner/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Välj Partner</Link></li>
              <li><Link to="/jamfor-partners/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Jämför Partners</Link></li>
              <li><Link to="/dynamics-365-ai-copilot-partners-sverige/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Dynamics 365 AI- & Copilot-partners</Link></li>
              <li><Link to="/branscher/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Branschlösningar</Link></li>
              <li><Link to="/kontakt/" className="text-[hsl(var(--muted-dark))] hover:text-white transition-colors">Kontakta oss</Link></li>
            </ul>
          </div>
        </div>

        {/* Om d365.se – fullbredd nederst */}
        <div className="border-t border-[hsl(var(--line-dark))] pt-6 mb-8">
          <h3 className="font-semibold text-white mb-3">Om d365.se</h3>
          <p className="text-sm text-[hsl(var(--muted-dark))] mb-2 max-w-4xl">
            Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner.
            Vi förmedlar kunskap – inte kontrakt – och står på köparens sida i valet av system och partner.
          </p>
          <p className="text-xs text-[hsl(var(--muted-dark))] italic max-w-4xl mb-2">
            d365.se är fristående från Microsoft Corporation. Vi är inte anslutna till, sponsrade av eller godkända av Microsoft. Dynamics 365, Business Central och andra Microsoft-produktnamn är varumärken som tillhör Microsoft.
          </p>
          <p className="text-xs text-[hsl(var(--muted-dark))] italic max-w-4xl">
            Disclaimer: Information på denna hemsida har ambitionen att ge en rättvisande bild av marknaden, men utvecklingen går fort och därför är det alltid en god idé att kontrollera senaste nytt i detaljerna.
          </p>
        </div>

        <div className="border-t border-[hsl(var(--line-dark))] pt-8 text-center text-[hsl(var(--muted-dark))]">
          <img src={siteLogo} alt="d365.se logotyp" width="194" height="40" loading="lazy" decoding="async" className="h-10 w-auto mx-auto mb-4 brightness-0 invert" />
          <p className="mb-2 text-white">© {new Date().getFullYear()} Dynamic Factory</p>
          <p className="text-sm mb-3">
            Microsoft Business Applications Evangelister
          </p>
          <div className="flex justify-center gap-4 text-sm mb-4 flex-wrap">
            <Link to="/dataskydd/" className="hover:text-white transition-colors">
              Dataskyddspolicy
            </Link>
            <span className="text-[hsl(var(--line-dark))]">|</span>
            <Link to="/agande-och-intressen/" className="hover:text-white transition-colors">
              Så fungerar partnersamarbetet
            </Link>
            <span className="text-[hsl(var(--line-dark))]">|</span>
            <Link to="/friskrivning/" className="hover:text-white transition-colors">
              Friskrivning
            </Link>
            <span className="text-[hsl(var(--line-dark))]">|</span>
            <button
              onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
              className="hover:text-white transition-colors"
            >
              Cookie-inställningar
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
