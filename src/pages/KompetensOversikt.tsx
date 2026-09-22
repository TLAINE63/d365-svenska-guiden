import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CompetenceFilters from "@/components/kompetens/CompetenceFilters";
import DescribeNeedDialog from "@/components/kompetens/DescribeNeedDialog";
import { CompetenceDisclaimer, SelectionNotice } from "@/components/kompetens/GuideNotices";
import { COMPETENCE_GUIDES, guidePath } from "@/data/competenceGuides";
import { nowrapBrand } from "@/lib/nowrapBrand";
import type { CompetenceFilterState } from "@/lib/competenceMatching";
import { trackCompetenceEvent } from "@/utils/trackCompetenceEvent";
import { ArrowRight } from "lucide-react";

const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Kompetens", url: "/kompetens/" },
];

const KompetensOversikt = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("");
  const [filters, setFilters] = useState<CompetenceFilterState>({});
  const [needOpen, setNeedOpen] = useState(false);

  useEffect(() => {
    trackCompetenceEvent("kompetens_overview_view");
  }, []);

  const selectedGuide = COMPETENCE_GUIDES.find((g) => g.slug === role);

  const search = () => {
    if (!selectedGuide) return;
    const sp = new URLSearchParams();
    if (selectedGuide.type !== "product" && filters.product) sp.set("produkt", filters.product);
    if (filters.industry) sp.set("bransch", filters.industry);
    if (filters.region) sp.set("omrade", filters.region);
    if (filters.delivery) sp.set("leveransform", filters.delivery);
    trackCompetenceEvent("kompetens_search", {
      guide: selectedGuide.slug,
      produkt: filters.product,
      bransch: filters.industry,
      omrade: filters.region,
      leveransform: filters.delivery,
    });
    const qs = sp.toString();
    navigate(`${guidePath(selectedGuide.slug)}${qs ? `?${qs}` : ""}#partners`);
  };

  return (
    <>
      <SEOHead
        title="Hitta rätt Dynamics 365-kompetens"
        description="Förstå vilken kompetens ert projekt behöver och hitta profilerade Dynamics 365-partners med relevant erfarenhet av rollen, produkten och branschen."
        canonicalPath="/kompetens/"
        breadcrumbs={breadcrumbs}
      />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {nowrapBrand("Hitta rätt Dynamics 365-kompetens")}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
            {nowrapBrand(
              "Förstå vilken kompetens ert projekt behöver och hitta profilerade Dynamics 365-partners med relevant erfarenhet."
            )}
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Så fungerar det</h2>
            <ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground leading-relaxed max-w-3xl">
              <li>Välj den roll eller det kompetensområde ni söker.</li>
              <li>Läs vad rollen gör och vad ni bör kontrollera vid utvärdering.</li>
              <li>Filtrera partners på produkt, bransch, område och leveransform.</li>
              <li>Gå vidare till partnerprofilen eller kontakta partnern direkt.</li>
            </ol>
          </section>

          <section className="mb-10 rounded-xl border border-border bg-card p-5">
            <h2 className="text-xl font-bold mb-4">Sök kompetens</h2>
            <div className="mb-4 max-w-sm">
              <Label className="text-xs font-semibold mb-1.5 block">
                Roll eller kompetensområde *
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj roll eller kompetensområde" />
                </SelectTrigger>
                <SelectContent>
                  {COMPETENCE_GUIDES.map((g) => (
                    <SelectItem key={g.slug} value={g.slug}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CompetenceFilters
              value={filters}
              onChange={setFilters}
              lockedProduct={selectedGuide?.type === "product" ? selectedGuide.productArea : undefined}
            />

            <Button className="mt-4" disabled={!selectedGuide} onClick={search}>
              Visa kompetensguide och partners
            </Button>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Kompetensguider</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {COMPETENCE_GUIDES.map((g) => (
                <Link
                  key={g.slug}
                  to={guidePath(g.slug)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--cta-orange))] hover:shadow-md"
                >
                  <h3 className="text-base font-bold mb-1.5">{nowrapBrand(g.title)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {nowrapBrand(g.cardDescription)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cta-orange))]">
                    Läs guiden
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-2">Beskriv ert behov för d365.se</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              Hittar ni inte rätt kompetens? Beskriv behovet, så går vi igenom det och återkommer om
              vi ser ett relevant nästa steg. Behovet skickas inte vidare till partners automatiskt.
            </p>
            <Button
              onClick={() => {
                setNeedOpen(true);
                trackCompetenceEvent("kompetens_need_form_open");
              }}
            >
              Beskriv ert behov
            </Button>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">Vad funktionen inte visar</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              Här visas inga enskilda konsulter, inga CV:n och ingen aktuell kapacitet. Sidorna
              beskriver partners erfarenhet av en typ av uppdrag. Bemanning och tillgänglighet
              bekräftas i dialog med partnern.
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectionNotice />
            <CompetenceDisclaimer />
          </div>
        </div>
      </main>
      <Footer />

      <DescribeNeedDialog
        open={needOpen}
        onOpenChange={setNeedOpen}
        roleLabel={selectedGuide?.title ?? "Ej vald"}
        guideSlug={selectedGuide?.slug}
        filters={filters}
      />
    </>
  );
};

export default KompetensOversikt;
