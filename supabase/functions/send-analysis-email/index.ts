import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// CORS origin validation - only allow trusted domains
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  // Allow custom domain d365.se (with and without www)
  if (origin === "https://d365.se" || origin === "https://www.d365.se") return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365-svenska-guiden.lovable.app";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// HTML sanitization to prevent XSS in emails
function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formatera AI-genererad text (som ofta innehåller markdown: **bold**, ## rubriker,
 * - listor, 1. numrerade listor, dubbla radbrytningar) till läsbar HTML för e-post.
 * Escapar först allt, konverterar sen tillbaka en whitelist av markdown-syntax.
 */
function formatAiMarkdown(input: string, maxLen = 6000): string {
  if (typeof input !== "string" || !input.trim()) return "";
  const clipped = input.slice(0, maxLen);
  const escaped = sanitizeHtml(clipped);

  const lines = escaped.split(/\r?\n/);
  const out: string[] = [];
  let listType: "ul" | "ol" | null = null;
  const closeList = () => {
    if (listType) { out.push(`</${listType}>`); listType = null; }
  };
  const paraBuf: string[] = [];
  const flushPara = () => {
    if (paraBuf.length) {
      // Luftig läs-typografi: större radavstånd + generöst mellanrum mellan stycken
      out.push(`<p style="margin:0 0 18px 0;line-height:1.75;font-size:15px;color:#1a1a1a;">${paraBuf.join(" ")}</p>`);
      paraBuf.length = 0;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { flushPara(); closeList(); continue; }

    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      flushPara(); closeList();
      const level = Math.min(4, Math.max(2, h[1].length + 1));
      const size = level === 2 ? "18px" : level === 3 ? "16px" : "15px";
      const topMargin = level === 2 ? "28px" : "22px";
      out.push(`<h${level} style="color:#0E7C86;margin:${topMargin} 0 10px 0;font-size:${size};font-weight:700;line-height:1.35;letter-spacing:-0.01em;">${h[2]}</h${level}>`);
      continue;
    }

    const ol = line.match(/^(\d+)[.)]\s+(.+)$/);
    if (ol) {
      flushPara();
      if (listType !== "ol") { closeList(); out.push('<ol style="margin:0 0 18px 22px;padding:0;line-height:1.7;font-size:15px;color:#1a1a1a;">'); listType = "ol"; }
      out.push(`<li style="margin:0 0 8px 0;padding-left:4px;">${ol[2]}</li>`);
      continue;
    }

    const ul = line.match(/^[-*•]\s+(.+)$/);
    if (ul) {
      flushPara();
      if (listType !== "ul") { closeList(); out.push('<ul style="margin:0 0 18px 22px;padding:0;line-height:1.7;font-size:15px;color:#1a1a1a;">'); listType = "ul"; }
      out.push(`<li style="margin:0 0 8px 0;padding-left:4px;">${ul[1]}</li>`);
      continue;
    }

    closeList();
    paraBuf.push(line);
  }
  flushPara(); closeList();

  let html = out.join("\n");
  html = html.replace(/\*\*([^*\n]+?)\*\*/g, "<strong style=\"color:#0d0d0d;\">$1</strong>");
  html = html.replace(/(^|[^\*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(/`([^`\n]+?)`/g, '<code style="background:#f4f4f5;padding:1px 5px;border-radius:3px;font-size:13px;">$1</code>');
  return html;
}

/** Kortare version för listobjekt (t.ex. risks/nextSteps) – behåller bold/italic men ingen block-parse. */
function formatAiInline(input: string, maxLen = 500): string {
  if (typeof input !== "string") return "";
  let html = sanitizeHtml(input.slice(0, maxLen));
  html = html.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^\*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(/`([^`\n]+?)`/g, '<code style="background:#f4f4f5;padding:1px 4px;border-radius:3px;font-size:13px;">$1</code>');
  return html;
}

// Validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email) && email.length <= 255;
}

function isValidName(name: string): boolean {
  return typeof name === "string" && name.trim().length > 0 && name.length <= 100;
}

function isValidPhone(phone: string | undefined): boolean {
  if (!phone || phone === "") return true; // Optional field
  return typeof phone === "string" && phone.length <= 30;
}

function isValidAnalysisType(type: string): boolean {
  const validTypes = [
    "ERP",
    "CRM",
    "Kundservice",
    "Kundservice / Ärendehantering",
    "Fältservice",
    "Contact Center",
    "Kundservice, Contact Center och Fältservice",
    "Sälj & Marknad",
    "Sälj / CRM",
    "Marknad / Marketing automation",
    "Sälj, Marknad och Kunddata",
  ];
  return validTypes.includes(type);
}

function isValidAnalysisData(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

function isValidBase64(str: string): boolean {
  if (typeof str !== "string") return false;
  // Check if it's a valid base64 string (basic check)
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(str) && str.length > 0;
}

interface AiAnalysis {
  aiInterpretation?: string;
  whyPoints?: string[];
  risks?: string[];
  partnerProfile?: string;
  nextSteps?: string[];
  confidence?: string;
}

interface AnalysisEmailRequest {
  analysisType: string;
  companyName: string;
  contactName: string;
  phone?: string;
  email: string;
  analysisData: Record<string, unknown>;
  recommendation?: {
    product: string;
    reasons: string[];
  };
  aiAnalysis?: AiAnalysis;
  pdfBase64?: string;
  pdfFilename?: string;
}

serve(async (req: Request): Promise<Response> => {
  
  console.log("send-analysis-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Check rate limit
    if (isRateLimited(clientIp)) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
        }
      );
    }

    // Parse and validate request body
    let body: AnalysisEmailRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
        }
      );
    }

    const {
      analysisType,
      companyName,
      contactName,
      phone,
      email,
      analysisData,
      recommendation,
      aiAnalysis,
      pdfBase64,
      pdfFilename
    } = body;
    
    // Server-side validation
    const errors: string[] = [];
    
    if (!isValidAnalysisType(analysisType)) {
      errors.push("Analysis type must be 'ERP', 'CRM', 'Kundservice', or 'Sälj & Marknad'");
    }
    if (!isValidName(companyName)) {
      errors.push("Company name is required and must be less than 100 characters");
    }
    if (!isValidName(contactName)) {
      errors.push("Contact name is required and must be less than 100 characters");
    }
    if (!isValidEmail(email)) {
      errors.push("Valid email is required");
    }
    if (!isValidPhone(phone)) {
      errors.push("Phone number must be less than 30 characters");
    }
    if (!isValidAnalysisData(analysisData)) {
      errors.push("Analysis data must be a valid object");
    }
    if (pdfBase64 && !isValidBase64(pdfBase64)) {
      errors.push("PDF data must be valid base64");
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
        }
      );
    }

    console.log(`Processing ${analysisType} analysis from:`, companyName, contactName);
    console.log(`PDF attachment included: ${!!pdfBase64}`);

    // Sanitize and format analysis data
    const formatAnalysisData = (data: Record<string, unknown>): string => {
      return Object.entries(data)
        .slice(0, 50) // Limit number of fields
        .map(([key, value]) => {
          const safeKey = sanitizeHtml(String(key).slice(0, 100));
          if (Array.isArray(value)) {
            const safeValues = value.slice(0, 20).map(v => sanitizeHtml(String(v).slice(0, 200)));
            return `<p><strong>${safeKey}:</strong> ${safeValues.join(", ")}</p>`;
          }
          const safeValue = sanitizeHtml(String(value).slice(0, 500));
          return `<p><strong>${safeKey}:</strong> ${safeValue}</p>`;
        })
        .join("");
    };

    // Sanitize inputs for HTML email
    const safeCompanyName = sanitizeHtml(companyName.trim().slice(0, 100));
    const safeContactName = sanitizeHtml(contactName.trim().slice(0, 100));
    const safePhone = phone ? sanitizeHtml(phone.trim().slice(0, 30)) : "Ej angivet";
    const safeEmail = sanitizeHtml(email.trim().slice(0, 255));
    const safeAnalysisType = sanitizeHtml(analysisType);

    const recommendationHtml = recommendation
      ? `
        <h2 style="color:#0E7C86;">Preliminär systemindikation</h2>
        <p><strong>${sanitizeHtml(String(recommendation.product).slice(0, 200))}</strong></p>
        <p style="color:#555;font-size:13px;">Detta är en preliminär indikation – inte ett definitivt systemval. Använd resultatet som diskussionsunderlag inför kravspecifikation och partnerdialog.</p>
        ${(recommendation.reasons || []).length > 0 ? `
          <p style="margin-top:12px;"><strong>Indikationen bygger främst på:</strong></p>
          <ul style="margin:0 0 12px 20px;padding:0;line-height:1.55;">
            ${(recommendation.reasons || []).slice(0, 6).map(r => `<li style="margin:0 0 4px 0;">${formatAiInline(String(r), 500)}</li>`).join("")}
          </ul>` : ""}
      `
      : "";

    const renderList = (items: string[] | undefined, limit = 7) =>
      Array.isArray(items) && items.length > 0
        ? `<ul style="margin:0 0 12px 20px;padding:0;line-height:1.55;">${items.slice(0, limit).map(i => `<li style="margin:0 0 4px 0;">${formatAiInline(String(i), 500)}</li>`).join("")}</ul>`
        : "";

    const aiHtml = aiAnalysis
      ? `
        ${aiAnalysis.aiInterpretation ? `
          <h2 style="color:#D64A1F;margin:32px 0 14px 0;font-size:20px;font-weight:700;letter-spacing:-0.01em;border-top:3px solid #D64A1F;padding-top:20px;">AI-tolkning av ert underlag</h2>
          <div style="font-size:15px;color:#1a1a1a;line-height:1.75;">${formatAiMarkdown(String(aiAnalysis.aiInterpretation), 6000)}</div>
          ${aiAnalysis.confidence ? `<p style="color:#666;font-size:12px;margin:12px 0 0 0;padding:10px 14px;background:#f8f6f1;border-left:3px solid #007C68;"><em>Säkerhet i analysen: ${sanitizeHtml(String(aiAnalysis.confidence))}</em></p>` : ""}
        ` : ""}
        ${(aiAnalysis.whyPoints || []).length ? `<h3 style="color:#0E7C86;margin:28px 0 12px 0;font-size:17px;font-weight:700;">Varför denna riktning</h3>${renderList(aiAnalysis.whyPoints)}` : ""}
        ${(aiAnalysis.risks || []).length ? `<h3 style="color:#0E7C86;margin:28px 0 12px 0;font-size:17px;font-weight:700;">Risker och frågor att utreda vidare</h3>${renderList(aiAnalysis.risks)}` : ""}
        ${aiAnalysis.partnerProfile ? `<h3 style="color:#0E7C86;margin:28px 0 12px 0;font-size:17px;font-weight:700;">Rekommenderad partnerprofil</h3><div style="font-size:15px;color:#1a1a1a;line-height:1.75;">${formatAiMarkdown(String(aiAnalysis.partnerProfile), 2500)}</div>` : ""}
        ${(aiAnalysis.nextSteps || []).length ? `<h3 style="color:#0E7C86;margin:28px 0 12px 0;font-size:17px;font-weight:700;">Rekommenderade nästa steg</h3>${renderList(aiAnalysis.nextSteps)}` : ""}
      `
      : "";

    const isErp = analysisType === "ERP";
    const serviceSubjectMap: Record<string, string> = {
      "Kundservice / Ärendehantering": "Din behovsanalys för Kundservice från d365.se",
      "Fältservice": "Din behovsanalys för Fältservice från d365.se",
      "Contact Center": "Din behovsanalys för Contact Center från d365.se",
      "Kundservice, Contact Center och Fältservice": "Din behovsanalys för Kundservice, Contact Center och Fältservice från d365.se",
    };
    const subject = isErp
      ? "Din ERP Behovsanalys från d365.se"
      : (serviceSubjectMap[analysisType] || `Din Behovsanalys för ${analysisType} från D365.se`);

    const intro = isErp
      ? `<p style="font-size:15px;line-height:1.7;margin:0 0 16px 0;color:#1a1a1a;">Hej ${safeContactName},</p>
         <p style="font-size:15px;line-height:1.7;margin:0 0 16px 0;color:#1a1a1a;">Tack för att du genomförde ERP Behovsanalysen på d365.se. Bifogat hittar du ert köparsidiga beslutsunderlag som PDF.</p>
         <p style="font-size:15px;line-height:1.7;margin:0 0 8px 0;color:#1a1a1a;">Analysen ger en <strong>preliminär systemindikation</strong> baserad på era svar – inte ett definitivt systemval. Använd den som diskussionsunderlag inför kravspecifikation och dialog med ERP-partner.</p>`
      : `<p style="font-size:15px;line-height:1.7;margin:0 0 16px 0;color:#1a1a1a;">Hej ${safeContactName},</p>
         <p style="font-size:15px;line-height:1.7;margin:0 0 8px 0;color:#1a1a1a;">Tack för att du genomförde vår behovsanalys. Här är en sammanfattning av dina svar och vår rekommendation.</p>`;

    const emailPayload: Record<string, unknown> = {
      from: "D365 Guiden <info@d365.se>",
      to: [email],
      cc: ["info@d365.se", "thomas.laine@dynamicfactory.se"],
      reply_to: "thomas.laine@dynamicfactory.se",
      subject,
      html: `
        <div style="background:#f5f3ee;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
          <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6e2da;">
            <!-- Brand header -->
            <div style="background:#15130F;padding:24px 32px;border-bottom:3px solid #D64A1F;">
              <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">d365.se</div>
              <div style="color:rgba(255,255,255,0.65);font-size:12px;margin-top:4px;letter-spacing:0.02em;">Köparsidig vägledning för Microsoft Dynamics 365</div>
            </div>

            <!-- Body -->
            <div style="padding:32px;color:#1a1a1a;">
              ${intro}

              <h2 style="color:#0E7C86;margin:28px 0 12px 0;font-size:17px;font-weight:700;">Kontaktinformation</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7;">
                <tr><td style="padding:4px 12px 4px 0;color:#666;width:130px;">Företag</td><td style="padding:4px 0;color:#1a1a1a;font-weight:600;">${safeCompanyName}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#666;">Kontaktperson</td><td style="padding:4px 0;color:#1a1a1a;font-weight:600;">${safeContactName}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#666;">Telefon</td><td style="padding:4px 0;color:#1a1a1a;">${safePhone}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#666;">E-post</td><td style="padding:4px 0;color:#1a1a1a;">${safeEmail}</td></tr>
              </table>

              ${recommendationHtml}
              ${aiHtml}

              ${!isErp ? `<h2 style="color:#0E7C86;margin:28px 0 12px 0;font-size:17px;font-weight:700;">Analysresultat</h2><div style="font-size:14px;line-height:1.7;color:#1a1a1a;">${formatAnalysisData(analysisData)}</div>` : ""}

              <!-- CTA-box -->
              <div style="margin:36px 0 8px 0;padding:24px;background:#f8f6f1;border-left:4px solid #D64A1F;">
                <h2 style="color:#15130F;margin:0 0 10px 0;font-size:17px;font-weight:700;">Vill du gå vidare?</h2>
                <p style="font-size:14px;line-height:1.7;margin:0 0 14px 0;color:#1a1a1a;">Hör av dig om du vill ha hjälp med kravarbete eller partnerdialog:</p>
                <p style="font-size:14px;line-height:1.6;margin:0;color:#1a1a1a;">
                  <strong style="color:#15130F;">Thomas Laine</strong><br>
                  <span style="color:#555;">Senior rådgivare – Microsoft Dynamics 365</span><br>
                  E-post: <a href="mailto:thomas.laine@dynamicfactory.se" style="color:#D64A1F;text-decoration:none;font-weight:600;">thomas.laine@dynamicfactory.se</a><br>
                  Tel: <a href="tel:+46722324060" style="color:#D64A1F;text-decoration:none;">072-232 40 60</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#15130F;padding:20px 32px;color:rgba(255,255,255,0.65);font-size:12px;line-height:1.6;">
              ${pdfBase64 ? '<div style="margin-bottom:6px;">📎 PDF-rapporten är bifogad i detta mejl.</div>' : ""}
              <div>d365.se – köparsidig vägledning för Microsoft Dynamics 365.</div>
            </div>
          </div>
        </div>
      `,
    };

    // Add PDF attachment if provided
    if (pdfBase64 && pdfFilename) {
      const safeFilename = pdfFilename.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100) + ".pdf";
      console.log(`PDF base64 length: ${pdfBase64.length} characters`);
      
      // Convert base64 to Uint8Array for Resend API
      const binaryString = atob(pdfBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Convert to base64 array for JSON serialization (Resend expects base64 content)
      emailPayload.attachments = [
        {
          filename: safeFilename,
          content: pdfBase64,
          content_type: "application/pdf",
        },
      ];
      console.log(`Adding PDF attachment: ${safeFilename}, size: ${bytes.length} bytes`);
    }

    // Send customer email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await emailResponse.json();
    console.log("Customer email response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(responseData.message || "Failed to send customer email");
    }

    // Send separate admin notification email
    const adminNotificationPayload = {
      from: "D365 Guiden <info@d365.se>",
      to: ["info@d365.se", "thomas.laine@dynamicfactory.se"],
      reply_to: email, // Reply goes to customer
      subject: `Ny: Behovsanalys ${analysisType} - ${companyName.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0078D4 0%, #00BCF2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📋 Ny behovsanalys inskickad</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Typ av analys:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safeAnalysisType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Företag:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safeCompanyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Kontaktperson:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safeContactName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>E-post:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Telefon:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Tidpunkt:</strong></td>
                <td style="padding: 8px 0;">${new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })}</td>
              </tr>
            </table>
          </div>
          
          ${recommendation ? `
          <div style="background: #e7f3ff; padding: 15px; margin-top: 15px; border-radius: 6px; border-left: 4px solid #0078D4;">
            <h3 style="margin: 0 0 10px 0; color: #0078D4;">💡 Rekommendation</h3>
            <p style="margin: 0;"><strong>${sanitizeHtml(String(recommendation.product))}</strong></p>
          </div>
          ` : ""}
          
          <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
            <h3 style="margin: 0 0 15px 0;">Sammanfattning av svar</h3>
            ${formatAnalysisData(analysisData)}
          </div>
          
          <div style="background: #f1f1f1; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              ${pdfBase64 ? "📎 PDF-analysen är bifogad i kundmailet." : ""}
              <br>
              Notifikation från <a href="https://d365.se">d365.se</a>
            </p>
          </div>
        </div>
      `,
    };

    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(adminNotificationPayload),
    });

    const adminData = await adminResponse.json();
    console.log("Admin notification response:", adminData);

    if (!adminResponse.ok) {
      console.error("Failed to send admin notification:", adminData);
      // Don't throw - customer email was already sent successfully
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
    });
  } catch (error: any) {
    console.error("Error in send-analysis-email function:", error);
    
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
      }
    );
  }
});
