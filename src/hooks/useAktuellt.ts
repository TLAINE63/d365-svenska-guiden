import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AKTUELLT_PUBLIC_SELECT, type AktuelltArticle } from "@/lib/aktuellt";

/** Publicerade Aktuellt-analyser. RLS släpper bara igenom publicerade rader. */
export function usePublishedAktuellt(opts: { limit?: number } = {}) {
  return useQuery({
    queryKey: ["aktuellt-public", opts],
    queryFn: async (): Promise<AktuelltArticle[]> => {
      let q = supabase
        .from("knowledge_articles")
        .select(AKTUELLT_PUBLIC_SELECT)
        .eq("content_type", "aktuellt")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (opts.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as AktuelltArticle[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAktuelltArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ["aktuellt-article", slug],
    enabled: !!slug,
    queryFn: async (): Promise<AktuelltArticle | null> => {
      const { data, error } = await supabase
        .from("knowledge_articles")
        .select(AKTUELLT_PUBLIC_SELECT)
        .eq("content_type", "aktuellt")
        .eq("is_published", true)
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as AktuelltArticle) ?? null;
    },
  });
}
