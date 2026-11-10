import { describe, expect, it } from 'vitest';
import { BC_ISV_SOLUTIONS } from '@/data/bcIsvSolutions';
import { presentationFor, productPartnerPath } from '../isvPresentation';
import { isvPresenceYearlyPrice } from '../isvVisibility';
const base = { ...BC_ISV_SOLUTIONS[0], productGallery: [{ url: 'https://example.org/product.jpg', caption: 'Product' }], demoVideoUrl: 'https://example.org/demo', productFeatures: [{ title: 'Feature', text: 'Details' }], customerCases: [1, 2, 3, 4].map(n => ({ title: `Case ${n}` })) };
describe('ISV presentations', () => {
  it('product-area partner search carries known apps without implying ISV experience', () => {
    expect(productPartnerPath(['Customer Service', 'Field Service'])).toBe('/valjdynamics365partner/?apps=Customer%20Service%2CField%20Service');
    expect(productPartnerPath([])).toBe('/valjdynamics365partner/');
  });
  it('Standard keeps rich presentation disabled', () => {
    const p = presentationFor({ ...base, hasPresence: false, informationStatus: 'verified' });
    expect([p.gallery.length, p.features.length, p.cases.length]).toEqual([0, 0, 0]);
    expect(p.video).toBeUndefined();
  });
  it('logo, link and contact require verification AND Presence', () => {
    for (const [status, presence] of [['compiled', true], ['verified', false]] as const) {
      const p = presentationFor({ ...base, informationStatus: status, hasPresence: presence });
      expect([p.showLogo, p.showWebsite, p.showContact]).toEqual([false, false, false]);
    }
    const p = presentationFor({ ...base, informationStatus: 'verified', hasPresence: true });
    expect([p.showLogo, p.showWebsite, p.showContact]).toEqual([true, true, true]);
  });
  it('Presence has independently enabled content and max three cases', () => {
    const p = presentationFor({ ...base, hasPresence: true, informationStatus: 'compiled' });
    expect(p.gallery).toHaveLength(1);
    expect(p.cases).toHaveLength(3);
    expect(p.video).toBe('https://example.org/demo');
  });
  it('a general verification never proves integration', () => {
    const p = presentationFor({ ...base, informationStatus: 'verified', integrationEvidence: [
      { application: 'Field Service', statement: 'Integration', sourceUrl: 'https://example.org/source', reviewed: false },
      { application: 'Sales', statement: 'Integration', sourceUrl: '', reviewed: true },
      { application: 'Customer Service', statement: 'Integration', sourceUrl: 'https://example.org/source', reviewed: true },
    ] });
    expect(p.integrations.map(e => e.application)).toEqual(['Customer Service']);
  });
  it('legacy slugs do not become documented partner experience', () => {
    const p = presentationFor({ ...base, partnerSlugs: ['bisqo'], partnerEvidence: [{ partnerSlug: 'bisqo', statement: 'Experience', sourceUrl: 'https://example.org/source', reviewed: false }] });
    expect(p.partners).toEqual([]);
  });
  it('empty media do not create presentation sections', () => {
    const p = presentationFor({ ...base, hasPresence: true, productGallery: [], productFeatures: [], demoVideoUrl: undefined, customerCases: [] });
    expect([p.gallery.length, p.features.length, p.cases.length]).toEqual([0, 0, 0]);
    expect(p.video).toBeUndefined();
  });
  it('Presence price is 5990 including one product plus 995 per extra', () => {
    expect(isvPresenceYearlyPrice(1)).toBe(5990);
    expect(isvPresenceYearlyPrice(2)).toBe(6985);
  });
});