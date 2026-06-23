import { Link, Navigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ExternalLink, BookOpen, Wrench, FileText, Play, Sparkles } from "lucide-react";
import { HUB_BY_SLUG, type HubResourceCard } from "@/data/knowledgeHubs";

const ICONS: Record<HubResourceCard["type"], typeof BookOpen> = {
  fordjupning: BookOpen,
  artikel: BookOpen,
  verktyg: Wrench,
  guide: FileText,
  video: Play,
};

const TYPE_LABEL: Record<HubResourceCard["type"], string> = {
  fordjupning: "Produktfördjupning",
  artikel: "Artikel",
  verktyg: "Verktyg",
  guide: "Guide",
  video: "Video",
};

const TYPE_BADGE: Record<HubResourceCard["type"], string> = {
  fordjupning: "bg-primary text-primary-foreground border-primary",
  artikel: "bg-slate-600 text-white border-slate-600",
  verktyg: "bg-teal-600 text-white border-teal-600",
  guide: "bg-indigo-600 text-white border-indigo-600",
  video: "bg-rose-600 text-white border-rose-600",
};

interface Props {
  slug: string;
}

const KunskapscenterHub = ({ slug }: Props) => {
  const hub = HUB_BY_SLUG[slug];
  if (!hub) return <Navigate to="/kunskapscenter" replace />;

  const canonical = `/kunskapscenter/${hub.slug}/`;

  // Group resources by type for clearer crawl-friendly structure
  const groups: Array<{ type: HubResourceCard["type"]; heading: string }> = [
    { type: "verktyg", heading: "Verktyg & behovsanalyser" },
    { type: "guide", heading: "Guider" },
    { type: "fordjupning", heading: "Produktfördjupningar" },
    { type: "artikel", heading: "Artiklar" },
    { type: "video", heading: "Videor" },
  ];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <SEOHead
        title={hub.metaTitle}
        description={hub.metaDescription}
        canonicalPath={canonical}
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kunskapscenter", url: "https://d365.se/kunskapscenter/" },
          { name: hub.breadcrumbLabel, url: `https://d365.se${canonical}` },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-20 lg:pt-28">
        {/* Header */}
        <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
            {/* Breadcrumbs (visual) */}
            <nav aria-label="Brödsmulor" className="mb-4 text-sm">
              <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Hem
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to="/kunskapscenter" className="hover:text-foreground transition-colors">
                    Kunskapscenter
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground font-medium">{hub.breadcrumbLabel}</li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Kunskapscenter
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{hub.h1}</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {hub.intro}
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{hub.resources.length}</span>{" "}
              {hub.resources.length === 1 ? "resurs" : "resurser"} samlade här.
            </p>
          </div>
        </section>

        {/* Grouped resource sections */}
        <div className="container mx-auto px-4 py-10 md:py-14 max-w-6xl">
          {groups.map((group) => {
            const items = hub.resources.filter((r) => r.type === group.type);
            if (items.length === 0) return null;
            return (
              <section key={group.type} className="mb-12 last:mb-0">
                <h2 className="text-xl md:text-2xl font-bold mb-5">
                  {group.heading}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({items.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((r) => {
                    const Icon = ICONS[r.type];
                    const Wrapper: any = r.isExternal ? "a" : Link;
                    const props = r.isExternal
                      ? { href: r.url, target: "_blank", rel: "noopener noreferrer" }
                      : { to: r.url };
                    return (
                      <Wrapper key={r.id} {...props} className="group block">
                        <Card className="h-full border-border/60  hover:-translate-y-0.5 transition-all duration-200">
                          <CardContent className="p-5 flex flex-col gap-3 h-full">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`text-xs ${TYPE_BADGE[r.type]}`}
                              >
                                <Icon className="w-3 h-3 mr-1" />
                                {TYPE_LABEL[r.type]}
                              </Badge>
                              {r.category && r.category !== TYPE_LABEL[r.type] && (
                                <span className="text-xs text-muted-foreground">
                                  {r.category}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base leading-snug">
                              {r.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                              {r.description}
                            </p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                              {r.date ? (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(r.date)}
                                </span>
                              ) : (
                                <span />
                              )}
                              <span className="text-xs text-primary font-medium flex items-center gap-1 ml-auto">
                                {r.isExternal ? (
                                  <>
                                    Öppna <ExternalLink className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    Läs mer <ArrowRight className="w-3 h-3" />
                                  </>
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Wrapper>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              to="/kunskapscenter"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till Kunskapscenter
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default KunskapscenterHub;
