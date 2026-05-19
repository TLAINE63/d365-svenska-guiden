import { Link } from "react-router-dom";
import linkedinLogo from "@/assets/linkedin-logo.jfif";
import siteLogo from "@/assets/d365guide-logo-new.webp";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-8 items-start mb-8">

          {/* Column 2: ERP */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Affärssystem (ERP)</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/affarssystem/" className="text-muted-foreground hover:text-foreground transition-colors">Affärssystem – guide</Link></li>
              <li><Link to="/erp/" className="text-muted-foreground hover:text-foreground transition-colors">Business Central vs F&SCM</Link></li>
              <li><Link to="/businesscentral/" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Business Central</Link></li>
              <li><Link to="/finance-supply-chain/" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Finance & SCM</Link></li>
              <li><Link to="/ERPbehovsanalys/" className="text-muted-foreground hover:text-foreground transition-colors">ERP Behovsanalys</Link></li>
            </ul>
          </div>

          {/* Column 3: CRM / Marknad & Sälj */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">CRM / Marknad & Sälj</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/crm/" className="text-muted-foreground hover:text-foreground transition-colors">CRM Översikt</Link></li>
              <li><Link to="/d365sales/" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Sales</Link></li>
              <li><Link to="/d365marketing/" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Customer Insights</Link></li>
              <li><Link to="/CRMbehovsanalys/" className="text-muted-foreground hover:text-foreground transition-colors">Behovsanalys Sälj & Marknad</Link></li>
            </ul>
          </div>

          {/* Column 4: Kundservice */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">CRM / Kundservice</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/d365customerservice/" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Customer Service</Link></li>
              <li><Link to="/d365fieldservice/" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Field Service</Link></li>
              <li><Link to="/d365contactcenter/" className="text-muted-foreground hover:text-foreground transition-colors">Dynamics 365 Contact Center</Link></li>
              <li><Link to="/kundservice-behovsanalys/" className="text-muted-foreground hover:text-foreground transition-colors">Behovsanalys Kundservice</Link></li>
            </ul>
          </div>

          {/* Column 5: Kunskapscenter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kunskapscenter</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kunskapscenter/" className="text-muted-foreground hover:text-foreground transition-colors">Produktfördjupningar (Q&A)</Link></li>
              <li><Link to="/events/" className="text-muted-foreground hover:text-foreground transition-colors">Events & Webinars</Link></li>
              <li><Link to="/kunskapscenter/" className="text-muted-foreground hover:text-foreground transition-colors">Guider & Behovsanalyser</Link></li>
              <li><Link to="/kunskapscenter/" className="text-muted-foreground hover:text-foreground transition-colors">Kravspecifikationer</Link></li>
              <li><Link to="/qa/" className="text-muted-foreground hover:text-foreground transition-colors">Vanliga frågor</Link></li>
              <li><Link to="/branscher/" className="text-muted-foreground hover:text-foreground transition-colors">Hitta din bransch</Link></li>
              <li><Link to="/valjdynamics365partner/" className="text-muted-foreground hover:text-foreground transition-colors">Hitta din partner</Link></li>
            </ul>
          </div>

          {/* Column 5: AI & Partner */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">AI & Partner</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/copilot/" className="text-muted-foreground hover:text-foreground transition-colors">Microsoft Copilot</Link></li>
              <li><Link to="/agents/" className="text-muted-foreground hover:text-foreground transition-colors">Microsoft Agenter</Link></li>
              <li><Link to="/aioversikt/" className="text-muted-foreground hover:text-foreground transition-colors">AI Översikt</Link></li>
              <li><Link to="/ai-readiness/" className="text-muted-foreground hover:text-foreground transition-colors">AI Readiness Assessment</Link></li>
              <li><Link to="/valjdynamics365partner/" className="text-muted-foreground hover:text-foreground transition-colors">Välj Partner</Link></li>
              <li><Link to="/branscher/" className="text-muted-foreground hover:text-foreground transition-colors">Branschlösningar</Link></li>
              <li><Link to="/kontakt/" className="text-muted-foreground hover:text-foreground transition-colors">Kontakta oss</Link></li>
            </ul>
          </div>
        </div>

        {/* Om d365.se – fullbredd nederst */}
        <div className="border-t border-border pt-6 mb-8">
          <h3 className="font-semibold text-foreground mb-3">Om d365.se</h3>
          <p className="text-sm text-muted-foreground mb-2 max-w-4xl">
            Oberoende guide till Microsoft Dynamics 365 - hjälper företag välja rätt affärssystem och partner.
          </p>
          <p className="text-xs text-muted-foreground italic max-w-4xl">
            Disclaimer: Information på denna hemsida har ambitionen att ge en neutral bild av marknaden, men utvecklingen går fort och därför är det alltid en god idé att kontrollera senaste nytt i detaljerna.
          </p>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <img src={siteLogo} alt="d365.se logotyp" width="194" height="40" loading="lazy" decoding="async" className="h-10 w-auto mx-auto mb-4" />
          <p className="mb-2">© 2025 Dynamic Factory</p>
          <p className="text-sm mb-3">
            Microsoft Business Applications Evangelister
          </p>
          <div className="flex justify-center gap-4 text-sm mb-4">
            <Link to="/dataskydd/" className="hover:text-foreground transition-colors">
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
            <img src={linkedinLogo} alt="LinkedIn logotyp" width="20" height="20" loading="lazy" decoding="async" className="w-5 h-5" />
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
