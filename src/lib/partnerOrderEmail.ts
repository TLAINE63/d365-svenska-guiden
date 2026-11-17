import { ADVISOR_EMAIL_HREF } from '@/data/organization';
import { ORDER_AREAS, ORDER_VERSION, orderPrice, type OrderSelection } from './partnerOrder';

export function partnerOrderEmail(selection: OrderSelection, company: string, contact: string) {
  const subject = `Beställning partnerprogram: ${company.trim()}`;
  const body = [
    'Hej Thomas,', '',
    `Vi beställer ${selection.level === 'premium' ? 'Premium' : 'Grundprofil'}${selection.mediation ? ' samt förmedlingsavtal (Finder’s fee)' : ''} enligt offerten och villkorsversion ${ORDER_VERSION}.`,
    `Företag: ${company.trim()}`,
    `Kontaktperson: ${contact.trim()}`,
    `Produktområden: ${selection.areas.map(area => ORDER_AREAS[area]).join(', ')}`,
    `Abonnemangspris exklusive moms: ${orderPrice(selection).toLocaleString('sv-SE')} kr/${selection.period === 'year' ? 'år' : 'månad'}`,
    `Önskat startdatum: ${selection.start_date}`,
    '', 'Vi accepterar abonnemangsvillkoren, priset och faktureringen.',
    ...(selection.mediation ? ['Vi accepterar även förmedlingsvillkoren separat.'] : []),
    'Jag har rätt att företräda företaget och ingå avtalet.',
    '', 'Faktureringsuppgifter:', 'Organisationsnummer:', 'Fakturaadress:', 'Fakturamejl:',
    '', 'Vänliga hälsningar', contact.trim(),
  ].join('\n');
  return { subject, body, href: `${ADVISOR_EMAIL_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}