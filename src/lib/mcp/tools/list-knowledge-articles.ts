import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseAnon() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export default defineTool({
  name: "list_knowledge_articles",
  title: "Lista kunskapsartiklar",
  description:
    "Lista publicerade artiklar från d365.se kunskapscenter. Filtrera fritt på ämne via 'query' som matchar titel eller sammanfattning.",
  inputSchema: {
    query: z.string().optional().describe("Fritextsökning i titel/sammanfattning."),
    limit: z.number().int().min(1).max(50).optional().describe("Max antal resultat (1-50, default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const sb = supabaseAnon();
    let q = sb
      .from("knowledge_articles")
      .select("slug,title,summary,category,published_at")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit ?? 20);

    if (query && query.trim()) {
      const term = `%${query.trim()}%`;
      q = q.or(`title.ilike.${term},summary.ilike.${term}`);
    }

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: `Fel: ${error.message}` }], isError: true };
    }
    const rows = (data ?? []).map((a: any) => ({
      ...a,
      url: `https://d365.se/kunskapscenter/${a.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { articles: rows, count: rows.length },
    };
  },
});
