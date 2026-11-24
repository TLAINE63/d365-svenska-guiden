import { describe, it, expect } from 'vitest';
import { isvOrderPrice, isvOrderRegularPrice, isvOrderValidation, ISV_ORDER_FEES } from './isvOrder';
import { ISV_FEES } from './budget2027';
const today = new Date().toISOString().slice(0,10);
describe('ISV-beställning', () => {
  it('introduktionspris 2027: 3 500 kr inkl. tre appar', () => expect(isvOrderPrice({kind:'isv',extra_apps:0,mediation:false,start_date:today})).toBe(3500));
  it('tre appar ingår', () => expect(ISV_ORDER_FEES.includedApps).toBe(3));
  it('ordinarie 5 000 kr/år från år två', () => expect(isvOrderRegularPrice({kind:'isv',extra_apps:0,mediation:false,start_date:today})).toBe(5000));
  it('500 kr/år per extra app', () => expect(isvOrderRegularPrice({kind:'isv',extra_apps:2,mediation:false,start_date:today})).toBe(6000));
  it('förmedling 5 % licens och 2,5 % konsult', () => { expect(ISV_ORDER_FEES.licenseRate).toBe(0.05); expect(ISV_ORDER_FEES.consultRate).toBe(0.025); });
  it('samma priser som budgeten', () => expect(ISV_FEES.base).toBe(5000));
  it('Finder’s fee är pausad men historiska valideringar fungerar', () => expect(isvOrderValidation({kind:'isv',extra_apps:0,mediation:true,start_date:today},true,true,false)).not.toBeNull());
});
