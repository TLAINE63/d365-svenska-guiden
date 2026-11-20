// Allow-list of partner columns the public MCP tools may ever return.
// Internal fields (source_document_text, admin/invoice emails, fees, notes, size tier) must never be added.
export const MCP_PUBLIC_PARTNER_COLUMNS = [
  "slug", "name", "description", "website", "applications", "industries", "secondary_industries",
  "geography", "office_cities", "customer_examples", "positioning_statement", "team_size_sweden",
  "implementations_done", "ai_summary",
] as const;

export const MCP_FORBIDDEN_PARTNER_COLUMNS = [
  "source_document_text", "admin_contact_email", "invoice_email", "monthly_fee", "admin_notes",
  "partner_size_tier", "email", "phone", "discount_percent", "agreement_signed",
];

/** Keeps only allow-listed keys, so a drifting view can never leak extra columns. */
export function pickPublicPartner<T extends Record<string, unknown>>(row: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of MCP_PUBLIC_PARTNER_COLUMNS) if (k in row) out[k] = row[k];
  return out;
}
