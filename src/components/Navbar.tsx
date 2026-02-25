import { Link } from "react-router-dom";
import companyLogo from "@/assets/d365-logo-v2.png";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const erpItems = [
    { label: "Business Central vs Finance & Supply Chain", path: "/erp" },
    { label: "Business Central", path: "/business-central" },
    { label: "Finance & Supply Chain", path: "/finance-supply-chain" },
    { label: "📊 Affärssystem (ERP) Behovsanalys", path: "/behovsanalys" },
  ];

  const aiItems = [
    { label: "AI med Copilot & Agenter", path: "/ai-oversikt" },
    { label: "🧠 AI Readiness Assessment", path: "/ai-readiness" },
    { label: "Copilot", path: "/copilot" },
    { label: "Agenter", path: "/agents" },
  ];

  const crmSalesItems = [
    { label: "CRM Översikt", path: "/crm" },
    { label: "Dynamics 365 Sales", path: "/d365-sales" },
    { label: "Dynamics 365 Customer Insights", path: "/d365-marketing" },
    { label: "📈 Behovsanalys Sälj & Marknad", path: "/salj-marknad-behovsanalys" },
  ];

  const crmServiceItems = [
    { label: "Dynamics 365 Customer Service", path: "/d365-customer-service" },
    { label: "Dynamics 365 Field Service", path: "/d365-field-service" },
    { label: "Dynamics 365 Contact Center", path: "/d365-contact-center" },
    { label: "🎧 Behovsanalys Kundservice", path: "/kundservice-behovsanalys" },
  ];

  const menuItems = [
    { label: "Events", path: "/events", external: false },
    { label: "Kontakt", path: "/kontakt", external: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={companyLogo} 
              alt="d365.se - Oberoende guide till Microsoft Dynamics 365 i Sverige" 
              className="h-[126px] w-auto object-contain mt-[11px]"
              width="294"
              height="126"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/branschlosningar"
              onClick={(e) => {
                if (window.location.pathname === '/branschlosningar') {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Branschlösningar
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-0">
                  Det kritiska partnervalet
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50 w-64">
                <DropdownMenuItem asChild>
                  <Link to="/valj-partner" className="cursor-pointer font-medium">
                    Hitta rätt partner
                  </Link>
                </DropdownMenuItem>
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Börja med en behovsanalys</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/behovsanalys" className="cursor-pointer">
                    📊 ERP (Affärssystem)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/salj-marknad-behovsanalys" className="cursor-pointer">
                    📈 Sälj & Marknad (CRM)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/kundservice-behovsanalys" className="cursor-pointer">
                    🎧 Kundservice & Field Service
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-0">
                  Affärssystem (ERP)
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50">
                {erpItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-0">
                  Marknad & Sälj
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50">
                {crmSalesItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-0">
                  Kundservice
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50">
                {crmServiceItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-0">
                  Microsoft AI
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50">
                {aiItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {menuItems.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <div className="flex flex-col gap-4 mt-8 pb-8">
                <Link
                  to="/branschlosningar"
                  onClick={(e) => {
                    if (window.location.pathname === '/branschlosningar') {
                      e.preventDefault();
                      window.location.reload();
                    }
                  }}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Branschlösningar
                </Link>
                <Link
                  to="/valj-partner"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Det kritiska partnervalet
                </Link>
                <div className="flex flex-col gap-2 ml-4">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Börja med en behovsanalys</span>
                  <Link to="/behovsanalys" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    📊 ERP (Affärssystem)
                  </Link>
                  <Link to="/salj-marknad-behovsanalys" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    📈 Sälj & Marknad (CRM)
                  </Link>
                  <Link to="/kundservice-behovsanalys" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    🎧 Kundservice & Field Service
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-foreground">Affärssystem (ERP)</span>
                  <div className="flex flex-col gap-2 ml-4">
                    {erpItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-foreground">Marknad & Sälj</span>
                  <div className="flex flex-col gap-2 ml-4">
                    {crmSalesItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-foreground">Kundservice</span>
                  <div className="flex flex-col gap-2 ml-4">
                    {crmServiceItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-foreground">Microsoft AI</span>
                  <div className="flex flex-col gap-2 ml-4">
                    {aiItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {menuItems.map((item) => (
                  item.external ? (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
