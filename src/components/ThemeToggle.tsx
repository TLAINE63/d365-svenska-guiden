import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Byt till ljust läge" : "Byt till mörkt läge"}
      title={isDark ? "Ljust läge" : "Mörkt läge"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:text-[hsl(var(--signature))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
