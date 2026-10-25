import { PRODUCT_GROUPS, QUESTION_TYPES } from "./d365-video-taxonomy.ts";

/** Det klassificeringen behöver veta om en video. */
export type ClassifiableVideo = { title: string; description: string };

export type Classification = {
  product_groups: string[];
  question_types: string[];
  summary_sv: string;
  relevance_score: number;
};

export async function classify(video: ClassifiableVideo): Promise<{ result?: Classification; status?: number }> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return { status: 401 };

  const prompt = `Du klassificerar en YouTube-video om Microsoft Dynamics 365 för en svensk kunskapsbank.

Titel: ${video.title}
Beskrivning: ${(video.description || "").slice(0, 1200)}

Svara med JSON:
{
  "product_groups": [],   // 0-3 värden ur: ${PRODUCT_GROUPS.join(", ")}
  "question_types": [],   // 0-2 värden ur: ${QUESTION_TYPES.join(", ")}
  "summary_sv": "",        // Neutral svensk sammanfattning, max 250 tecken, ingen säljande ton
  "relevance_score": 0     // 0-100: hur relevant videon är för svenska beslutsfattare som utvärderar Dynamics 365. Sätt lågt (<40) för allmänt Microsoft-innehåll utan koppling till Dynamics 365.
}
Svara enbart med JSON.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return { status: res.status };

  const data = await res.json().catch(() => null);
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(text.replace(/^```json\s*|```$/g, "").trim());
    const groups = Array.isArray(parsed.product_groups)
      ? parsed.product_groups.filter((g: string) => (PRODUCT_GROUPS as readonly string[]).includes(g)).slice(0, 3)
      : [];
    const questions = Array.isArray(parsed.question_types)
      ? parsed.question_types.filter((q: string) => (QUESTION_TYPES as readonly string[]).includes(q)).slice(0, 2)
      : [];
    const score = Number.isFinite(Number(parsed.relevance_score))
      ? Math.max(0, Math.min(100, Math.round(Number(parsed.relevance_score))))
      : 0;
    return {
      result: {
        product_groups: groups.length ? groups : ["ovrigt"],
        question_types: questions,
        summary_sv: String(parsed.summary_sv ?? "").slice(0, 400),
        relevance_score: score,
      },
    };
  } catch {
    return {};
  }
}

