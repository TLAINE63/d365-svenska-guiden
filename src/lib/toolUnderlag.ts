import { readToolContext, type ToolEntry } from "@/lib/toolContext";

export function findTool(tool: string): ToolEntry | undefined {
  return readToolContext().find((t) => t.tool === tool);
}

/** Kort textsammanfattning av ett verktygsresultat, används som förifylld beskrivning (max 1000 tecken). */
export function toolSummary(t: ToolEntry): string {
  const head = [t.label, t.industry && `bransch ${t.industry}`, t.users && `${t.users} användare`].filter(Boolean).join(", ");
  const rows = Object.entries(t.values).map(([k, v]) => `${k}: ${v}`).join("; ");
  return `Underlag från ${head}. ${rows}`.slice(0, 1000);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

/** Word-kompatibel HTML-fil (.doc) med verktygets indata och resultat. */
export function toolWordHtml(t: ToolEntry, date: string): string {
  const rows = Object.entries(t.values).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`).join("");
  return `<html><head><meta charset="utf-8"><title>${esc(t.label)}</title></head><body style="font-family:Calibri,Arial,sans-serif">
<h1 style="color:#0E7C86">${esc(t.label)}</h1><p>d365.se, ${date}${t.industry ? `, bransch: ${esc(t.industry)}` : ""}${t.users ? `, ${t.users} användare` : ""}</p>
<table>${rows}</table><p style="color:#777;font-size:10pt">Uppskattning baserad på dina egna val i verktyget. Källa: d365.se</p></body></html>`;
}
