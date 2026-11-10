import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WEBINAR_PUBLIC_SELECT, type PublicWebinar } from "@/lib/webinars";
import type { ContentInviteData, InviteArticle } from "@/lib/contentInvite";

const ContentInviteContext = createContext<ContentInviteData | null>(null);

export function ContentInviteProvider({ children, initialData = null }: { children: ReactNode; initialData?: ContentInviteData | null }) {
  return <ContentInviteContext.Provider value={initialData}>{children}</ContentInviteContext.Provider>;
}

export function useContentInviteData(): ContentInviteData {
  const initial = useContext(ContentInviteContext);
  const { data } = useQuery({
    queryKey: ["content-invites"],
    enabled: !initial,
    staleTime: 60_000,
    queryFn: async (): Promise<ContentInviteData> => {
      const [webinars, articles] = await Promise.all([
        supabase.from("webinars_public").select(WEBINAR_PUBLIC_SELECT).eq("status", "publicerad").order("starts_at", { ascending: true }),
        supabase.from("knowledge_articles")
          .select("id,title,description,url,slug,theme,published_at,created_at")
          .eq("is_published", true)
          .not("theme", "is", null)
          .order("published_at", { ascending: false }),
      ]);
      if (webinars.error || articles.error) return { webinars: [], articles: [] };
      return {
        webinars: (webinars.data || []) as unknown as PublicWebinar[],
        articles: (articles.data || []) as unknown as InviteArticle[],
      };
    },
  });
  return initial || data || { webinars: [], articles: [] };
}
