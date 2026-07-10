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
