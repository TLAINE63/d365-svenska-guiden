import { describe, it, expect } from 'vitest';
import { orderPrice, orderValidation, orderSnapshot, ORDER_AREAS, ADDON_PRODUCTS, ADDON_PRODUCT_NOTE, SUBSCRIPTION_TERMS, type OrderSelection } from '../partnerOrder';
import { MONTH_PRICE, YEAR_PRICE } from '../budget2027';
const base: OrderSelection = { level: 'premium', period: 'month', areas: ['bc'], mediation: false, start_date: '2099-01-01' };
describe('partnerbeställning', () => {
  it('Premium har samma månad/årspriser som prislistan', () => {
    for (const areas of [['bc'], ['bc','crm'], ['bc','crm','fscm']] as OrderSelection['areas'][]) {
      expect(orderPrice({...base,areas})).toBe(MONTH_PRICE[areas.length]);
      expect(orderPrice({...base,areas,period:'year'})).toBe(YEAR_PRICE[areas.length]);
    }
    expect(orderPrice(base)).toBe(995);
    expect(orderPrice({...base,period:'year'})).toBe(7990);
  });
  it('Grundprofil är kostnadsfri', () => { expect(orderPrice({...base,level:'basic'})).toBe(0); });
  it('abonnemangsaccept krävs', () => { expect(orderValidation(base,false,true,false)).not.toBeNull(); });
  it('företrädarbehörighet krävs', () => { expect(orderValidation(base,true,false,false)).not.toBeNull(); });
  it('förmedling kräver separat accept', () => {
    expect(orderValidation({...base,mediation:true},true,true,false)).not.toBeNull();
    expect(orderValidation({...base,mediation:true},true,true,true)).toBeNull();
  });
  it('högst tre unika produktområden', () => {
    expect(orderValidation({...base,areas:['bc','crm','fscm','commerce'] as OrderSelection['areas']},true,true,false)).not.toBeNull();
    expect(orderValidation({...base,areas:['bc','bc']},true,true,false)).not.toBeNull();
  });
  it('tillvalsprodukterna är inte beställbara produktområden', () => {
    expect(Object.keys(ORDER_AREAS)).toEqual(['bc','fscm','crm']);
    for (const addon of ADDON_PRODUCTS) {
      expect(Object.values(ORDER_AREAS).join(' ')).not.toContain(addon);
    }
    expect(ADDON_PRODUCT_NOTE).toContain('kostnadsfritt');
    expect(SUBSCRIPTION_TERMS).toContain('Commerce, Human Resources och Project Operations');
  });
  it('serverunderlaget använder eget pris och inkluderar bara vald förmedling', () => {
    const snapshot=orderSnapshot({...base,...{price_ex_vat:1}});
    expect(snapshot.price_ex_vat).toBe(995);
    expect(snapshot.mediation).toBeNull();
    expect(orderSnapshot({...base,mediation:true}).mediation).toBeTruthy();
  });
});
