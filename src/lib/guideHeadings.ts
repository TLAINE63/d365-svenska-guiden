/** Presentation-only labels; source guide content and URLs remain unchanged. */
export function buyerSectionHeading(heading: string): string {
  const text = heading.replace(/^\d+\.\s*/, "");
  const labels: Record<string, string> = {
    "Börja i verksamheten, inte i systemet": "Vad avgör valet?",
    "Avgränsa vilket problem CRM ska lösa": "Vad avgör valet?",
    "Business Central eller Finance & Supply Chain Management (F&O)?": "Jämförelse: Business Central och Finance & Supply Chain Management (F&O)",
    "Vad kostnaden faktiskt består av": "Vad avgör totalkostnaden?",
    "Så utvärderar du partners": "Partner och kompetens: vad ska ni kontrollera?",
    "Vanliga fallgropar": "Risker att tänka på",
  };
  return labels[text] ?? text;
}
export function partnerQuestion(title: string): string {
  if (title.endsWith("?")) return title;
  return title.replace(/^Så väljer (du|ni) /i, "Hur väljer $1 ").replace(/\.$/, "") + "?";
}
