import { z } from "zod";

export const stages = [
  "discovery",
  "research",
  "consideration",
  "selection",
  "conversion",
] as const;
export type Stage = (typeof stages)[number];
export const stageOrder = (stage: string | null | undefined) => stages.indexOf(stage as Stage) + 1;
export const stageNames: Record<Stage, string> = {
  discovery: "Discovery",
  research: "Research",
  consideration: "Consideration",
  selection: "Selection",
  conversion: "Conversion",
};
export const comparisonKinds = [
  "product_vs_product",
  "product_vs_category",
  "product_vs_alternative",
  "partner_vs_partner",
  "isv_vs_isv",
  "csp_vs_csp",
  "provider_vs_provider",
  "approach_vs_approach",
  "licensing_comparison",
  "cost_comparison",
  "implementation_comparison",
  "feature_comparison",
  "other",
] as const;
export const entityKinds = [
  "product",
  "product_category",
  "dynamics_partner",
  "isv",
  "csp",
  "provider",
  "approach",
  "licensing_model",
  "implementation_model",
  "other",
] as const;
export const destinationKinds = [
  "product",
  "pricing",
  "implementation",
  "guide",
  "partner_directory",
  "provider_profile",
  "provider_website",
  "wizard",
  "lead_form",
  "product_page",
  "campaign_page",
  "booking_page",
  "contact_page",
  "other",
] as const;
export const transitionMethods = [
  "internal_link",
  "comparison",
  "recommendation",
  "navigation",
  "search",
  "wizard",
  "other",
] as const;
const key = z
  .string()
  .regex(/^[a-zA-Z0-9_-]+$/)
  .max(128);
