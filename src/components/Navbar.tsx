import { track } from "@/lib/track";
import { Link } from "react-router-dom";
const companyLogo = "/d365-logo.svg";
import { Menu, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import RegionLanguageSwitcher from "./RegionLanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PARTNER_GUIDES, guidePath } from "@/data/partnerGuides";

type NavLinkItem = { label: string; path?: string; href?: string; strong?: boolean };
type NavGroup = { heading?: string; items: NavLinkItem[] };
type NavMenu = { label: string; groups: NavGroup[] };

const SURVEYS = "https://d365-surveys.lovable.app";

/** Huvudnavigation: ERP | CRM | Branscher | Guider & verktyg | Partners. ERP och CRM har samma struktur. */
const MENUS: NavMenu[] = [
  {
    label: "Affärssystem / ERP",
    groups: [
      { items: [{ label: "ERP-guiden: välja affärssystem", path: "/affarssystem/", strong: true }] },
      {
        heading: "Applikationer",
        items: [
          { label: "Dynamics 365 Business Central", path: "/businesscentral" },
          { label: "Dynamics 365 Finance & Supply Chain Management", path: "/finance-supply-chain" },
          { label: "Dynamics 365 Project Operations", path: "/d365projectoperations" },
          { label: "NAV/Navision till Business Central", path: "/nav-till-business-central/" },
          { label: "Dynamics 365 Commerce", path: "/d365commerce" },
          { label: "Dynamics 365 Human Resources", path: "/d365humanresources" },
        ],
      },
      {
        heading: "Partners",
        items: [
          { label: "Jämför Business Central-partners", path: "/business-central-partners-sverige/" },
          { label: "Jämför F&SCM-partners", path: "/finance-supply-chain-partners-sverige/" },
        ],
      },
    ],
  },
  {
    label: "CRM",
    groups: [
      {
        items: [
          { label: "CRM-guiden: välja CRM-system", path: "/crm/", strong: true },
          { label: "Välja kundservicesystem", path: "/kundservicesystem/" },
          { label: "Välja fältservicesystem", path: "/faltservicesystem/" },
        ],
      },
      {
        heading: "Områden (Customer Engagement)",
        items: [
          { label: "Försäljning: Dynamics 365 Sales", path: "/d365sales" },
          { label: "Marknad och kundinsikter: Customer Insights", path: "/d365marketing" },
          { label: "Kundservice och ärendehantering: Customer Service", path: "/d365customerservice" },
          { label: "Kontaktcenter: Contact Center", path: "/d365contactcenter" },
          { label: "Fältservice: Field Service", path: "/d365fieldservice" },
        ],
      },
      { heading: "Partners", items: [{ label: "Jämför CRM-partners", path: "/dynamics-365-crm-partners-sverige/" }] },
    ],
  },
  {
    label: "Guider & verktyg",
    groups: [
      {
        items: [
          { label: "Kom igång-guiden", path: "/kom-igang/", strong: true },
          { label: "Kunskapscenter", path: "/kunskapscenter" },
          { label: "Översikt: alla guider", path: "/guider/" },
          { label: "Välj din roll", path: "/roller/" },
          { label: "Redan Dynamics-kund", path: "/befintlig-kund/" },
          { label: "Upphandlingsguiden", path: "/upphandlingsguiden/" },
        ],
      },
      {
        heading: "Behovsanalys",
        items: [
          { label: "ERP (affärssystem)", path: "/ERPbehovsanalys/" },
          { label: "CRM (sälj och marknad)", path: "/CRMbehovsanalys/" },
          { label: "Kundservice, fältservice och Contact Center", path: "/kundservice-behovsanalys/" },
        ],
      },
      {
        heading: "Beslutsunderlag",
        items: [
          { label: "Kravspecifikation", path: "/kravspecifikation/" },
          { label: "Beslutsmognadsindex", path: "/beslutsmognad/" },
          { label: "Pris- och omfattningskalkylator", path: "/implementationskalkylator/" },
          { label: "Min D365-plan", path: "/underlag/" },
        ],
      },
      {
        heading: "Microsoft AI",
        items: [
          { label: "AI med Copilot och agenter", path: "/aioversikt" },
          { label: "AI Readiness Assessment", path: "/ai-readiness/" },
          { label: "Fråga d365.se", path: "/fraga/" },
        ],
      },
      {
        heading: "Fördjupade analyser",
        items: [
          { label: "ERP-benchmark och fördjupad ERP-analys", href: `${SURVEYS}/` },
          { label: "Snabbkoll: bromsar ert affärssystem verksamheten?", href: `${SURVEYS}/snabbkoll` },
          { label: "Förvaltning: stödjer den verksamhetens behov?", href: `${SURVEYS}/forvaltning` },
          { label: "Övriga analyser", href: `${SURVEYS}/fler-analyser` },
        ],
      },
    ],
  },
  {
    label: "Partners & kompetens",
    groups: [
      {
        items: [
          { label: "Hitta partner", path: "/valjdynamics365partner/", strong: true },
          { label: "Partners per bransch", path: "/partners-per-bransch/" },
          { label: "Jämför partners", path: "/jamfor-partners/" },
          { label: "Min kortlista", path: "/kortlista/" },
          { label: "Hitta kompetens", path: "/kompetens/" },
          { label: "Partnernytt", path: "/partnernytt/" },
        ],
      },
      {
        heading: "Guider: välja partner",
        items: PARTNER_GUIDES.map((g) => ({ label: g.shortLabel, path: guidePath(g) })),
      },
    ],
  },
];

import { forwardRef } from "react";

type ItemLinkProps = React.ComponentPropsWithoutRef<"a"> & { item: NavLinkItem };

/** Måste vidarebefordra ref och props: Radix Slot (DropdownMenuItem/SheetClose asChild)
 *  klonar barnet och smälter in ref, onClick, tabIndex m.m. Utan detta går
 *  tangentbordsnavigation i menyn och stängning av mobilmenyn förlorade. */
const ItemLink = forwardRef<HTMLAnchorElement, ItemLinkProps>(({ item, ...props }, ref) =>
  item.href ? (
    <a ref={ref} href={item.href} {...props}>{item.label}</a>
  ) : (
    <Link ref={ref} to={item.path!} {...props}>{item.label}</Link>
  )
);
ItemLink.displayName = "ItemLink";

const triggerClass =
  "text-sm font-medium text-white hover:text-[hsl(var(--signature))] hover:bg-transparent transition-colors px-0 focus-visible:ring-2 focus-visible:ring-[hsl(var(--signature))]";

const DesktopMenu = ({ menu }: { menu: NavMenu }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button onClick={() => track("nav_menu_open", { menu: menu.label })} variant="ghost" className={triggerClass}>
        {menu.label}
        <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-background border border-border z-50 w-72 max-h-[80vh] overflow-y-auto">
      {menu.groups.map((g, gi) => (
        <div key={gi}>
          {gi > 0 && <DropdownMenuSeparator />}
          {g.heading && (
            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wide text-foreground">{g.heading}</DropdownMenuLabel>
          )}
          {g.items.map((item) => (
            <DropdownMenuItem key={item.path ?? item.href} asChild>
              <ItemLink item={item} className={`cursor-pointer ${item.strong ? "font-semibold text-primary" : ""}`} />
            </DropdownMenuItem>
          ))}
        </div>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const utilityLink = "font-medium text-white/70 hover:text-[hsl(var(--signature))] transition-colors";
const mobileLink = "block py-1.5 text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors";

const Navbar = () => {
  const [erp, crm, tools, partners] = MENUS;
  return (
    <nav
      data-site-nav
      aria-label="Huvudmeny"
      className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--hero-dark))]"
      style={{ borderBottom: "3px solid hsl(var(--signature))" }}
    >
      {/* Sekundär rad (desktop) */}
      <div className="hidden lg:block border-b border-[hsl(var(--line-dark))] bg-[hsl(var(--hero-dark))]">
        <div className="container mx-auto px-4">
          <div className="flex h-9 items-center justify-end gap-5 text-sm">
            <Link to="/fraga/" className={`inline-flex items-center gap-1.5 ${utilityLink}`}>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Fråga d365.se
            </Link>
            <Link to="/kunskapscenter" className={utilityLink}>Kunskapscenter</Link>
            <Link to="/partnernytt/" className={utilityLink}>Partnernytt</Link>
            <Link to="/kontakt/" className={utilityLink}>Kontakt</Link>
            <RegionLanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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

          {/* Huvudmeny desktop */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            <DesktopMenu menu={erp} />
            <DesktopMenu menu={crm} />
            <Link to="/branscher/" className="text-sm font-medium text-white hover:text-[hsl(var(--signature))] transition-colors">
              Branscher
            </Link>
            <DesktopMenu menu={tools} />
            <DesktopMenu menu={partners} />
            <Link
              to="/valjdynamics365partner/"
              data-nav-cta
              className="inline-flex items-center gap-1.5 rounded bg-[hsl(var(--cta-orange))] px-4 py-2 text-sm font-bold text-white hover:bg-[hsl(var(--cta-orange-hover))] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Hitta rätt partner
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Mobil */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Öppna menyn" className="text-white hover:text-[hsl(var(--signature))] hover:bg-transparent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <div className="flex flex-col gap-3 mt-8 pb-8">
                <SheetClose asChild>
                  <Link
                    to="/valjdynamics365partner/"
                    className="inline-flex w-full items-center justify-center gap-2 rounded bg-[hsl(var(--cta-orange))] px-4 py-3 text-base font-bold text-white hover:bg-[hsl(var(--cta-orange-hover))]"
                  >
                    Hitta rätt partner
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </SheetClose>
                <Accordion type="single" collapsible className="w-full">
                  {[erp, crm].map((m) => (
                    <MobileGroup key={m.label} menu={m} />
                  ))}
                  <div className="border-b border-border py-4">
                    <SheetClose asChild>
                      <Link to="/branscher/" className="text-base font-semibold text-foreground hover:text-[hsl(var(--signature))]">Branscher</Link>
                    </SheetClose>
                  </div>
                  {[tools, partners].map((m) => (
                    <MobileGroup key={m.label} menu={m} />
                  ))}
                </Accordion>
                <div className="flex flex-col gap-1 pt-2">
                  <SheetClose asChild><Link to="/fraga/" className={`inline-flex items-center gap-2 ${mobileLink}`}><Sparkles className="h-4 w-4" aria-hidden="true" />Fråga d365.se</Link></SheetClose>
                  <SheetClose asChild><Link to="/kunskapscenter" className={mobileLink}>Kunskapscenter</Link></SheetClose>
                  <SheetClose asChild><Link to="/partnernytt/" className={mobileLink}>Partnernytt</Link></SheetClose>
                  <SheetClose asChild><Link to="/kontakt/" className={mobileLink}>Kontakt</Link></SheetClose>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground">Välj land / språk</span>
                  <RegionLanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

const MobileGroup = ({ menu }: { menu: NavMenu }) => (
  <AccordionItem value={menu.label}>
    <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline">{menu.label}</AccordionTrigger>
    <AccordionContent>
      {menu.groups.map((g, gi) => (
        <div key={gi} className={gi > 0 ? "mt-3" : ""}>
          {g.heading && <p className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground">{g.heading}</p>}
          {g.items.map((item) => (
            <SheetClose asChild key={item.path ?? item.href}>
              <ItemLink item={item} className={`${mobileLink} ${item.strong ? "!text-primary font-semibold" : ""}`} />
            </SheetClose>
          ))}
        </div>
      ))}
    </AccordionContent>
  </AccordionItem>
);

export default Navbar;
