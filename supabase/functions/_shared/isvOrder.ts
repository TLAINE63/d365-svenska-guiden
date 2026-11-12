export const ISV_ORDER_VERSION = '2026-11-13';
export const ISV_ORDER_FEES = { base: 5990, introFirstYear: 2990, extraApp: 995, licenseRate: 0.05, consultRate: 0.025 };
/** Introduktionspriset gäller de första 20 nya ISV-leverantörerna; d365.se bekräftar platsen vid granskning av beställningen. */
export const ISV_INTRO_SEATS = 20;
export const ISV_MAX_EXTRA_APPS = 20;
export type IsvOrderSelection = { kind: 'isv'; extra_apps: number; mediation: boolean; start_date: string };
export const ISV_SUBSCRIPTION_TERMS = 'ISV Premium omfattar verifieringsprocessen (grundkontroll), logotyp, webblänk och kontaktuppgifter för verifierad leverantör och app, upp till tre aktiva demofilmer från YouTube per app som visas under Produktdemonstrationer i d365.se INSIDE, märkena Verifierad ISV och Verifierad tilläggslösning med datum när respektive verifiering är godkänd samt möjlighet till visning på businesscentral.se för BC-appar. Verifierad status kan inte köpas eller garanteras och beslutas manuellt av d365.se-redaktionen. Pris: 5 990 kr per år och ISV inklusive en app, 995 kr per år för varje extra app. Introduktionserbjudande: 2 990 kr för första året inklusive en app för de första 20 nya ISV-leverantörerna; från år två gäller ordinarie pris om inget annat avtalas. Avgiften faktureras årsvis i förskott. Produktion av INSIDE-film offereras separat. Alla priser exklusive moms. Betalning påverkar aldrig ordningen i katalogen eller rekommendationer.';
export const ISV_MEDIATION_TERMS = 'Förmedlingsavtal (Finder’s fee) för ISV, frivilligt och separat från ISV Premium. ISV:n bedömer varje affärsmöjlighet och accepterar villkoren före introduktion. Ersättning utgår först när en överenskommen affär genomförs: 5 procent av ISV:ns nettointäkter från produktlicenser eller abonnemang under affärens första 12 månader, samt 2,5 procent av nettointäkterna från ett separat förmedlat implementations- eller konsultuppdrag. Ersättning gäller endast nya, registrerade och godkända affärsmöjligheter och beräknas på betalade intäkter exklusive moms, rabatter, återbetalningar och vidarefakturerade tredjepartskostnader. Vid försäljning genom en Solution Partner beräknas ersättningen på ISV:ns faktiska nettointäkt. Samma intäkt provisionsbeläggs aldrig dubbelt, och ersättningen gäller normalt första affären, inte förnyelser eller tilläggsbeställningar. Ingen ersättning uppstår av enbart ett formulär, ett klick eller en obesvarad förfrågan.';
/** Pris för första året (introduktionspris). */
export function isvOrderPrice(s: IsvOrderSelection): number { return ISV_ORDER_FEES.introFirstYear + Math.max(0, Math.floor(s.extra_apps)) * ISV_ORDER_FEES.extraApp; }
/** Ordinarie årspris från år två. */
export function isvOrderRegularPrice(s: IsvOrderSelection): number { return ISV_ORDER_FEES.base + Math.max(0, Math.floor(s.extra_apps)) * ISV_ORDER_FEES.extraApp; }
export function isvOrderValidation(s: IsvOrderSelection, accept: boolean, authority: boolean, mediationAccept: boolean): string | null {
 if (s.kind !== 'isv' || !Number.isInteger(s.extra_apps) || s.extra_apps < 0 || s.extra_apps > ISV_MAX_EXTRA_APPS) return `Ange 0 till ${ISV_MAX_EXTRA_APPS} extra appar.`;
 if (typeof s.mediation !== 'boolean') return 'Välj om förmedlingsavtalet ska ingå.';
 if (!/^\d{4}-\d{2}-\d{2}$/.test(s.start_date) || Number.isNaN(Date.parse(s.start_date)) || new Date(s.start_date).toISOString().slice(0,10) !== s.start_date || s.start_date < new Date().toISOString().slice(0,10)) return 'Välj ett giltigt startdatum från dagens datum.';
 if (!accept || !authority) return 'Acceptera villkoren och bekräfta din behörighet att beställa.';
 if (s.mediation && !mediationAccept) return 'Acceptera förmedlingsvillkoren separat.';
 return null;
}
export function isvOrderSnapshot(s: IsvOrderSelection) { return { version: ISV_ORDER_VERSION, subscription: ISV_SUBSCRIPTION_TERMS, mediation: s.mediation ? ISV_MEDIATION_TERMS : null, selection: s, price_ex_vat: isvOrderPrice(s), regular_price_ex_vat: isvOrderRegularPrice(s) }; }
