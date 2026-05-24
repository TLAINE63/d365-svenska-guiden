import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import {
  getVideoBySlug,
  buildVideoObjectSchema,
  KNOWLEDGE_VIDEOS,
} from "@/data/knowledgeVideos";

const VideoLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const video = slug ? getVideoBySlug(slug) : undefined;

  if (!video) {
    return <Navigate to="/kunskapscenter" replace />;
  }

  const canonicalPath = `/kunskapscenter/video/${video.slug}`;
  const thumb = `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  const schema = buildVideoObjectSchema(video);

  const related = KNOWLEDGE_VIDEOS.filter((v) => v.slug !== video.slug);

  return (
    <>
      <SEOHead
        title={video.title}
        description={video.description}
        canonicalPath={canonicalPath}
        ogImage={thumb}
        ogImageAlt={video.title}
        ogType="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kunskapscenter", url: "https://d365.se/kunskapscenter/" },
          { name: video.title, url: `https://d365.se${canonicalPath}/` },
        ]}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <article className="container mx-auto px-4 max-w-3xl">
            <Link
              to="/kunskapscenter"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Tillbaka till Kunskapscenter
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {video.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {video.products.map((p) => (
                <Badge key={p} variant="secondary">
                  {p}
                </Badge>
              ))}
            </div>

            <div
              className="relative w-full mb-8 rounded-xl overflow-hidden bg-black mx-auto"
              style={{ maxWidth: "400px", aspectRatio: "9 / 16" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold text-foreground">Om filmen</h2>
              <p className="text-muted-foreground leading-relaxed">
                {video.longDescription}
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Publicerad
              </p>
              <p className="text-sm text-foreground">
                {video.uploadDate.replaceAll("-", "/")}
              </p>
            </div>

            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Fler korta filmer
                </h2>
                <ul className="space-y-3">
                  {related.map((v) => (
                    <li key={v.slug}>
                      <Link
                        to={`/kunskapscenter/video/${v.slug}`}
                        className="block p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                      >
                        <p className="font-medium text-foreground">{v.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {v.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default VideoLanding;
