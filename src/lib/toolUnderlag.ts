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

