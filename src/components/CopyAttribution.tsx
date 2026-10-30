import { useEffect } from "react";
import { installCopyAttribution } from "@/lib/copyAttribution";

/** Installerar källhänvisningen vid kopiering i webbläsaren. Renderar ingenting. */
export default function CopyAttribution() {
  useEffect(() => installCopyAttribution(), []);
  return null;
}
