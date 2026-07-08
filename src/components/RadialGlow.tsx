import { cn } from "@/lib/utils";

export interface RadialGlowProps {
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Reusable radial glow background for hero/section overlays.
 * Mirrors the glow treatment used on the Home page.
 * Use variant="dark" on --hero-dark backgrounds and variant="light" on light surfaces.
 */
export function RadialGlow({ variant = "dark", className }: RadialGlowProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent",
          variant === "dark" ? "from-primary/20 opacity-60" : "from-primary/5 opacity-60"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent",
          variant === "dark" ? "from-accent/15 opacity-40" : "from-accent/5 opacity-40"
        )}
      />
    </div>
  );
}
