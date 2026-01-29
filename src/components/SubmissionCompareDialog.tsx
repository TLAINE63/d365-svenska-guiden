import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFilter {
  industries: string[];
  geography: string[];
  swedenRegions: string[];
  swedenCities: string[];
  ranking: number;
  customerExamples: string[];
  customerCaseLinks: string[];
  productDescription: string;
}

interface ProductFilters {
  bc?: ProductFilter;
  fsc?: ProductFilter;
  sales?: ProductFilter;
  service?: ProductFilter;
}

interface Submission {
  id: string;
  invitation_id: string;
  partner_id: string | null;
  name: string;
  description: string;
  website: string;
  logo_url: string | null;
  contact_person: string | null;
  email: string;
  phone: string;
  address: string | null;
  applications: string[] | null;
  industries: string[] | null;
  secondary_industries: string[] | null;
  geography: string[] | null;
  product_filters: ProductFilters | null;
  notes: string | null;
  submitted_at: string;
}

interface ExistingPartner {
  id: string;
  name: string;
  description: string | null;
  website: string;
  logo_url: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  applications: string[] | null;
  industries: string[] | null;
  secondary_industries: string[] | null;
  geography: string[] | null;
  product_filters: ProductFilters | null;
}

interface SubmissionCompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
  partnerId: string | null;
  token: string;
  onApprove: (submissionId: string) => void;
}

