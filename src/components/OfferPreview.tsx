import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, Pencil, Mail } from "lucide-react";
import { ORGANIZATION } from "@/data/organization";

interface Props {
  offer: string;
  scope: string;
  price: string;
  included: string[];
  addons: string[];
  finders: string;
  disabled?: boolean;
  onDownload: () => void | Promise<void>;
}

/** Förhandsgranskning av offertförslaget innan PDF:en laddas ned. */
export default function OfferPreview({ offer, scope, price, included, addons, finders, disabled, onDownload }: Props) {
  const [show, setShow] = useState(false);
  if (!show) return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" onClick={() => setShow(true)} disabled={disabled}><Eye className="mr-2 h-4 w-4" />Förhandsgranska ert offertförslag</Button>
      <Button type="button" variant="outline" asChild><a href={`mailto:${ORGANIZATION.email}?subject=${encodeURIComponent(`Fråga om ${offer}`)}`}><Mail className="mr-2 h-4 w-4" />Kontakta d365.se om erbjudandet</a></Button>
    </div>
  );
  return (
    <section aria-label="Förhandsgranskning av offertförslag" className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
      <h3 className="text-lg font-semibold">Ert förslag från d365.se</h3>
      <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[10rem_1fr]">
        <dt className="text-muted-foreground">Erbjudande</dt><dd className="font-medium">{offer}</dd>
        <dt className="text-muted-foreground">Vald omfattning</dt><dd>{scope}</dd>
        <dt className="text-muted-foreground">Pris</dt><dd className="font-semibold">{price}</dd>
      </dl>
      {included.length > 0 && <div><p className="text-sm font-medium">Ingår</p><ul className="ml-5 list-disc text-sm">{included.map((i) => <li key={i}>{i}</li>)}</ul></div>}
      {addons.length > 0 && <div><p className="text-sm font-medium">Tillägg (ingår inte)</p><ul className="ml-5 list-disc text-sm text-muted-foreground">{addons.map((i) => <li key={i}>{i}</li>)}</ul></div>}
      <p className="text-sm"><span className="font-medium">Finder’s fee, separat avtal: </span>{finders}</p>
      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="button" onClick={onDownload}><Download className="mr-2 h-4 w-4" />Ladda ned ert offertförslag (PDF)</Button>
        <Button type="button" variant="outline" onClick={() => setShow(false)}><Pencil className="mr-2 h-4 w-4" />Ändra mina val</Button>
      </div>
    </section>
  );
}
