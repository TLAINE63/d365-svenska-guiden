import { trackAdsContactConversion } from "@/utils/googleAdsConversion";
// Existing call sites now use the single consent-gated SDK, never a second sender.
import { sendEvent, providerForSlug, trackPage, trackConfirmedForm, pageType } from './siteIntelligence';
export type JourneyEvent = { type: string; url?: string; content_type?: string; meta?: Record<string, unknown> };
export function trackJourney(event: JourneyEvent) {
  try {
    if (event.type === 'page_view') return trackPage();
    if (event.type === 'partner_click' && typeof event.meta?.partner === 'string') {
      const provider = providerForSlug(event.meta.partner);
      if (provider) sendEvent('outbound_provider_click', { ...provider, destination_type: 'provider_website', link_placement: 'provider_profile' });
    }
    if (event.type === 'comparison_view' && Array.isArray(event.meta?.partners)) {
      const ids = event.meta.partners.filter((s): s is string => typeof s === 'string').map(s => providerForSlug(s)?.provider_id).filter((s): s is string => !!s);
      if (ids.length >= 2) sendEvent('comparison_view', { comparison_type: 'partner_vs_partner', primary_entity_id: ids[0], compared_entity_ids: ids.slice(1) });
    }
    if (event.type === 'download' || event.type === 'tool_use') sendEvent(event.type);
    if (event.type === 'form_submit' && typeof event.meta?.form === 'string') { trackConfirmedForm(event.meta.form); trackAdsContactConversion(event.meta.form); }
  } catch { /* silent */ }
}
export function contentTypeForPath(p: string): string { return pageType(p) || 'other'; }
export function forwardFunnelEvent(eventType: string, eventName: string, _meta: Record<string, unknown>) {
  const n = eventName.toLowerCase();
  if (eventType === 'pdf_download' || n.includes('download') || n.includes('exported')) return sendEvent('download');
  if (['intro_sent', 'inquiry_sent', 'underlag_sent'].includes(n)) { trackAdsContactConversion(eventName); return trackConfirmedForm(eventName); }
  if (eventType === 'analysis_start' || n === 'test_started' || n.includes('tool_start')) return sendEvent('tool_use');
}
