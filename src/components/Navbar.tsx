import { Link } from "react-router-dom";
import companyLogo from "@/assets/d365guide-logo-new.webp";
import { Menu, ChevronDown, Sparkles } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const erpItems = [
    { label: "Business Central vs Finance & Supply Chain Management", path: "/erp" },
    { label: "Business Central", path: "/businesscentral" },
    { label: "Finance & Supply Chain Management", path: "/finance-supply-chain" },
  ];

  const aiItems = [
    { label: "AI med Copilot & Agenter", path: "/aioversikt" },
    { label: "🧠 AI Readiness Assessment", path: "/ai-readiness" },
  ];

  const crmItems = [
    { label: "CRM Översikt", path: "/crm" },
    { label: "Dynamics 365 Sales", path: "/d365sales" },
    { label: "Dynamics 365 Customer Insights", path: "/d365marketing" },
    { label: "Dynamics 365 Customer Service", path: "/d365customerservice" },
    { label: "Dynamics 365 Field Service", path: "/d365fieldservice" },
    { label: "Dynamics 365 Contact Center", path: "/d365contactcenter" },
  ];

  const menuItems = [
    { label: "Kunskapscenter & Events", path: "/kunskapscenter", external: false },
    { label: "Kontakt", path: "/kontakt", external: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      {/* Top utility bar (desktop only) */}
      <div className="hidden lg:block border-b border-border/60 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-9 items-center justify-end gap-5 text-sm">
            <Link
              to="/AIsok"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-sök
            </Link>
            <Link
              to="/kunskapscenter"
              className="font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Kunskapscenter & Events
            </Link>
            <Link
              to="/kontakt"
              className="font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>

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
              alt="d365.se - Beslutsstöd för dig som ska välja Microsoft Dynamics 365 och rätt partner" 
               className="h-[88px] lg:h-[104px] w-auto object-contain -my-3 lg:-my-9 relative z-10"
              width="194"
              height="104"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link
              to="/branscher/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Hitta din bransch & partner
            </Link>
            {/* Branschlösningar – dold tills vidare */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-0">
                  Verksamhetsguider
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50 w-64">
                <DropdownMenuItem asChild>
                  <Link to="/valjdynamics365partner/" className="cursor-pointer font-medium text-primary">
                    🔍 Verksamhetsguider
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Börja med en behovsanalys</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/ERPbehovsanalys/" className="cursor-pointer">
                    📊 ERP (Affärssystem)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/CRMbehovsanalys/" className="cursor-pointer">
                    📈 Sälj & Marknad (CRM)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/kundservice-behovsanalys/" className="cursor-pointer">
                    🎧 Kundservice & Field Service
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/ai-readiness/" className="cursor-pointer">
                    🤖 AI Readiness Assessment
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/beslutsmognad/" className="cursor-pointer">
                    📋 Beslutsmognadsindex
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/kunskapscenter/upphandlingsresan" className="cursor-pointer">
                    🗺️ Upphandlingsresan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Guide</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/valjdynamics365partner/?ai=1" className="cursor-pointer">
                    📘 Så väljer du rätt Dynamics 365-partner
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
                  Marknad, Sälj & Service
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50">
                {crmItems.map((item) => (
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
          </div>


          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <div className="flex flex-col gap-4 mt-8 pb-8">
                <Link to="/AIsok" className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors">
                  <Sparkles className="h-4 w-4" /> AI-sök
                </Link>
                <Link
                  to="/branscher/"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Hitta din bransch & partner
                </Link>
                {/* Branschlösningar – dold tills vidare */}
                <Link
                  to="/valjdynamics365partner/"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Verksamhetsguider
                </Link>
                <div className="flex flex-col gap-2 ml-4">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Börja med en behovsanalys</span>
                  <Link to="/ERPbehovsanalys/" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    📊 ERP (Affärssystem)
                  </Link>
                  <Link to="/CRMbehovsanalys/" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    📈 Sälj & Marknad (CRM)
                  </Link>
                  <Link to="/kundservice-behovsanalys/" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    🎧 Kundservice & Field Service
                  </Link>
                  <Link to="/ai-readiness/" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    🤖 AI Readiness Assessment
                  </Link>
                  <Link to="/beslutsmognad/" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    📋 Beslutsmognadsindex
                  </Link>
                  <Link to="/kunskapscenter/upphandlingsresan" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    🗺️ Upphandlingsresan
                  </Link>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-2">Guide</span>
                  <Link to="/valjdynamics365partner/?ai=1" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                    📘 Så väljer du rätt Dynamics 365-partner
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
                  <span className="text-lg font-semibold text-foreground">Marknad, Sälj & Service</span>
                  <div className="flex flex-col gap-2 ml-4">
                    {crmItems.map((item) => (
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