const keys = z.array(key).max(20);
const count = z.number().int().min(0).max(10000);
export const sprint2Fields = {
  comparison_id: key.optional(),
  comparison_configuration_id: key.optional(),
  primary_entity_type: z.enum(entityKinds).optional(),
  compared_entity_type: z.enum(entityKinds).optional(),
  start_method: z
    .enum([
      "dedicated_page",
      "embedded_section",
      "compare_button",
      "entity_selector",
      "internal_link",
      "search_result",
      "recommended_comparison",
      "other",
    ])
    .optional(),
  interaction_type: z
    .enum([
      "add_entity",
      "remove_entity",
      "replace_entity",
      "expand_criterion",
      "collapse_criterion",
      "filter",
      "sort",
      "tab_change",
      "view_details",
      "other",
    ])
    .optional(),
  criterion_id: key.optional(),
  selected_entity_ids: keys.optional(),
  previous_entity_ids: keys.optional(),
  interaction_number: count.optional(),
  criteria_viewed_count: count.optional(),
  interactions_count: count.optional(),
  completion_method: z
    .enum([
      "scroll_completion",
      "criteria_completion",
      "result_reached",
      "next_step_selected",
      "provider_selected",
      "manual_completion",
      "other",
    ])
    .optional(),
  selected_entity_type: z.enum(entityKinds).optional(),
  selected_entity_id: key.optional(),
  destination_id: key.optional(),
  destination_url: z
    .string()
    .startsWith("/")
    .max(500)
    .refine((v) => !v.includes("?") && !v.includes("#") && !v.startsWith("//"))
    .optional(),
  alternative_entity_type: z.enum(entityKinds).optional(),
  alternative_entity_id: key.optional(),
  alternative_category: z
    .enum([
      "microsoft_product",
      "non_microsoft_product",
      "manual_process",
      "spreadsheet",
      "custom_solution",
      "alternative_approach",
      "other",
    ])
    .optional(),
  product_ids: keys.optional(),
  product_count: count.optional(),
  first_product_id: key.optional(),
  latest_product_id: key.optional(),
  sequence: keys.optional(),
  time_between_first_and_latest_seconds: z.number().min(0).max(86400).optional(),
  view_count: count.optional(),
  first_view_timestamp: z.string().datetime({ offset: true }).optional(),
  latest_view_timestamp: z.string().datetime({ offset: true }).optional(),
  intervening_content_count: count.optional(),
  intervening_product_ids: keys.optional(),
  comparison_ids: keys.optional(),
  comparison_types: z.array(z.enum(comparisonKinds)).max(20).optional(),
  comparison_count: count.optional(),
  provider_ids: keys.optional(),
  provider_types: z
    .array(z.enum(["dynamics_partner", "isv", "csp", "microsoft", "other_provider"]))
    .max(20)
    .optional(),
  provider_count: count.optional(),
  first_provider_id: key.optional(),
  latest_provider_id: key.optional(),
  placement_type: z
    .enum(["organic", "alphabetical", "editorial", "sponsored", "recommended", "filtered", "other"])
    .optional(),
  next_step_type: z
    .enum([
      "learn_more",
      "view_product",
      "view_pricing",
      "view_implementation",
      "compare_products",
      "compare_providers",
      "find_partner",
      "view_provider",
      "visit_provider",
      "start_wizard",
      "contact",
      "download",
      "view_case",
      "other",
    ])
    .optional(),
  current_journey_stage: z.enum(stages).optional(),
  intended_next_journey_stage: z.enum(stages).optional(),
  destination_content_id: key.optional(),
  previous_highest_stage: z.enum(stages).nullable().optional(),
  stage_order: z.number().int().min(1).max(5).optional(),
  triggering_event_name: key.optional(),
  seconds_from_session_start: z.number().min(0).max(86400).optional(),
  wizard_id: key.optional(),
  wizard_type: z
    .enum([
      "product_selector",
      "partner_match",
      "solution_selector",
      "needs_assessment",
      "implementation_guide",
      "fp_and_a_assessment",
      "other",
    ])
    .optional(),
  step_id: key.optional(),
  step_number: count.optional(),
  total_steps: count.optional(),
  completed_steps: count.optional(),
  selected_option_ids: keys.optional(),
  product_context_ids: keys.optional(),
  result_type: key.optional(),
  recommended_entity_type: z.enum(entityKinds).optional(),
  recommended_entity_ids: keys.optional(),
  transition_method: z.enum(transitionMethods).optional(),
  user_initiated: z.boolean().optional(),
};
export const sprint2Events: Record<string, string[]> = {
  comparison_start: [
    "comparison_id",
    "comparison_type",
    "primary_entity_id",
    "compared_entity_ids",
    "start_method",
  ],
  comparison_interaction: [
    "comparison_id",
    "comparison_type",
    "interaction_type",
    "user_initiated",
  ],
  comparison_complete: [
    "comparison_id",
    "comparison_type",
    "primary_entity_id",
    "compared_entity_ids",
    "completion_method",
  ],
  comparison_result_click: [
    "comparison_id",
    "comparison_type",
    "selected_entity_type",
    "selected_entity_id",
    "destination_type",
  ],
  alternative_view: [
    "primary_entity_type",
    "primary_entity_id",
    "alternative_entity_type",
    "alternative_entity_id",
    "alternative_category",
  ],
  multiple_products_viewed: ["product_ids", "product_count"],
  repeated_product_view: ["product_id", "view_count"],
  multiple_comparisons_viewed: ["comparison_ids", "comparison_count"],
  provider_comparison_start: ["comparison_id", "provider_ids", "provider_type", "start_method"],
  provider_comparison_interaction: [
    "comparison_id",
    "provider_ids",
    "provider_type",
    "interaction_type",
    "user_initiated",
  ],
  provider_comparison_complete: [
    "comparison_id",
    "provider_ids",
    "provider_type",
    "completion_method",
  ],
  multiple_providers_viewed: ["provider_ids", "provider_count"],
  journey_step_reached: ["journey_stage", "triggering_event_name"],
  wizard_start: ["wizard_id", "wizard_type", "total_steps"],
  wizard_step_complete: [
    "wizard_id",
    "wizard_type",
    "step_id",
    "step_number",
    "selected_option_ids",
  ],
  wizard_complete: ["wizard_id", "wizard_type", "total_steps", "completed_steps", "result_type"],
  buyer_next_step_click: [
    "next_step_type",
    "current_journey_stage",
    "intended_next_journey_stage",
    "destination_page_type",
  ],
};
export type JourneyRule = {
  event_name: string;
  conditions: Record<string, unknown>;
  journey_stage: Stage;
  version: number;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  priority: number;
};
export type JourneyConfig = {
  multiple_products: number;
  multiple_comparisons: number;
  multiple_providers: number;
  repeat_seconds: number;
  small_cell: number;
  completion: Record<
    string,
    { active_seconds: number; scroll_percent: number; criteria: number; interactions: number }
  >;
};
export const defaultJourneyConfig: JourneyConfig = {
  multiple_products: 2,
  multiple_comparisons: 2,
  multiple_providers: 2,
  repeat_seconds: 30,
  small_cell: 3,
  completion: { default: { active_seconds: 30, scroll_percent: 75, criteria: 3, interactions: 2 } },
};
export function resolveJourneyStage(
  event: Record<string, unknown>,
  rules: JourneyRule[],
): { stage: Stage | null; version: number | null } {
  const at = String(event["event_timestamp"] ?? event["occurred_at"]);
  const rule = rules
    .filter(
      (r) =>
        r.is_active &&
        r.event_name === event["event_name"] &&
        Date.parse(at) >= Date.parse(r.valid_from) &&
        (!r.valid_to || Date.parse(at) < Date.parse(r.valid_to)) &&
        Object.entries(r.conditions).every(([key, value]) =>
          Array.isArray(value) ? value.includes(event[key]) : event[key] === value,
        ),
    )
    .sort((a, b) => b.priority - a.priority || b.version - a.version)[0];
  return { stage: rule?.journey_stage ?? null, version: rule?.version ?? null };
}
export function qualifiesComparison(
  e: Record<string, unknown>,
  config = defaultJourneyConfig,
): boolean {
  const rule = config.completion[String(e["comparison_type"])] ?? config.completion["default"];
  if (!rule) return false;
  const seconds = Number(e["engaged_time_seconds"] ?? 0);
  const method = e["completion_method"];
  if (method === "scroll_completion")
    return (
      seconds >= rule.active_seconds && Number(e["max_scroll_percent"] ?? 0) >= rule.scroll_percent
    );
  if (method === "criteria_completion")
    return (
      Number(e["criteria_viewed_count"] ?? 0) >= rule.criteria &&
      Number(e["interactions_count"] ?? 0) >= rule.interactions
    );
  return (
    ["result_reached", "next_step_selected", "provider_selected"].includes(String(method)) &&
    e["user_initiated"] === true
  );
}
export function comparisonIdentity(e: Record<string, unknown>): string {
  return JSON.stringify([
    e["comparison_id"],
    e["comparison_configuration_id"] ?? null,
    e["primary_entity_id"] ?? null,
    e["compared_entity_ids"] ?? e["provider_ids"] ?? [],
  ]);
}
