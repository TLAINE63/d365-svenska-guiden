// Client mirror of supabase/functions/_shared/freeEmailDomains.ts
// Used for inline UX validation. Server enforces the same rule authoritatively.

export const FREE_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  // Microsoft consumer
  "hotmail.com", "hotmail.se", "hotmail.co.uk", "hotmail.fr", "hotmail.de", "hotmail.it", "hotmail.es", "hotmail.no", "hotmail.dk", "hotmail.fi",
  "outlook.com", "outlook.se", "outlook.dk", "outlook.fr", "outlook.de", "outlook.it", "outlook.es",
  "live.com", "live.se", "live.dk", "live.no", "live.fi", "live.nl", "live.fr", "live.de", "live.co.uk",
  "msn.com",
  // Google
  "gmail.com", "googlemail.com",
  // Apple
  "icloud.com", "me.com", "mac.com",
  // Yahoo
  "yahoo.com", "yahoo.se", "yahoo.co.uk", "yahoo.fr", "yahoo.de", "yahoo.it", "yahoo.es", "yahoo.no", "yahoo.dk", "ymail.com", "rocketmail.com",
  // Other free
  "aol.com", "aim.com", "protonmail.com", "proton.me", "pm.me",
  "gmx.com", "gmx.net", "gmx.de", "gmx.se",
  "mail.com", "email.com", "fastmail.com", "fastmail.fm",
  "zoho.com", "yandex.com", "yandex.ru",
  "tutanota.com", "tutamail.com", "tuta.io",
  // Swedish ISPs / personal
  "telia.com", "telia.se", "spray.se", "bredband.net", "bredband2.com",
  "comhem.se", "bahnhof.se", "tele2.se", "swipnet.se", "passagen.se",
  "home.se", "minmail.se", "chello.se", "glocalnet.net",
  // Nordic ISPs
  "online.no", "broadpark.no", "start.no", "c2i.net",
  "stofanet.dk", "mail.dk", "tdcadsl.dk",
  // Disposable
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "trashmail.com", "yopmail.com", "throwawaymail.com", "getnada.com",
  "dispostable.com", "maildrop.cc", "sharklasers.com",
]);

export const FREE_EMAIL_ERROR_SV =
  "Vänligen ange din jobbmejl. Vi tar inte emot privata adresser (t.ex. Gmail, Hotmail, Outlook, Live).";

export function getEmailDomain(email: string): string {
  return (email || "").trim().toLowerCase().split("@")[1] || "";
}

export function isFreeEmailDomain(email: string): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  return FREE_EMAIL_DOMAINS.has(domain);
}

/**
 * Returns null when the email is acceptable. Returns a Swedish error message
 * otherwise. Use this in form onSubmit handlers before invoking edge functions.
 */
export function validateBusinessEmail(email: string): string | null {
  const trimmed = (email || "").trim();
  if (!trimmed) return "Ange en e-postadress.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Ogiltig e-postadress.";
  if (trimmed.length > 255) return "E-postadressen är för lång.";
  if (isFreeEmailDomain(trimmed)) return FREE_EMAIL_ERROR_SV;
  return null;
}
