import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin === "https://d365.se" || origin === "https://www.d365.se") return true;
  return false;
}

function corsFor(req: Request) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const auth = req.headers.get("authorization") || "";
    const adminPwd = Deno.env.get("PARTNER_ADMIN_PASSWORD") || "";
    if (!adminPwd || auth !== `Bearer ${adminPwd}`) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = Date.now();
    const since90 = new Date(now - 90 * 86400000).toISOString();
    const since30 = new Date(now - 30 * 86400000).toISOString();
    const since7 = new Date(now - 7 * 86400000).toISOString();

    // Pull all rows from last 90 days. For larger sites we'd paginate.
    // Use range pagination to bypass 1000-row default limit.
    const all: { page_path: string; session_id: string | null; visited_at: string }[] = [];
    const pageSize = 1000;
    for (let from = 0; from < 50000; from += pageSize) {
      const { data, error } = await supabase
        .from("visitor_analytics")
        .select("page_path, session_id, visited_at")
        .gte("visited_at", since90)
        .order("visited_at", { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) {
        console.error("query error", error);
        return new Response(JSON.stringify({ error: "query failed" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (!data || data.length === 0) break;
      all.push(...data);
      if (data.length < pageSize) break;
    }

    function countWindow(rows: typeof all) {
      const sessions = new Set<string>();
      let views = 0;
      for (const r of rows) {
        views++;
        if (r.session_id) sessions.add(r.session_id);
      }
      return { pageViews: views, uniqueVisitors: sessions.size };
    }

    const rows7 = all.filter((r) => r.visited_at >= since7);
    const rows30 = all.filter((r) => r.visited_at >= since30);
    const rows90 = all;

    function topPages(rows: typeof all, limit = 20) {
      const map = new Map<string, { views: number; sessions: Set<string> }>();
      for (const r of rows) {
        const key = r.page_path || "(okänd)";
        let m = map.get(key);
        if (!m) {
          m = { views: 0, sessions: new Set() };
          map.set(key, m);
        }
        m.views++;
        if (r.session_id) m.sessions.add(r.session_id);
      }
      return Array.from(map.entries())
        .map(([path, v]) => ({
          path,
          views: v.views,
          uniqueVisitors: v.sessions.size,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }

    const result = {
      totals: {
        d7: countWindow(rows7),
        d30: countWindow(rows30),
        d90: countWindow(rows90),
      },
      topPages: {
        d7: topPages(rows7),
        d30: topPages(rows30),
        d90: topPages(rows90),
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
