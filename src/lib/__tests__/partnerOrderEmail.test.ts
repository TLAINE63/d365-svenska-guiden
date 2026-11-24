import { describe, expect, it } from 'vitest';
import { partnerOrderEmail, partnerOrderParts } from '../partnerOrderEmail';
import type { OrderSelection } from '../partnerOrder';

const selection: OrderSelection = { level: 'premium', period: 'year', areas: ['bc'], mediation: true, start_date: '2027-01-01' };
describe('partnerbeställning via mejl', () => {
  it('adresseras till Thomas och inkluderar båda valda delarna', () => {
    const email = partnerOrderEmail(selection, 'Exempel AB', 'Anna');
    expect(email.href.startsWith('mailto:thomas.laine@dynamicfactory.se?')).toBe(true);
    expect(email.body).toContain('Premium samt affärsförmedlingsavtal');
    expect(email.body).toContain('8 000 kr/år');
    expect(email.body).toContain('2027-01-01');
  });
  it('inkluderar inte förmedling när partnern väljer bort den', () => {
    expect(partnerOrderEmail({ ...selection, mediation: false }, 'Exempel AB', 'Anna').body).not.toContain('förmedlings');
  });
  it('endast affärsförmedlingsavtal innebär inget Premiumabonnemang', () => {
    expect(partnerOrderParts({ ...selection, level: 'basic' })).toEqual({ subscription: false, mediation: true });
  });
  it('båda delarna kan beställas tillsammans', () => {
    expect(partnerOrderParts(selection)).toEqual({ subscription: true, mediation: true });
  });
  it('endast Premium innebär inget förmedlingsavtal', () => {
    expect(partnerOrderParts({ ...selection, mediation: false })).toEqual({ subscription: true, mediation: false });
  });
});