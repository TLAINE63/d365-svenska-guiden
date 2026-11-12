import { describe, it, expect } from 'vitest';
import { isvOrderPrice, isvOrderValidation } from './isvOrder';
import { ISV_FEES } from './budget2027';
const today = new Date().toISOString().slice(0,10);
describe('ISV-beställning', () => {
  it('5 990 kr/år inkl. en app', () => expect(isvOrderPrice({kind:'isv',extra_apps:0,mediation:false,start_date:today})).toBe(5990));
  it('995 kr/år per extra app', () => expect(isvOrderPrice({kind:'isv',extra_apps:2,mediation:false,start_date:today})).toBe(7980));
  it('samma priser som budgeten', () => expect(ISV_FEES.base).toBe(5990));
  it('Finder’s fee kräver separat accept', () => expect(isvOrderValidation({kind:'isv',extra_apps:0,mediation:true,start_date:today},true,true,false)).not.toBeNull());
});
