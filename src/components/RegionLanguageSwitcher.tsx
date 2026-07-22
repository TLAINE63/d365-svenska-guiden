import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

type Locale = "sv" | "no" | "fi" | "dk" | "en";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const OPTION_LABELS: Record<Locale, string> = {
  sv: "Sverige | SV",
  no: "Norge | NO",
  fi: "Suomi | FI",
  dk: "Danmark | DA",
  en: "Global | EN",
};

const OPTION_ORDER: Locale[] = ["sv", "no", "fi", "dk", "en"];

const FLAG_CC: Record<Locale, string | null> = {
  sv: "se",
  no: "no",
  fi: "fi",
  dk: "dk",
  en: null,
};

function FlagOrGlobe({ locale, className }: { locale: Locale; className?: string }) {
  const cc = FLAG_CC[locale];
  if (!cc) return <Globe className={className ?? "h-4 w-4"} aria-hidden="true" />;
  return (
    <img
      src={`https://flagcdn.com/${cc}.svg`}
      alt=""
      aria-hidden="true"
      className={className ?? "h-3.5 w-5 rounded-sm object-cover"}
      loading="lazy"
    />
  );
}

function setCookie(locale: string) {
  document.cookie = `preferred_locale=${locale}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Domain=.d365.se`;
}

export default function RegionLanguageSwitcher() {
  // d365.se is always the Swedish market
  const currentLocale: Locale = "sv";

  const handleSelect = (target: Locale) => {
    setCookie(target);
    if (target === "sv") {
      // stay on d365.se
      window.location.href = "https://d365.se";
      return;
    }
    // English is default (no prefix) on d365guide.com
    const path = target === "en" ? "" : `/${target}`;
    window.location.href = `https://d365guide.com${path}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 px-2.5"
          aria-label="Välj land och språk"
        >
          <FlagOrGlobe locale={currentLocale} />
          <span className="text-xs font-semibold tracking-wide">SV</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTION_ORDER.map((l) => (
          <DropdownMenuItem key={l} onClick={() => handleSelect(l)}>
            <FlagOrGlobe locale={l} className="mr-2 h-3.5 w-5 rounded-sm object-cover" />
            {OPTION_LABELS[l]}
            {l === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">•</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
