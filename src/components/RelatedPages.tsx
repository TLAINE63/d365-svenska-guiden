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
    <section className="py-8 sm:py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          {heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              aria-label={page.title}
              className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 hover:border-primary/40  transition-all"
            >
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {page.title}
              </span>
              <span className="text-sm text-muted-foreground line-clamp-2">
                {page.description}
              </span>
              <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                Till {page.title} <ArrowRight className="h-3.5 w-3.5" />
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
  { title: "ERP-översikt", description: "Jämför Business Central och Finance & Supply Chain Management", href: "/erp/" },
  { title: "Finance & Supply Chain", description: "Enterprise ERP för globala koncerner med avancerad tillverkning", href: "/finance-supply-chain/" },
  { title: "Behovsanalys ERP", description: "Kostnadsfri behovsanalys – få en personlig rekommendation", href: "/ERPbehovsanalys/" },
  { title: "Copilot AI", description: "Så fungerar Microsoft Copilot i Business Central", href: "/copilot/" },
  { title: "Branschlösningar", description: "Dynamics 365 per bransch – tillverkning, handel, service", href: "/branscher/" },
  { title: "Hitta partner", description: "Filtrera och jämför Business Central-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const fscRelatedPages: RelatedPage[] = [
  { title: "ERP-översikt", description: "Jämför Business Central och Finance & Supply Chain Management", href: "/erp/" },
  { title: "Business Central", description: "ERP för SMB – enklare och snabbare att implementera", href: "/businesscentral/" },
  { title: "Behovsanalys ERP", description: "Kostnadsfri behovsanalys – få en personlig rekommendation", href: "/ERPbehovsanalys/" },
  { title: "Copilot AI", description: "Så fungerar Microsoft Copilot i Finance & Supply Chain", href: "/copilot/" },
  { title: "Branschlösningar", description: "Dynamics 365 per bransch – tillverkning, handel, service", href: "/branscher/" },
  { title: "Hitta partner", description: "Filtrera och jämför Finance & SCM-partners i Sverige", href: "/valjdynamics365partner/" },
];

// MOFU – teknisk jämförelse Business Central vs Finance & SCM.
// Länkar FRAMÅT till produktsidor (BOFU) och stödjande sidor.
// Innehåller INTE /affarssystem (TOFU) – skickar inte tillbaka köpmogna besökare.
export const erpRelatedPages: RelatedPage[] = [
  { title: "Business Central – pris & funktioner", description: "Produktdetaljer, licensnivåer och paketering för SMB", href: "/businesscentral/" },
  { title: "Finance & Supply Chain", description: "Enterprise-ERP för koncerner med global drift och avancerad produktion", href: "/finance-supply-chain/" },
  { title: "Behovsanalys", description: "Få en rekommendation om BC vs F&SCM passar dig bäst", href: "/ERPbehovsanalys/" },
  { title: "Branschlösningar", description: "Dynamics 365 per bransch – tillverkning, handel, service", href: "/branscher/" },
  { title: "Hitta partner", description: "Jämför Microsoft-partners specialiserade på BC och F&SCM", href: "/valjdynamics365partner/" },
];

// TOFU – allmän utbildning "vad är ett affärssystem".
// Länkar FRAMÅT till /erp (MOFU jämförelse) och /businesscentral (produkt).
// Använder INTE ordet "ERP" som ankartext för /erp (vi vill inte krocka med /erp:s primära sökord).
export const affarssystemRelatedPages: RelatedPage[] = [
  { title: "Jämför Business Central och Finance & SCM", description: "Teknisk jämförelse av Microsofts två affärssystem", href: "/erp/" },
  { title: "Business Central – produktsida", description: "ERP för SMB med 10–300 anställda – från 765 kr/mån", href: "/businesscentral/" },
  { title: "Finance & Supply Chain", description: "För större bolag med global koncernstruktur", href: "/finance-supply-chain/" },
  { title: "Behovsanalys", description: "Få en kostnadsfri rekommendation baserad på dina behov", href: "/ERPbehovsanalys/" },
  { title: "Branschlösningar", description: "Hur Dynamics 365 anpassas för olika branscher", href: "/branscher/" },
  { title: "Hitta partner", description: "Katalog över certifierade Microsoft-partners – vi står på köparens sida", href: "/valjdynamics365partner/" },
];

