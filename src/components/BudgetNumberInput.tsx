import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { flushSync } from "react-dom";

type Props = Omit<ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: number | string;
  onValueChange: (value: number) => void;
};

const formatter = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 10 });

export function BudgetNumberInput({ value, onValueChange, className, min = 0, max, step: _step, ...props }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const numeric = Number(value) || 0;
  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      placeholder="0"
      className={cn("text-right tabular-nums", className)}
      value={draft ?? (numeric === 0 ? "" : formatter.format(numeric))}
      onFocus={(event) => {
        flushSync(() => setDraft(numeric === 0 ? "" : String(numeric).replace(".", ",")));
        event.currentTarget.select();
      }}
      onChange={(event) => {
        const text = event.target.value.replace(/\s/g, "").replace(/\./g, ",");
        if (!/^\d*(,\d*)?$/.test(text)) return;
        const normalized = text.replace(/^0+(?=\d)/, "");
        const parsed = Number(normalized.replace(",", ".")) || 0;
        const bounded = Math.max(Number(min), Math.min(max === undefined ? Infinity : Number(max), parsed));
        setDraft(bounded === parsed ? normalized : String(bounded).replace(".", ","));
        onValueChange(bounded);
      }}
      onBlur={() => setDraft(null)}
    />
  );
}