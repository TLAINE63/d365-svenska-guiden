import { describe, it, expect } from 'vitest';
import { isvOrderPrice, isvOrderRegularPrice, isvOrderValidation, ISV_ORDER_FEES } from './isvOrder';
import { ISV_FEES } from './budget2027';
const today = new Date().toISOString().slice(0,10);
describe('ISV-beställning', () => {
  it('första året 2 990 kr inkl. en app', () => expect(isvOrderPrice({kind:'isv',extra_apps:0,mediation:false,start_date:today})).toBe(2990));
  it('ordinarie 5 990 kr/år från år två', () => expect(isvOrderRegularPrice({kind:'isv',extra_apps:0,mediation:false,start_date:today})).toBe(5990));
  it('995 kr/år per extra app', () => expect(isvOrderRegularPrice({kind:'isv',extra_apps:2,mediation:false,start_date:today})).toBe(7980));
  it('förmedling 5 % licens och 2,5 % konsult', () => { expect(ISV_ORDER_FEES.licenseRate).toBe(0.05); expect(ISV_ORDER_FEES.consultRate).toBe(0.025); });
  it('samma priser som budgeten', () => expect(ISV_FEES.base).toBe(5990));
  it('Finder’s fee kräver separat accept', () => expect(isvOrderValidation({kind:'isv',extra_apps:0,mediation:true,start_date:today},true,true,false)).not.toBeNull());
});