export const crmRelatedPages: RelatedPage[] = [
  { title: "Microsoft Dynamics 365 Sales", description: "CRM för säljteam – pipeline, leads och Copilot AI", href: "/d365sales/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering med omnikanalstöd", href: "/d365customerservice/" },
  { title: "Field Service", description: "Fältservicehantering med schemaläggning och mobilapp", href: "/d365fieldservice/" },
  { title: "Marketing", description: "Customer Insights och marketing automation", href: "/d365marketing/" },
  { title: "Contact Center", description: "Omnikanal-kontaktcenter för kundservice", href: "/d365contactcenter/" },
  { title: "Behovsanalys CRM", description: "Kostnadsfri behovsanalys för sälj och marknad", href: "/CRMbehovsanalys/" },
  { title: "Hitta CRM-partner", description: "Jämför CRM-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const salesRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm/" },
  { title: "Marketing", description: "Customer Insights – marketing automation och kunddata", href: "/d365marketing/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365customerservice/" },
  { title: "Copilot AI", description: "Hur Copilot hjälper säljare i Dynamics 365 Sales", href: "/copilot/" },
  { title: "Behovsanalys Sälj", description: "Kostnadsfri behovsanalys för sälj och marknad", href: "/CRMbehovsanalys/" },
  { title: "Hitta partner", description: "Jämför Dynamics 365 Sales-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const customerServiceRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm/" },
  { title: "Contact Center", description: "Omnikanal-kontaktcenter med telefoni och chatt", href: "/d365contactcenter/" },
  { title: "Field Service", description: "Fältservicehantering och schemaläggning", href: "/d365fieldservice/" },
  { title: "Copilot AI", description: "Hur Copilot hjälper kundservicemedarbetare", href: "/copilot/" },
  { title: "Behovsanalys Kundservice", description: "Kostnadsfri behovsanalys för kundservice", href: "/kundservice-behovsanalys/" },
  { title: "Hitta partner", description: "Jämför kundservice-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const fieldServiceRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365customerservice/" },
  { title: "Contact Center", description: "Omnikanal-kontaktcenter", href: "/d365contactcenter/" },
  { title: "Behovsanalys Kundservice", description: "Kostnadsfri behovsanalys", href: "/kundservice-behovsanalys/" },
  { title: "Hitta partner", description: "Jämför Field Service-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const marketingRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm/" },
  { title: "Microsoft Dynamics 365 Sales", description: "CRM för säljteam med Copilot AI", href: "/d365sales/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365customerservice/" },
  { title: "Copilot AI", description: "AI-driven marketing automation med Copilot", href: "/copilot/" },
  { title: "Behovsanalys Sälj & Marknad", description: "Kostnadsfri behovsanalys", href: "/CRMbehovsanalys/" },
  { title: "Hitta partner", description: "Jämför Marketing-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const contactCenterRelatedPages: RelatedPage[] = [
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering", href: "/d365customerservice/" },
  { title: "Field Service", description: "Fältservicehantering", href: "/d365fieldservice/" },
  { title: "Copilot AI", description: "AI i kontaktcentret med Copilot", href: "/copilot/" },
  { title: "Behovsanalys Kundservice", description: "Kostnadsfri behovsanalys", href: "/kundservice-behovsanalys/" },
  { title: "Hitta partner", description: "Jämför Contact Center-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const copilotRelatedPages: RelatedPage[] = [
  { title: "Business Central", description: "Copilot i ERP – produktbeskrivningar och bankavstämning", href: "/businesscentral/" },
  { title: "Microsoft Dynamics 365 Sales", description: "Copilot för säljare – mötessammanfattningar och e-post", href: "/d365sales/" },
  { title: "Customer Service", description: "Copilot för kundservice – ärendehantering och svar", href: "/d365customerservice/" },
  { title: "AI-agenter", description: "Autonoma AI-agenter i Dynamics 365", href: "/agents/" },
  { title: "AI-översikt", description: "AI med Copilot och Agenter – strategisk guide", href: "/aioversikt/" },
  { title: "AI Readiness", description: "Bedöm din organisations AI-mognad", href: "/ai-readiness/" },
];

export const branschRelatedPages: RelatedPage[] = [
  { title: "Business Central", description: "ERP för SMB med branschanpassningar", href: "/businesscentral/" },
  { title: "Finance & Supply Chain", description: "Enterprise ERP med branschfunktionalitet", href: "/finance-supply-chain/" },
  { title: "CRM-översikt", description: "CRM-applikationer per bransch", href: "/crm/" },
  { title: "Behovsanalys ERP", description: "Kostnadsfri behovsanalys anpassad efter din bransch", href: "/ERPbehovsanalys/" },
  { title: "Hitta partner", description: "Filtrera partners per bransch", href: "/valjdynamics365partner/" },
];

export const aiOverviewRelatedPages: RelatedPage[] = [
  { title: "Copilot", description: "Microsoft Copilot AI i alla Dynamics 365-appar", href: "/copilot/" },
  { title: "AI-agenter", description: "Autonoma AI-agenter för automatiserade arbetsflöden", href: "/agents/" },
  { title: "AI Readiness", description: "Bedöm din organisations AI-mognad", href: "/ai-readiness/" },
  { title: "Business Central", description: "Copilot i ERP – produktbeskrivningar och bankavstämning", href: "/businesscentral/" },
  { title: "Microsoft Dynamics 365 Sales", description: "Copilot för säljare", href: "/d365sales/" },
];

// Homepage hub – partner discovery. Länkar till pelarsidorna med TOFU/MOFU-ankare
// så de inte konkurrerar med /:s primära "partner"-intent eller med varandras sökord.
export const indexRelatedPages: RelatedPage[] = [
  { title: "Microsoft Dynamics 365 Sales", description: "CRM för säljteam – pipeline, leads och Copilot AI", href: "/d365sales/" },
  { title: "Microsoft Dynamics 365 Business Central", description: "ERP för SMB – ekonomi, lager och produktion", href: "/businesscentral/" },
  { title: "Microsoft Dynamics 365 Customer Service", description: "Helpdesk och ärendehantering med omnikanal", href: "/d365customerservice/" },
  { title: "Microsoft Dynamics 365 Finance & SCM", description: "Enterprise ERP för globala koncerner", href: "/finance-supply-chain/" },
  { title: "Affärssystem & ERP – guide", description: "Köparsidig guide: vad ett affärssystem är, vad det kostar och hur du väljer rätt", href: "/erp/" },
  { title: "CRM-översikt", description: "Jämför alla CRM-applikationer i Dynamics 365", href: "/crm/" },
  { title: "Copilot i Microsoft Dynamics 365", description: "AI-assistenten som ingår i alla appar", href: "/copilot/" },
];

// ── Kravspec / Behovsanalys / Partner-konvertering ────────────────
// Trefoten: Kravspec ↔ Behovsanalys ↔ Hitta partner – binder ihop köpresan.

export const requirementsErpRelatedPages: RelatedPage[] = [
  { title: "Behovsanalys ERP", description: "Få rekommendation Business Central eller Finance & Supply Chain innan du skriver kravspec", href: "/ERPbehovsanalys/" },
  { title: "Business Central", description: "ERP för SMB – funktioner, pris och paketering", href: "/businesscentral/" },
  { title: "Finance & Supply Chain", description: "Enterprise-ERP för koncerner med global drift", href: "/finance-supply-chain/" },
  { title: "Jämför BC och F&SCM", description: "Teknisk jämförelse av Microsofts två affärssystem", href: "/erp/" },
  { title: "Hitta partner", description: "Matcha kravspecifikationen mot Microsoft-partners i Sverige", href: "/valjdynamics365partner/" },
  { title: "Branschlösningar", description: "Branschspecifika krav för Dynamics 365", href: "/branscher/" },
];

export const requirementsCrmRelatedPages: RelatedPage[] = [
  { title: "Behovsanalys CRM", description: "Få rekommendation för Sales och Customer Insights (Marketing)", href: "/CRMbehovsanalys/" },
  { title: "Dynamics 365 Sales", description: "B2B-CRM för säljteam – pipeline, leads och Copilot", href: "/d365sales/" },
  { title: "Customer Insights (Marketing)", description: "Marketing automation och Customer Data Platform", href: "/d365marketing/" },
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm/" },
  { title: "Hitta CRM-partner", description: "Matcha kravspecifikationen mot CRM-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const requirementsCsRelatedPages: RelatedPage[] = [
  { title: "Behovsanalys Customer Service", description: "Få rekommendation för kundservice och kontaktcenter", href: "/kundservice-behovsanalys/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering med omnikanal", href: "/d365customerservice/" },
  { title: "Contact Center", description: "AI-drivet omnikanal-kontaktcenter", href: "/d365contactcenter/" },
  { title: "Field Service", description: "Fältservicehantering med schemaläggning och IoT", href: "/d365fieldservice/" },
  { title: "Hitta partner", description: "Matcha kravspecifikationen mot kundservice-partners", href: "/valjdynamics365partner/" },
];

export const needsAnalysisErpRelatedPages: RelatedPage[] = [
  { title: "Kravspecifikation affärssystem", description: "Bygg vidare på rekommendationen med en strukturerad kravspec", href: "/kravspecifikation/" },
  { title: "Business Central", description: "Produktdetaljer, pris och funktioner för SMB", href: "/businesscentral/" },
  { title: "Finance & Supply Chain", description: "Produktdetaljer, pris och funktioner för enterprise", href: "/finance-supply-chain/" },
  { title: "Jämför BC och F&SCM", description: "Teknisk MOFU-jämförelse av Microsofts ERP-system", href: "/erp/" },
  { title: "Branschlösningar", description: "Branschpaketering av Dynamics 365 ERP", href: "/branscher/" },
  { title: "Hitta partner", description: "Få offerter från Microsoft-partners i Sverige", href: "/valjdynamics365partner/" },
];

export const needsAnalysisCrmRelatedPages: RelatedPage[] = [
  { title: "Kravspecifikation Sales", description: "Bygg en strukturerad kravspec för B2B-CRM", href: "/kravspecifikation-sales/" },
  { title: "Kravspecifikation Marketing", description: "Bygg en kravspec för marketing automation / CDP", href: "/kravspecifikation-marketing/" },
  { title: "Dynamics 365 Sales", description: "CRM för B2B-säljteam – pris och funktioner", href: "/d365sales/" },
  { title: "Customer Insights", description: "Marketing automation och Customer Data Platform", href: "/d365marketing/" },
  { title: "CRM-översikt", description: "Jämför alla Dynamics 365 CRM-applikationer", href: "/crm/" },
  { title: "Hitta CRM-partner", description: "Matcha behovsbilden mot svenska CRM-partners", href: "/valjdynamics365partner/" },
];

export const needsAnalysisCsRelatedPages: RelatedPage[] = [
  { title: "Kravspecifikation Customer Service", description: "Bygg en strukturerad kravspec för kundservice", href: "/kravspecifikation-kundservice/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering – pris och funktioner", href: "/d365customerservice/" },
  { title: "Contact Center", description: "AI-drivet omnikanal-kontaktcenter", href: "/d365contactcenter/" },
  { title: "Field Service", description: "Fältservicehantering med schemaläggning och IoT", href: "/d365fieldservice/" },
  { title: "Hitta partner", description: "Matcha behovsbilden mot kundservice-partners", href: "/valjdynamics365partner/" },
];

// Hitta partner-sidan – BOFU/konvertering. Stötta med behovsanalys + kravspec
// så köpmogna besökare kan skapa underlag innan kontakt.
export const valjPartnerRelatedPages: RelatedPage[] = [
  { title: "Behovsanalys ERP", description: "Få rekommendation Business Central eller Finance & SCM", href: "/ERPbehovsanalys/" },
  { title: "Behovsanalys CRM", description: "Kartlägg sälj- och marknadsbehov inför partnerval", href: "/CRMbehovsanalys/" },
  { title: "Kravspecifikation affärssystem", description: "Skapa underlag innan du begär offert från partner", href: "/kravspecifikation/" },
  { title: "Business Central", description: "ERP för SMB – pris, funktioner och svenska partners", href: "/businesscentral/" },
  { title: "Dynamics 365 Sales", description: "B2B-CRM för säljteam – pris och svenska partners", href: "/d365sales/" },
  { title: "Branschlösningar", description: "Hitta partners med erfarenhet av just din bransch", href: "/branscher/" },
];

// Generella artikellänkar – binder ihop Kunskapscenter med produkt/partner.
export const articleRelatedPages: RelatedPage[] = [
  { title: "Business Central", description: "ERP för SMB – pris, funktioner och svenska partners", href: "/businesscentral/" },
  { title: "Finance & Supply Chain", description: "Enterprise-ERP för globala koncerner", href: "/finance-supply-chain/" },
  { title: "Dynamics 365 Sales", description: "B2B-CRM för säljteam – pipeline och Copilot", href: "/d365sales/" },
  { title: "Customer Service", description: "Helpdesk och ärendehantering med omnikanal", href: "/d365customerservice/" },
  { title: "Branschlösningar", description: "Dynamics 365 per bransch", href: "/branscher/" },
  { title: "Hitta partner", description: "Jämför Microsoft-partners i Sverige", href: "/valjdynamics365partner/" },
];

