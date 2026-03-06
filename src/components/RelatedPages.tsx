import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RelatedPage {
  title: string;
  description: string;
  href: string;
}

interface RelatedPagesProps {
  heading?: string;
  pages: RelatedPage[];
}

const RelatedPages = ({ heading = "Utforska vidare", pages }: RelatedPagesProps) => {
  if (!pages.length) return null;

  return (
    <section className="py-12 sm:py-16 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          {heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {page.title}
              </span>
              <span className="text-sm text-muted-foreground line-clamp-2">
                {page.description}
              </span>
              <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                Läs mer <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedPages;

// ── Predefined link sets per page context ──────────────────────────

export const bcRelatedPages: RelatedPage[] = [
  { title: "ERP-översikt", description: "Jämför Business Central och Finance & Supply Chain Management", href: "/erp" },
  { title: "Finance & Supply Chain", description: "Enterprise ERP för globala koncerner med avancerad tillverkning", href: "/finance-supply-chain" },
  { title: "Behovsanalys ERP", description: "Kostnadsfri behovsanalys – få en personlig rekommendation", href: "/behovsanalys" },
  { title: "Copilot AI", description: "Så fungerar Microsoft Copilot i Business Central", href: "/copilot" },
  { title: "Branschlösningar", description: "Dynamics 365 per bransch – tillverkning, handel, service", href: "/branschlosningar" },
  { title: "Hitta partner", description: "Filtrera och jämför Business Central-partners i Sverige", href: "/valj-partner" },
];

export const fscRelatedPages: RelatedPage[] = [
  { title: "ERP-översikt", description: "Jämför Business Central och Finance & Supply Chain Management", href: "/erp" },
  { title: "Business Central", description: "ERP för SMB – enklare och snabbare att implementera", href: "/business-central" },
  { title: "Behovsanalys ERP", description: "Kostnadsfri behovsanalys – få en personlig rekommendation", href: "/behovsanalys" },
  { title: "Copilot AI", description: "Så fungerar Microsoft Copilot i Finance & Supply Chain", href: "/copilot" },
  { title: "Branschlösningar", description: "Dynamics 365 per bransch – tillverkning, handel, service", href: "/branschlosningar" },
  { title: "Hitta partner", description: "Filtrera och jämför Finance & SCM-partners i Sverige", href: "/valj-partner" },
];

export const erpRelatedPages: RelatedPage[] = [
  { title: "Business Central", description: "ERP för SMB med 10–300 anställda – från 765 kr/mån", href: "/business-central" },
  { title: "Finance & Supply Chain", description: "Enterprise ERP för globala koncerner", href: "/finance-supply-chain" },
  { title: "Behovsanalys ERP", description: "Kostnadsfri behovsanalys – vilken ERP-lösning passar dig?", href: "/behovsanalys" },
  { title: "Branschlösningar", description: "Dynamics 365 per bransch – tillverkning, handel, service", href: "/branschlosningar" },
  { title: "Hitta partner", description: "Jämför ERP-partners i Sverige", href: "/valj-partner" },
];

export const crmRelatedPages: RelatedPage[] = [
  { title: "Dynamics 365 Sales", description: "CRM för säljteam – pipeline, leads och Copilot AI", href: "/d365-sales" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering med omnikanalstöd", href: "/d365-customer-service" },
  { title: "Field Service", description: "Fältservicehantering med schemaläggning och mobilapp", href: "/d365-field-service" },
  { title: "Marketing", description: "Customer Insights och marketing automation", href: "/d365-marketing" },
  { title: "Contact Center", description: "Omnikanal-kontaktcenter för kundservice", href: "/d365-contact-center" },
  { title: "Behovsanalys CRM", description: "Kostnadsfri behovsanalys för sälj och marknad", href: "/salj-marknad-behovsanalys" },
  { title: "Hitta CRM-partner", description: "Jämför CRM-partners i Sverige", href: "/valj-partner" },
];

export const salesRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm" },
  { title: "Marketing", description: "Customer Insights – marketing automation och kunddata", href: "/d365-marketing" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365-customer-service" },
  { title: "Copilot AI", description: "Hur Copilot hjälper säljare i Dynamics 365 Sales", href: "/copilot" },
  { title: "Behovsanalys Sälj", description: "Kostnadsfri behovsanalys för sälj och marknad", href: "/salj-marknad-behovsanalys" },
  { title: "Hitta partner", description: "Jämför Dynamics 365 Sales-partners i Sverige", href: "/valj-partner" },
];

export const customerServiceRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm" },
  { title: "Contact Center", description: "Omnikanal-kontaktcenter med telefoni och chatt", href: "/d365-contact-center" },
  { title: "Field Service", description: "Fältservicehantering och schemaläggning", href: "/d365-field-service" },
  { title: "Copilot AI", description: "Hur Copilot hjälper kundservicemedarbetare", href: "/copilot" },
  { title: "Behovsanalys Kundservice", description: "Kostnadsfri behovsanalys för kundservice", href: "/kundservice-behovsanalys" },
  { title: "Hitta partner", description: "Jämför kundservice-partners i Sverige", href: "/valj-partner" },
];

export const fieldServiceRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365-customer-service" },
  { title: "Contact Center", description: "Omnikanal-kontaktcenter", href: "/d365-contact-center" },
  { title: "Behovsanalys Kundservice", description: "Kostnadsfri behovsanalys", href: "/kundservice-behovsanalys" },
  { title: "Hitta partner", description: "Jämför Field Service-partners i Sverige", href: "/valj-partner" },
];

export const marketingRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm" },
  { title: "Dynamics 365 Sales", description: "CRM för säljteam med Copilot AI", href: "/d365-sales" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365-customer-service" },
  { title: "Copilot AI", description: "AI-driven marketing automation med Copilot", href: "/copilot" },
  { title: "Behovsanalys Sälj & Marknad", description: "Kostnadsfri behovsanalys", href: "/salj-marknad-behovsanalys" },
  { title: "Hitta partner", description: "Jämför Marketing-partners i Sverige", href: "/valj-partner" },
];

export const contactCenterRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365-customer-service" },
  { title: "Field Service", description: "Fältservicehantering", href: "/d365-field-service" },
  { title: "Copilot AI", description: "AI i kontaktcentret med Copilot", href: "/copilot" },
  { title: "Behovsanalys Kundservice", description: "Kostnadsfri behovsanalys", href: "/kundservice-behovsanalys" },
  { title: "Hitta partner", description: "Jämför Contact Center-partners i Sverige", href: "/valj-partner" },
];

