/**
 * Delad logik för "Skicka underlag till partners".
 * Publika formuläret sparar bara en förfrågan; mejl till partners och köparens
 * bekräftelse skickas först när en administratör godkänt förfrågan.
 */

export const ADVISOR_BCC = ["thomas.laine@dynamicfactory.se", "info@d365.se"];
export const UNDERLAG_PDF_BUCKET = "email-documents";

const ASSESSMENT_LABELS: Record<string, string> = {
  bc_matching: "Behovsanalys – Business Central (ERP)",
  fscm_matching: "Behovsanalys – Finance & Supply Chain (ERP)",
  crm_matching_sales: "Behovsanalys – Dynamics 365 Sales",
  "crm_matching_customer-service": "Behovsanalys – Dynamics 365 Customer Service",
  crm_matching_marketing: "Behovsanalys – Customer Insights (Marketing)",
  "crm_matching_field-service": "Behovsanalys – Dynamics 365 Field Service",
  "crm_matching_contact-center": "Behovsanalys – Dynamics 365 Contact Center",
  req_spec_erp: "Kravspecifikation – ERP",
  req_spec_sales: "Kravspecifikation – Sälj (D365 Sales)",
  req_spec_customer_service: "Kravspecifikation – Kundservice",
  req_spec_marketing: "Kravspecifikation – Marknad (Customer Insights)",
};

export function labelFor(assessmentType: string): string {
  return ASSESSMENT_LABELS[assessmentType] || "Underlag från d365.se";
}

export function sanitize(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

/** Bara länkar till sajtens egna domäner får följa med i mejlet till partnern. */
export function safeResultUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    const h = u.hostname;
    if (h === "d365.se" || h === "www.d365.se" || h.endsWith(".lovable.app")) return u.toString();
  } catch { /* ogiltig */ }
  return null;
}

export interface ForwardRequestRow {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  assessment_type: string;
  industry: string | null;
  company_size: string | null;
  products: string[] | null;
  underlag_summary: string;
  result_url: string | null;
  lead_id: string | null;
}

export function partnerEmailHtml(r: ForwardRequestRow, partnerName: string, contactPerson: string | null, hasPdf: boolean) {
  const label = labelFor(r.assessment_type);
  const productsList = (r.products || []).join(", ");
  const summaryHtml = sanitize(r.underlag_summary)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 12px 0;line-height:1.6;color:#1a1a1a;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  const resultUrl = safeResultUrl(r.result_url);
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;width:35%;">${k}</td><td style="padding:6px 8px;background:#faf8f4;">${v}</td></tr>`;
  return `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;">
        <div style="background:#15130F;padding:22px 28px;">
          <div style="height:3px;background:#D64A1F;width:60px;margin-bottom:14px;"></div>
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Nytt underlag från d365.se</h1>
          <p style="margin:6px 0 0 0;color:#c9c4bb;font-size:13px;">${sanitize(label)}</p>
        </div>
        <div style="padding:24px 28px;color:#1a1a1a;">
          <p style="margin:0 0 12px 0;">Hej ${sanitize(contactPerson || partnerName)},</p>
          <p style="margin:0 0 16px 0;line-height:1.6;">
            En köpare på d365.se har genomfört <strong>${sanitize(label)}</strong>
            och valt att skicka sitt underlag till er. Underlaget har granskats av d365.se innan det skickades.
          </p>
          <table style="width:100%;border-collapse:collapse;margin:12px 0 20px;">
            ${row("Företag", sanitize(r.company_name))}
            ${row("Kontaktperson", sanitize(r.contact_name))}
            ${row("E-post", `<a href="mailto:${sanitize(r.email)}">${sanitize(r.email)}</a>`)}
            ${r.phone ? row("Telefon", sanitize(r.phone)) : ""}
            ${r.industry ? row("Bransch", sanitize(r.industry)) : ""}
            ${r.company_size ? row("Storlek", sanitize(r.company_size)) : ""}
            ${productsList ? row("Produktområde", sanitize(productsList)) : ""}
          </table>
          ${r.message ? `<p style="margin:0 0 8px 0;"><strong>Meddelande från köparen:</strong></p><blockquote style="margin:0 0 16px 0;padding:10px 14px;background:#faf8f4;border-left:3px solid #D64A1F;color:#333;">${sanitize(r.message)}</blockquote>` : ""}
          <h2 style="font-size:15px;margin:24px 0 10px 0;color:#0E7C86;">Sammanfattning av underlaget</h2>
          ${summaryHtml}
          ${resultUrl ? `<p style="margin:16px 0;"><a href="${sanitize(resultUrl)}" style="color:#D64A1F;">Öppna underlaget online</a></p>` : ""}
          ${hasPdf ? `<p style="margin:16px 0 0 0;color:#555;font-size:13px;">Fullständigt underlag bifogas som PDF.</p>` : ""}
          <p style="margin:24px 0 0 0;line-height:1.6;">
            Vänligen svara direkt till köparen på <a href="mailto:${sanitize(r.email)}" style="color:#D64A1F;">${sanitize(r.email)}</a>.
            Rådgivningsteamet på d365.se är kopierat (BCC) för uppföljning.
          </p>
          <p style="margin:24px 0 0 0;color:#888;font-size:12px;">Referens: ${sanitize(r.lead_id || r.id)}</p>
        </div>
      </div>`;
}

export function buyerConfirmationHtml(r: ForwardRequestRow, partnerNames: string[]) {
  const label = labelFor(r.assessment_type);
  const list = partnerNames.map((n) => `<li style="margin:0 0 6px 0;">${sanitize(n)}</li>`).join("");
  return `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;">
            <div style="background:#15130F;padding:22px 28px;">
              <div style="height:3px;background:#D64A1F;width:60px;margin-bottom:14px;"></div>
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Ert underlag är skickat</h1>
              <p style="margin:6px 0 0 0;color:#c9c4bb;font-size:13px;">${sanitize(label)}</p>
            </div>
            <div style="padding:24px 28px;color:#1a1a1a;line-height:1.6;">
              <p style="margin:0 0 14px 0;">Hej ${sanitize(r.contact_name)},</p>
              <p style="margin:0 0 14px 0;">Vi har nu skickat ert underlag från ${sanitize(label)} till följande Microsoft-partners:</p>
              <ul style="margin:0 0 16px 20px;padding:0;">${list}</ul>
              <p style="margin:0 0 14px 0;">Partnerna kontaktar er direkt via e-post. Rådgivningsteamet på d365.se följer upp.</p>
              <p style="margin:0;color:#555;font-size:13px;">Har ni frågor? Svara på det här mejlet så hjälper vi er.</p>
            </div>
          </div>`;
}
