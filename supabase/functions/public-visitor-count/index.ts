// Publik besöksräknare för startsidans hero.
// Returnerar ENBART antalet unika besökare senaste 30 dagarna – ingen annan data.
// Unik besökare = anonymiserad IP + dag (fallback: session-id + dag), samma
// definition som i site-traffic-stats. Alla besökare räknas (inget undantag).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const visitors = new Set<string>();
    const pageSize = 1000;
    for (let from = 0; from < 200000; from += pageSize) {
      const { data, error } = await supabase
        .from("visitor_analytics")
        .select("session_id, visited_at, ip_anonymized")
        .gte("visited_at", since)
        .order("visited_at", { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) {
        console.error("public-visitor-count query error", error);
        return new Response(JSON.stringify({ error: "query failed" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (!data || data.length === 0) break;
      for (const r of data) {
        const day = (r.visited_at || "").slice(0, 10);
        const base = r.ip_anonymized && r.ip_anonymized !== "unknown" ? r.ip_anonymized : r.session_id;
        if (base) visitors.add(`${base}|${day}`);
      }
      if (data.length < pageSize) break;
    }

    return new Response(JSON.stringify({ uniqueVisitors30d: visitors.size }), {
      headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  } catch (e) {
    console.error("public-visitor-count error", e);
    return new Response(JSON.stringify({ error: "Internt fel" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