// Helper to compare two values and highlight differences
const CompareField = ({ 
  label, 
  oldValue, 
  newValue, 
  isNew = false 
}: { 
  label: string; 
  oldValue: string | null | undefined; 
  newValue: string | null | undefined;
  isNew?: boolean;
}) => {
  const hasChanged = oldValue !== newValue && !isNew;
  const oldDisplay = oldValue || "-";
  const newDisplay = newValue || "-";

  return (
    <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start">
      <div className={cn("p-2 rounded text-sm", isNew ? "bg-muted/30" : "bg-muted/50")}>
        <Label className="text-muted-foreground text-xs block mb-1">{label}</Label>
        {isNew ? (
          <span className="text-muted-foreground italic">Ny partner</span>
        ) : (
          <span className={cn(hasChanged && "line-through text-muted-foreground")}>{oldDisplay}</span>
        )}
      </div>
      <ArrowRight className={cn("w-4 h-4 mt-6", hasChanged ? "text-amber-500" : "text-muted-foreground/30")} />
      <div className={cn("p-2 rounded text-sm", hasChanged ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800" : "bg-muted/50")}>
        <Label className="text-muted-foreground text-xs block mb-1">{label}</Label>
        <span className={cn(hasChanged && "font-medium text-amber-700 dark:text-amber-300")}>{newDisplay}</span>
      </div>
    </div>
  );
};

// Helper to compare arrays (like applications, geography)
const CompareArrayField = ({ 
  label, 
  oldValue, 
  newValue,
  isNew = false 
}: { 
  label: string; 
  oldValue: string[] | null | undefined; 
  newValue: string[] | null | undefined;
  isNew?: boolean;
}) => {
  const oldArr = oldValue || [];
  const newArr = newValue || [];
  
  const added = newArr.filter(item => !oldArr.includes(item));
  const removed = oldArr.filter(item => !newArr.includes(item));
  const unchanged = newArr.filter(item => oldArr.includes(item));
  const hasChanged = added.length > 0 || removed.length > 0;

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start">
        <div className={cn("p-2 rounded min-h-[40px]", isNew ? "bg-muted/30" : "bg-muted/50")}>
          {isNew ? (
            <span className="text-muted-foreground italic text-sm">Ny partner</span>
          ) : oldArr.length === 0 ? (
            <span className="text-muted-foreground text-sm">-</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {oldArr.map((item) => (
                <Badge 
                  key={item} 
                  variant="outline" 
                  className={cn("text-xs", removed.includes(item) && "line-through bg-red-50 dark:bg-red-900/20 border-red-200")}
                >
                  {item}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <ArrowRight className={cn("w-4 h-4 mt-3", hasChanged ? "text-amber-500" : "text-muted-foreground/30")} />
        <div className={cn("p-2 rounded min-h-[40px]", hasChanged ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800" : "bg-muted/50")}>
          {newArr.length === 0 ? (
            <span className="text-muted-foreground text-sm">-</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {unchanged.map((item) => (
                <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
              ))}
              {added.map((item) => (
                <Badge key={item} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 border-green-300 text-green-700 dark:text-green-300">
                  + {item}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getProductName = (key: string) => {
  const names: Record<string, string> = {
    bc: 'Business Central',
    fsc: 'Finance & Supply Chain',
    sales: 'Sales & Customer Insights',
    service: 'Customer Service / Field Service',
  };
  return names[key] || key;
};

export const SubmissionCompareDialog = ({
  open,
  onOpenChange,
  submission,
  partnerId,
  token,
  onApprove,
}: SubmissionCompareDialogProps) => {
  const [existingPartner, setExistingPartner] = useState<ExistingPartner | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExistingPartner = async () => {
      if (!partnerId || !open) {
        setExistingPartner(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-partners`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ action: "get-one", token, id: partnerId }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.partner) {
            setExistingPartner(data.partner);
          }
        }
      } catch (err) {
        console.error("Error fetching existing partner:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingPartner();
  }, [partnerId, open, token]);

  if (!submission) return null;

  const isNewPartner = !partnerId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Granska inskickade uppgifter
            {isNewPartner ? (
              <Badge className="bg-blue-500">Ny partner</Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500 text-amber-600">Uppdatering</Badge>
            )}
          </DialogTitle>
          {!isNewPartner && (
            <p className="text-sm text-muted-foreground">
              Jämför befintlig data (vänster) med inskickade ändringar (höger). Ändringar markeras med gul bakgrund.
            </p>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <Card>
              <CardHeader className="py-3 px-4 bg-muted/30">
                <CardTitle className="text-sm">Grundläggande information</CardTitle>
              </CardHeader>
              <CardContent className="py-4 space-y-4">
                <CompareField 
                  label="Företagsnamn" 
                  oldValue={existingPartner?.name} 
                  newValue={submission.name}
                  isNew={isNewPartner}
                />
                <CompareField 
                  label="Webbplats" 
                  oldValue={existingPartner?.website} 
                  newValue={submission.website}
                  isNew={isNewPartner}
                />
                <CompareField 
                  label="Beskrivning" 
                  oldValue={existingPartner?.description} 
                  newValue={submission.description}
                  isNew={isNewPartner}
                />
                
                {/* Logo comparison */}
                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start">
                  <div className="p-2 rounded bg-muted/50">
                    <Label className="text-muted-foreground text-xs block mb-2">Logotyp</Label>
                    {isNewPartner ? (
                      <span className="text-muted-foreground italic text-sm">Ny partner</span>
                    ) : existingPartner?.logo_url ? (
                      <div className="w-20 h-20 border rounded overflow-hidden bg-white flex items-center justify-center">
                        <img src={existingPartner.logo_url} alt="Befintlig" className="max-w-full max-h-full object-contain p-1" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Ingen logotyp</span>
                    )}
                  </div>
                  <ArrowRight className={cn("w-4 h-4 mt-8", submission.logo_url !== existingPartner?.logo_url ? "text-amber-500" : "text-muted-foreground/30")} />
                  <div className={cn("p-2 rounded", submission.logo_url !== existingPartner?.logo_url && !isNewPartner ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200" : "bg-muted/50")}>
                    <Label className="text-muted-foreground text-xs block mb-2">Logotyp</Label>
                    {submission.logo_url ? (
                      <div className="w-20 h-20 border rounded overflow-hidden bg-white flex items-center justify-center">
                        <img src={submission.logo_url} alt="Ny" className="max-w-full max-h-full object-contain p-1" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Ingen logotyp</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader className="py-3 px-4 bg-muted/30">
                <CardTitle className="text-sm">Kontaktuppgifter</CardTitle>
              </CardHeader>
              <CardContent className="py-4 space-y-4">
                <CompareField 
                  label="Säljare/Säljansvarig" 
                  oldValue={existingPartner?.contact_person} 
                  newValue={submission.contact_person}
                  isNew={isNewPartner}
                />
                <CompareField 
                  label="E-post" 
                  oldValue={existingPartner?.email} 
                  newValue={submission.email}
                  isNew={isNewPartner}
                />
                <CompareField 
                  label="Telefon" 
                  oldValue={existingPartner?.phone} 
                  newValue={submission.phone}
                  isNew={isNewPartner}
                />
                <CompareField 
                  label="Adress" 
                  oldValue={existingPartner?.address} 
                  newValue={submission.address}
                  isNew={isNewPartner}
                />
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader className="py-3 px-4 bg-muted/30">
                <CardTitle className="text-sm">Valda produkter</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <CompareArrayField 
                  label="Applikationer" 
                  oldValue={existingPartner?.applications} 
                  newValue={submission.applications}
                  isNew={isNewPartner}
                />
              </CardContent>
            </Card>

            {/* Geography */}
            <Card>
              <CardHeader className="py-3 px-4 bg-muted/30">
                <CardTitle className="text-sm">Geografisk täckning</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <CompareArrayField 
                  label="Regioner" 
                  oldValue={existingPartner?.geography} 
                  newValue={submission.geography}
                  isNew={isNewPartner}
                />
              </CardContent>
            </Card>

            {/* Product Filters */}
            {submission.product_filters && Object.keys(submission.product_filters).length > 0 && (
              <Card>
                <CardHeader className="py-3 px-4 bg-muted/30">
                  <CardTitle className="text-sm">Produktspecifik information</CardTitle>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  {Object.entries(submission.product_filters).map(([key, newFilter]) => {
                    if (!newFilter) return null;
                    const oldFilter = existingPartner?.product_filters?.[key as keyof ProductFilters];
                    
                    return (
                      <Card key={key} className="border">
                        <CardHeader className="py-2 px-4 bg-muted/50">
                          <CardTitle className="text-xs font-medium">{getProductName(key)}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3 px-4 space-y-3 text-sm">
                          <CompareField 
                            label="Beskrivning" 
                            oldValue={oldFilter?.productDescription} 
                            newValue={newFilter.productDescription}
                            isNew={isNewPartner}
                          />
                          <CompareArrayField 
                            label="Branschfokus" 
                            oldValue={oldFilter?.industries} 
                            newValue={newFilter.industries}
                            isNew={isNewPartner}
                          />
                          <CompareArrayField 
                            label="Geografi" 
                            oldValue={oldFilter?.geography} 
                            newValue={newFilter.geography}
                            isNew={isNewPartner}
                          />
                          <CompareArrayField 
                            label="Regioner i Sverige" 
                            oldValue={oldFilter?.swedenRegions} 
                            newValue={newFilter.swedenRegions}
                            isNew={isNewPartner}
                          />
                          <CompareArrayField 
                            label="Kundexempel" 
                            oldValue={oldFilter?.customerExamples} 
                            newValue={newFilter.customerExamples}
                            isNew={isNewPartner}
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {submission.notes && (
              <Card>
                <CardHeader className="py-3 px-4 bg-muted/30">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Anteckningar från partner
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <p className="text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200">
                    {submission.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
          <Button onClick={() => onApprove(submission.id)}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Godkänn och {isNewPartner ? "skapa partner" : "uppdatera partner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
