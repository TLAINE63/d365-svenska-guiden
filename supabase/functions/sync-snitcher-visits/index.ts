import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SNITCHER_BASE = "https://api.snitcher.com/v1";

async function snitcherFetch(path: string, token: string): Promise<any> {
  const res = await fetch(`${SNITCHER_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
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
  for (const u of urls || []) {
    const m = (u || "").match(re);
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

    let body: any = {};
    try { body = await req.json(); } catch { /* */ }

    const wsResp = await snitcherFetch("/workspaces", SNITCHER_API_KEY);
    const workspaces: any[] = wsResp.data || [];
    if (workspaces.length === 0) throw new Error("Ingen Snitcher-workspace hittad");
    let workspace = workspaces.find(w => (w.url || "").includes("d365")) || workspaces[0];
    const workspaceUuid: string = body.workspaceUuid || workspace.uuid;

    let upserted = 0;
    let orgsScanned = 0;
    let orgsWithPartnerVisit = 0;
    let page = 1;
    const maxPages = Math.min(Math.max(Number(body.maxPages) || 20, 1), 50);

    while (page <= maxPages) {
      const orgResp = await snitcherFetch(
        `/workspaces/${workspaceUuid}/organisations?page=${page}&per_page=100`,
        SNITCHER_API_KEY,
      );
      const items: any[] = orgResp.data || [];
      if (items.length === 0) break;

      for (const org of items) {
        orgsScanned++;
        const pages: string[] = org.pages_visited || [];
        const partnerSlugs = extractPartnerSlugs(pages);
        if (partnerSlugs.length === 0) continue;
        orgsWithPartnerVisit++;

        const visitedUrls = pages.map((url) => ({ url }));

        const { error } = await supabase
          .from("snitcher_visits")
          .upsert({
            workspace_uuid: workspaceUuid,
            organisation_uuid: org.uuid,
            // We don't have per-session granularity from this endpoint; use org uuid as session key
            session_uuid: `org:${org.uuid}`,
            company_name: org.name ?? null,
            company_domain: org.website ?? null,
            company_industry: org.industry ?? null,
            company_size: org.size ?? null,
            company_country: org.address?.country ?? null,
            company_logo_url: org.logo ?? null,
            session_started_at: org.first_seen ?? null,
            session_ended_at: org.last_seen ?? null,
            visited_urls: visitedUrls,
            partner_slugs: partnerSlugs,
            raw_data: org as Record<string, unknown>,
            synced_at: new Date().toISOString(),
          }, { onConflict: "session_uuid" });

        if (!error) upserted++;
        else console.error("Upsert error", org.uuid, error.message);
      }

      if (items.length < 100) break;
      page++;
    }

    return new Response(JSON.stringify({
      success: true,
      workspaceUuid,
      orgsScanned,
      orgsWithPartnerVisit,
      upserted,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("sync-snitcher-visits error:", e);
    return new Response(JSON.stringify({ error: e.message || String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
