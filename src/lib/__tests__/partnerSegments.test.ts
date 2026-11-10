import { describe, it, expect } from 'vitest';
import { segmentRows, segmentCsv, segmentOptions, segmentKeyOk, type SegmentPartner } from '../../../supabase/functions/_shared/partnerSegments';

const partner: SegmentPartner = { slug: 'fellowmind', applications: ['Business Central', 'Sales', 'Customer Insights (Marketing)', 'F&SCM', 'Commerce'], is_featured: true, updated_at: '2026-11-06T10:38:24.408Z', product_filters: {
  bc: { industries: ['Grossist & Distribution', 'Konsulttjänster', 'Retail & E-handel'], geography: ['Sverige', 'Norden', 'Europa', 'Globalt'], companySize: ['50-99', '100-249', '250-999'], revenue: ['25-99 MSEK', '100-499 MSEK', '500-999 MSEK'] },
  sales: { companySize: ['1.000-4.999', '>5.000'], revenue: ['1.000-4.999 MSEK', '>5.000 MSEK'], geography: 'Sverige' },
} };
describe('partner segment export', () => {
  it('exports the exact seven columns in order', () => {
    expect(segmentCsv([]).trim()).toBe('partner_slug,product,industries,geography,employees,revenue,updated_at');
  });
  it('preserves Fellowmind BC selections including saved industry order', () => {
    expect(segmentRows([partner]).find(r => r.product === 'Business Central')).toEqual({ partner_slug: 'fellowmind', product: 'Business Central', industries: 'Grossist & Distribution | Konsulttjänster | Retail & E-handel', geography: 'Sverige | Norden | Europa | Globalt', employees: '50-99 | 100-249 | 250-999', revenue: '25-99 MSEK | 100-499 MSEK | 500-999 MSEK', updated_at: '2026-11-06T10:38:24.408Z' });
  });
  it('normalizes largest size ranges in export only', () => {
    const row = segmentRows([partner]).find(r => r.product === 'Sales');
    expect(row?.employees).toBe('1000-4999 | >5000');
    expect(row?.revenue).toBe('1000-4999 MSEK | >5000 MSEK');
    expect(partner.product_filters?.sales.companySize).toEqual(['1.000-4.999', '>5.000']);
  });
  it('shares grouped targets across individual CRM products and keeps F&SCM grouped', () => {
    const rows = segmentRows([partner]);
    expect(rows.find(r => r.product === 'Customer Insights')?.employees).toBe('1000-4999 | >5000');
    expect(rows.filter(r => r.product === 'Finance | Supply Chain Management')).toHaveLength(1);
  });
  it('exports missing targets as empty strings, never null', () => {
    const row = segmentRows([partner]).find(r => r.product === 'Commerce');
    expect([row?.industries, row?.geography, row?.employees, row?.revenue]).toEqual(['', '', '', '']);
    expect(segmentCsv(segmentRows([partner]))).not.toMatch(/null|undefined/);
  });
  it('excludes unpublished by default and includes only on request', () => {
    const hidden = { ...partner, is_featured: false };
    expect(segmentRows([hidden])).toEqual([]);
    expect(segmentRows([hidden], true)).toHaveLength(5);
  });
  it('limits industries and both size dimensions to three values', () => {
    const broad = { ...partner, applications: ['Business Central'], product_filters: { bc: { industries: ['a','b','c','d'], companySize: ['1-49','50-99','100-249','250-999'], revenue: ['1-24 MSEK','25-99 MSEK','100-499 MSEK','500-999 MSEK'] } } };
    expect(segmentRows([broad])[0]).toMatchObject({ industries: 'a | b | c', employees: '1-49 | 50-99 | 100-249', revenue: '1-24 MSEK | 25-99 MSEK | 100-499 MSEK' });
  });
  it('accepts legacy geography strings', () => {
    expect(segmentRows([partner]).find(r => r.product === 'Sales')?.geography).toBe('Sverige');
  });
  it('sorts by slug then product', () => {
    const rows = segmentRows([partner, { ...partner, slug: 'aaa' }]);
    expect(rows[0].partner_slug).toBe('aaa');
    expect(rows.slice(0,5).map(r => r.product)).toEqual(['Business Central','Commerce','Customer Insights','Finance | Supply Chain Management','Sales']);
  });
  it('validates GET options', () => {
    expect(segmentOptions(new URL('https://example.test'))).toEqual({ format: 'csv', includeUnpublished: false });
    expect(segmentOptions(new URL('https://example.test?format=json&include_unpublished=1'))).toEqual({ format: 'json', includeUnpublished: true });
    expect(segmentOptions(new URL('https://example.test?format=html'))).toBeNull();
    expect(segmentOptions(new URL('https://example.test?include_unpublished=true'))).toBeNull();
  });
  it('rejects missing or incorrect keys and accepts exact configured keys', () => {
    expect(segmentKeyOk(null, undefined)).toBe(false);
    expect(segmentKeyOk(null, 'test-only-key')).toBe(false);
    expect(segmentKeyOk('wrong', 'test-only-key')).toBe(false);
    expect(segmentKeyOk('test-only-key', 'test-only-key')).toBe(true);
  });
  it('quotes CSV commas and embedded quotes', () => {
    const row = { partner_slug: 'slug', product: 'Sales', industries: 'A, "B"', geography: '', employees: '', revenue: '', updated_at: '' };
    expect(segmentCsv([row])).toContain('slug,Sales,"A, ""B""",,,,');
  });
});