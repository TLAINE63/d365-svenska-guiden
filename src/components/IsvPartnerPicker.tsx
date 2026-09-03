import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { PRODUCT_FILTER_GROUP, type ProductFilterKey } from "@/lib/productFilterGroup";

interface Props {
  /** Valda partners (slugs) */
  value: string[];
  onChange: (slugs: string[]) => void;
}

const PRODUCT_KEYS = Object.keys(PRODUCT_FILTER_GROUP) as ProductFilterKey[];

const SHORT_LABEL: Record<ProductFilterKey, string> = {
  bc: "Business Central",
  fsc: "Finance & SCM",
  sales: "Sales & Marketing",
  service: "Service",
};

/**
 * Väljare för vilka svenska återförsäljare/partners som säljer/implementerar en ISV-lösning.
 * Sökbar lista med filter per Dynamics 365-produktområde.
 */
export default function IsvPartnerPicker({ value, onChange }: Props) {
  const { data: partners = [], isLoading } = useAllPartnerNames();
  const [search, setSearch] = useState("");
  const [productKey, setProductKey] = useState<ProductFilterKey | null>(null);

  const toggle = (slug: string) =>
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .filter((p) => (productKey ? !!p.product_filters?.[productKey] : true))
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return a.name.localeCompare(b.name, "sv");
      });
  }, [partners, search, productKey]);

  const selectedNames = useMemo(
    () =>
      value.map((slug) => ({
        slug,
        name: partners.find((p) => p.slug === slug)?.name || slug,
      })),
    [value, partners]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRODUCT_KEYS.map((key) => {
          const active = productKey === key;
          return (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              onClick={() => setProductKey(active ? null : key)}
            >
              {SHORT_LABEL[key]}
            </Button>
          );
        })}
        {productKey && (
          <Button type="button" size="sm" variant="ghost" onClick={() => setProductKey(null)}>
            Rensa filter
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Sök partner…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedNames.map((p) => (
            <Badge key={p.slug} variant="secondary" className="gap-1">
              {p.name}
              <button type="button" onClick={() => toggle(p.slug)} aria-label={`Ta bort ${p.name}`}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="max-h-72 overflow-y-auto rounded-md border border-border divide-y divide-border">
        {isLoading && <p className="p-3 text-sm text-muted-foreground">Hämtar partners…</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="p-3 text-sm text-muted-foreground">Inga partners matchar din sökning.</p>
        )}
        {filtered.map((p) => (
          <label
            key={p.slug}
            className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-muted/50"
          >
            <Checkbox checked={value.includes(p.slug)} onCheckedChange={() => toggle(p.slug)} />
            <span className="flex-1">{p.name}</span>
            {p.is_featured && (
              <Badge variant="outline" className="text-[10px]">
                Partnerverifierad
              </Badge>
            )}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {value.length} valda partners av {partners.length} kartlagda.
      </p>
    </div>
  );
}
