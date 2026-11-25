export const ORDER_VERSION = '2027-01-01';
export const MONTHLY_NOTICE_MONTHS = 1;
export const MONTHLY_BILLING_TERMS = `Premium Månad faktureras i efterskott med ${MONTHLY_NOTICE_MONTHS === 1 ? 'en månads' : `${MONTHLY_NOTICE_MONTHS} månaders`} uppsägningstid. Uppsägning sker skriftligen via e-post.`;
export const PREMIUM_MEETING_TERMS = 'Mötesavgifter för möten under en betald månad följer Premiumpriset endast om Premiumabonnemanget är aktivt när mötet genomförs. Om abonnemanget inte är aktivt gäller Grundprofilens mötesavgift.';
export const FINDERS_FEE_VARIANTS = [
 { name: 'Alla produktområden', scope: 'Business\u00a0Central, CRM (Sales, Customer Service, Contact Center, Field Service, Customer Insights), F&SCM (Finance och Supply Chain Management), Project Operations, Commerce, Human Resources, Power Platform och Copilot', premium: 0, grund: 3500 },
] as const;
/** Ersättning vid vunnen affär: Premium 2,5 %, Grundprofil 5 % (prislista 2027). */
export const FINDERS_FEE_RATE = 0.025;
export const FINDERS_FEE_RATE_GRUND = 0.05;
export const FINDERS_FEE_CAP = null;
export const FINDERS_FEE_AFFAR = 'Vid affär: 2,5 % (Premium) eller 5 % (Grundprofil) av fakturerat konsult- och projektvärde under de första 12 månaderna från kundavtalet, för kundavtal som tecknas inom 6 månader från mötet (vid expertförmedling från intervjun). Inget maxbelopp. För Grundprofil räknas betald mötesavgift av till 100 % och avräkningen blir aldrig negativ; för Premium är mötet kostnadsfritt och avräkning är inte aktuell. Gäller nya projekt, partnerbyte och expertförmedling.';
export const FINDERS_FEE_MEETINGS = FINDERS_FEE_VARIANTS.map(v => `${v.name}: ${v.scope}. Mötesavgift ${(v.premium as number).toLocaleString('sv-SE')} kr (Premium) / ${v.grund.toLocaleString('sv-SE')} kr (Grundprofil).`).join('\n\n');
export const ORDER_AREAS = { bc: 'Business Central', fscm: 'Finance & Supply Chain Management', crm: 'CRM (Sales, Customer Service, Field Service, Customer Insights och Contact Center)' };
export const ADDON_PRODUCTS = ['Commerce', 'Human Resources', 'Project Operations'];
export const ADDON_PRODUCT_NOTE = 'Commerce, Human Resources och Project Operations är tillvalsprodukter som ni för in via profileringslänken. De ingår kostnadsfritt för partners med profil och räknas därför inte som produktområden i prislistan.';
export type OrderSelection = { level: 'basic' | 'premium'; period: 'month' | 'year'; areas: (keyof typeof ORDER_AREAS)[]; mediation: boolean; start_date: string };
export const ORDER_PRICES = { month: [0, 1000, 1300, 1500], year: [0, 8000, 10500, 12000] };
/** Comparison uses monthly list price, not saved individual contract discounts. */
export function premiumPriceComparison(areas: number) {
 if (!Number.isInteger(areas) || areas < 1 || areas > 3) throw new RangeError('Välj ett till tre produktområden.');
 const monthly = ORDER_PRICES.month[areas];
 const annual = ORDER_PRICES.year[areas];
 const monthlyTotal = monthly * 12;
 const savings = monthlyTotal - annual;
 return { areas, monthly, monthlyTotal, annual, savings, savingsPercent: Math.round(savings / monthlyTotal * 100) };
}
/** Generella kommersiella principer (prislista 2027); gäller partner, ISV och affärsförmedling. */
export const COMMERCIAL_PRINCIPLES = [
 'Samtliga priser exklusive moms.',
 'Ordinarie priser kan indexregleras årligen.',
 'Betalning påverkar aldrig relevansordning, rekommendationer eller verifieringsbeslut.',
 'Ingen garanterad volym av kundmöten.',
 'INSIDE-produktion prissätts separat.',
] as const;
export const COMMERCIAL_PRINCIPLES_TEXT = `Generella kommersiella principer:\n${COMMERCIAL_PRINCIPLES.map(p => `• ${p}`).join('\n')}`;
export const AGREEMENT_DURATION_TERMS = 'Avtalen gäller tills vidare. Priserna kan komma att indexregleras inför varje nytt kalenderår.';
export const SUBSCRIPTION_TERMS = `Grundprofil är kostnadsfri. Premium omfattar fördjupad presentation, redaktionell granskning inför verifiering, kvartalsvis genomgång, profilstatistik och namngiven kontaktperson.

Märket Verifierad partner ges efter redaktionens godkännande, aldrig automatiskt genom betalning. INSIDE-produktion köps separat och gäller endast Premiumpartners.

${MONTHLY_BILLING_TERMS} Premium År faktureras årsvis i förskott.

${PREMIUM_MEETING_TERMS}

CRM-applikationerna räknas som ett produktområde. Upp till tre branscher per produktområde ingår.

Commerce, Human Resources och Project Operations är tillvalsprodukter som ingår kostnadsfritt via profileringslänken och räknas inte som produktområden.

${AGREEMENT_DURATION_TERMS}

${COMMERCIAL_PRINCIPLES_TEXT}`;
export const MEDIATION_TERMS = `Affärsförmedlingsavtal, prislista 2027. Samma villkor för alla partners inom respektive nivå; Premium och Grundprofil avser partnerns profilnivå. Partnern bedömer varje affärsmöjlighet och accepterar villkoren före introduktion.

Mötesavgift per genomfört kvalificerat möte, oavsett produktområde. Samma belopp gäller för nya projekt, partnerbyte och expertförmedling.
${PREMIUM_MEETING_TERMS}
${FINDERS_FEE_MEETINGS}
Samma mötesavgift gäller även när affären omfattar flera produktområden. Vid expertförmedling tas mötesavgiften ut när kunden har haft intervju med experten, inte när ett CV skickas. Avgiften gäller per expert.

${FINDERS_FEE_AFFAR}

Vid expertförmedling tecknar partnern kundavtalet, debiterar kunden och har leveransansvaret.

Tidsgränser:
• Reklamation av kvalificering: 5 arbetsdagar efter mötet.
• Vunnen affär rapporteras inom 14 dagar efter avtal med kund.
• Fakturerat konsult- och projektvärde rapporteras kvartalsvis under de första 12 månaderna.
• Tidsfönster: kundavtal ska tecknas inom 6 månader från mötet. För expertförmedling: inom 6 månader från intervjun.
• Befintlig kundrelation: partnern visar aktiv dialog inom 5 arbetsdagar.

${AGREEMENT_DURATION_TERMS}

Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte. Alla belopp är exklusive moms.

${COMMERCIAL_PRINCIPLES_TEXT}`;
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
