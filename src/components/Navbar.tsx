import { Link } from "react-router-dom";
const companyLogo = "/d365-logo.svg";
import { Menu, ChevronDown, Sparkles } from "lucide-react";
import RegionLanguageSwitcher from "./RegionLanguageSwitcher";
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
    { label: "Project Operations", path: "/d365projectoperations" },
    { label: "Commerce", path: "/d365commerce" },
    { label: "Human Resources", path: "/d365humanresources" },
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
    { label: "Kunskapscenter", path: "/kunskapscenter", external: false },
    { label: "Kontakt", path: "/kontakt", external: false },
  ];

  return (
    <nav
      data-site-nav
      className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--hero-dark))]"
      style={{ borderBottom: "3px solid hsl(var(--signature))" }}
    >

      {/* Top utility bar (desktop only) */}
      <div className="hidden lg:block border-b border-[hsl(var(--line-dark))] bg-[hsl(var(--hero-dark))]">
        <div className="container mx-auto px-4">
          <div className="flex h-9 items-center justify-end gap-5 text-sm">
            <Link
              to="/AI-sok/"
              className="inline-flex items-center gap-1.5 font-medium text-white/70 hover:text-[hsl(var(--signature))] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-sök
            </Link>
            <Link
              to="/kunskapscenter"
              className="font-medium text-white/70 hover:text-[hsl(var(--signature))] transition-colors"
            >
              Kunskapscenter
            </Link>
            <Link
              to="/partnernytt/"
              className="font-medium text-white/70 hover:text-[hsl(var(--signature))] transition-colors"
            >
              Partnernytt
            </Link>
            <Link
              to="/kontakt/"
              className="font-medium text-white/70 hover:text-[hsl(var(--signature))] transition-colors"
            >
              Kontakt
            </Link>
            <RegionLanguageSwitcher />
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
              alt="d365.se - Guide för Dynamics 365" 
              className="h-10 lg:h-12 w-auto object-contain relative z-10"
              width="225"
              height="60"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link
              to="/branscher/"
              className="text-sm font-medium text-white hover:text-[hsl(var(--signature))] transition-colors"
            >
              Hitta bransch & partner
            </Link>
            {/* Branschlösningar – dold tills vidare */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-white hover:text-[hsl(var(--signature))] hover:bg-transparent transition-colors px-0">
                  Verktyg & guider
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50 w-64">
                <DropdownMenuItem asChild>
                  <Link to="/valjdynamics365partner/" className="cursor-pointer font-medium text-primary">
                    🔍 Hitta Dynamics&nbsp;365-partner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/partners-per-bransch/" className="cursor-pointer">
                    🏭 Partners per bransch
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/jamfor-partners/" className="cursor-pointer">
                    ⚖️ Jämför partners
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/upphandlingsguiden/" className="cursor-pointer font-medium text-primary">
                    🗺️ Upphandlingsguiden
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
                    🎧 Kundservice (Ärendehantering), Fältservice & Contact Center
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
                    📘 Så väljer du rätt Dynamics&nbsp;365-partner
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-white hover:text-[hsl(var(--signature))] hover:bg-transparent transition-colors px-0">
                  ERP / Affärssystem
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
                <Button variant="ghost" className="text-sm font-medium text-white hover:text-[hsl(var(--signature))] hover:bg-transparent transition-colors px-0">
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
                <Button variant="ghost" className="text-sm font-medium text-white hover:text-[hsl(var(--signature))] hover:bg-transparent transition-colors px-0">
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
              <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="text-white hover:text-[hsl(var(--signature))] hover:bg-transparent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <div className="flex flex-col gap-4 mt-8 pb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Välj land / språk</span>
                  <RegionLanguageSwitcher />
                </div>
                <div className="h-px bg-border" />
                <Link to="/AI-sok/" className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:text-[hsl(var(--signature))] transition-colors">
                  <Sparkles className="h-4 w-4" /> AI-sök
                </Link>
                <Link
                  to="/partnernytt/"
                  className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
                >
                  Partnernytt
                </Link>
                <Link
                  to="/branscher/"
                  className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
                >
                  Hitta bransch & partner
                </Link>
                {/* Branschlösningar – dold tills vidare */}
                <Link
                  to="/valjdynamics365partner/"
                  className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
                >
                  Hitta Dynamics&nbsp;365-partner
                </Link>
                <Link
                  to="/partners-per-bransch/"
                  className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
                >
                  🏭 Partners per bransch
                </Link>
                <Link
                  to="/jamfor-partners/"
                  className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
                >
                  ⚖️ Jämför partners
                </Link>
                <Link
                  to="/upphandlingsguiden/"
                  className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
                >
                  🗺️ Upphandlingsguiden
                </Link>
                <div className="flex flex-col gap-2 ml-4">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Börja med en behovsanalys</span>
                  <Link to="/ERPbehovsanalys/" className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors">
                    📊 ERP (Affärssystem)
                  </Link>
                  <Link to="/CRMbehovsanalys/" className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors">
                    📈 Sälj & Marknad (CRM)
                  </Link>
                  <Link to="/kundservice-behovsanalys/" className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors">
                    🎧 Kundservice (Ärendehantering), Fältservice & Contact Center
                  </Link>
                  <Link to="/ai-readiness/" className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors">
                    🤖 AI Readiness Assessment
                  </Link>
                  <Link to="/beslutsmognad/" className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors">
                    📋 Beslutsmognadsindex
                  </Link>
                  <Link to="/kunskapscenter/upphandlingsresan" className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors">
                    🗺️ Upphandlingsresan
                  </Link>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-2">Guide</span>
                  <Link to="/valjdynamics365partner/?ai=1" className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors">
                    📘 Så väljer du rätt Dynamics&nbsp;365-partner
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-foreground">ERP / Affärssystem</span>
                  <div className="flex flex-col gap-2 ml-4">
                    {erpItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors"
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
                        className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors"
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
                        className="text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors"
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
                      className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-lg font-medium text-foreground hover:text-[hsl(var(--signature))] transition-colors"
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
