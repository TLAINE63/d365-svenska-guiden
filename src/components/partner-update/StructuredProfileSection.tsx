import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";
import {
  MIGRATION_SOURCES, BC_COMPETENCIES, PROJECT_TYPES, DELIVERY_MODELS,
  type StructuredProfile,
} from "@/data/structuredPartnerProfile";

type ListKey = "migration_experience" | "bc_competencies" | "project_types" | "delivery_models";

interface Props {
  value: StructuredProfile;
  onChange: (v: StructuredProfile) => void;
}

export function StructuredProfileSection({ value, onChange }: Props) {
  const toggle = (key: ListKey, opt: string) =>
    onChange({
      ...value,
      [key]: value[key].includes(opt) ? value[key].filter((x) => x !== opt) : [...value[key], opt],
    });

  const group = (key: ListKey, title: string, desc: string, options: readonly string[]) => (
    <div className="space-y-2">
      <div>
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={value[key].includes(o)} onCheckedChange={() => toggle(key, o)} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );

  const sols = value.industry_solutions;
  const setSol = (i: number, patch: Partial<StructuredProfile["industry_solutions"][number]>) =>
    onChange({ ...value, industry_solutions: sols.map((s, j) => (j === i ? { ...s, ...patch } : s)) });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Strukturerad profil</CardTitle>
        <CardDescription>
          Kryssa i det som stämmer. Uppgifterna hjälper köpare att förstå er erfarenhet och används inte
          för köpt placering.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {group("migration_experience", "Migreringserfarenhet", "Från vilka system har ni migrerat kunder?", MIGRATION_SOURCES)}
        {group("bc_competencies", "Business Central-kompetens", "Vilka områden har ni dokumenterad kompetens inom?", BC_COMPETENCIES)}
        {group("project_types", "Typiska projekt", "Vilka typer av projekt gör ni oftast?", PROJECT_TYPES)}
        {group("delivery_models", "Leveransmodell", "Hur erbjuder ni att starta och leverera?", DELIVERY_MODELS)}

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
