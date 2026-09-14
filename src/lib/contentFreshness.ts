// Centraliserad "senast granskad"-tidsstämpel för Kunskapscenter-artiklar.
// Uppdatera detta värde när redaktionen har gjort en innehållsgranskning så
// att Google ser en aktuell dateModified och besökare ser ett tydligt
// "Senast uppdaterad"-datum i UI:t.
import { formatDateYYYYMMDD } from "@/lib/utils";

export const KNOWLEDGE_CENTER_LAST_REVIEWED = "2026-06-01T00:00:00+02:00";

export const formatLongDateSv = (iso: string): string => formatDateYYYYMMDD(iso);
