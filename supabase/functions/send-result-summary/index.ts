// Mejlar besökarens verktygsresultat (kostnadskalkyl eller behovsguide) till besökaren,
// med tre frågor att ställa till leverantörer. Thomas notifieras bara om besökaren
// uttryckligen kryssat i att d365.se får höra av sig. Inget skickas till partners.
import { brandEmail } from "../_shared/email-branding.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const THOMAS = "thomas.laine@dynamicfactory.se";

const QUESTIONS: Record<string, { title: string; subject: string; questions: string[] }> = {
  kostnad: {
    title: "Er kostnadsuppskattning",
    subject: "Er kostnadsuppskattning för Dynamics 365 från d365.se",
    questions: [
      "Vilka delar av projektet är fastpris och vilka är löpande räkning, och vad händer om omfattningen växer?",
      "Hur många timmar har ni räknat för datamigrering, integrationer och utbildning, och vem gör vad hos oss?",
      "Vilka licenser behöver vi från start, och vilka kan vänta tills vi vet hur systemet används?",
    ],
  },
  behovsguide: {
    title: "Ert resultat från behovsguiden",
    subject: "Ert resultat från behovsguiden på d365.se",
    questions: [
      "Vilka liknande kunder i vår bransch och storlek har ni infört lösningen hos, och kan vi prata med någon av dem?",
      "Vad i vårt behov täcks av standard, och vad kräver anpassningar eller tilläggslösningar?",
      "Vilka personer från ert team arbetar i projektet, och hur ser upplägget ut efter driftstart?",
    ],
  },
};

const rate = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const r = rate.get(ip);
  if (!r || now > r.t) { rate.set(ip, { n: 1, t: now + 60_000 }); return false; }
  r.n++;
  return r.n > 3;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

function cleanLines(lines: unknown): string[] {
  if (!Array.isArray(lines)) return [];
  return lines.filter((l): l is string => typeof l === "string")
    .map((l) => l.replace(/\s+/g, " ").trim().slice(0, 200)).filter(Boolean).slice(0, 15);
}

async function send(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify(brandEmail(payload as never)),
  });
  if (!res.ok) throw new Error(`send failed ${res.status}`);
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ error: "För många försök. Vänta en minut." }, 429);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Ogiltig förfrågan" }, 400); }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const tool = typeof body.tool === "string" ? body.tool : "";
  const followUp = body.follow_up === true;
  const sourcePage = typeof body.source_page === "string" ? body.source_page.slice(0, 200) : "";
  const lines = cleanLines(body.lines);
  const cfg = QUESTIONS[tool];

  if (!cfg) return json({ error: "Okänt verktyg" }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return json({ error: "Ange en giltig e-postadress." }, 400);
  if (isFreeEmailDomain(email)) return json({ error: FREE_EMAIL_ERROR_SV }, 400);
  if (!lines.length) return json({ error: "Inget resultat att skicka." }, 400);

  const li = (items: string[]) => items.map((x) => `<li style="margin:0 0 8px">${esc(x)}</li>`).join("");
  const html = `
    <h1 style="font-size:22px;margin:0 0 12px">${cfg.title}</h1>
    <p style="margin:0 0 16px">Här är sammanställningen ni bad om från d365.se.</p>
    <ul style="padding-left:20px;margin:0 0 24px">${li(lines)}</ul>
    <h2 style="font-size:18px;margin:0 0 8px">Tre frågor att ställa till leverantörerna</h2>
    <ol style="padding-left:20px;margin:0 0 24px">${li(cfg.questions)}</ol>
    <p style="margin:0 0 8px">Har ni redan fått ett förslag? <a href="https://d365.se/second-opinion/">Få en second opinion</a> innan ni skriver på.</p>
    <p style="margin:0 0 16px">Vill ni gå igenom resultatet tillsammans? <a href="https://bookings.cloud.microsoft/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&amp;ismsaljsauthenabled&amp;ep=mlink">Välj 20 minuter i Thomas kalender</a>.</p>
    <p style="margin:0;color:#555;font-size:13px">Inga partners har fått era uppgifter. Svara på mejlet om ni vill prata med Thomas Laine på d365.se.</p>`;

  try {
    await send({ from: "Thomas Laine på d365.se <info@d365.se>", to: [email], reply_to: THOMAS, subject: cfg.subject, html });
    if (followUp) {
      await send({
        from: "d365.se <info@d365.se>", to: [THOMAS], reply_to: email,
        subject: `Ny: ${cfg.title.toLowerCase()} mejlad, vill bli kontaktad (${email.split("@")[1]})`,
        html: `<p><strong>${esc(email)}</strong> fick ${esc(cfg.title.toLowerCase())} mejlat och vill att du hör av dig.</p>
          <p>Sida: ${esc(sourcePage || "okänd")}<br>Tid: ${new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })}</p>
          <ul>${li(lines)}</ul>`,
      }).catch((e) => console.error("notify failed", e));
    }
    return json({ ok: true });
  } catch (e) {
    console.error("send-result-summary", e);
    return json({ error: "Det gick inte att skicka. Försök igen." }, 500);
  }
});
