export const ORDER_VERSION = '2026-11-17';
export const ORDER_AREAS = { bc: 'Business Central', fscm: 'Finance & Supply Chain Management', crm: 'CRM (Sales, Customer Service, Field Service, Customer Insights och Contact Center)' };
export const ADDON_PRODUCTS = ['Commerce', 'Human Resources', 'Project Operations'];
export const ADDON_PRODUCT_NOTE = 'Commerce, Human Resources och Project Operations är tillvalsprodukter som ni för in via profileringslänken. De ingår kostnadsfritt för partners med profil och räknas därför inte som produktområden i prislistan.';
export type OrderSelection = { level: 'basic' | 'premium'; period: 'month' | 'year'; areas: (keyof typeof ORDER_AREAS)[]; mediation: boolean; start_date: string };
export const ORDER_PRICES = { month: [0, 995, 1295, 1495], year: [0, 8000, 9990, 11990] };
export const AGREEMENT_DURATION_TERMS = 'Avtalen gäller tills vidare. Priserna kan komma att indexregleras inför varje nytt kalenderår.';
export const SUBSCRIPTION_TERMS = `Grundprofil är kostnadsfri. Premium omfattar fördjupad presentation, redaktionell granskning inför verifiering, kvartalsvis genomgång, profilstatistik och namngiven kontaktperson.

Märket Verifierad partner ges efter redaktionens godkännande, aldrig automatiskt genom betalning. INSIDE-produktion köps separat och gäller endast Premiumpartners.

Premium Månad faktureras i efterskott med tre månaders uppsägningstid, meddelad i god tid före varje kvartals början. Premium År faktureras årsvis i förskott.

CRM-applikationerna räknas som ett produktområde. Upp till tre branscher per produktområde ingår.

Commerce, Human Resources och Project Operations är tillvalsprodukter som ingår kostnadsfritt via profileringslänken och räknas inte som produktområden.

${AGREEMENT_DURATION_TERMS}

Alla priser exklusive moms. Betalning påverkar aldrig relevansordning eller rekommendationer.`;
export const MEDIATION_TERMS = `Förmedlingsavtal (Finder’s fee), prismodell 2026-11-24. Samma villkor för alla partners inom respektive nivå; Premium och Grundprofil avser partnerns profilnivå. Partnern bedömer varje affärsmöjlighet och accepterar villkoren före introduktion.

Mötesavgift per genomfört kvalificerat möte, efter produktområde. Samma belopp gäller för nya projekt, partnerbyte och expertförmedling.
• Band 1: Business Central. Power Platform och Copilot som fristående projekt: 1 000 kr (Premium) / 3 000 kr (Grundprofil).
• Band 2: CRM: Sales, Customer Service, Contact Center, Field Service, Customer Insights: 1 500 kr (Premium) / 4 000 kr (Grundprofil).
• Band 3: Finance, Supply Chain Management, Project Operations, Commerce, Human Resources: 2 000 kr (Premium) / 5 000 kr (Grundprofil).
Ingår Power Platform eller Copilot i ett CRM- eller ERP-projekt följer de det produktområdets band. Omfattar affären flera produktområden gäller det högsta bandet. Vid expertförmedling tas mötesavgiften ut när kunden har haft intervju med experten, inte när ett CV skickas. Avgiften gäller per expert.

Vid affär: 2,5 % av fakturerat konsult- och projektvärde under de första 12 månaderna från kundavtalet, för avtal som tecknas inom 12 månader från mötet. Högst 100 000 kr per affär. Betald mötesavgift räknas av i sin helhet, och avräkningen blir aldrig negativ. Gäller nya projekt, partnerbyte och expertförmedling.

Vid expertförmedling tecknar partnern kundavtalet, debiterar kunden och har leveransansvaret.

Tidsgränser:
• Reklamation av kvalificering: 5 arbetsdagar efter mötet.
• Vunnen affär rapporteras inom 14 dagar efter avtal med kund.
• Fakturerat konsult- och projektvärde rapporteras kvartalsvis under de första 12 månaderna.
• Tidsfönster: 12 månader från mötet. För expertförmedling: 12 månader från intervjun.
• Befintlig kundrelation: partnern visar aktiv dialog inom 5 arbetsdagar.

${AGREEMENT_DURATION_TERMS}

Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte. Alla belopp är exklusive moms.`;
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
