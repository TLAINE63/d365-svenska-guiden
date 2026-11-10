import { expect, it } from 'vitest';
import { presentationFields } from '../../../supabase/functions/_shared/isvPresentation';
it('supplier submissions cannot mark integration or partner evidence reviewed', () => {
  const result = presentationFields({ integration_evidence: [{ application: 'Field Service', statement: 'Connection', sourceUrl: 'https://example.org/source', reviewed: true }], partner_evidence: [{ partnerSlug: 'bisqo', statement: 'Experience', sourceUrl: 'https://example.org/source', reviewed: true }] }, false);
  expect(result.integration_evidence).toEqual([{ application: 'Field Service', statement: 'Connection', sourceUrl: 'https://example.org/source', reviewed: false }]);
  expect((result.partner_evidence as { reviewed: boolean }[])[0].reviewed).toBe(false);
});
it('editorial review requires actual HTTPS documentation', () => {
  const result = presentationFields({ integration_evidence: [{ application: 'Sales', statement: 'Claim', sourceUrl: '', reviewed: true }, { application: 'Service', statement: 'Claim', sourceUrl: 'javascript:alert(1)', reviewed: true }], product_gallery: [{ url: 'javascript:alert(1)' }] }, true);
  expect(result.integration_evidence).toEqual([]);
  expect(result.product_gallery).toEqual([]);
});