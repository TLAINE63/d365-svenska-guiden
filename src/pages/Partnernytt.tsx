import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PartnerNewsCard, {
  partnerNewsProductLabel,
  partnerNewsSourceLabel,
  partnerNewsTypeLabel,
} from "@/components/PartnerNewsCard";
import { usePublishedPartnerNews } from "@/hooks/usePartnerNews";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const PRODUCT_OPTIONS = ["business-central", "finance-scm", "crm-sales", "crm-service", "power-platform", "microsoft-ai", "ovrigt"] as const;
const TYPE_OPTIONS = ["kundcase", "event", "webinar", "erbjudande", "artikel", "rapport", "branschlosning", "produktnyhet", "partnernyhet", "analys"] as const;
const SOURCE_OPTIONS = ["linkedin", "partner_web", "blog", "press", "webinar", "event", "other"] as const;

export default function Partnernytt() {
  const [searchParams, setSearchParams] = useSearchParams();
  const partnerParam = searchParams.get("partner") ?? "all";
  const productParam = searchParams.get("produkt") ?? "all";
  const typeParam = searchParams.get("typ") ?? "all";
  const industryParam = searchParams.get("bransch") ?? "all";
  const sourceParam = searchParams.get("kalla") ?? "all";
  const [sort, setSort] = useState<"latest" | "featured">("latest");

  const { data, isLoading } = usePublishedPartnerNews({});
  const { data: allPartners } = useAllPartnerNames();

  const partners = useMemo(() => {
    const idsWithNews = new Set((data ?? []).map((n) => n.partner_id));
    const map = new Map<string, string>();
    (allPartners ?? []).forEach((p) => {
      if (idsWithNews.has(p.id)) map.set(p.slug, p.name);
    });
    // Fallback for any items whose partner isn't in the RPC result
    (data ?? []).forEach((n) => {
      if (n.partner?.slug && !map.has(n.partner.slug)) map.set(n.partner.slug, n.partner.name);
    });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1], "sv"));
  }, [data, allPartners]);

  // Visa endast nyhetstyper som faktiskt har publicerat innehåll.
  const types = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((n) => n.news_type && set.add(n.news_type));
    return TYPE_OPTIONS.filter((t) => set.has(t));
  }, [data]);

  const industries = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((n) => n.industry && set.add(n.industry));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "sv"));
  }, [data]);

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (partnerParam !== "all") {
      const partnerId = (allPartners ?? []).find((p) => p.slug === partnerParam)?.id;
      list = list.filter((n) => n.partner?.slug === partnerParam || (partnerId && n.partner_id === partnerId));
    }
    if (productParam !== "all") list = list.filter((n) => (n.product_areas && n.product_areas.length > 0 ? n.product_areas.includes(productParam as typeof n.product_area) : n.product_area === productParam));
    if (typeParam !== "all") list = list.filter((n) => n.news_type === typeParam);
    if (industryParam !== "all") list = list.filter((n) => n.industry === industryParam);
    if (sourceParam !== "all") list = list.filter((n) => n.source_type === sourceParam);
    if (sort === "featured") {
      list = [...list].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }
    return list;
  }, [data, allPartners, partnerParam, productParam, typeParam, industryParam, sourceParam, sort]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const hasFilters = [partnerParam, productParam, typeParam, industryParam, sourceParam].some((v) => v !== "all");
  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Partnernytt – utvalt från Dynamics 365-partners | d365.se"
        description="Redaktionellt utvalda nyheter, kundcase, event och erbjudanden från publicerade Dynamics 365-partners på d365.se. Länkar till originalkällan."
        canonicalPath="/partnernytt/"
      />
      <Navbar />
      <main className="pt-24">
        <section className="bg-[hsl(var(--hero-dark))] text-white py-14">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h1 className="text-3xl sm:text-4xl font-bold">Utvalt från Dynamics 365-partners</h1>
            <p className="mt-4 text-lg text-white/80">
              Nyheter, kundcase, event och erbjudanden från publicerade partners på d365.se – redaktionellt utvalda och länkade till originalkällan.
            </p>
          </div>
        </section>

        <section className="py-8 border-b border-border bg-card/40">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <Select value={partnerParam} onValueChange={(v) => setParam("partner", v)}>
                <SelectTrigger><SelectValue placeholder="Partner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla partners</SelectItem>
                  {partners.map(([slug, name]) => (
                    <SelectItem key={slug} value={slug}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={productParam} onValueChange={(v) => setParam("produkt", v)}>
                <SelectTrigger className="text-left min-w-max"><SelectValue placeholder="Produktområde" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla produktområden</SelectItem>
                  {PRODUCT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>{partnerNewsProductLabel(p)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeParam} onValueChange={(v) => setParam("typ", v)}>
                <SelectTrigger><SelectValue placeholder="Nyhetstyp" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla typer</SelectItem>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>{partnerNewsTypeLabel(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={industryParam} onValueChange={(v) => setParam("bransch", v)}>
                <SelectTrigger><SelectValue placeholder="Bransch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla branscher</SelectItem>
                  {industries.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sourceParam} onValueChange={(v) => setParam("kalla", v)}>
                <SelectTrigger><SelectValue placeholder="Källa" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla källor</SelectItem>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{partnerNewsSourceLabel(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v) => setSort(v as "latest" | "featured")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Senast publicerad först</SelectItem>
                  <SelectItem value="featured">Utvalda nyheter först</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasFilters && (
              <div className="mt-3">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="w-3.5 h-3.5 mr-1" /> Rensa filter
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            {isLoading && (
              <p className="text-center text-muted-foreground">Laddar partnernytt…</p>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Inget partnernytt matchar just dina filter. Prova att rensa filtren eller kontakta oss om något specifikt du letar efter.
                </p>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <PartnerNewsCard key={item.id} item={item} clickSource="partnernytt_list" />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
