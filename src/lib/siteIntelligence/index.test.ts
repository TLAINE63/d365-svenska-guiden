import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

async function setup(consent = false) {
  localStorage.clear();
  localStorage.setItem('cookie-consent-v2', JSON.stringify({ statistics: consent }));
  Object.defineProperty(navigator, 'doNotTrack', { value: '0', configurable: true });
  window.history.replaceState({}, '', '/');
  document.title = 'D365.SE';
  return import('./index');
}
describe('Site Intelligence v2 privacy contract', () => {
  beforeEach(() => { vi.resetModules(); vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true })); });
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
  it('creates no tracking identity and sends nothing without statistics consent', async () => {
    const m = await setup(); m.trackPage(); m.sendEvent('tool_use');
    expect(fetch).not.toHaveBeenCalled();
    expect(localStorage.getItem('portfolio_tracking_d365_se')).toBeNull();
  });
  it('always sends production environment and exact site key after consent', async () => {
    const m = await setup(true); m.trackPage();
    const event = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string).events[0];
    expect(event.environment).toBe('production'); expect(event.site_id).toBe('d365_se');
    expect(event.page_type).toBe('home'); expect(event.consent).toBe('granted');
  });
  it('respects Do Not Track even when consent is granted', async () => {
    const m = await setup(true); Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true });
    m.trackPage(); expect(fetch).not.toHaveBeenCalled();
    expect(localStorage.getItem('portfolio_tracking_d365_se')).toBeNull();
  });
  it('records BC journey actions in production without carrying query or fragment data', async () => {
    const m = await setup(true);
    window.history.replaceState({}, '', '/businesscentral/?company=private#pricing');
    m.sendEvent('cta_click', { cta_type: 'bc_cost', page_type: 'product' });
    const event = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string).events[0];
    expect(event.event_name).toBe('cta_click');
    expect(event.cta_type).toBe('bc_cost');
    expect(event.environment).toBe('production');
    expect(event.page_path).toBe('/businesscentral/');
    expect(event.page_url).not.toContain('private');
    expect(event.page_url).not.toContain('#');
  });
  it('stops immediately when consent is withdrawn', async () => {
    const m = await setup(true); const cleanup = m.installTracking();
    localStorage.setItem('cookie-consent-v2', JSON.stringify({ statistics: false }));
    window.dispatchEvent(new Event('cookie-consent-changed')); vi.mocked(fetch).mockClear();
    m.sendEvent('download'); m.trackPage(); expect(fetch).not.toHaveBeenCalled(); cleanup();
  });
  it('does not transmit URL queries, fragments or arbitrary form metadata', async () => {
    const m = await setup(true); window.history.replaceState({}, '', '/partner/navcite/?email=private@example.test#private');
    m.trackConfirmedForm('partner_inquiry');
    const e = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string).events[0];
    expect(e.page_path).toBe('/partner/navcite/'); expect(e.page_url).not.toContain('?'); expect(e.page_url).not.toContain('#');
    expect(e.submission_status).toBe('confirmed'); expect(e.metadata).toBeUndefined();
  });
  it('silently survives unavailable receiver', async () => {
    const m = await setup(true); vi.mocked(fetch).mockRejectedValue(new Error('offline'));
    expect(() => m.sendEvent('download')).not.toThrow(); await Promise.resolve();
  });
  it('blocks personal information in page paths before tracking identity creation', async () => {
    const m = await setup(true); window.history.replaceState({}, '', '/contact/private%40example.test/');
    m.sendEvent('download'); expect(fetch).not.toHaveBeenCalled();
    expect(localStorage.getItem('portfolio_tracking_d365_se')).toBeNull();
  });
  it('records a form start on input, not opening, and never records account forms', async () => {
    const m = await setup(true); const cleanup = m.installTracking(); vi.mocked(fetch).mockClear();
    document.body.innerHTML = '<form><input type="email" /></form><form><input type="email" /><input type="password" /></form>';
    expect(fetch).not.toHaveBeenCalled();
    const inputs = document.querySelectorAll('input[type="email"]');
    inputs[1].dispatchEvent(new Event('input', { bubbles: true })); expect(fetch).not.toHaveBeenCalled();
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    const events = vi.mocked(fetch).mock.calls.map(c => JSON.parse(c[1]?.body as string).events[0]);
    expect(events.filter(e => e.event_name === 'lead_start')).toHaveLength(1);
    expect(events.filter(e => e.event_name === 'lead_submit')).toHaveLength(0); cleanup();
  });
  it('tracks engagement at the supplied 30 visible seconds threshold', async () => {
    const m = await setup(true); vi.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    const cleanup = m.installTracking(); await vi.advanceTimersByTimeAsync(29000);
    let events = vi.mocked(fetch).mock.calls.map(c => JSON.parse(c[1]?.body as string).events[0]);
    expect(events.filter(e => e.event_name === 'engaged_session')).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1000);
    events = vi.mocked(fetch).mock.calls.map(c => JSON.parse(c[1]?.body as string).events[0]);
    expect(events.filter(e => e.event_name === 'engaged_session')).toHaveLength(1);
    expect(events.find(e => e.event_name === 'engaged_session').engaged_time_seconds).toBe(30); cleanup();
  });
});