import { describe, it, expect } from 'vitest';
import { COMMERCIAL_PRINCIPLES, SUBSCRIPTION_TERMS, MEDIATION_TERMS } from '../partnerOrder';
import { ISV_SUBSCRIPTION_TERMS } from '../isvOrder';

describe('generella kommersiella principer', () => {
  it('innehåller de fem principerna', () => {
    expect(COMMERCIAL_PRINCIPLES).toEqual([
      'Samtliga priser exklusive moms.',
      'Ordinarie priser kan indexregleras årligen.',
      'Betalning påverkar aldrig relevansordning, rekommendationer eller verifieringsbeslut.',
      'Ingen garanterad volym av kundmöten.',
      'INSIDE-produktion prissätts separat.',
    ]);
  });
  it('ingår i partner-, förmedlings- och ISV-villkoren', () => {
    for (const t of [SUBSCRIPTION_TERMS, MEDIATION_TERMS, ISV_SUBSCRIPTION_TERMS]) expect(t).toContain('Ingen garanterad volym av kundmöten.');
  });
});
