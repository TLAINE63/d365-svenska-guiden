import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";
import {
  BC_OPTIONS, BC_GROUP_TITLES, type BcAttributeType, type StructuredProfile,
} from "@/data/structuredPartnerProfile";

interface Props {
  value: StructuredProfile;
  onChange: (v: StructuredProfile) => void;
}

const GROUPS: BcAttributeType[] = ["migration", "competency", "project_type", "delivery_model"];

export function StructuredProfileSection({ value, onChange }: Props) {
  const toggle = (key: BcAttributeType, opt: string) =>
    onChange({
      ...value,
      [key]: value[key].includes(opt) ? value[key].filter((x) => x !== opt) : [...value[key], opt],
    });

  const sols = value.industry_solutions;
  const setSol = (i: number, patch: Partial<StructuredProfile["industry_solutions"][number]>) =>
    onChange({ ...value, industry_solutions: sols.map((s, j) => (j === i ? { ...s, ...patch } : s)) });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Strukturerad Business Central-profil</CardTitle>
        <CardDescription>
          Kryssa i det som stämmer för er Business Central-verksamhet. Uppgifterna granskas av d365.se
          innan de publiceras och ger ingen köpt placering.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {GROUPS.map((g) => (
          <div key={g} className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm text-foreground">{BC_GROUP_TITLES[g].title}</h4>
              <p className="text-xs text-muted-foreground">{BC_GROUP_TITLES[g].desc}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {BC_OPTIONS[g].map((o) => (
                <label key={o.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={value[g].includes(o.key)} onCheckedChange={() => toggle(g, o.key)} />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-foreground">Har ni en egen branschlösning?</h4>
          <div className="flex gap-2">
            {[true, false].map((b) => (
              <Button
                key={String(b)}
                type="button"
                size="sm"
                variant={value.has_industry_solution === b ? "default" : "outline"}
                onClick={() =>
                  onChange({
                    ...value,
                    has_industry_solution: b,
                    industry_solutions: b ? (sols.length ? sols : [{ name: "", description: "", industry: "" }]) : [],
                  })
                }
              >
                {b ? "Ja" : "Nej"}
              </Button>
            ))}
          </div>
          {value.has_industry_solution &&
            sols.map((s, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                <div className="grid sm:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Lösningsnamn</Label>
                    <Input value={s.name} maxLength={120} onChange={(e) => setSol(i, { name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Bransch</Label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={s.industry}
                      onChange={(e) => setSol(i, { industry: e.target.value })}
                    >
                      <option value="">Välj bransch</option>
                      {INDUSTRY_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Beskrivning</Label>
                  <Textarea rows={2} maxLength={800} value={s.description} onChange={(e) => setSol(i, { description: e.target.value })} />
                </div>
                {sols.length > 1 && (
                  <Button type="button" variant="ghost" size="sm"
                    onClick={() => onChange({ ...value, industry_solutions: sols.filter((_, j) => j !== i) })}>
                    <Trash2 className="w-4 h-4 mr-1" /> Ta bort
                  </Button>
                )}
              </div>
            ))}
          {value.has_industry_solution && (
            <Button type="button" variant="outline" size="sm"
              onClick={() => onChange({ ...value, industry_solutions: [...sols, { name: "", description: "", industry: "" }] })}>
              <Plus className="w-4 h-4 mr-1" /> Lägg till lösning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
