import { track } from "@/lib/track";
import { Link } from "react-router-dom";
const companyLogo = "/d365-logo.svg";
import { Menu, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import RegionLanguageSwitcher from "./RegionLanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
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
import { hasPlanStarted, usePlanMeta } from "@/lib/d365Plan";

type NavLinkItem = { label: string; path?: string; href?: string; strong?: boolean; /** Produktnamn som visas under behovet (behov först, produkt sedan). */ product?: string };
type NavGroup = { heading?: string; items: NavLinkItem[] };
type NavMenu = { label: string; groups: NavGroup[] };

const ISV = "/kunskapscenter/dynamics-365-tillagg/";

/** Huvudnavigation (6 block): ERP | CRM | Branscher | Tilläggslösningar | Guider & verktyg | Partners & kompetens.
 *  Inom varje meny: orientera → applikationer/fördjupning → partner. ERP och CRM har samma struktur. */
const MENUS: NavMenu[] = [
  {
    label: "Affärssystem / ERP",
    groups: [
      {
        heading: "Välja affärssystem",
        items: [
          { label: "ERP-guiden: välja affärssystem", path: "/affarssystem/", strong: true },
          { label: "Jämför: Business Central vs F&SCM", path: "/affarssystem/#comparison-intro" },
          { label: "NAV/Navision till Business Central", path: "/nav-till-business-central/" },
        ],
      },
      {
        heading: "Dynamics\u00A0365-applikationer",
        items: [
          { label: "Business Central", path: "/businesscentral" },
          { label: "Finance & Supply Chain Management", path: "/finance-supply-chain" },
          { label: "Project Operations", path: "/d365projectoperations" },
          { label: "Commerce", path: "/d365commerce" },
          { label: "Human Resources", path: "/d365humanresources" },
        ],
      },
      {
        heading: "Hitta rätt leverantör",
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
        heading: "Välj system",
        items: [
          { label: "Välj CRM-system", path: "/crm/", strong: true },
          { label: "Välj system för kundservice", path: "/kundservicesystem/" },
          { label: "Välj system för fältservice", path: "/faltservicesystem/" },
        ],
      },
      {
        heading: "Microsofts lösningar",
        items: [
          { label: "Sälj och kundrelationer", product: "Dynamics\u00A0365 Sales", path: "/d365sales" },
          { label: "Marknadsföring och kunddata", product: "Customer Insights", path: "/d365marketing" },
          { label: "Kundservice och ärenden", product: "Customer Service", path: "/d365customerservice" },
          { label: "Kontaktcenter och kundkommunikation", product: "Contact Center", path: "/d365contactcenter" },
          { label: "Service ute hos kund", product: "Field Service", path: "/d365fieldservice" },
        ],
      },
      { heading: "Hitta partner", items: [{ label: "Hitta CRM-partner", path: "/dynamics-365-crm-partners-sverige/" }] },
    ],
  },
  {
    label: "Branscher",
    groups: [
      {
        heading: "Utforska branschlösningar",
        items: [
          { label: "Alla branscher", path: "/branscher/", strong: true },
          { label: "Tillverkning", path: "/branscher/tillverkning/" },
          { label: "Grossist & distribution", path: "/branscher/grossist-distribution/" },
          { label: "Bygg, entreprenad & installation", path: "/branscher/bygg-entreprenad/" },
          { label: "Konsulttjänster", path: "/branscher/konsulttjanster/" },
          { label: "Fastighet & förvaltning", path: "/branscher/fastighet-forvaltning/" },
          { label: "Offentlig sektor", path: "/branscher/offentlig-sektor/" },
        ],
      },
      { heading: "Fördjupa", items: [{ label: "Partners per bransch", path: "/partners-per-bransch/" }] },
    ],
  },
  {
    label: "Tilläggslösningar",
    groups: [
      {
        heading: "Hitta tillägg efter behov",
        items: [
          { label: "Sök bland 200+ tilläggslösningar", path: ISV, strong: true },
          { label: "Tillägg för Business Central", path: `${ISV}?produkt=Business%20Central` },
          { label: "Tillägg för Finance & Supply Chain", path: `${ISV}?produkt=Finance%20%26%20Supply%20Chain%20Management` },
          { label: "Tillägg för CRM (Customer Engagement)", path: `${ISV}?ce=Sales` },
        ],
      },
    ],
  },
  {
    label: "Guider & verktyg",
    groups: [
      {
        heading: "Kom igång",
        items: [
          { label: "Starta behovsguiden", path: "/kom-igang/", strong: true },
          { label: "Välj ditt område", path: "/roller/" },
          { label: "Redan Dynamics-kund", path: "/befintlig-kund/" },
        ],
      },
      {
        heading: "Planera investeringen",
        items: [
          { label: "Pris- och omfattningskalkylator", path: "/implementationskalkylator/" },
          { label: "Kravspecifikation", path: "/kravspecifikation/" },
          { label: "Beslutsmognadsindex", path: "/beslutsmognad/" },
          { label: "Min D365-plan", path: "/underlag/" },
        ],
      },
      {
        heading: "Fördjupa dig",
        items: [
          { label: "AI med Copilot och agenter", path: "/aioversikt" },
          { label: "Kunskapscenter", path: "/kunskapscenter" },
          { label: "Översikt: alla guider", path: "/guider/" },
        ],
      },
    ],
  },
  {
    label: "Partners & kompetens",
    groups: [
      {
        heading: "Hitta och jämför",
        items: [
          { label: "Hitta partner", path: "/valjdynamics365partner/", strong: true },
          { label: "Så väljer du partner", path: "/guider/valja-dynamics-365-partner/" },
          { label: "Jämför partners", path: "/jamfor-partners/" },
          { label: "Partners per bransch", path: "/partners-per-bransch/" },
          { label: "Min kortlista", path: "/kortlista/" },
        ],
      },
      {
        heading: "När du redan har Dynamics",
        items: [
          { label: "Byta partner?", path: "/guider/byta-dynamics-partner/" },
          { label: "Hitta kompetens", path: "/kompetens/" },
          { label: "Second opinion", path: "/second-opinion/" },
        ],
      },
      { heading: "Om partnermarknaden", items: [{ label: "Partnernytt", path: "/partnernytt/" }] },
    ],
  },
];

import { forwardRef, type ComponentPropsWithoutRef } from "react";

type ItemLinkProps = ComponentPropsWithoutRef<"a"> & { item: NavLinkItem };

/** Måste vidarebefordra ref och props: Radix Slot (DropdownMenuItem/SheetClose asChild)
 *  klonar barnet och smälter in ref, onClick, tabIndex m.m. Utan detta går
 *  tangentbordsnavigation i menyn och stängning av mobilmenyn förlorade. */
const ItemLink = forwardRef<HTMLAnchorElement, ItemLinkProps>(({ item, ...props }, ref) =>
  item.href ? (
    <a ref={ref} href={item.href} {...props}>{item.label}</a>
  ) : (
    <Link ref={ref} to={item.path!} {...props} aria-label={item.product ? `${item.label}: ${item.product}` : undefined}>
      {item.product ? (
        <span className="flex flex-col">
          <span>{item.label}</span>
          <span className="whitespace-nowrap text-xs font-normal text-muted-foreground group-hover:text-primary/80 group-data-[highlighted]:text-primary/80">{item.product}</span>
        </span>
      ) : (
        item.label
      )}
      {item.path === "/underlag/" && <PlanStartedBadge />}
    </Link>
  )
);
ItemLink.displayName = "ItemLink";

/** Diskret markering vid "Min D365-plan" när besökaren har en påbörjad plan sparad lokalt. */
const PlanStartedBadge = () => {
  const meta = usePlanMeta();
  if (!hasPlanStarted(meta)) return null;
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent))] px-2 py-0.5 align-middle text-[11px] font-semibold text-white">
      Påbörjad
    </span>
  );
};

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
    <DropdownMenuContent
      align="start"
      className={`bg-background border border-border z-50 max-h-[80vh] overflow-y-auto p-2 rounded-xl shadow-xl ${
        menu.groups.length >= 3 ? "w-[min(760px,95vw)]" : menu.groups.length === 2 ? "w-[min(540px,95vw)]" : "w-[380px]"
      }`}
    >
      <div
        className={`grid gap-1 ${
          menu.groups.length >= 3 ? "grid-cols-3" : menu.groups.length === 2 ? "grid-cols-2" : "grid-cols-1"
        } divide-x divide-border`}
      >
        {menu.groups.map((g, gi) => (
          <div key={gi} className="px-2 py-1">
            {g.heading && (
              <DropdownMenuLabel className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {g.heading}
              </DropdownMenuLabel>
            )}
            <div className="flex flex-col gap-0.5">
              {g.items.map((item) => (
                <DropdownMenuItem key={item.path ?? item.href} asChild>
                  <ItemLink
                    item={item}
                    className={`group cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-snug transition-colors ${
                      item.strong
                        ? "mb-1 border border-primary/30 bg-primary/5 font-semibold text-primary hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
                        : "text-foreground hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
                    }`}
                  />
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

const utilityLink = "font-medium text-white/70 hover:text-[hsl(var(--signature))] transition-colors";
const mobileLink = "block py-1.5 text-base font-medium text-muted-foreground hover:text-[hsl(var(--signature))] transition-colors";

const Navbar = () => {
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
            <Link to="/befintlig-kund/" className={utilityLink}>Redan Dynamics-kund?</Link>
            <Link to="/fraga/" className={`inline-flex items-center gap-1.5 ${utilityLink}`}>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Fråga d365.se
            </Link>
            <Link to="/kunskapscenter" className={utilityLink}>Kunskapscenter</Link>
            <Link to="/aktuellt/" className={utilityLink}>Aktuellt</Link>
            <Link to="/partnernytt/" className={utilityLink}>Partnernytt</Link>
            <Link to="/kontakt/" className={utilityLink}>Kontakt</Link>
            <Link to="/konto/" className={utilityLink}>Min plan</Link>
            <RegionLanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
          <div className="hidden xl:flex items-center gap-3 2xl:gap-6">
            {MENUS.map((m) => (
              <DesktopMenu key={m.label} menu={m} />
            ))}
            <Link
              to="/valjdynamics365partner/"
              data-nav-cta
              className="inline-flex items-center gap-1.5 rounded bg-[hsl(var(--cta-orange))] px-4 py-2 text-sm font-bold text-white hover:bg-[hsl(var(--cta-orange-hover))] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Hitta rätt partner
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobil */}
          <div className="flex items-center gap-1 xl:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild className="xl:hidden">
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
                  {MENUS.map((m) => (
                    <MobileGroup key={m.label} menu={m} />
                  ))}
                </Accordion>
                <div className="flex flex-col gap-1 pt-2">
                  <SheetClose asChild><Link to="/befintlig-kund/" className={mobileLink}>Redan Dynamics-kund?</Link></SheetClose>
                  <SheetClose asChild><Link to="/fraga/" className={`inline-flex items-center gap-2 ${mobileLink}`}><Sparkles className="h-4 w-4" aria-hidden="true" />Fråga d365.se</Link></SheetClose>
                  <SheetClose asChild><Link to="/kunskapscenter" className={mobileLink}>Kunskapscenter</Link></SheetClose>
                  <SheetClose asChild><Link to="/aktuellt/" className={mobileLink}>Aktuellt</Link></SheetClose>
                  <SheetClose asChild><Link to="/partnernytt/" className={mobileLink}>Partnernytt</Link></SheetClose>
                  <SheetClose asChild><Link to="/kontakt/" className={mobileLink}>Kontakt</Link></SheetClose>
                  <SheetClose asChild><Link to="/konto/" className={mobileLink}>Min plan</Link></SheetClose>
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
