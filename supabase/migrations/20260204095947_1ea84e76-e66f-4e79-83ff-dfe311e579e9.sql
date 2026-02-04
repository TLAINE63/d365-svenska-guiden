-- Allow events without a partner (d365.se-hosted events)
ALTER TABLE partner_events
ALTER COLUMN partner_id DROP NOT NULL;

-- Add a comment explaining the change
COMMENT ON COLUMN partner_events.partner_id IS 'NULL indicates the event is hosted by d365.se directly, not a partner';