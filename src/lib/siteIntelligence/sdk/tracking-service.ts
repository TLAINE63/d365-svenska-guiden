import {
  commonEventSchema,
  defaultEngagement,
  normalizedSearch,
  semanticDedupKey,
  type CommonEvent,
  type EngagementConfig,
  type RegistryEntry,
} from "./tracking-contract";

type Options = {
  endpoint: string;
  siteId: string;
  registry: RegistryEntry[];
  consent: () => boolean;
  environment?: "test" | "production";
  config?: EngagementConfig;
  onValidationError?: (code: string) => void;
  destinations?: ((event: CommonEvent) => void | Promise<void>)[];
};
type Session = { session: string; visitor: string; last: number };
export function createTrackingService(options: Options) {
  const config = options.config ?? defaultEngagement;
  const sent = new Set<string>();
  let memory: Session | null = null;
  let activeSeconds = 0;
  const pages = new Set<string>();
  const interactionTypes = new Set<string>();
  let currentPath: string | null = null;
  let pageInstance = "";
  function permitted() {
    try {
      return typeof window !== "undefined" && navigator.doNotTrack !== "1" && options.consent();
    } catch {
      return false;
    }
  }
  function identity(): Session {
    const now = Date.now();
    const storageKey = `portfolio_tracking_${options.siteId}`;
    try {
      const stored = window.localStorage.getItem(storageKey);
      const parsed = stored ? (JSON.parse(stored) as Session) : memory;
      const visitor = parsed?.visitor ?? crypto.randomUUID();
      const session =
        parsed && now - parsed.last < config.session_timeout_minutes * 60000
          ? parsed.session
          : crypto.randomUUID();
      if (memory?.session !== session) {
        activeSeconds = 0;
        pages.clear();
        interactionTypes.clear();
        sent.clear();
      }
      memory = { visitor, session, last: now };
      window.localStorage.setItem(storageKey, JSON.stringify(memory));
    } catch {
      memory =
        memory && now - memory.last < config.session_timeout_minutes * 60000
          ? { ...memory, last: now }
          : { visitor: crypto.randomUUID(), session: crypto.randomUUID(), last: now };
    }
    return memory;
  }
  function fail(code: string) {
    try {
      if (options.environment === "test") options.onValidationError?.(code);
    } catch {
      /* diagnostics never blocks the site */
    }
    return false;
  }
  async function trackEvent(
    name: string,
    parameters: Record<string, unknown> = {},
  ): Promise<boolean> {
    // No identifiers or storage access before consent, even when configuration is permissive.
    if (!permitted()) return false;
    const definition = options.registry.find((r) => r.active && r.event_key === name);
    if (!definition) return fail("unknown_event");
    const ids = identity();
    if (currentPath !== window.location.pathname) {
      currentPath = window.location.pathname;
      pageInstance = crypto.randomUUID();
    }
    if (name === "page_view" && parameters["user_initiated"] === true)
      pageInstance = crypto.randomUUID();
    const parsed = commonEventSchema.safeParse({
      ...parameters,
      event_id: parameters["event_id"] ?? crypto.randomUUID(),
      event_name: name,
      site_id: options.siteId,
      event_timestamp: parameters["event_timestamp"] ?? new Date().toISOString(),
      session_id: ids.session,
      anonymous_visitor_id: ids.visitor,
      page_url: window.location.origin + window.location.pathname,
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer ? new URL(document.referrer).origin : null,
      page_instance_id: pageInstance,
      consent: "granted",
      environment: options.environment ?? "production",
    });
    if (!parsed.success) return fail("invalid_parameters");
    const event = parsed.data;
    if (event.search_term_normalized)
      event.search_term_normalized = normalizedSearch(event.search_term_normalized);
    const required = Array.isArray(definition.required_parameters)
      ? definition.required_parameters
      : [];
    if (required.some((k) => typeof k === "string" && event[k as keyof CommonEvent] == null))
      return fail("missing_required");
    const dedup = semanticDedupKey(event);
    if (dedup && sent.has(dedup)) return false;
    if (dedup) sent.add(dedup);
    try {
      const response = await fetch(options.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: [event] }),
        keepalive: true,
      });
      if (!response.ok) {
        if (dedup) sent.delete(dedup);
        return fail(`http_${response.status}`);
      }
      await Promise.all(
        (options.destinations ?? []).map(async (send) => {
          try {
            await send(event);
          } catch {
            /* optional destination cannot block public navigation */
          }
        }),
      );
      return true;
    } catch {
      if (dedup) sent.delete(dedup);
      return false;
    }
  }
  async function observeEngagement(parameters: {
    page_type: CommonEvent["page_type"];
    active_seconds?: number;
    interaction_event?: string;
  }) {
    if (!permitted() || document.visibilityState === "hidden") return false;
    identity();
    activeSeconds += parameters.active_seconds ?? 0;
    pages.add(window.location.pathname);
    if (parameters.interaction_event) interactionTypes.add(parameters.interaction_event);
    const reason =
      activeSeconds >= config.active_seconds
        ? "active_time"
        : pages.size >= config.relevant_page_views
          ? "page_views"
          : config.interaction_events.some((e) => interactionTypes.has(e))
            ? "interaction"
            : null;
    return reason
      ? trackEvent("engaged_session", {
          page_type: parameters.page_type,
          engagement_reason: reason,
          ...(parameters.interaction_event
            ? { interaction_event: parameters.interaction_event }
            : {}),
          engaged_time_seconds: activeSeconds,
          page_view_count: pages.size,
        })
      : false;
  }
  return { trackEvent, observeEngagement };
}
