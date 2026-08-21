import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface D365Video {
  id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  channel_name: string | null;
  published_at: string | null;
  thumbnail_url: string | null;
  product_groups: string[];
  question_types: string[];
  summary_sv: string | null;
  relevance_score: number;
}

export function useD365Videos(limit = 300) {
  const [videos, setVideos] = useState<D365Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("d365_videos")
        .select(
          "id, youtube_id, title, description, channel_name, published_at, thumbnail_url, product_groups, question_types, summary_sv, relevance_score",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(limit);
      if (!active) return;
      if (!error && data) setVideos(data as D365Video[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [limit]);

  return { videos, loading };
}
