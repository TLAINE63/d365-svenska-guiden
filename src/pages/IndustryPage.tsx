import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema, ArticleSchema } from "@/components/StructuredData";
import PartnerCard from "@/components/PartnerCard";
import PartnerBasicCard from "@/components/partner/PartnerBasicCard";
import { useBasicPartners } from "@/hooks/useBasicPartners";
import { filterBasicPartners } from "@/lib/basicPartnerMatch";
import WhyTheseResults from "@/components/WhyTheseResults";
import RelatedPages, { branschRelatedPages } from "@/components/RelatedPages";
import { useIndustryPage } from "@/hooks/useIndustryPage";
import { usePartners } from "@/hooks/usePartners";
import { findIndustryBySlug, STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { getIndustrySEO } from "@/data/industrySEO";
import { INDUSTRY_TO_ARTICLE_SLUG } from "@/data/branschguideIndustryMap";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Briefcase, Users, AlertTriangle, Layers, HelpCircle, Filter, Building2, Sparkles } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import { companySizes, geographyOptions } from "@/data/partners";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";

const GEOGRAPHY_HIERARCHY = ["Sverige", "Norden", "Europa", "Globalt"];
const matchesGeography = (partnerGeos: string | string[] | undefined, selected: string): boolean => {
  const geos = Array.isArray(partnerGeos) && partnerGeos.length > 0
    ? partnerGeos
    : typeof partnerGeos === "string" && partnerGeos
    ? [partnerGeos]
    : ["Sverige"];
  const selectedIndex = GEOGRAPHY_HIERARCHY.indexOf(selected);
  if (selectedIndex === -1) return false;
  return geos.some((geo) => GEOGRAPHY_HIERARCHY.indexOf(geo) >= selectedIndex);
};

import BusinessCentralIcon from "@/assets/icons/BusinessCentral.svg";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";

// Industry hero images (webp). Falls back to a default gradient if missing.
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import konsultforetagImg from "@/assets/industries/konsultforetag.webp";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.webp";
import fastigheterImg from "@/assets/industries/fastigheter.webp";
import energiImg from "@/assets/industries/energi.webp";
import finansForsakringImg from "@/assets/industries/finans-forsakring.webp";
import lakemedelImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import mediaPublishingImg from "@/assets/industries/media-publishing.webp";
import jordbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import halsaImg from "@/assets/industries/halsa-sjukvard.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";
import utbildningImg from "@/assets/industries/utbildning.webp";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";

const INDUSTRY_IMAGES: Record<string, string> = {
 "tillverkning": tillverkningImg,
 "livsmedel-processindustri": livsmedelsImg,
 "grossist-distribution": handelDistributionImg,
 "retail-ehandel": detaljhandelImg,
 "konsulttjanster": konsultforetagImg,
 "bygg-entreprenad": byggEntreprenadImg,
 "fastighet-forvaltning": fastigheterImg,
 "energi-utilities": energiImg,
 "finans-forsakring": finansForsakringImg,
 "life-science-medtech": lakemedelImg,
 "telekom-it-tjanster": itTechImg,
 "logistik-transport": transportLogistikImg,
 "media-publishing": mediaPublishingImg,
 "jordbruk-skogsbruk": jordbrukImg,
 "halsa-sjukvard": halsaImg,
 "nonprofit-organisationer": medlemsorganisationerImg,
 "medlemsorganisationer": medlemsorganisationerImg,
 "utbildning": utbildningImg,
 "offentlig-sektor": offentligSektorImg,
 "uthyrning": uthyrningImg,
};

// Product filters mapped to product_filters keys in the database.
// Visningen är granulär (Sales / Customer Insights / Customer Service / Field Service / Contact Center)
// men matchningen sker mot de fyra underliggande nycklarna i product_filters.
type UnderlyingKey = "bc" | "fsc" | "sales" | "service";
type FilterKey = "bc" | "fsc" | "sales" | "ci" | "cs" | "fs" | "cc";
const FILTER_TO_UNDERLYING: Record<FilterKey, UnderlyingKey> = {
 bc: "bc",
 fsc: "fsc",
 sales: "sales",
 ci: "sales",
 cs: "service",
 fs: "service",
 cc: "service",
};
const PRODUCT_FILTERS: { key: FilterKey; label: string; icon: string }[] = [
 { key: "bc", label: "Business Central", icon: BusinessCentralIcon },
 { key: "fsc", label: "Finance & Supply Chain", icon: FinanceIcon },
 { key: "sales", label: "Sales", icon: SalesIcon },
 { key: "ci", label: "Customer Insights (Marketing Automation)", icon: MarketingIcon },
 { key: "cs", label: "Customer Service", icon: CustomerServiceIcon },
 { key: "fs", label: "Field Service", icon: FieldServiceIcon },
 { key: "cc", label: "Contact Center", icon: ContactCenterIcon },
];

