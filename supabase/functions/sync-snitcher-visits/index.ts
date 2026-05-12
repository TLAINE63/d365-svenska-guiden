import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SNITCHER_BASE = "https://api.snitcher.com/v1";

interface SnitcherEvent {
  event_type: string;
  url?: string;
  triggered_at?: string;
  time_on_page?: number;
}

interface SnitcherSession {
  uuid: string;
  organisation_uuid: string;
  started_at?: string;
  ended_at?: string;
  events?: SnitcherEvent[];
  views?: { url: string; visited_at: string; time_on_page?: number }[];
}

interface SnitcherOrganisation {
  uuid: string;
  name?: string;
  domain?: string;
  industry?: string;
  size?: string;
  country?: string;
  logo_url?: string;
}

async function snitcherFetch(path: string, token: string): Promise<any> {
  const res = await fetch(`${SNITCHER_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Snitcher ${path} ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function extractPartnerSlugs(urls: string[]): string[] {
  const slugs = new Set<string>();
  const re = /\/partner\/([a-z0-9-]+)\/?(?:\?|#|$)/i;
  for (const u of urls) {
    const m = u.match(re);
    if (m) slugs.add(m[1].toLowerCase());
  }
  return Array.from(slugs);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SNITCHER_API_KEY = Deno.env.get("SNITCHER_API_KEY");
    if (!SNITCHER_API_KEY) throw new Error("SNITCHER_API_KEY saknas");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Optional body: { daysBack?: number, workspaceUuid?: string }
    let body: any = {};
    try { body = await req.json(); } catch { /* GET or empty */ }
    const daysBack = Math.min(Math.max(Number(body.daysBack) || 7, 1), 90);

    // 1. Discover workspace (match d365.se if multiple)
    const wsResp = await snitcherFetch("/workspaces", SNITCHER_API_KEY);
    const workspaces: any[] = wsResp.data || [];
    if (workspaces.length === 0) throw new Error("Ingen Snitcher-workspace hittad");

    let workspace = workspaces.find(w => (w.url || "").includes("d365"));
    if (!workspace) workspace = workspaces[0];
    const workspaceUuid: string = body.workspaceUuid || workspace.uuid;

    const since = new Date(Date.now() - daysBack * 86400000).toISOString().slice(0, 10);

    // 2. List organisations (paginated)
    let orgsCollected: SnitcherOrganisation[] = [];
    let page = 1;
    while (true) {
      const orgResp = await snitcherFetch(
        `/workspaces/${workspaceUuid}/organisations?page=${page}&per_page=100`,
        SNITCHER_API_KEY,
      );
      const items: SnitcherOrganisation[] = orgResp.data || [];
      orgsCollected = orgsCollected.concat(items);
      if (items.length < 100 || page > 10) break;
      page++;
    }

    let totalSessionsUpserted = 0;
    let orgsScanned = 0;

    // 3. For each org, fetch sessions and upsert
    for (const org of orgsCollected) {
      orgsScanned++;
      try {
        const sessResp = await snitcherFetch(
          `/workspaces/${workspaceUuid}/organisations/${org.uuid}/sessions?date=${since}`,
          SNITCHER_API_KEY,
        );
        const sessions: SnitcherSession[] = sessResp.data || [];

        for (const s of sessions) {
          const events = (s.events || []).filter(e => e.event_type === "pageview" && e.url);
          const visitedUrls = events.map(e => ({
            url: e.url!,
            triggered_at: e.triggered_at || null,
            time_on_page: e.time_on_page ?? null,
          }));
          const partnerSlugs = extractPartnerSlugs(visitedUrls.map(v => v.url));

          // Only store sessions that touched at least one partner profile
          if (partnerSlugs.length === 0) continue;

          const { error } = await supabase
            .from("snitcher_visits")
            .upsert({
              workspace_uuid: workspaceUuid,
              organisation_uuid: org.uuid,
              session_uuid: s.uuid,
              company_name: org.name ?? null,
              company_domain: org.domain ?? null,
              company_industry: org.industry ?? null,
              company_size: org.size ?? null,
              company_country: org.country ?? null,
              company_logo_url: org.logo_url ?? null,
              session_started_at: s.started_at ?? null,
              session_ended_at: s.ended_at ?? null,
              visited_urls: visitedUrls,
              partner_slugs: partnerSlugs,
              raw_data: s as unknown as Record<string, unknown>,
              synced_at: new Date().toISOString(),
            }, { onConflict: "session_uuid" });

          if (!error) totalSessionsUpserted++;
          else console.error("Upsert error", s.uuid, error);
        }
      } catch (e) {
        console.error("Org sync error", org.uuid, e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      workspaceUuid,
      orgsScanned,
      sessionsUpserted: totalSessionsUpserted,
      since,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("sync-snitcher-visits error:", e);
    return new Response(JSON.stringify({ error: e.message || String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
