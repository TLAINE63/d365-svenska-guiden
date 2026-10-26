import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDateYYYYMMDD } from "@/lib/utils";

interface PartnerArticle {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
}

interface Props {
  partnerSlug: string;
  partnerName: string;
}

/**
 * Redaktionens publicerade artiklar som redaktören kopplat till partnern
 * (t.ex. intervjuer). Visas bara när det finns minst en artikel.
 */
export default function PartnerArticlesSection({ partnerSlug, partnerName }: Props) {
  const { data: articles = [] } = useQuery({
    queryKey: ["partner-articles", partnerSlug],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<PartnerArticle[]> => {
      const { data, error } = await supabase
        .from("knowledge_articles")
        .select("slug,title,description,image_url,published_at,reading_time_minutes")
        .eq("is_published", true)
        .contains("partner_slugs", [partnerSlug])
        .not("body_html", "is", null)
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []).filter((a): a is PartnerArticle => !!a.slug);
    },
  });

  if (articles.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="partner-articles-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-primary/10 text-primary">
            <Newspaper className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 id="partner-articles-heading" className="text-xl font-bold text-foreground tracking-tight">
            Artiklar på d365.se med {partnerName}
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                to={`/artiklar/${a.slug}/`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {a.image_url && (
                  <img
                    src={a.image_url}
                    alt=""
                    loading="lazy"
                    className="aspect-[2/1] w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                    {a.title}
                  </h3>
                  {a.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{a.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>
                      {a.published_at ? formatDateYYYYMMDD(a.published_at) : ""}
                      {a.reading_time_minutes ? ` · ${a.reading_time_minutes} min läsning` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      Läs artikeln <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
