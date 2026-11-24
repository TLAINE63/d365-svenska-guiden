import { ADVISOR_EMAIL_HREF } from '@/data/organization';
import { ORDER_AREAS, ORDER_VERSION, orderPrice, type OrderSelection } from './partnerOrder';

export function partnerOrderParts(selection: OrderSelection) {
  return { subscription: selection.level === 'premium', mediation: selection.mediation };
}

export function partnerOrderLabel(selection: OrderSelection) {
  const parts = partnerOrderParts(selection);
  return parts.subscription ? (parts.mediation ? 'Premium samt affärsförmedlingsavtal' : 'Endast Premiumabonnemang') : 'Endast affärsförmedlingsavtal, inget Premiumabonnemang';
}

export function partnerOrderEmail(selection: OrderSelection, company: string, contact: string) {
  const parts = partnerOrderParts(selection);
  const subject = `Beställning: ${partnerOrderLabel(selection)}: ${company.trim()}`;
  const body = [
    'Hej Thomas,', '',
    `Vi beställer ${partnerOrderLabel(selection)} enligt offerten och villkorsversion ${ORDER_VERSION}.`,
    `Företag: ${company.trim()}`,
    `Kontaktperson: ${contact.trim()}`,
    `Produktområden: ${selection.areas.map(area => ORDER_AREAS[area]).join(', ')}`,
    ...(parts.subscription ? [`Abonnemangspris exklusive moms: ${orderPrice(selection).toLocaleString('sv-SE')} kr/${selection.period === 'year' ? 'år' : 'månad'}`] : ['Inget Premiumabonnemang beställs. Förmedlingsavgifter enligt förmedlingsvillkoren (Grundprofil).']),
    `Önskat startdatum: ${selection.start_date}`,
    '', ...(parts.subscription ? ['Vi accepterar abonnemangsvillkoren, priset och faktureringen.'] : []),
    ...(selection.mediation ? ['Vi accepterar även förmedlingsvillkoren separat.'] : []),
    'Jag har rätt att företräda företaget och ingå avtalet.',
    '', 'Faktureringsuppgifter:', 'Organisationsnummer:', 'Fakturaadress:', 'Fakturamejl:',
    '', 'Vänliga hälsningar', contact.trim(),
  ].join('\n');
  return { subject, body, href: `${ADVISOR_EMAIL_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}