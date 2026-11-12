export const ISV_ORDER_VERSION = '2026-11-12';
export const ISV_ORDER_FEES = { base: 5990, extraApp: 995, introStd: 3500, introFscm: 7500, successRate: 0.025 };
export const ISV_MAX_EXTRA_APPS = 20;
export type IsvOrderSelection = { kind: 'isv'; extra_apps: number; mediation: boolean; start_date: string };
export const ISV_SUBSCRIPTION_TERMS = 'ISV Premium omfattar verifieringsprocessen (grundkontroll), logotyp, webblänk och kontaktuppgifter för verifierad leverantör och app, upp till tre aktiva demofilmer från YouTube per app som visas under Produktdemonstrationer i d365.se INSIDE, märkena Verifierad ISV och Verifierad tilläggslösning med datum när respektive verifiering är godkänd samt möjlighet till visning på businesscentral.se för BC-appar. Verifierad status kan inte köpas eller garanteras och beslutas manuellt av d365.se-redaktionen. Pris: 5 990 kr per år och ISV inklusive en app, 995 kr per år för varje extra app. Avgiften faktureras årsvis i förskott. Produktion av INSIDE-film offereras separat. Alla priser exklusive moms. Betalning påverkar aldrig ordningen i katalogen eller rekommendationer.';
export const ISV_MEDIATION_TERMS = 'Förmedlingsavtal (Finder’s fee) för ISV. ISV:n bedömer varje affärsmöjlighet och accepterar villkoren före introduktion. Ersättning vid accepterad introduktion som leder till tecknat avtal: 3 500 kr för ISV-lösningar för Business Central och CRM, 7 500 kr för ISV-lösningar för Finance & Supply Chain Management. Success fee på 2,5 procent tillkommer; beräkningsunderlag och betalningsvillkor fastställs innan introduktionen genomförs. ISV Premium och förmedlingsersättning är separata. Alla belopp exklusive moms.';
export function isvOrderPrice(s: IsvOrderSelection): number { return ISV_ORDER_FEES.base + Math.max(0, Math.floor(s.extra_apps)) * ISV_ORDER_FEES.extraApp; }
export function isvOrderValidation(s: IsvOrderSelection, accept: boolean, authority: boolean, mediationAccept: boolean): string | null {
 if (s.kind !== 'isv' || !Number.isInteger(s.extra_apps) || s.extra_apps < 0 || s.extra_apps > ISV_MAX_EXTRA_APPS) return `Ange 0 till ${ISV_MAX_EXTRA_APPS} extra appar.`;
 if (typeof s.mediation !== 'boolean') return 'Välj om förmedlingsavtalet ska ingå.';
 if (!/^\d{4}-\d{2}-\d{2}$/.test(s.start_date) || Number.isNaN(Date.parse(s.start_date)) || new Date(s.start_date).toISOString().slice(0,10) !== s.start_date || s.start_date < new Date().toISOString().slice(0,10)) return 'Välj ett giltigt startdatum från dagens datum.';
 if (!accept || !authority) return 'Acceptera villkoren och bekräfta din behörighet att beställa.';
 if (s.mediation && !mediationAccept) return 'Acceptera förmedlingsvillkoren separat.';
 return null;
}
export function isvOrderSnapshot(s: IsvOrderSelection) { return { version: ISV_ORDER_VERSION, subscription: ISV_SUBSCRIPTION_TERMS, mediation: s.mediation ? ISV_MEDIATION_TERMS : null, selection: s, price_ex_vat: isvOrderPrice(s) }; }
