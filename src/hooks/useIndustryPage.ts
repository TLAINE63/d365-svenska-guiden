import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface IndustryPageProcess {
  title: string;
  description: string;
}
export interface IndustryPageRole {
  role: string;
  needs: string;
}
export interface IndustryPageApplication {
  app: string;
  relevance: string;
}
export interface IndustryPageFAQ {
  q: string;
  a: string;
}

export interface IndustryPage {
  id: string;
  slug: string;
  name: string;
  meta_title: string | null;
  meta_description: string | null;
  hero_image_url: string | null;
  intro: string | null;
  processes: IndustryPageProcess[];
  challenges: IndustryPageProcess[];
  roles: IndustryPageRole[];
  applications: IndustryPageApplication[];
  faq: IndustryPageFAQ[];
  related_industries: string[];
  is_published: boolean;
  ai_generated_at: string | null;
}

export function useIndustryPage(slug: string | undefined) {
  const [page, setPage] = useState<IndustryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("industry_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setPage(null);
      } else {
        setPage((data as unknown as IndustryPage) || null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { page, loading, error };
}
