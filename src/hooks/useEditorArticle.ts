import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EDITOR_ARTICLE_PUBLIC_SELECT, type EditorArticleRow } from "@/lib/editorArticle";

/** Hämtar en publicerad Word-artikel från redaktionen via dess adress. */
export function useEditorArticle(slug: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["editor-article", slug],
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<EditorArticleRow | null> => {
      const { data, error } = await supabase
        .from("knowledge_articles")
        .select(EDITOR_ARTICLE_PUBLIC_SELECT)
        .eq("slug", slug!)
        .eq("is_published", true)
        .not("body_html", "is", null)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as EditorArticleRow) ?? null;
    },
  });
}
