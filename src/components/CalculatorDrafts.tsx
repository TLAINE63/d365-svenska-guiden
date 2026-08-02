import { useState } from "react";
import { Save, FolderOpen, Trash2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useCalculatorDrafts,
  type CalculatorDraft,
  type CalculatorDraftInputs,
} from "@/hooks/useCalculatorDrafts";

interface Props {
  inputs: CalculatorDraftInputs;
  summary: CalculatorDraft["summary"];
  onLoad: (inputs: CalculatorDraftInputs) => void;
}

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function CalculatorDrafts({ inputs, summary, onLoad }: Props) {
  const { drafts, saveDraft, deleteDraft, maxDrafts } = useCalculatorDrafts();
  const [name, setName] = useState("");

  const handleSave = () => {
    if (drafts.length >= maxDrafts) {
      toast.error(`Du kan spara max ${maxDrafts} utkast. Ta bort ett äldre först.`);
      return;
    }
    const draft = saveDraft(name, inputs, summary);
    setName("");
    toast.success(`Utkastet "${draft.name}" är sparat`);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-accent" aria-hidden="true" />
            Spara som utkast
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Spara det här scenariot och återanvänd det senare. Utkasten sparas lokalt i
            din webbläsare – inget skickas till oss.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <Label htmlFor="draft-name" className="text-sm">
              Namn på utkastet
            </Label>
            <Input
              id="draft-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="T.ex. BC – 25 användare, låg anpassning"
              maxLength={80}
              className="mt-1"
            />
          </div>
          <Button type="button" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" aria-hidden="true" />
            Spara utkast
          </Button>
        </div>

        {drafts.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Sparade utkast ({drafts.length})
            </p>
            <ul className="space-y-2">
              {drafts.map((d) => (
                <li
                  key={d.id}
                  className="rounded-lg border border-border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {fmtDate(d.savedAt)} · {fmtSek(d.summary.costLow)} – {fmtSek(d.summary.costHigh)} ·{" "}
                      {d.inputs.users} användare · ca {String(d.summary.months).replace(".", ",")} mån
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        onLoad(d.inputs);
                        toast.success(`Utkastet "${d.name}" är inläst`);
                      }}
                    >
                      <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                      Öppna
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label={`Ta bort utkastet ${d.name}`}
                      onClick={() => {
                        deleteDraft(d.id);
                        toast.success("Utkastet är borttaget");
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
