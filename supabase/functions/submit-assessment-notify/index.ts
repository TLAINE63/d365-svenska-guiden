import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin === "https://d365.se" || origin === "https://www.d365.se") return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin)
    ? origin
    : "https://d365-svenska-guiden.lovable.app";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

const TEAM_INBOX = "thomas.laine@dynamicfactory.se";

interface SubmitBody {
  contact_name: string;
  contact_email: string;
  company: string;
  background: Record<string, string>;
  responses: Record<string, number>;
  dimension_scores: Record<string, number>;
  free_text?: string;
  followup_preference?: string;
}

function escape(s: string): string {
  return String(s ?? "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

serve(async (req: Request) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const body = (await req.json()) as SubmitBody;
    if (!body?.contact_email || !body?.contact_name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Email not configured" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const resend = new Resend(apiKey);

    // 1. Confirmation to respondent (plain text)
    const respondentBody = `Tack för att ni genomförde diagnostiken. Vi sammanställer er rapport manuellt under de kommande 24–48 timmarna och återkommer på den här adressen.

Med vänlig hälsning,
Redaktionen · d365.se`;

    await resend.emails.send({
      from: "d365.se <hej@d365.se>",
      to: [body.contact_email],
      subject: "Er sammanställning är registrerad — Beslutsmognadsindex",
      text: respondentBody,
    });

    // 2. Internal notification with all answers
    const dimLines = Object.entries(body.dimension_scores ?? {})
      .map(([k, v]) => `  ${k.padEnd(18)} ${Number(v).toFixed(2)} / 5`)
      .join("\n");
    const respLines = Object.entries(body.responses ?? {})
      .map(([k, v]) => `  ${k.padEnd(5)} ${v}`)
      .join("\n");
    const bgLines = Object.entries(body.background ?? {})
      .map(([k, v]) => `  ${k.padEnd(14)} ${v}`)
      .join("\n");

    const internalBody = `Ny ifylld Beslutsmognadsindex
============================

Kontakt:        ${body.contact_name}
E-post:         ${body.contact_email}
Företag:        ${body.company}
Uppföljning:    ${body.followup_preference ?? "-"}

Bakgrund
--------
${bgLines}

Dimensionspoäng
---------------
${dimLines}

Svar (Likert 1–5)
-----------------
${respLines}

Fritext
-------
${body.free_text ?? "(ingen)"}
`;

    await resend.emails.send({
      from: "d365.se Notify <hej@d365.se>",
      to: [TEAM_INBOX],
      reply_to: body.contact_email,
      subject: `Ny ifylld Beslutsmognadsindex — ${escape(body.contact_name)}, ${escape(body.company)}`,
      text: internalBody,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("submit-assessment-notify error", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message ?? "unknown" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
