import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AssignmentProfilePublic } from "@/lib/competenceMatching";

/**
 * Publicerade uppdragsprofiler för en kompetensguide.
 * Läser den publika vyn, som redan filtrerar på publicerad partner,
 * publicerad profil och kontroll inom 12 månader.
 */
export function useAssignmentProfiles(guideSlug: string | undefined) {
  return useQuery({
    queryKey: ["assignment-profiles", guideSlug],
    enabled: !!guideSlug,
    queryFn: async (): Promise<AssignmentProfilePublic[]> => {
      const { data, error } = await (supabase as any)
        .from("assignment_profiles_public")
        .select("*")
        .eq("guide_slug", guideSlug);
      if (error) throw error;
      return (data || []) as AssignmentProfilePublic[];
    },
  });
}