// Simple seeded shuffle for stable random order per session+industry
const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
 const out = [...arr];
 let s = seed || 1;
 for (let i = out.length - 1; i > 0; i--) {
 s = (s * 1103515245 + 12345) & 0x7fffffff;
 const j = Math.floor((s / 0x7fffffff) * (i + 1));
 [out[i], out[j]] = [out[j], out[i]];
 }
 return out;
};

const hashString = (s: string): number => {
 let h = 0;
 for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
 return Math.abs(h);
};

interface IndustryPageProps {
 initialPartners?: any[] | null;
}

const IndustryPage = ({ initialPartners }: IndustryPageProps = {}) => {
 const { slug } = useParams<{ slug: string }>();
 const meta = slug ? findIndustryBySlug(slug) : undefined;
 const { page, loading } = useIndustryPage(slug);
 const { data: partnersLive } = usePartners();
 // Prefer live data after hydration; fall back to SSR-injected partners
 const partners = partnersLive ?? initialPartners ?? undefined;
 const [selected, setSelected] = useState<FilterKey[]>([]);
 const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
 const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);

 // Publish current filters to partner-compare so a "Jämför"-navigering
 // carries product/industry/geo/size into the compare page.
 const { setFilterContext: setCompareFilters } = usePartnerCompare();
 useEffect(() => {
  const industryName = meta?.name || null;
  const productKeys = Array.from(new Set(selected.map((k) => FILTER_TO_UNDERLYING[k])));
  setCompareFilters({
   product: productKeys.length > 0 ? productKeys.join(",") : null,
   industry: industryName,
   geography: selectedGeography || null,
   companySize: selectedCompanySize || null,
  });
 }, [selected, meta, selectedGeography, selectedCompanySize, setCompareFilters]);

 const industryName = page?.name || meta?.name || "Bransch";
 const heroImage = slug ? INDUSTRY_IMAGES[slug] : undefined;
 const seoDefaults = getIndustrySEO(slug);

 const matchingPartners = useMemo(() => {
 if (!partners || !meta) return [];
 const industryName = meta.name;

 const underlyingSelected = Array.from(
 new Set(selected.map((k) => FILTER_TO_UNDERLYING[k])),
 );
 const productKeysToCheck: UnderlyingKey[] =
 underlyingSelected.length > 0 ? underlyingSelected : ["bc", "fsc", "sales", "service"];

 const filtered = partners.filter((p: any) => {
 if (p.is_featured !== true) return false;
 const pf = p.product_filters || {};
 // Bransch måste matcha (inom valda produkter om filter satt, annars valfri källa)
 const industryMatch =
 underlyingSelected.length > 0
 ? underlyingSelected.some((k) => {
 const inds = pf[k]?.industries || [];
 const sec = pf[k]?.secondaryIndustries || [];
 return inds.includes(industryName) || sec.includes(industryName);
 })
 : collectPartnerIndustries(p).has(industryName);
 if (!industryMatch) return false;

 // Geografi/storlek: kräver att MINST EN produkt (av de relevanta) uppfyller filtren
 if (selectedGeography || selectedCompanySize) {
 return productKeysToCheck.some((k) => {
 const f = pf[k];
 if (!f) return false;
 const inds = f.industries || [];
 const sec = f.secondaryIndustries || [];
 if (!inds.includes(industryName) && !sec.includes(industryName)) return false;
 if (selectedGeography && !matchesGeography(f.geography, selectedGeography)) return false;
 if (selectedCompanySize && !(f.companySize || []).includes(selectedCompanySize)) return false;
 return true;
 });
 }
 return true;
 });

 const seed = hashString(`${slug}-${selected.join(",")}-${selectedGeography || ""}-${selectedCompanySize || ""}`);
 return seededShuffle(filtered, seed);
 }, [partners, meta, selected, slug, selectedGeography, selectedCompanySize]);

 const matchingBasicPartners = useMemo(() => {
  if (!meta) return [];
  const underlyingSelected = Array.from(new Set(selected.map((k) => FILTER_TO_UNDERLYING[k])));
  const labelByKey: Record<string, string> = {
   bc: "Business Central",
   fsc: "Finance & SCM",
   sales: "Sales",
   service: "Customer Service",
  };
  return filterBasicPartners(basicPartners || [], {
   applications: underlyingSelected.map((k) => labelByKey[k]).filter(Boolean),
   industry: meta.name,
   companySize: selectedCompanySize,
   geography: selectedGeography,
  });
 }, [basicPartners, meta, selected, selectedGeography, selectedCompanySize]);

 if (!loading && !page) {
 return (
 <>
 <SEOHead
 title={`${industryName} – Dynamics 365`}
 description="Branschsidan är inte publicerad ännu."
 canonicalPath={`/branscher/${slug}`}
 noIndex
 />
 <Navbar />
 <main className="min-h-screen bg-background pt-24">
 <div className="container mx-auto px-4 max-w-3xl text-center py-10">
 <h1 className="text-2xl md:text-3xl font-bold mb-3">{industryName}</h1>
 <p className="text-muted-foreground mb-6">
 Innehållet för denna bransch är på väg. Under tiden kan du hitta partners eller göra en behovsanalys.
 </p>
 <div className="flex flex-wrap gap-3 justify-center">
 <Link to="/valjdynamics365partner" className="text-primary hover:underline">Hitta partner →</Link>
 <Link to="/ERPbehovsanalys" className="text-primary hover:underline">Gör en behovsanalys →</Link>
 <Link to="/branscher" className="text-primary hover:underline">Alla branscher →</Link>
 </div>
 </div>
 </main>
 <Footer />
 </>
 );
 }

 return (
 <>
 <SEOHead
 title={
 page?.meta_title ||
 seoDefaults?.title ||
 `${industryName} – Microsoft Dynamics 365`
 }
 description={
 page?.meta_description ||
 seoDefaults?.description ||
 `Microsoft Dynamics 365 för ${industryName.toLowerCase()}: affärsprocesser, utmaningar, roller och partners.`
 }
 canonicalPath={`/branscher/${slug}`}
 ogImage={heroImage}
 ogImageAlt={`${industryName} – Microsoft Dynamics 365`}
 ogType="article"
 articlePublishedTime={(page as any)?.updated_at || "2024-01-01T00:00:00+01:00"}
 articleModifiedTime={(page as any)?.updated_at || "2024-01-01T00:00:00+01:00"}
 articleAuthor="Thomas Laine"
 articleSection={industryName}
 />
 <BreadcrumbSchema
 items={[
 { name: "Hem", url: "https://d365.se/" },
 { name: "Branscher", url: "https://d365.se/branscher" },
 { name: industryName, url: `https://d365.se/branscher/${slug}` },
 ]}
 />
 <ArticleSchema
 headline={(page as any)?.h1 || `${industryName} – Microsoft Dynamics 365`}
 description={
 page?.meta_description ||
 `Microsoft Dynamics 365 för ${industryName.toLowerCase()}: affärsprocesser, utmaningar, roller och partners.`
 }
 url={`https://d365.se/branscher/${slug}/`}
 image={heroImage}
 datePublished={(page as any)?.created_at || (page as any)?.updated_at || "2024-01-01T00:00:00+01:00"}
 dateModified={(page as any)?.updated_at || "2024-01-01T00:00:00+01:00"}
 section={industryName}
 />
 {page?.faq && page.faq.length > 0 && (
 <FAQSchema faqs={page.faq.map((f) => ({ question: f.q, answer: f.a }))} />
 )}

 <Navbar />
 <main className="min-h-screen bg-background pt-12 lg:pt-28">
 {/* Hero med bakgrundsbild */}
 <section className="relative border-b border-border overflow-hidden min-h-[320px] md:min-h-[420px] flex items-center">
 {heroImage ? (
 <>
 <div
 className="absolute inset-0 bg-cover bg-center scale-105"
 style={{ backgroundImage: `url(${heroImage})` }}
 aria-hidden
 />
 <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20" aria-hidden />
 <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" aria-hidden />
 </>
 ) : (
 <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" aria-hidden />
 )}
 <div className="relative container mx-auto px-4 max-w-5xl py-8 md:py-12">
 <nav className="text-xs text-muted-foreground mb-2">
 <Link to="/" className="hover:text-foreground">Hem</Link>
 <span className="mx-2">/</span>
 <Link to="/branscher" className="hover:text-foreground">Branscher</Link>
 <span className="mx-2">/</span>
 <span className="text-foreground">{industryName}</span>
 </nav>
 <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2 drop-">
 {seoDefaults?.h1 || `Dynamics 365 för ${industryName} – guide & partners i Sverige`}
 </h1>
 <div className="mb-3">
 <span
 title="Innehållet på denna branschsida är initialt genererat med AI och granskat redaktionellt. Partnerdata är manuellt kvalitetssäkrad."
 className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
 >
 <Sparkles className="w-3 h-3" />
 AI-assisterat innehåll
 </span>
 </div>
 {page?.intro && (
 <p className="text-xs md:text-sm text-foreground/90 leading-relaxed max-w-3xl whitespace-pre-line">
 {page.intro}
 </p>
 )}
 <a
 href="#partners"
 className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
 >
 <Building2 className="w-4 h-4" />
 Se {matchingPartners.length === 1 ? 'en partner' : `${matchingPartners.length} partners`} inom {industryName.toLowerCase()}
 <ArrowRight className="w-4 h-4" />
 </a>
 </div>
 </section>

      {/* Dold tills vidare: Hur passar Dynamics 365 för branschen */}
      {false && (
        <ShortAnswer title={`Hur passar Dynamics 365 för ${industryName.toLowerCase()}`}>
          För <strong>{industryName.toLowerCase()}</strong> är Microsoft Dynamics 365 en bred plattform där rätt
          val av app (Business Central, Finance &amp; Supply Chain, Sales, Customer Service m.fl.) och
          partner spelar större roll än produkten i sig. På d365.se hittar du {matchingPartners.length}{' '}
          {matchingPartners.length === 1 ? 'partner' : 'partners'} med dokumenterad erfarenhet av{' '}
          {industryName.toLowerCase()} – jämför kompetens, branschreferenser och geografisk närvaro
          köparsidigt, utan att bli kontaktad förrän du själv väljer det.
        </ShortAnswer>
      )}

 {/* Innehåll – full bredd */}
 <section className="pt-4 md:pt-6 pb-10 border-b border-border">
 <div className="container mx-auto px-4 max-w-5xl space-y-10">
 {/* Collapsible sektioner – endast rubriker visas tills man klickar */}
 <Accordion type="multiple" className="space-y-3">
 {page?.processes && page.processes.length > 0 && (
 <AccordionItem value="processes" className="border border-border rounded-lg bg-card px-5">
 <AccordionTrigger className="hover:no-underline py-4">
 <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
 <Briefcase className="w-5 h-5 text-primary" />
 Typiska affärsprocesser
 </span>
 </AccordionTrigger>
 <AccordionContent>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
 {page.processes.map((p, i) => (
 <div key={i} className="rounded-lg border border-border bg-background p-5">
 <h2 className="font-semibold text-foreground mb-2">{p.title}</h2>
 <p className="text-sm text-muted-foreground">{p.description}</p>
 </div>
 ))}
 </div>
 </AccordionContent>
 </AccordionItem>
 )}


 {page?.challenges && page.challenges.length > 0 && (
 <AccordionItem value="challenges" className="border border-border rounded-lg bg-card px-5">
 <AccordionTrigger className="hover:no-underline py-4">
 <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
 <AlertTriangle className="w-5 h-5 text-primary" />
 Vanliga utmaningar
 </span>
 </AccordionTrigger>
 <AccordionContent>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
 {page.challenges.map((c, i) => (
 <div key={i} className="rounded-lg border border-border bg-background p-5">
 <h2 className="font-semibold text-foreground mb-2">{c.title}</h2>
 <p className="text-sm text-muted-foreground">{c.description}</p>
 </div>
 ))}
 </div>
 </AccordionContent>
 </AccordionItem>
 )}

            {/* Dold tills vidare: Roller & funktioner */}
            {false && page?.roles && page.roles.length > 0 && (
              <AccordionItem value="roles" className="border border-border rounded-lg bg-card px-5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                    <Users className="w-5 h-5 text-primary" />
                    Roller & funktioner
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
                    {page.roles.map((r, i) => (
                      <div key={i} className="rounded-lg border border-border bg-background p-5">
                        <h2 className="font-semibold text-foreground mb-2">{r.role}</h2>
                        <p className="text-sm text-muted-foreground">{r.needs}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

 {page?.applications && page.applications.length > 0 && (
 <AccordionItem value="applications" className="border border-border rounded-lg bg-card px-5">
 <AccordionTrigger className="hover:no-underline py-4">
 <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
 <Layers className="w-5 h-5 text-primary" />
 Dynamics 365-applikationer som passar branschen
 </span>
 </AccordionTrigger>
 <AccordionContent>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
 {page.applications.map((a, i) => (
 <div key={i} className="rounded-lg border border-border bg-background p-5">
 <Badge variant="outline" className="mb-2">{a.app}</Badge>
 <p className="text-sm text-muted-foreground">{a.relevance}</p>
 </div>
 ))}
 </div>
 </AccordionContent>
 </AccordionItem>
 )}

 {page?.faq && page.faq.length > 0 && (
 <AccordionItem value="faq" className="border border-border rounded-lg bg-card px-5">
 <AccordionTrigger className="hover:no-underline py-4">
 <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
 <HelpCircle className="w-5 h-5 text-primary" />
 Vanliga frågor
 </span>
 </AccordionTrigger>
 <AccordionContent>
 <div className="space-y-3 pt-2 pb-4">
 {page.faq.map((f, i) => (
 <div key={i} className="rounded-lg border border-border bg-background p-5">
 <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
 <p className="text-sm text-muted-foreground whitespace-pre-line">{f.a}</p>
 </div>
 ))}
 </div>
 </AccordionContent>
 </AccordionItem>
 )}
 </Accordion>
 </div>
 </section>

 {/* Partners + produktfilter längst ned */}
 <section id="partners" className="py-12 border-b border-border bg-muted/20">
 <div className="container mx-auto px-4 max-w-5xl">
 <div className="flex items-center gap-2 mb-2">
 <Building2 className="w-5 h-5 text-primary" />
 <h2 className="text-2xl font-bold">
 {matchingPartners.length === 1 ? '1 partner' : `${matchingPartners.length} partners`} inom {industryName}
 </h2>
 </div>
 <p className="text-sm text-muted-foreground mb-6">
 Profilerade mot {industryName.toLowerCase()}. Filtrera per produktområde nedan.
 </p>

 <div className="mb-6">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide">
 <Filter className="w-3.5 h-3.5" />
 Filtrera per produktområde
 </div>
 {selected.length > 0 && (
 <button
 onClick={() => setSelected([])}
 className="text-xs text-primary hover:underline"
 >
 Rensa
 </button>
 )}
 </div>
 <div className="flex flex-wrap gap-2">
 {PRODUCT_FILTERS.map((f) => {
 const active = selected.includes(f.key);
 return (
 <button
 key={f.key}
 onClick={() =>
 setSelected((prev) =>
 active ? prev.filter((k) => k !== f.key) : [...prev, f.key],
 )
 }
 className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-all ${
 active
 ? "bg-primary text-primary-foreground border-primary "
 : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/40"
 }`}
 >
 <img src={f.icon} alt="" className="w-4 h-4 flex-shrink-0" />
 <span>{f.label}</span>
 </button>
 );
 })}
  </div>
 </div>

 <div className="mb-6 rounded-lg border border-border bg-background p-4">
 <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
 <Filter className="w-3.5 h-3.5" />
 Filtrera ytterligare – företagsstorlek och geografi
 </div>
 <FilterButtons
 title="Företagsstorlek – antal anställda"
 icon="employees"
 options={companySizes.map((s) => ({ label: s, value: s }))}
 selectedValue={selectedCompanySize}
 onSelect={setSelectedCompanySize}
 colorScheme="primary"
 />
 <FilterButtons
 title="Geografi"
 icon="geography"
 options={geographyOptions.map((g) => ({ label: g, value: g }))}
 selectedValue={selectedGeography}
 onSelect={setSelectedGeography}
 colorScheme="primary"
 />
 </div>

 {matchingPartners.length === 0 ? (
 <div className="text-center py-10 text-muted-foreground text-sm rounded-lg border border-dashed border-border bg-background">
 <p className="mb-3">Inga matchande partners just nu.</p>
 <Link to="/kontakt/" className="text-primary hover:underline">
 Kontakta oss →
 </Link>
 </div>
  ) : (
   <>
   <WhyTheseResults className="mb-4" />
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   {matchingPartners.map((p) => {
   const activeProductKey =
   selected.length === 1 ? FILTER_TO_UNDERLYING[selected[0]] : null;
   const highlightedProductLabel =
   selected.length >= 1
   ? selected.map((k) => PRODUCT_FILTERS.find((f) => f.key === k)?.label || k).join(", ")
   : undefined;
   return (
    <PartnerCard
    key={p.id}
    partner={p as any}
    profileUrl={`/partner/${(p as any).slug}`}
    highlightedIndustry={meta?.name}
    highlightedGeography={selectedGeography || undefined}
    highlightedCompanySize={selectedCompanySize || undefined}
    highlightedProduct={highlightedProductLabel}
    productKey={activeProductKey as any}
    showIndustryPitch
    />


  );
  })}
  </div>
   </>
   )}

 {matchingBasicPartners.length > 0 && (
  <div className="mt-10 border-t border-dashed border-border pt-8">
   <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
    {matchingBasicPartners.length === 1
     ? "1 identifierad partner"
     : `${matchingBasicPartners.length} identifierade partners`}{" "}
    inom {industryName}
   </h3>
   <p className="text-sm text-muted-foreground mb-5 max-w-3xl">
    Grundläggande information sammanställd av d365.se från publika källor. Profilerna är
    ännu inte verifierade av partnern och saknar därför kontaktuppgifter och detaljerade
    kompetenser. Hör av dig till oss så hjälper vi dig vidare.
   </p>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {matchingBasicPartners.map((bp) => (
     <PartnerBasicCard key={bp.id} partner={bp} variant="list" />
    ))}
   </div>
  </div>
 )}
 </div>
 </section>

 {/* Branschguide-artikel + andra branscher */}
 <section className="py-10 border-b border-border">
 <div className="container mx-auto px-4 max-w-5xl">
 {slug && INDUSTRY_TO_ARTICLE_SLUG[slug] && (
 <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-5">
 <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
 Fördjupande artikel
 </p>
 <Link
 to={`/artiklar/${INDUSTRY_TO_ARTICLE_SLUG[slug]}/`}
 className="text-base md:text-lg font-semibold text-foreground hover:text-primary inline-flex items-center gap-2"
 >
 Dynamics 365 för {industryName} – branschguide
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 )}
 <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">
 Utforska andra branscher
 </h2>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
 {STANDARD_INDUSTRIES.filter((i) => i.slug !== slug).map((i) => (
 <Link
 key={i.slug}
 to={`/branscher/${i.slug}/`}
 className="text-sm text-muted-foreground hover:text-primary hover:underline truncate"
 >
 {i.name}
 </Link>
 ))}
 </div>
 </div>
 </section>

 {/* Relaterade pelarsidor – interna länkar för SEO/AIO */}
 <RelatedPages heading="Utforska Dynamics 365" pages={branschRelatedPages} />

 {/* CTA */}
 <section className="py-12">
 <div className="container mx-auto px-4 max-w-4xl">
 <div className="rounded border border-border bg-card p-8 text-center">
 <h2 className="text-xl md:text-2xl font-bold mb-3">
 Nästa steg för {industryName.toLowerCase()}
 </h2>
 <p className="text-sm text-muted-foreground mb-5 max-w-2xl mx-auto">
 Gör en kostnadsfri behovsanalys eller låt oss matcha dig med partners som kan din bransch.
 </p>
 <div className="flex flex-wrap gap-3 justify-center">
 <Link
 to="/ERPbehovsanalys"
 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
 >
 Behovsanalys ERP <ArrowRight className="w-4 h-4" />
 </Link>
 <Link
 to="/valjdynamics365partner"
 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm font-medium hover:border-primary/50"
 >
 Hitta partner
 </Link>
 </div>
 </div>
 </div>
 </section>
 </main>
 <Footer />
 </>
 );
};

export default IndustryPage;
