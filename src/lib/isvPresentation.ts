import type { IsvSolution } from '@/data/bcIsvSolutions';
import { productExposure } from '@/lib/isvVisibility';

export interface ProductImage { url: string; caption: string }
export interface ProductFeature { title: string; text: string }
export interface IntegrationEvidence { application: string; statement: string; sourceUrl: string; reviewed: boolean }
export interface PartnerEvidence { partnerSlug: string; statement: string; sourceUrl: string; reviewed: boolean }
export const isvProductPath = (id: string) => `/isv/produkt/${encodeURIComponent(id)}/`;
export function productPartnerPath(products: string[]) {
  return products.length ? `/valjdynamics365partner/?apps=${encodeURIComponent(products.join(','))}` : '/valjdynamics365partner/';
}
export function httpsUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : undefined; } catch { return undefined; }
}
export function presentationFor(s: IsvSolution) {
  const presence = s.hasPresence === true;
  return {
    ...productExposure(s.informationStatus, presence),
    gallery: presence ? (s.productGallery || []).filter(i => httpsUrl(i.url)) : [],
    features: presence ? (s.productFeatures || []).filter(f => f.title?.trim()) : [],
    video: presence ? httpsUrl(s.demoVideoUrl) : undefined,
    cases: presence ? (s.customerCases || []).filter(c => c.title?.trim()).slice(0, 3) : [],
    integrations: (s.integrationEvidence || []).filter(e => e.reviewed === true && e.application?.trim() && e.statement?.trim() && httpsUrl(e.sourceUrl)),
    partners: (s.partnerEvidence || []).filter(e => e.reviewed === true && e.partnerSlug?.trim() && e.statement?.trim() && httpsUrl(e.sourceUrl)),
  };
}