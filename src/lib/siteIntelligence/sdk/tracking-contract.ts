import { z } from "zod";
import { comparisonKinds, destinationKinds, sprint2Fields, sprint2Events } from "./journey-rules";

export const journeyStages = [
  "discovery",
  "research",
  "consideration",
  "selection",
  "conversion",
] as const;
export const pageTypes = [
  "home",
  "product",
  "category",
  "pricing",
  "cost_guide",
  "comparison",
  "implementation",
  "migration",
  "licensing",
  "partner_directory",
  "partner_profile",
  "isv_directory",
  "isv_profile",
  "csp_profile",
  "case_study",
  "article",
  "guide",
  "glossary",
  "wizard",
  "form",
  "search_results",
  "other",
] as const;
export const providerTypes = [
  "dynamics_partner",
  "isv",
  "csp",
  "microsoft",
  "other_provider",
] as const;
export const pricingTypes = [
  "license_price",
  "implementation_cost",
  "total_cost",
  "tco",
  "pricing_overview",
  "cost_comparison",
] as const;
export const comparisonTypes = comparisonKinds;
export const leadTypes = [
  "partner_match",
  "provider_contact",
  "consultation",
  "guide_request",
  "demo_request",
  "general_contact",
  "newsletter",
  "other",
] as const;
const key = z
  .string()
  .regex(/^[a-zA-Z0-9_-]+$/)
  .max(128);
const safeText = z
  .string()
  .trim()
  .max(160)
  .refine((v) => !containsPersonalData(v), "unsafe_text");
const number = z.number().finite().min(0);

