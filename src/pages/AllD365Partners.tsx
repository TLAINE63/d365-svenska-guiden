import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Users } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import TrustBanner from "@/components/TrustBanner";
import { useUnprofiledPartners } from "@/hooks/useUnprofiledPartners";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { useMemo } from "react";
import partnerDataJson from "@/data/partnerData.json";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Alla D365-partners", url: "https://d365.se/alla-d365-partners" },
];

// Static snapshot of featured partners (built into the bundle so the
// prerendered HTML always lists every profiled partner without requiring
// client-side JavaScript or a network round-trip).
const STATIC_PROFILED = (partnerDataJson as any[])
  .filter((p) => p.is_featured !== false)
  .map((p) => ({ id: p.id as string, slug: p.slug as string, name: p.name as string }))
  .sort((a, b) => a.name.localeCompare(b.name, "sv"));

export default function AllD365Partners() {
  const { data: dbPartners } = usePartners();
  const { data: unprofiled } = useUnprofiledPartners();
  const { data: allNames } = useAllPartnerNames();

  const profiled = useMemo(() => {
    // Prefer live DB data once loaded; otherwise fall back to the static
    // snapshot so SSG/crawlers always see the full list.
    const live = (dbPartners || [])
      .filter((p) => p.is_featured)
      .map((p) => ({ id: p.id, slug: p.slug, name: p.name }));
    const source = live.length > 0 ? live : STATIC_PROFILED;
    return [...source].sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [dbPartners]);

  const others = useMemo(() => {
    const items: { id: string; name: string }[] = [];
    (allNames || [])
      .filter((p) => !p.is_featured)
      .forEach((p) => items.push({ id: `db-${p.id}`, name: p.name }));
    (unprofiled || []).forEach((p) => items.push({ id: `up-${p.id}`, name: p.name }));
    const seen = new Set<string>();
    const deduped = items.filter((it) => {
      const key = it.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    deduped.sort((a, b) => a.name.localeCompare(b.name, "sv"));
    return deduped;
  }, [allNames, unprofiled]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Alla Microsoft Dynamics 365-partners i Sverige"
        description="Komplett lista över Microsoft Dynamics 365-partners i Sverige – profilerade leverantörer på d365.se och övriga aktörer på marknaden. Köparsidig vägledning vid partnerval."
        canonicalPath="/alla-d365-partners/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Users className="w-3.5 h-3.5" /> Marknadsöversikt
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Hela partnermarknaden i Sverige
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              För att ge er en realistisk bild av partnerlandskapet listar vi både de partners som är profilerade på d365.se och övriga svenska Dynamics 365-partners vi känner till. Vill ni veta mer om någon — eller få hjälp att smalna ner kortlistan — hör av er.
            </p>
          </div>
        </section>



        {/* Profiled partners */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Profilerade partners på d365.se
              </h2>
              <p className="text-sm text-muted-foreground">
                Dessa partners har egna profilsidor med fördjupad info om kompetens,
                branscher, referenser och kontakt.
              </p>
            </div>
            {profiled.length === 0 ? (
              <p className="text-sm text-muted-foreground">Laddar…</p>
            ) : (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profiled.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/partner/${p.slug}`}
                      className="group flex items-center justify-between gap-2 p-4 rounded-lg border border-border bg-card hover:border-primary/50  transition-all"
                    >
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {p.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Other partners (non-featured DB entries + curated list) */}
        {others.length > 0 && (
          <section className="py-8 sm:py-12 bg-secondary/40 border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Övriga D365-partners på marknaden
                </h2>
                <p className="text-sm text-muted-foreground max-w-3xl">
                  Dessa partners är verksamma i Sverige men har ännu inte en egen profil
                  här på d365.se. Vi visar deras namn för transparens. Vill du veta mer
                  – eller jämföra dem med profilerade partners – hör av dig.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
                {others.map((p) => (
                  <Badge
                    key={p.id}
                    variant="outline"
                    className="text-sm sm:text-base px-3 py-1.5 bg-card text-foreground border-border font-medium"
                  >
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Vill du ha hjälp att hitta rätt partner?
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              Vi vägleder dig köparsidigt och kostnadsfritt – berätta vad du behöver
              så återkopplar vi med 2–3 lämpliga partners att jämföra.
            </p>
            <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white">
              <Link to="/kontakt/">
                <MessageSquare className="w-4 h-4 mr-2" />
                Kontakta oss för matchning
              </Link>
            </Button>
          </div>
        </section>
        <TrustBanner variant="compact" />

      </main>

      <Footer />
    </div>
  );
}
