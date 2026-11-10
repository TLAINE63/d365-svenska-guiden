import { toCsv } from './demandExport.ts';

export const SEGMENT_COLUMNS = ['partner_slug', 'product', 'industries', 'geography', 'employees', 'revenue', 'updated_at'];
type Filter = { industries?: unknown; geography?: unknown; companySize?: unknown; revenue?: unknown };
export interface SegmentPartner {
  slug: string;
  applications: string[] | null;
  product_filters: Record<string, Filter> | null;
  updated_at: string;
  is_featured: boolean;
}
const PRODUCTS: Record<string, [string, string]> = {
  'Business Central': ['Business Central', 'bc'],
  'F&SCM': ['Finance | Supply Chain Management', 'fsc'],
  'Finance & Supply Chain Management': ['Finance | Supply Chain Management', 'fsc'],
  'Finance': ['Finance', 'fsc'],
  'Supply Chain Management': ['Supply Chain Management', 'fsc'],
  'Project Operations': ['Project Operations', ''],
  'Commerce': ['Commerce', ''],
  'Human Resources': ['Human Resources', ''],
  'Sales': ['Sales', 'sales'],
  'Customer Service': ['Customer Service', 'service'],
  'Field Service': ['Field Service', 'service'],
  'Contact Center': ['Contact Center', 'service'],
  'Customer Insights': ['Customer Insights', 'sales'],
  'Customer Insights (Marketing)': ['Customer Insights', 'sales'],
  'Power Platform': ['Power Platform', ''],
  'Copilot': ['Copilot och agenter', ''],
  'Copilot Studio': ['Copilot och agenter', ''],
  'Copilot Studio och AI-agenter': ['Copilot och agenter', ''],
  'Copilot och agenter': ['Copilot och agenter', ''],
  'AI-agenter': ['Copilot och agenter', ''],
};
const EMPLOYEES = ['1-49', '50-99', '100-249', '250-999', '1000-4999', '>5000'];
const REVENUE = ['1-24 MSEK', '25-99 MSEK', '100-499 MSEK', '500-999 MSEK', '1000-4999 MSEK', '>5000 MSEK'];
const GEOGRAPHY = ['Sverige', 'Norden', 'Europa', 'Globalt'];
function values(value: unknown): string[] {
  return [...new Set((Array.isArray(value) ? value : typeof value === 'string' ? [value] : [])
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0))];
}
function normalized(value: unknown, allowed: string[]): string {
  const selected = values(value).map(v => v.replace(/\./g, '').replace(/[–−]/g, '-'));
  return allowed.filter(v => selected.includes(v)).slice(0, 3).join(' | ');
}
export function segmentRows(partners: SegmentPartner[], includeUnpublished = false): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  for (const p of partners) {
    if (!includeUnpublished && !p.is_featured) continue;
    const mapped = new Map<string, string>();
    for (const app of p.applications || []) {
      const mapping = PRODUCTS[app];
      if (mapping) mapped.set(mapping[0], mapping[1]);
    }
    // The editor stores one shared segment for each group, never one per member.
    for (const [product, key] of mapped) {
      const filter = p.product_filters?.[key];
      const at = new Date(p.updated_at);
      rows.push({
        partner_slug: p.slug,
        product,
        industries: values(filter?.industries).slice(0, 3).join(' | '),
        geography: GEOGRAPHY.filter(v => values(filter?.geography).includes(v)).join(' | '),
        employees: normalized(filter?.companySize, EMPLOYEES),
        revenue: normalized(filter?.revenue, REVENUE),
        updated_at: Number.isNaN(at.getTime()) ? '' : at.toISOString(),
      });
    }
  }
  return rows.sort((a, b) => a.partner_slug.localeCompare(b.partner_slug) || a.product.localeCompare(b.product));
}
export function segmentCsv(rows: Record<string, string>[]): string {
  return toCsv(SEGMENT_COLUMNS, rows);
}
export function segmentOptions(url: URL): { format: 'csv' | 'json'; includeUnpublished: boolean } | null {
  const format = url.searchParams.get('format') ?? 'csv';
  const unpublished = url.searchParams.get('include_unpublished');
  if (!['csv', 'json'].includes(format) || (unpublished !== null && unpublished !== '1')) return null;
  return { format: format as 'csv' | 'json', includeUnpublished: unpublished === '1' };
}
export function segmentKeyOk(actual: string | null, expected: string | undefined): boolean {
  if (!expected || !actual || actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}