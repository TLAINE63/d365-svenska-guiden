import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WEBINAR_PUBLIC_SELECT, type PublicWebinar } from "@/lib/webinars";

export function useWebinars(initialData: PublicWebinar[] | null = null) {
  return useQuery({
    queryKey: ["public-webinars"],
    initialData: initialData || undefined,
    staleTime: 60_000,
    queryFn: async (): Promise<PublicWebinar[]> => {
      const { data, error } = await supabase.from("webinars_public").select(WEBINAR_PUBLIC_SELECT).order("starts_at", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as PublicWebinar[];
    },
  });
}

export function useWebinar(slug: string | undefined, initialData: PublicWebinar | null = null) {
  return useQuery({
    queryKey: ["public-webinar", slug],
    initialData: initialData || undefined,
    staleTime: 60_000,
    enabled: Boolean(slug),
    queryFn: async (): Promise<PublicWebinar | null> => {
      const { data, error } = await supabase.from("webinars_public").select(WEBINAR_PUBLIC_SELECT).eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return (data as unknown as PublicWebinar | null) ?? null;
    },
  });
}
