/** Presentation and routing only; delivery, attachments and consent stay with the existing provider. */
export const EMAIL_OWNER = "thomas.laine@dynamicfactory.se";
export const EMAIL_FROM = "Thomas Laine | D365.SE <info@d365.se>";
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));

export function premiumEmail(html: string, subject: string): string {
  if (html.includes('data-d365-email="premium"')) return html;
  let content = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  content = content.replace(/<!doctype[^>]*>|<\/?(?:html|head|body)\b[^>]*>|<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  // Retain tables, information cards, action links and recipient-specific content.
  content = content.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, text: string) =>
    text.split(/\n\s*\n/).filter(Boolean).map((part) => `<p style="margin:0 0 16px;line-height:1.7">${part.replace(/\n/g, "<br>")}</p>`).join(""));
  content = content.replace(/Microsoft(?: |&nbsp;)Dynamics(?: |&nbsp;)365/g, "Microsoft&nbsp;Dynamics&nbsp;365").replace(/Dynamics 365/g, "Dynamics&nbsp;365");
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body data-d365-email="premium" style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#181512">
<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(subject)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5F2EC"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #D8D1C6;border-radius:4px;overflow:hidden">
<tr><td style="padding:24px 28px;background:#161511;color:#ffffff"><strong style="font-size:22px">D365.SE</strong><div style="margin-top:6px;font-size:12px;color:#D8D1C6">Vägledning inför system- och partnerval i Microsoft&nbsp;Dynamics&nbsp;365</div></td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.7;overflow-wrap:anywhere">${content}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;border-top:1px solid #D8D1C6"><tr><td style="padding-top:20px;font-size:14px;line-height:1.8">Med vänliga hälsningar<br><strong>Thomas&nbsp;Laine</strong><br>D365.SE<br><a href="mailto:${EMAIL_OWNER}" style="color:#007C68">${EMAIL_OWNER}</a><br><a href="tel:+46722324060" style="color:#007C68">+46&nbsp;72&nbsp;232&nbsp;40&nbsp;60</a> · <a href="https://d365.se" style="color:#007C68">d365.se</a></td></tr></table>
</td></tr></table><div style="padding:18px 12px;color:#6F6A61;font-size:11px;line-height:1.6">Moveahead AB (Dynamic Factory) · D365.SE</div>
</td></tr></table></body></html>`;
}

type Address = string | string[];
export interface BrandableEmail {
  from: string; to: Address; subject: string; html?: string; text?: string;
  reply_to?: Address; bcc?: Address; cc?: Address; [key: string]: unknown;
}
const normalizeRecipients = (addresses: Address): Address => {
  const list = (Array.isArray(addresses) ? addresses : [addresses]).map((a) =>
    /^(?:info|hej|noreply)@d365\.se$/i.test(a.trim()) ? EMAIL_OWNER : a);
  const unique = [...new Set(list)];
  return Array.isArray(addresses) ? unique : unique[0] ?? EMAIL_OWNER;
};
export function brandEmail<T extends BrandableEmail>(email: T): T & BrandableEmail {
  const html = email.html ?? `<p>${escapeHtml(email.text ?? "").replace(/\n/g, "<br>")}</p>`;
  const to = normalizeRecipients(email.to);
  const internal = (Array.isArray(to) ? to : [to]).every((a) => a.toLowerCase() === EMAIL_OWNER);
  return {
    ...email, from: EMAIL_FROM, to,
    reply_to: internal ? EMAIL_OWNER : email.reply_to ? normalizeRecipients(email.reply_to) : EMAIL_OWNER,
    ...(email.cc ? { cc: normalizeRecipients(email.cc) } : {}),
    ...(email.bcc ? { bcc: normalizeRecipients(email.bcc) } : {}),
    html: premiumEmail(html, email.subject),
    text: `${email.text ?? html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}\n\nMed vänliga hälsningar\nThomas Laine | D365.SE\n${EMAIL_OWNER}\n+46 72 232 40 60\nhttps://d365.se\nMoveahead AB (Dynamic Factory)`,
  };
}