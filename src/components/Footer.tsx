import { Link } from "react-router-dom";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="text-center text-muted-foreground">
          <p className="mb-2">© 2025 Dynamic Factory</p>
          <p className="text-sm mb-3">
            Microsoft Business Applications Evangelister
          </p>
          <p className="text-xs mb-3 max-w-2xl mx-auto italic">
            Disclaimer: Information på denna hemsida har ambitionen att ge en neutral bild av marknaden, men utvecklingen går fort och därför är det alltid en god idé att kontrollera senaste nytt i detaljerna.
          </p>
          <div className="flex justify-center gap-4 text-sm mb-4">
            <Link to="/dataskydd" className="hover:text-foreground transition-colors">
              Dataskyddspolicy
            </Link>
          </div>
          <div className="flex justify-center items-center gap-2">
            <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5" />
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
