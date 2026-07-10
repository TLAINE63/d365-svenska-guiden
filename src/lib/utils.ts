import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Svensk genitiv: lägg till "s" om namnet inte redan slutar på s/x/z.
 * Ex: "Fellowmind" → "Fellowminds", "Goodfellows" → "Goodfellows'",
 * "NAB Solutions" → "NAB Solutions'".
 */
export function swedishPossessive(name: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  const last = trimmed.slice(-1).toLowerCase();
  if (last === "s" || last === "x" || last === "z") return `${trimmed}'`;
  return `${trimmed}s`;
}

/**
 * Formatera svenska telefonnummer i grupper: "070-608 21 21", "08-123 45 67".
 * Bevarar landsprefix (+46). Om numret inte matchar svenskt mönster returneras
 * ursprunget med normaliserad mellanslag.
 */
export function formatSwedishPhone(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  // Behåll landsprefix separat
  let prefix = "";
  let digits = trimmed.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+46")) {
    prefix = "+46 ";
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("0046")) {
    prefix = "+46 ";
    digits = "0" + digits.slice(4);
  }
  if (!/^\d+$/.test(digits)) return trimmed;

  // Mobil (07x) och 3-siffriga riktnummer (t.ex. 018, 019, 021, 023, 026, 031...)
  // Enkelt: om längd 10 och börjar med 07 → 3-3-2-2. Om längd 10 och börjar med 08 → 2-3-2-3.
  // Annars grupp: riktnummer 3 siffror + resten i 3-2-2.
  if (digits.length === 10 && digits.startsWith("07")) {
    return `${prefix}${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  if (digits.length === 9 && digits.startsWith("08")) {
    return `${prefix}${digits.slice(0, 2)}-${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  if (digits.length === 10 && digits.startsWith("08")) {
    return `${prefix}${digits.slice(0, 2)}-${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 10)}`;
  }
  if (digits.length === 10) {
    return `${prefix}${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  if (digits.length === 9) {
    return `${prefix}${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  return prefix ? `${prefix}${digits}` : trimmed;
}