export function containsPersonalData(value: string): boolean {
  return /@|(?:\+?\d[\s()-]*){7,}|\b(?:email|e-post|telefon|phone|password|personnummer)\b|https?:\/\//i.test(
    value,
  );
}
export function normalizedSearch(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export const commonEventSchema = z
  .object({
    event_id: z.string().uuid(),
    event_name: z
      .string()
      .regex(/^[a-z][a-z0-9_]*$/)
      .max(80),
    page_instance_id: z.string().uuid().optional(),
    event_timestamp: z.string().datetime({ offset: true }),
    site_id: key,
    session_id: z.string().uuid(),
    anonymous_visitor_id: z.string().uuid(),
    page_url: z.string().min(1).max(2000),
    page_path: z.string().startsWith("/").max(500),
    page_title: safeText,
    referrer: z.string().max(2000).nullable().optional(),
    page_type: z.enum(pageTypes).nullable().optional(),
    journey_stage: z.enum(journeyStages).optional(),
    product_id: key.nullable().optional(),
    solution_category_id: key.nullable().optional(),
    topic_id: key.nullable().optional(),
    provider_id: key.nullable().optional(),
    provider_type: z.enum(providerTypes).nullable().optional(),
    content_id: key.nullable().optional(),
    comparison_type: z.enum(comparisonTypes).optional(),
    cta_type: key.optional(),
    traffic_source: key.optional(),
    traffic_medium: key.optional(),
    traffic_campaign: key.optional(),
    device_category: z.enum(["desktop", "tablet", "mobile", "other"]).optional(),
    country_code: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional(),
    environment: z.enum(["test", "production"]).default("production"),
    consent: z.literal("granted"),
    engagement_reason: z.enum(["active_time", "page_views", "interaction"]).optional(),
    interaction_event: key.optional(),
    engaged_time_seconds: number.max(86400).optional(),
    page_view_count: number.int().optional(),
    scroll_percent: z.union([z.literal(50), z.literal(75), z.literal(90)]).optional(),
    search_term_normalized: safeText.optional(),
    result_count: number.int().optional(),
    selected_result_id: key.optional(),
    selected_result_type: key.optional(),
    link_url: z.string().max(2000).optional(),
    link_text_normalized: safeText.optional(),
    source_page_type: z.enum(pageTypes).optional(),
    destination_page_type: z.enum(pageTypes).optional(),
    source_product_id: key.optional(),
    destination_product_id: key.optional(),
    link_context: z
      .enum([
        "comparison_link",
        "related_product",
        "next_step",
        "related_article",
        "partner_discovery",
        "navigation",
        "inline_content",
      ])
      .optional(),
    max_scroll_percent: number.max(100).optional(),
    pricing_type: z.enum(pricingTypes).optional(),
    view_context: key.optional(),
    primary_entity_id: key.optional(),
    compared_entity_ids: z.array(key).min(1).max(20).optional(),
    source_content_id: key.optional(),
    destination_type: z.enum(destinationKinds).optional(),
    link_placement: z
      .enum([
        "provider_profile",
        "provider_directory",
        "product_page",
        "comparison",
        "article",
        "guide",
        "sponsored_placement",
        "other",
      ])
      .optional(),
    lead_type: z.enum(leadTypes).optional(),
    form_id: key.optional(),
    submission_status: z.literal("confirmed").optional(),
    // Strict metadata prevents accidental form values or unknown personal data ingestion.
    metadata: z.object({ step: safeText.optional(), status: key.optional() }).strict().optional(),
    ...sprint2Fields,
  })
  .strict();

export type CommonEvent = z.infer<typeof commonEventSchema>;
export type RegistryEntry = {
  event_key: string;
  active: boolean;
  required_parameters: unknown;
  journey_stage_v2: string | null;
};
export type Dimensions = {
  products: string[];
  topics: string[];
  providers: { provider_key: string; provider_type: string }[];
  content: { content_key: string; site_id: string }[];
  entities?: { entity_key: string; entity_type: string }[];
};
export type EngagementConfig = {
  active_seconds: number;
  relevant_page_views: number;
  interaction_events: string[];
  content_active_seconds: number;
  content_scroll_percent: number;
  session_timeout_minutes: number;
  requires_consent: boolean;
};
export const defaultEngagement: EngagementConfig = {
  active_seconds: 30,
  relevant_page_views: 2,
  interaction_events: ["comparison_view", "outbound_provider_click", "lead_submit"],
  content_active_seconds: 30,
  content_scroll_percent: 50,
  session_timeout_minutes: 30,
  requires_consent: true,
};

export function validateCommonEvent(
  input: unknown,
  registry: RegistryEntry[],
  dimensions: Dimensions,
) {
  const parsed = commonEventSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, code: "invalid_parameters" };
  const event = parsed.data;
  const entry = registry.find((r) => r.active && r.event_key === event.event_name);
  if (!entry) return { ok: false as const, code: "unknown_event" };
  const required = [
    ...(Array.isArray(entry.required_parameters) ? entry.required_parameters : []),
    ...(sprint2Events[event.event_name] ?? []),
  ];
  if (
    required.some(
      (field) =>
        typeof field === "string" &&
        (event[field as keyof CommonEvent] == null || event[field as keyof CommonEvent] === ""),
    )
  )
    return { ok: false as const, code: "missing_required" };
  if (event.product_id && !dimensions.products.includes(event.product_id))
    return { ok: false as const, code: "invalid_product" };
  if (
    [event.source_product_id, event.destination_product_id].some(
      (id) => id && !dimensions.products.includes(id),
    )
  )
    return { ok: false as const, code: "invalid_product" };
  if (event.topic_id && !dimensions.topics.includes(event.topic_id))
    return { ok: false as const, code: "invalid_topic" };
  if (
    event.provider_id &&
    !dimensions.providers.some(
      (p) => p.provider_key === event.provider_id && p.provider_type === event.provider_type,
    )
  )
    return { ok: false as const, code: "invalid_provider" };
  if (event.content_id && !dimensions.content.some((c) => c.content_key === event.content_id))
    return { ok: false as const, code: "invalid_content" };
  if (
    event.source_content_id &&
    !dimensions.content.some((c) => c.content_key === event.source_content_id)
  )
    return { ok: false as const, code: "invalid_content" };
  if (Boolean(event.selected_result_id) !== Boolean(event.selected_result_type))
    return { ok: false as const, code: "incomplete_search_result" };
  const entities = [
    ...dimensions.products,
    ...dimensions.providers.map((p) => p.provider_key),
    ...(dimensions.entities ?? []).map((e) => e.entity_key),
  ];
  if (
    [
      ...(event.compared_entity_ids ?? []),
      ...(event.selected_entity_ids ?? []),
      ...(event.previous_entity_ids ?? []),
      ...(event.recommended_entity_ids ?? []),
      event.primary_entity_id,
      event.alternative_entity_id,
      event.selected_entity_id,
    ].some((id) => id && !entities.includes(id))
  )
    return { ok: false as const, code: "invalid_comparison_entity" };
  if (
    [
      ...(event.product_ids ?? []),
      ...(event.product_context_ids ?? []),
      ...(event.intervening_product_ids ?? []),
      event.first_product_id,
      event.latest_product_id,
    ].some((id) => id && !dimensions.products.includes(id))
  )
    return { ok: false as const, code: "invalid_product" };
  if (
    [...(event.provider_ids ?? []), event.first_provider_id, event.latest_provider_id].some(
      (id) => id && !dimensions.providers.some((p) => p.provider_key === id),
    )
  )
    return { ok: false as const, code: "invalid_provider" };
  if (event.event_name.includes("interaction") && event.user_initiated !== true)
    return { ok: false as const, code: "not_user_initiated" };
  if (
    event.event_name.startsWith("provider_comparison") &&
    (new Set(event.provider_ids).size < 2 ||
      event.provider_ids?.some(
        (id) =>
          !dimensions.providers.some(
            (p) => p.provider_key === id && p.provider_type === event.provider_type,
          ),
      ))
  )
    return { ok: false as const, code: "invalid_provider_comparison" };
  if (
    event.event_name === "wizard_complete" &&
    (event.completed_steps !== event.total_steps || !event.total_steps)
  )
    return { ok: false as const, code: "incomplete_wizard" };
  if (event.search_term_normalized)
    event.search_term_normalized = normalizedSearch(event.search_term_normalized);
  return { ok: true as const, event, stage: entry.journey_stage_v2 ?? "research" };
}

export function semanticDedupKey(event: CommonEvent): string | null {
  const session = event.session_id;
  if (
    [
      "comparison_start",
      "comparison_complete",
      "provider_comparison_start",
      "provider_comparison_complete",
    ].includes(event.event_name)
  )
    return `${event.event_name}|${session}|${event.comparison_id}|${event.comparison_configuration_id ?? ""}|${event.primary_entity_id ?? ""}|${JSON.stringify(event.compared_entity_ids ?? event.provider_ids ?? [])}`;
  if (
    [
      "multiple_products_viewed",
      "multiple_comparisons_viewed",
      "multiple_providers_viewed",
    ].includes(event.event_name)
  )
    return `${event.event_name}|${session}`;
  if (event.event_name === "journey_step_reached") return `stage|${session}|${event.journey_stage}`;
  if (event.event_name === "scroll_depth")
    return `scroll|${session}|${event.page_path}|${event.scroll_percent}`;
  if (event.event_name === "engaged_session") return `session|${session}`;
  if (event.event_name === "engaged_content_view") return `content|${session}|${event.content_id}`;
  if (event.event_name === "page_view")
    return `page|${session}|${event.page_instance_id ?? `${event.page_path}|${Math.floor(Date.parse(event.event_timestamp) / 2000)}`}`;
  return `id|${event.event_id}`;
}
