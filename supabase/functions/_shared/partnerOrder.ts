export const ORDER_VERSION = '2026-11-17';
export const ORDER_AREAS = { bc: 'Business Central', fscm: 'Finance & Supply Chain Management', crm: 'CRM (Sales, Customer Service, Field Service, Customer Insights och Contact Center)' };
export const ADDON_PRODUCTS = ['Commerce', 'Human Resources', 'Project Operations'];
export const ADDON_PRODUCT_NOTE = 'Commerce, Human Resources och Project Operations är tillvalsprodukter som ni för in via profileringslänken. De ingår kostnadsfritt för partners med profil och räknas därför inte som produktområden i prislistan.';
export type OrderSelection = { level: 'basic' | 'premium'; period: 'month' | 'year'; areas: (keyof typeof ORDER_AREAS)[]; mediation: boolean; start_date: string };
export const ORDER_PRICES = { month: [0, 995, 1295, 1495], year: [0, 7990, 9990, 11990] };
export const AGREEMENT_DURATION_TERMS = 'Avtalen gäller tills vidare. Priserna kan komma att indexregleras inför varje nytt kalenderår.';
export const SUBSCRIPTION_TERMS = `Grundprofil är kostnadsfri. Premium omfattar fördjupad presentation, redaktionell granskning inför verifiering, kvartalsvis genomgång, profilstatistik och namngiven kontaktperson.

Märket Verifierad partner ges efter redaktionens godkännande, aldrig automatiskt genom betalning. INSIDE-produktion köps separat och gäller endast Premiumpartners.

Premium Månad faktureras i efterskott med tre månaders uppsägningstid, meddelad i god tid före varje kvartals början. Premium År faktureras årsvis i förskott.

CRM-applikationerna räknas som ett produktområde. Upp till tre branscher per produktområde ingår.

Commerce, Human Resources och Project Operations är tillvalsprodukter som ingår kostnadsfritt via profileringslänken och räknas inte som produktområden.

${AGREEMENT_DURATION_TERMS}

Alla priser exklusive moms. Betalning påverkar aldrig relevansordning eller rekommendationer.`;
export const MEDIATION_TERMS = `Förmedlingsavtal (Finder’s fee), prismodell 2026-11-17. Samma villkor för alla partners; Premium och Basic avser partnerns profilnivå. Partnern bedömer varje affärsmöjlighet och accepterar villkoren före introduktion.

Nya projekt: mötesavgift per genomfört kvalificerat möte samt avgift vid affär på 2,5 procent av affärens konsult- och projektvärde.
• Under 250 tkr: mötesavgift 1 500 kr (Premium och Basic), lägsta avgift vid affär 3 000 kr.
• 250 tkr–1 Mkr: mötesavgift 3 000 kr (Premium) / 5 000 kr (Basic).
• Över 1 Mkr: mötesavgift 6 000 kr (Premium) / 9 000 kr (Basic), avgiften vid affär är högst 100 000 kr.
Betald mötesavgift räknas av i sin helhet mot avgiften vid affär; avräkningen blir aldrig negativ och mötesavgiften återbetalas inte.

Partnerbyte: endast mötesavgift, ingen avgift vid affär.
• Business Central, CRM och Power Platform: 3 000 kr (Premium) / 5 000 kr (Basic).
• Finance & Supply Chain Management: 6 000 kr (Premium) / 9 000 kr (Basic).

Expertförmedling: fast avgift per tillsatt uppdrag.
• Upp till sex månader eller under halvtid: 7 500 kr (Premium) / 12 500 kr (Basic).
• Längre uppdrag eller minst halvtid: 15 000 kr (Premium) / 25 000 kr (Basic).

Partnern tecknar kundavtalet, debiterar kunden och har leveransansvaret.

Tidsgränser:
• Reklamation av kvalificering inom 5 arbetsdagar efter mötet.
• Offert som flyttar mötet till lägre band inom 60 dagar efter mötet.
• Vunnen affär rapporteras inom 14 dagar efter avtal med kund.
• Tidsfönster 9 månader från mötet för nya projekt och partnerbyte, samt 6 månader från förfrågan för expertförmedling.
• Befintlig kundrelation ska visas med aktiv dialog inom 5 arbetsdagar.

${AGREEMENT_DURATION_TERMS}

Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte i affärsvärdet. Alla belopp exklusive moms.`;
export function orderPrice(s: OrderSelection): number { return s.level === 'basic' ? 0 : ORDER_PRICES[s.period][s.areas.length] ?? 0; }
export function orderValidation(s: OrderSelection, accept: boolean, authority: boolean, mediationAccept: boolean): string | null {
 if (!['basic','premium'].includes(s.level) || !['month','year'].includes(s.period)) return 'Välj profil och betalningsperiod.';
 if (!Array.isArray(s.areas) || s.areas.length < 1 || s.areas.length > 3 || new Set(s.areas).size !== s.areas.length || s.areas.some(a => !(a in ORDER_AREAS))) return 'Välj ett till tre produktområden.';
 if (typeof s.mediation !== 'boolean') return 'Välj om förmedlingsavtalet ska ingå.';
 if (!/^\d{4}-\d{2}-\d{2}$/.test(s.start_date) || Number.isNaN(Date.parse(s.start_date)) || new Date(s.start_date).toISOString().slice(0,10) !== s.start_date || s.start_date < new Date().toISOString().slice(0,10)) return 'Välj ett giltigt startdatum från dagens datum.';
 if (!accept || !authority) return 'Acceptera villkoren och bekräfta din behörighet att beställa.';
 if (s.mediation && !mediationAccept) return 'Acceptera förmedlingsvillkoren separat.';
 return null;
}
export function orderSnapshot(s: OrderSelection) { return { version: ORDER_VERSION, subscription: SUBSCRIPTION_TERMS, mediation: s.mediation ? MEDIATION_TERMS : null, selection: s, price_ex_vat: orderPrice(s) }; }
/** Läslig villkorstext med radbrytning, för mejl och adminvy. Ger tom sträng om underlaget saknas. */
export function termsDisplayText(snapshot: unknown): string {
  const s = (snapshot ?? {}) as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : '');
  const subscription = text(s.subscription);
  const mediation = text(s.mediation);
  const parts: string[] = [];
  const version = text(s.version);
  if (version) parts.push(`Villkorsversion ${version}`);
  if (subscription) parts.push(subscription);
  if (mediation) parts.push(mediation);
  const accept = [
    `Abonnemangsvillkor accepterade: ${s.accept === true ? 'Ja' : 'Nej'}`,
    `Behörighet att företräda företaget: ${s.authority === true ? 'Ja' : 'Nej'}`,
  ];
  if (mediation) accept.push(`Förmedlingsvillkor accepterade: ${s.mediation_accept === true ? 'Ja' : 'Nej'}`);
  parts.push(accept.join('\n'));
  return parts.join('\n\n');
}
