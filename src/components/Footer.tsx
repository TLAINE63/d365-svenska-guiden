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
          <div className="flex justify-center gap-4 text-sm mb-4">
            <Link to="/dataskydd" className="hover:text-foreground transition-colors">
              Dataskyddspolicy
            </Link>
          </div>
          <div className="flex justify-center items-center gap-2">
            <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5" />
            <a 
              href="https://linkedin.com/in/thomaslaine" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-foreground transition-colors text-sm"
            >
              linkedin.com/in/thomaslaine
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
