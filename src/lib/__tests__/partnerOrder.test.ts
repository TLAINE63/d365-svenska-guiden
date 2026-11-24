import { describe, it, expect } from 'vitest';
import { orderPrice, orderValidation, orderSnapshot, termsDisplayText, ORDER_AREAS, ADDON_PRODUCTS, ADDON_PRODUCT_NOTE, SUBSCRIPTION_TERMS, MEDIATION_TERMS, FINDERS_FEE_VARIANTS, FINDERS_FEE_RATE, FINDERS_FEE_RATE_GRUND, FINDERS_FEE_CAP, type OrderSelection } from '../partnerOrder';
import { MONTH_PRICE, YEAR_PRICE } from '../budget2027';
const base: OrderSelection = { level: 'premium', period: 'month', areas: ['bc'], mediation: false, start_date: '2099-01-01' };
describe('partnerbeställning', () => {
  it('både abonnemangs- och förmedlingsavtal gäller tills vidare', () => {
    const snapshot = orderSnapshot({ ...base, mediation: true });
    for (const terms of [snapshot.subscription, snapshot.mediation]) {
      expect(terms).toContain('Avtalen gäller tills vidare.');
    }
  });
  it('båda avtalen medger indexreglering inför varje nytt kalenderår', () => {
    const snapshot = orderSnapshot({ ...base, mediation: true });
    for (const terms of [snapshot.subscription, snapshot.mediation]) {
      expect(terms).toContain('Priserna kan komma att indexregleras inför varje nytt kalenderår.');
    }
  });
  it('Premium har samma månad/årspriser som prislistan', () => {
    for (const areas of [['bc'], ['bc','crm'], ['bc','crm','fscm']] as OrderSelection['areas'][]) {
      expect(orderPrice({...base,areas})).toBe(MONTH_PRICE[areas.length]);
      expect(orderPrice({...base,areas,period:'year'})).toBe(YEAR_PRICE[areas.length]);
    }
    expect(orderPrice(base)).toBe(1000);
    expect(orderPrice({...base,period:'year'})).toBe(8000);
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
    expect(snapshot.price_ex_vat).toBe(1000);
    expect(snapshot.mediation).toBeNull();
    expect(orderSnapshot({...base,mediation:true}).mediation).toBeTruthy();
  });
  it('meetings: Premium 0 kr, Grundprofil 3 500 kr; deal fee Premium 2,5 %, Grundprofil 5 %', () => {
    expect(FINDERS_FEE_VARIANTS[0].premium).toBe(0);
    expect(FINDERS_FEE_RATE).toBe(0.025);
    expect(FINDERS_FEE_RATE_GRUND).toBe(0.05);
    expect(FINDERS_FEE_VARIANTS[0].grund).toBe(3500);
    for (const app of ['Business\u00a0Central', 'Sales', 'Customer Service', 'Contact Center', 'Field Service', 'Customer Insights']) expect(FINDERS_FEE_VARIANTS[0].scope).toContain(app);
  });
  it('one variant covers F&SCM and all additional products', () => {
    expect(FINDERS_FEE_VARIANTS).toHaveLength(1);
    for (const app of ['F&SCM', 'Project Operations', 'Commerce', 'Human Resources', 'Power Platform', 'Copilot']) expect(FINDERS_FEE_VARIANTS[0].scope).toContain(app);
  });
  it('commission is 2.5 percent with no cap', () => {
    expect(FINDERS_FEE_RATE).toBe(0.025);
    expect(FINDERS_FEE_CAP).toBeNull();
  });
  it('termsDisplayText ger läslig villkorstext med godkännanden', () => {
    const out = termsDisplayText({ ...orderSnapshot({ ...base, mediation: true }), accept: true, authority: true, mediation_accept: false });
    expect(out.startsWith('Villkorsversion 2027-01-01')).toBe(true);
    expect(out).toContain('Grundprofil är kostnadsfri.');
    expect(out).toContain('Förmedlingsvillkor accepterade: Nej');
    expect(termsDisplayText(null)).toBe('Abonnemangsvillkor accepterade: Nej\nBehörighet att företräda företaget: Nej');
  });
});
