export function presentationFields(body: Record<string, unknown>, editorial: boolean) {
  const text = (v: unknown, max = 2000) => typeof v === 'string' ? v.trim().slice(0, max) : '';
  const url = (v: unknown) => {
    try { const u = new URL(text(v, 1000)); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
  };
  const result: Record<string, unknown> = {};
  const rows = (key: string, max: number, fn: (r: Record<string, unknown>) => Record<string, unknown>, valid: (r: Record<string, unknown>) => boolean) => {
    if (!(key in body)) return;
    if (!Array.isArray(body[key])) throw new Error('Ogiltigt produktinnehåll');
    result[key] = (body[key] as unknown[]).slice(0, max).map(r => fn(r && typeof r === 'object' ? r as Record<string, unknown> : {})).filter(valid);
  };
  rows('product_gallery', 12, r => ({ url: url(r.url), caption: text(r.caption, 300) }), r => !!r.url);
  rows('product_features', 20, r => ({ title: text(r.title, 150), text: text(r.text) }), r => !!r.title);
  rows('integration_evidence', 20, r => ({ application: text(r.application, 150), statement: text(r.statement), sourceUrl: url(r.sourceUrl), reviewed: editorial && r.reviewed === true }), r => !!r.application && !!r.statement && !!r.sourceUrl);
  rows('partner_evidence', 20, r => ({ partnerSlug: text(r.partnerSlug, 150), statement: text(r.statement), sourceUrl: url(r.sourceUrl), reviewed: editorial && r.reviewed === true }), r => !!r.partnerSlug && !!r.statement && !!r.sourceUrl);
  return result;
}