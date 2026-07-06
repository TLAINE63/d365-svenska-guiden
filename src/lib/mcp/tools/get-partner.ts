import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseAnon() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export default defineTool({
  name: "get_partner",
  title: "Hämta partnerprofil",
  description:
    "Hämta den publika profilen för en enskild Dynamics 365-partner på d365.se via slug (t.ex. 'cgi', 'columbus'). Returnerar beskrivning, applikationer, branscher, geografi, kontor, kundexempel och positioneringsinformation.",
  inputSchema: {
    slug: z.string().min(1).describe("Partnerns URL-slug, t.ex. 'columbus'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const sb = supabaseAnon();
    const { data, error } = await sb
      .from("partners_public")
      .select(
        "slug,name,description,website,applications,industries,secondary_industries,geography,office_cities,customer_examples,positioning_statement,team_size_sweden,implementations_done,ai_summary",
      )
      .eq("slug", slug)
      .eq("is_featured", true)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: `Fel: ${error.message}` }], isError: true };
    }
    if (!data) {
      return {
        content: [{ type: "text", text: `Ingen publicerad partner hittades för slug '${slug}'.` }],
        isError: true,
      };
    }
    const enriched = { ...data, profile_url: `https://d365.se/partner/${data.slug}` };
    return {
      content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }],
      structuredContent: enriched,
    };
  },
});
