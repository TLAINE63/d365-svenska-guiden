import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseAnon() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export default defineTool({
  name: "search_partners",
  title: "Sök Dynamics 365-partners",
  description:
    "Sök publika, publicerade Dynamics 365-partners på d365.se. Filtrera på applikation (t.ex. 'Business Central', 'Finance & Supply Chain', 'Sales', 'Customer Service'), bransch och geografi. Returnerar namn, kort beskrivning, applikationer, branscher, geografi och publik profil-URL.",
  inputSchema: {
    application: z.string().optional().describe("Dynamics 365-applikation att filtrera på."),
    industry: z.string().optional().describe("Bransch (t.ex. 'Tillverkning', 'Detaljhandel')."),
    geography: z.string().optional().describe("Geografi (t.ex. 'Sverige', 'Norden')."),
    limit: z.number().int().min(1).max(50).optional().describe("Max antal resultat (1-50, default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ application, industry, geography, limit }) => {
    const sb = supabaseAnon();
    let q = sb
      .from("partners")
      .select("slug,name,description,applications,industries,geography,office_cities,website")
      .eq("is_featured", true)
      .not("published_at", "is", null)
      .limit(limit ?? 20);

    if (application) q = q.contains("applications", [application]);
    if (industry) q = q.contains("industries", [industry]);
    if (geography) q = q.contains("geography", [geography]);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: `Fel: ${error.message}` }], isError: true };
    }
    const rows = (data ?? []).map((p: any) => ({
      ...p,
      profile_url: `https://d365.se/partner/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { partners: rows, count: rows.length },
    };
  },
});
