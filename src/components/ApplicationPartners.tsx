import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import SearchResultSummary from "@/components/partner/SearchResultSummary";
import WhyTheseResults from "@/components/WhyTheseResults";
import { allIndustries } from "@/data/partners";
import { SizeFilters } from "@/components/SizeFilters";
import { usePartners } from "@/hooks/usePartners";
import UnprofiledPartnersList from "@/components/UnprofiledPartnersList";
import { buildPartnerProductPath } from "@/lib/partnerProductSlug";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { appToProductFilterKey } from "@/lib/productFilterGroup";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";

// Geography filter options
const geographyFilters = [
 { label: "Sverige", value: "Sverige" },
 { label: "Norden", value: "Norden" },
 { label: "Europa", value: "Europa" },
 { label: "Globalt", value: "Globalt" }
];

interface ApplicationPartnersProps {
  applicationFilter: string;
  pageSource: string;
  /** "industry" (default) shows bransch-filter, "companySize" shows storleksfilter istället. */
  filterMode?: "industry" | "companySize";
  /** Visa sektionen "Övriga partners som arbetar med ...". Standard true. */
  showUnprofiledList?: boolean;
}

const ApplicationPartners = ({ applicationFilter, pageSource, filterMode = "industry", showUnprofiledList = true }: ApplicationPartnersProps) => {
 const { data: dbPartners, isLoading } = usePartners();
 const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
 const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
 const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
 const [selectedRevenue, setSelectedRevenue] = useState<string | null>(null);

 // Låt aktiva filter följa med till jämförelsesidan
 const { setFilterContext: setCompareFilters } = usePartnerCompare();
 useEffect(() => {
  setCompareFilters({
   product: appToProductFilterKey(applicationFilter),
   industry: selectedIndustry || null,
   geography: selectedGeography || null,
   companySize: selectedCompanySize || null,
   revenue: selectedRevenue || null,
  });
 }, [applicationFilter, selectedIndustry, selectedGeography, selectedCompanySize, selectedRevenue, setCompareFilters]);

 // Filter to only show featured partners
 const partners = useMemo(() => {
 return (dbPartners || []).filter(p => p.is_featured === true);
 }, [dbPartners]);

 // Determine which product key to use based on application filter
 const productKey: 'bc' | 'fsc' | 'sales' | 'service' | null = useMemo(() => {
 if (applicationFilter === "Business Central") return 'bc';
 if (applicationFilter === "Finance & SCM") return 'fsc';
 if (["Commerce", "Human Resources"].includes(applicationFilter)) return 'fsc';
 if (["Sales", "Customer Insights (Marketing)"].includes(applicationFilter)) {
 return 'sales';
 }
 if (["Customer Service", "Field Service", "Contact Center", "Project Operations"].includes(applicationFilter)) {
 return 'service';
 }
 return null;
 }, [applicationFilter]);

 // Session-stable seed for consistent random ordering
 const sessionSeed = useMemo(() => Math.floor(Math.random() * 1000000), []);
 
 const filteredPartners = useMemo(() => {
 if (!productKey) return [];
 
 // Only show partners with product_filters for this product
 let result = partners.filter(partner => partner.product_filters?.[productKey]);
 
 // Apply product-specific filters
 result = result.filter(partner => {
 const pf = partner.product_filters?.[productKey];
 if (!pf) return false;
 if (selectedIndustry && !pf.industries?.includes(selectedIndustry)) return false;
 if (selectedCompanySize && !pf.companySize?.includes(selectedCompanySize)) return false;
 if (selectedRevenue && !(pf as any).revenue?.includes(selectedRevenue)) return false;
 if (selectedGeography) {
 // Geography is now an array - check if partner covers the selected geography
 const partnerGeo = Array.isArray(pf.geography) ? pf.geography : (pf.geography ? [pf.geography] : ["Sverige"]);
 const geoHierarchy = ["Sverige", "Norden", "Europa", "Globalt"];
 const selIdx = geoHierarchy.indexOf(selectedGeography);
 // Partner matches if they have the selected geography or a broader one
 const maxPartnerIdx = Math.max(...partnerGeo.map(g => geoHierarchy.indexOf(g)));
 if (maxPartnerIdx < selIdx) return false;
 }
 return true;
 });
 
 // Seeded shuffle for fair exposure
 const seededShuffle = <T,>(array: T[], seed: number): T[] => {
 const shuffled = [...array];
 let currentIndex = shuffled.length;
 let currentSeed = seed;
 
 const seededRandom = () => {
 currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
 return currentSeed / 0x7fffffff;
 };
 
 while (currentIndex > 0) {
 const randomIndex = Math.floor(seededRandom() * currentIndex);
 currentIndex--;
 [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
 }
 
 return shuffled;
 };
 
 // Avtals-signerade partners prioriteras alltid först
 const signed = result.filter(p => p.agreement_signed);
 const unsigned = result.filter(p => !p.agreement_signed);
 return [
 ...seededShuffle(signed, sessionSeed),
 ...seededShuffle(unsigned, sessionSeed + 1),
 ];
 }, [productKey, partners, selectedIndustry, selectedCompanySize, selectedRevenue, selectedGeography, sessionSeed]);

 // Show all 18 industries in the filter
 const availableIndustries = allIndustries;

 usePartnerImpressions(
  selectedIndustry || selectedGeography || selectedCompanySize || selectedRevenue
   ? "partner_filter_impression"
   : "partner_list_impression",
  filteredPartners,
  {
   surface: "product_page",
   product: applicationFilter,
   industry: selectedIndustry,
   geography: selectedGeography,
   companySize: selectedCompanySize,
   revenue: selectedRevenue,
  },
  !isLoading,
 );

 if (isLoading) {
 return (
 <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6 flex justify-center">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 </div>
 </section>
 );
 }

 return (
 <section id="partners" className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="text-center mb-8 sm:mb-10 md:mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Hitta rätt partner
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
 Här är ett urval av partners som arbetar med {applicationFilter} i Sverige.
 {filterMode === "companySize"
 ? " Filtrera på din storlek (antal anställda och omsättning) och geografi för att hitta partners som passar dig bäst."
 : " Filtrera på bransch, storlek (antal anställda och omsättning) och geografi för att hitta partners som passar dig bäst."}
 </p>
 </div>

 {/* Industry Filter – döljs när filterMode = companySize */}
 {filterMode === "industry" && (
 <FilterButtons
 title="Filtrera på bransch"
 icon="industry"
 options={availableIndustries.map(ind => ({ label: ind, value: ind }))}
 selectedValue={selectedIndustry}
 onSelect={setSelectedIndustry}
 colorScheme="crm"
 />
 )}

 {/* Storleksfilter – antal anställda och omsättning visas alltid */}
 <SizeFilters
 selectedCompanySize={selectedCompanySize}
 selectedRevenue={selectedRevenue}
 onCompanySizeChange={setSelectedCompanySize}
 onRevenueChange={setSelectedRevenue}
 colorScheme="crm"
 />

 {/* Geography Filter */}
  <FilterButtons
  title="Var behöver du leverans och support? (Sverige, Norden, Europa, Globalt)"
 icon="geography"
 options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
 selectedValue={selectedGeography}
 onSelect={setSelectedGeography}
 colorScheme="crm"
 />


 {/* Resultathuvud – användarens sökning visas en gång ovanför korten */}
 {(selectedIndustry || selectedGeography || selectedCompanySize || selectedRevenue) && (
 <>
 <SearchResultSummary
 count={filteredPartners.length}
 criteria={[
 applicationFilter,
 selectedIndustry,
 selectedGeography,
 selectedCompanySize ? `${selectedCompanySize} anställda` : null,
 selectedRevenue,
 ]}
 onChangeFilters={() => {
 if (typeof document !== "undefined") {
 document.getElementById("partners")?.scrollIntoView({ behavior: "smooth", block: "start" });
 }
 }}
 />
 <div className="text-center -mt-4 mb-8">
 <Button
 variant="ghost"
 size="sm"
 onClick={() => {
 setSelectedIndustry(null);
 setSelectedGeography(null);
 setSelectedCompanySize(null);
 setSelectedRevenue(null);
 }}
 className="text-muted-foreground hover:text-foreground"
 >
 Rensa alla filter
 </Button>
 </div>
 </>
 )}


  <WhyTheseResults className="mb-6 max-w-4xl mx-auto" />

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredPartners.map((partner, index) => {
 // Build profile URL with filter context
 const basePath = buildPartnerProductPath(partner.slug, applicationFilter);
 const params = new URLSearchParams();
 if (selectedIndustry) params.set("industry", selectedIndustry);
 if (selectedGeography) params.set("geography", selectedGeography);
 const qs = params.toString();
 const profileUrl = qs ? `${basePath}?${qs}` : basePath;
 
 return (
 <PartnerCard
 key={index}
 partner={partner}
 profileUrl={profileUrl}
 colorScheme="crm"
 productKey={productKey}
 highlightedProduct={applicationFilter}
 highlightedIndustry={selectedIndustry || undefined}
 highlightedGeography={selectedGeography || undefined}
 highlightedCompanySize={selectedCompanySize || undefined}
 showRandomIndicator={true}
 resultView
 />
 );
 })}
 </div>

 {filteredPartners.length === 0 && (
 <div className="text-center py-6">
 <h3 className="text-lg font-semibold text-foreground mb-2">Inga partner listas med denna filtrering?</h3>
 <p className="text-muted-foreground">
 Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
 </p>
 </div>
 )}

 <div className="text-center mt-8">
 <Button asChild variant="outline" size="lg">
<Link to="/valjdynamics365partner/#alla-partners-rubrik">
  Se alla partners
  <ArrowRight className="ml-2 h-4 w-4" />
</Link>
 </Button>
 </div>

 {/* Lead CTA - shows when partners are filtered */}
 {(selectedIndustry || selectedGeography || selectedCompanySize) && (
 <div className="max-w-xl mx-auto mt-12">
 {/* Premium Contact CTA Card - same design as PartnerProfile */}
 <article className="relative rounded overflow-hidden ">
 {/* Gradient background */}
 <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
 
 {/* Animated orb */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/40 to-transparent rounded animate-pulse" />
 
 <div className="relative p-6 sm:p-8">
 <div className="flex items-start gap-4 mb-6">
 <div className="p-3 rounded bg-gradient-to-br from-primary to-accent shadow-primary/30">
 <span className="text-xl">✨</span>
 </div>
 <div>
 <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
 Låt oss hjälpa dig hitta rätt partner
 </h3>
 <p className="text-white/70 text-sm sm:text-base">
 Det här var ett första steg i rätt riktning. Låt oss hjälpa dig vidare – helt kostnadsfritt.
 </p>
 </div>
 </div>
 
 {/* Filter context with glass effect */}
 <div className="mb-6 p-4 bg-white/10 rounded border border-white/20">
 <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded bg-amber-400 animate-pulse" />
 Din sökning
 </p>
 <div className="flex flex-wrap gap-2">
 <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 ">
 {applicationFilter}
 </Badge>
 {selectedIndustry && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedIndustry}
 </Badge>
 )}
 {selectedCompanySize && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedCompanySize} anställda
 </Badge>
 )}
 {selectedGeography && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedGeography}
 </Badge>
 )}
 </div>
 </div>
 
 <LeadCTA
 sourcePage={pageSource}
 selectedProduct={applicationFilter}
 selectedIndustry={selectedIndustry || undefined}
 variant="inline"
 />
 </div>
 </article>
 </div>
 )}
 </div>

  {/* Övriga partners som angett att de arbetar med denna produkt men inte är publicerade */}
  {productKey && showUnprofiledList && (
    <UnprofiledPartnersList
      variant="teaser"
      showSeeAllLink
      productKey={productKey}
      productLabel={applicationFilter}
      industry={selectedIndustry || null}
    />
  )}
 </section>
 );
};

export default ApplicationPartners;
