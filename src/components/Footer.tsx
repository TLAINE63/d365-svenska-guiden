import { Link } from "react-router-dom";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Om d365.se</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Oberoende guide till Microsoft Dynamics 365 - hjälper företag välja rätt affärssystem och partner.
            </p>
            <p className="text-xs text-muted-foreground italic">
              Disclaimer: Information på denna hemsida har ambitionen att ge en neutral bild av marknaden, men utvecklingen går fort och därför är det alltid en god idé att kontrollera senaste nytt i detaljerna.
            </p>
          </div>

          {/* Column 2: ERP */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Affärssystem (ERP)</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/erp" className="text-muted-foreground hover:text-foreground transition-colors">Business Central vs F&SCM</Link></li>
              <li><Link to="/business-central" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Business Central</Link></li>
              <li><Link to="/finance-supply-chain" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Finance & SCM</Link></li>
              <li><Link to="/behovsanalys" className="text-muted-foreground hover:text-foreground transition-colors">ERP Behovsanalys</Link></li>
            </ul>
          </div>

          {/* Column 3: Marknad & Sälj */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Marknad & Sälj</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/d365-sales" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Sales</Link></li>
              <li><Link to="/d365-marketing" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Customer Insights</Link></li>
              <li><Link to="/salj-marknad-behovsanalys" className="text-muted-foreground hover:text-foreground transition-colors">Behovsanalys Sälj & Marknad</Link></li>
            </ul>
          </div>

          {/* Column 4: Kundservice */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kundservice</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/d365-customer-service" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Customer Service</Link></li>
              <li><Link to="/d365-field-service" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Field Service</Link></li>
              <li><Link to="/d365-contact-center" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Contact Center</Link></li>
              <li><Link to="/kundservice-behovsanalys" className="text-muted-foreground hover:text-foreground transition-colors">Behovsanalys Kundservice</Link></li>
            </ul>
          </div>

          {/* Column 5: AI & Resurser */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">AI & Interna resurser</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ai-oversikt" className="text-muted-foreground hover:text-foreground transition-colors">AI med Copilot & Agenter</Link></li>
              <li><Link to="/ai-readiness" className="text-muted-foreground hover:text-foreground transition-colors">AI Readiness Assessment</Link></li>
              <li><Link to="/valj-partner" className="text-muted-foreground hover:text-foreground transition-colors">Välj Partner</Link></li>
              <li><Link to="/branschlosningar" className="text-muted-foreground hover:text-foreground transition-colors">Branschlösningar</Link></li>
              <li><Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">Events</Link></li>
              <li><Link to="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors">Kontakta oss</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p className="mb-2">© 2025 Dynamic Factory</p>
          <p className="text-sm mb-3">
            Microsoft Business Applications Evangelister
          </p>
          <div className="flex justify-center gap-4 text-sm mb-4">
            <Link to="/dataskydd" className="hover:text-foreground transition-colors">
              Dataskyddspolicy
            </Link>
            <span className="text-border">|</span>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
              className="hover:text-foreground transition-colors"
            >
              Cookie-inställningar
            </button>
          </div>
          <div className="flex justify-center items-center gap-2">
            <img src={linkedinLogo} alt="LinkedIn logotyp" className="w-5 h-5" />
            <a 
              href="https://www.linkedin.com/showcase/d365se/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-foreground transition-colors text-sm"
            >
              D365.se på LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
