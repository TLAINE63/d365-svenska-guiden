import connection from './package.json';
import routes from './providerRoutes.json';
import { createTrackingService } from './sdk/tracking-service';
import { containsPersonalData, type CommonEvent } from './sdk/tracking-contract';
const providers: Record<string, { provider_id: string; provider_type: 'dynamics_partner' }> = routes as Record<string, { provider_id: string; provider_type: 'dynamics_partner' }>;
export function analyticsConsentGranted(): boolean {
  try { return typeof window !== 'undefined' && navigator.doNotTrack !== '1' && JSON.parse(localStorage.getItem('cookie-consent-v2') || 'null')?.statistics === true; } catch { return false; }
}
let service: ReturnType<typeof createTrackingService> | undefined;
function tracker() {
  service ??= createTrackingService({ endpoint: connection.endpoint, siteId: connection.site.site_key, registry: connection.registry, environment: 'production', config: connection.engagement, consent: analyticsConsentGranted });
  return service;
}
export function providerForSlug(slug: string) { return providers[slug]; }
export function providerForName(name: string) {
  const match = connection.providers.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase());
  return match ? { provider_id: match.provider_key, provider_type: 'dynamics_partner' as const } : undefined;
}
export function pageType(path: string): CommonEvent['page_type'] {
  if (path === '/') return 'home';
  if (/^\/(partner|basic)\//.test(path)) return 'partner_profile';
  if (/^\/isv\//.test(path)) return 'isv_profile';
  if (/tillagg|isv-katalog/.test(path)) return 'isv_directory';
  if (/jamfor|compare|\/vs-/.test(path)) return 'comparison';
  if (/kostnad/.test(path)) return 'cost_guide';
  if (/licens/.test(path)) return 'licensing';
  if (/pris/.test(path)) return 'pricing';
  if (/partners|valjdynamics365partner/.test(path)) return 'partner_directory';
  if (/^\/(businesscentral|finance-supply-chain|crm|d365sales|d365marketing|d365customerservice|d365fieldservice|d365contactcenter|d365projectoperations|d365humanresources|d365commerce)\/?$/.test(path)) return 'product';
  if (/kunskapscenter|nyheter|partnernytt|artikel|ai\/exempel/.test(path)) return 'article';
  if (/kom-igang|test/.test(path)) return 'wizard';
  if (/guide|underlag/.test(path)) return 'guide';
  if (/fraga|sok/.test(path)) return 'search_results';
  return 'other';
}
export function sendEvent(name: string, parameters: Partial<CommonEvent> = {}): void {
  try {
    if (!analyticsConsentGranted() || /^\/(admin|redaktion)(\/|$)/.test(window.location.pathname)) return;
    if (containsPersonalData(decodeURIComponent(window.location.pathname))) return;
    void tracker().trackEvent(name, { page_type: pageType(window.location.pathname), ...parameters }).catch(() => {});
    if (connection.engagement.interaction_events.includes(name)) void tracker().observeEngagement({ page_type: pageType(window.location.pathname), interaction_event: name }).catch(() => {});
  } catch { /* silent */ }
}
let lastPage: string | null = null;
export function trackPage(): void {
  try {
    if (!analyticsConsentGranted() || lastPage === window.location.pathname) return;
    lastPage = window.location.pathname;
    sendEvent('page_view');
    const match = lastPage.match(/^\/(?:partner|basic)\/([^/]+)/);
    const provider = match ? providerForSlug(match[1]) : undefined;
    if (provider) sendEvent('provider_profile_view', provider);
  } catch { /* silent */ }
}
export function trackConfirmedForm(formId: string): void {
  const leadType = formId === 'general_contact' ? 'general_contact' : formId === 'underlag_sent' ? 'guide_request' : 'provider_contact';
  if (/^[a-zA-Z0-9_-]{1,128}$/.test(formId)) sendEvent('lead_submit', { form_id: formId, lead_type: leadType, submission_status: 'confirmed' });
}
export function installTracking(): () => void {
  if (typeof window === 'undefined') return () => {};
  let forms = new WeakSet<HTMLFormElement>();
  const onInput = (event: Event) => {
    try {
      if (!analyticsConsentGranted()) return;
      const target = event.target;
      const form = target instanceof HTMLElement ? target.closest('form') : null;
      if (!form || forms.has(form) || form.querySelector('input[type="password"]') || !form.querySelector('input[type="email"]') || /^\/konto/.test(window.location.pathname)) return;
      forms.add(form); sendEvent('lead_start');
    } catch { /* silent */ }
  };
  const onConsent = () => {
    try {
      if (!analyticsConsentGranted()) { service = undefined; lastPage = null; forms = new WeakSet(); }
      else trackPage();
    } catch { /* silent */ }
  };
  const interval = window.setInterval(() => {
    try {
      if (!analyticsConsentGranted() || document.visibilityState !== 'visible' || containsPersonalData(decodeURIComponent(window.location.pathname)) || /^\/(admin|redaktion)(\/|$)/.test(window.location.pathname)) return;
      void tracker().observeEngagement({ page_type: pageType(window.location.pathname), active_seconds: 1 }).catch(() => {});
    } catch { /* silent */ }
  }, 1000);
  window.addEventListener('cookie-consent-changed', onConsent);
  window.addEventListener('storage', onConsent);
  document.addEventListener('input', onInput, true);
  trackPage();
  return () => { window.clearInterval(interval); window.removeEventListener('cookie-consent-changed', onConsent); window.removeEventListener('storage', onConsent); document.removeEventListener('input', onInput, true); };
}
