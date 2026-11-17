import { describe, expect, it } from 'vitest';
import { partnerOrderEmail } from '../partnerOrderEmail';
import type { OrderSelection } from '../partnerOrder';

const selection: OrderSelection = { level: 'premium', period: 'year', areas: ['bc'], mediation: true, start_date: '2027-01-01' };
describe('partnerbeställning via mejl', () => {
  it('adresseras till Thomas och inkluderar båda valda delarna', () => {
    const email = partnerOrderEmail(selection, 'Exempel AB', 'Anna');
    expect(email.href.startsWith('mailto:thomas.laine@dynamicfactory.se?')).toBe(true);
    expect(email.body).toContain('Premium samt förmedlingsavtal');
    expect(email.body).toContain('7 990 kr/år');
    expect(email.body).toContain('2027-01-01');
  });
  it('inkluderar inte förmedling när partnern väljer bort den', () => {
    expect(partnerOrderEmail({ ...selection, mediation: false }, 'Exempel AB', 'Anna').body).not.toContain('förmedlings');
  });
});