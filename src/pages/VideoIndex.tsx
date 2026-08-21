import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { useD365Videos, type D365Video } from "@/hooks/useD365Videos";
import D365VideoCard from "@/components/D365VideoCard";
import D365VideoPlayerDialog from "@/components/D365VideoPlayerDialog";
import {
  VIDEO_PRODUCT_GROUPS,
  VIDEO_QUESTION_TYPES,
  videoProductLabel,
  videoQuestionLabel,
} from "@/lib/d365VideoTaxonomy";

const VideoIndex = () => {
  const { videos, loading } = useD365Videos();
  const [product, setProduct] = useState<string>("alla");
  const [question, setQuestion] = useState<string>("alla");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<D365Video | null>(null);

  const availableProducts = useMemo(
    () => VIDEO_PRODUCT_GROUPS.filter((p) => videos.some((v) => v.product_groups?.includes(p))),
    [videos],
  );
  const availableQuestions = useMemo(
    () => VIDEO_QUESTION_TYPES.filter((q) => videos.some((v) => v.question_types?.includes(q))),
    [videos],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      if (product !== "alla" && !v.product_groups?.includes(product)) return false;
      if (question !== "alla" && !v.question_types?.includes(question)) return false;
      if (q && !`${v.title} ${v.summary_sv ?? ""} ${v.channel_name ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [videos, product, question, query]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Videobibliotek för Microsoft Dynamics 365",
    itemListElement: filtered.slice(0, 25).map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: v.summary_sv || v.description || v.title,
        thumbnailUrl: v.thumbnail_url || `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`,
        uploadDate: v.published_at,
        embedUrl: `https://www.youtube.com/embed/${v.youtube_id}`,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title="Videobibliotek: Dynamics 365 på YouTube"
        description="Kurerat videobibliotek med Microsoft Dynamics 365-videor grupperade per produktområde och frågeställning – demo, priser, implementering, integration och nyheter."
        canonicalPath="/kunskapscenter/videor"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "/" },
          { name: "Kunskapscenter", url: "/kunskapscenter" },
          { name: "Videobibliotek", url: "/kunskapscenter/videor" },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Videobibliotek för Microsoft Dynamics 365
            </h1>
            <p className="mt-3 text-muted-foreground">
              Vi samlar in videor från Microsofts officiella YouTube-kanaler varje dygn och grupperar dem
              automatiskt per produktområde och frågeställning, så att du snabbt hittar svar på just din fråga.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök i videobiblioteket"
                className="pl-9"
                aria-label="Sök videor"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Produktområde
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={product === "alla" ? "default" : "outline"} onClick={() => setProduct("alla")}>
                  Alla produkter
                </Button>
                {availableProducts.map((p) => (
                  <Button key={p} size="sm" variant={product === p ? "default" : "outline"} onClick={() => setProduct(p)}>
                    {videoProductLabel(p)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Vad vill du veta?
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={question === "alla" ? "default" : "outline"} onClick={() => setQuestion("alla")}>
                  Alla frågor
                </Button>
                {availableQuestions.map((q) => (
                  <Button key={q} size="sm" variant={question === q ? "default" : "outline"} onClick={() => setQuestion(q)}>
                    {videoQuestionLabel(q)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {loading ? "Laddar videor…" : `${filtered.length} videor`}
          </p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((v) => (
              <D365VideoCard key={v.id} video={v} onPlay={setActive} />
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <p className="mt-8 text-muted-foreground">
              Inga videor matchar ditt val just nu. Prova en bredare filtrering eller{" "}
              <Link to="/kontakt" className="text-primary underline">
                hör av dig till oss
              </Link>{" "}
              med din fråga.
            </p>
          )}

          <div className="mt-12 rounded-xl border border-border bg-muted/40 p-6">
            <h2 className="text-lg font-semibold">Behöver du mer än en video?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Gör en kostnadsfri behovsanalys eller jämför partners som arbetar med just ditt produktområde.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/behovsanalys">
                  Starta en kostnadsfri behovsanalys <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/valjdynamics365partner">Jämför partners</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <D365VideoPlayerDialog video={active} onOpenChange={(o) => !o && setActive(null)} />
    </>
  );
};

export default VideoIndex;