export const copilotRelatedPages: RelatedPage[] = [
  { title: "Business Central", description: "Copilot i ERP – produktbeskrivningar och bankavstämning", href: "/business-central" },
  { title: "Dynamics 365 Sales", description: "Copilot för säljare – mötessammanfattningar och e-post", href: "/d365-sales" },
  { title: "Customer Service", description: "Copilot för kundservice – ärendehantering och svar", href: "/d365-customer-service" },
  { title: "AI-agenter", description: "Autonoma AI-agenter i Dynamics 365", href: "/agents" },
  { title: "AI-översikt", description: "AI med Copilot och Agenter – strategisk guide", href: "/ai-oversikt" },
  { title: "AI Readiness", description: "Bedöm din organisations AI-mognad", href: "/ai-readiness" },
];

export const branschRelatedPages: RelatedPage[] = [
  { title: "Business Central", description: "ERP för SMB med branschanpassningar", href: "/business-central" },
  { title: "Finance & Supply Chain", description: "Enterprise ERP med branschfunktionalitet", href: "/finance-supply-chain" },
  { title: "CRM-översikt", description: "CRM-applikationer per bransch", href: "/crm" },
  { title: "Behovsanalys ERP", description: "Kostnadsfri behovsanalys anpassad efter din bransch", href: "/behovsanalys" },
  { title: "Hitta partner", description: "Filtrera partners per bransch", href: "/valj-partner" },
];

export const aiOverviewRelatedPages: RelatedPage[] = [
  { title: "Copilot", description: "Microsoft Copilot AI i alla Dynamics 365-appar", href: "/copilot" },
  { title: "AI-agenter", description: "Autonoma AI-agenter för automatiserade arbetsflöden", href: "/agents" },
  { title: "AI Readiness", description: "Bedöm din organisations AI-mognad", href: "/ai-readiness" },
  { title: "Business Central", description: "Copilot i ERP – produktbeskrivningar och bankavstämning", href: "/business-central" },
  { title: "Dynamics 365 Sales", description: "Copilot för säljare", href: "/d365-sales" },
];
