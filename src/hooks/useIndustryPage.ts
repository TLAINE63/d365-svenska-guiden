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

import industryPagesSnapshot from "@/data/industryPages.json";

// Build-time snapshot for SSR / instant first paint.
const snapshotBySlug: Record<string, IndustryPage> = {};
(industryPagesSnapshot as unknown as IndustryPage[]).forEach((p) => {
  if (p?.slug) snapshotBySlug[p.slug] = p;
});

export function useIndustryPage(slug: string | undefined) {
  const initial = slug ? snapshotBySlug[slug] || null : null;
  const [page, setPage] = useState<IndustryPage | null>(initial);
  // If we have a static snapshot, never show loading state – we already have content.
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      // Re-fetch in the background to pick up edits since last build.
      const { data, error } = await supabase
        .from("industry_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setError(error.message);
        // Keep snapshot value on error – do not blank out content.
      } else if (data) {
        setPage(data as unknown as IndustryPage);
      } else if (!initial) {
        setPage(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { page, loading, error };
}
