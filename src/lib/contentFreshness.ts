// Centraliserad "senast granskad"-tidsstämpel för Kunskapscenter-artiklar.
// Uppdatera detta värde när redaktionen har gjort en innehållsgranskning så
// att Google ser en aktuell dateModified och besökare ser ett tydligt
// "Senast uppdaterad"-datum i UI:t.
export const KNOWLEDGE_CENTER_LAST_REVIEWED = "2026-06-01T00:00:00+02:00";

export const formatLongDateSv = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return iso;
  }
};
