import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Check, AlertCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug, PartnerInput } from "@/hooks/usePartners";

interface ParsedPartner extends PartnerInput {
  _status?: "new" | "update" | "error";
  _error?: string;
  _existingId?: string;
}

interface PartnerCsvUploadProps {
  password: string;
  existingPartners: { id: string; name: string; slug: string }[];
  onImportComplete: () => void;
}

// Parse CSV content
const parseCSV = (content: string): Record<string, string>[] => {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];

  // Handle both comma and semicolon separators
  const separator = lines[0].includes(";") ? ";" : ",";
  
  const headers = lines[0].split(separator).map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(separator).map(v => v.trim().replace(/^["']|["']$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || "";
    });
    return row;
  });
};

// Map CSV columns to partner fields
const mapToPartner = (row: Record<string, string>): PartnerInput => {
  // Try different column name variations
  const getName = () => row.name || row.namn || row.företag || row.company || "";
  const getWebsite = () => row.website || row.hemsida || row.url || row.webbplats || "";
  const getDescription = () => row.description || row.beskrivning || "";
  const getEmail = () => row.email || row.epost || row["e-post"] || "";
  const getPhone = () => row.phone || row.telefon || row.tel || "";
  const getAddress = () => row.address || row.adress || "";
  const getLogoUrl = () => row.logo_url || row.logo || row.logotyp || "";
  
  // Parse arrays (comma-separated in the CSV cell)
  const parseArray = (value: string): string[] => {
    if (!value) return [];
    return value.split(",").map(v => v.trim()).filter(v => v);
  };
  
  const getApplications = () => parseArray(row.applications || row.applikationer || "");
  const getIndustries = () => parseArray(row.industries || row.branscher || "");
  const getIsFeatured = () => {
    const val = (row.is_featured || row.utvald || "").toLowerCase();
    return val === "true" || val === "ja" || val === "yes" || val === "1";
  };

  const name = getName();
  
  return {
    name,
    slug: row.slug || generateSlug(name),
    website: getWebsite(),
    description: getDescription(),
    email: getEmail(),
    phone: getPhone(),
    address: getAddress(),
    logo_url: getLogoUrl(),
    applications: getApplications(),
    industries: getIndustries(),
    is_featured: getIsFeatured(),
  };
};

export const PartnerCsvUpload = ({ password, existingPartners, onImportComplete }: PartnerCsvUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [parsedPartners, setParsedPartners] = useState<ParsedPartner[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const rows = parseCSV(content);
      
      if (rows.length === 0) {
        toast({
          title: "Tom fil",
          description: "Filen innehåller inga datarader.",
          variant: "destructive",
        });
        return;
      }

      // Map and validate partners
      const mapped: ParsedPartner[] = rows.map(row => {
        const partner = mapToPartner(row);
        
        // Check if partner already exists (by name, case-insensitive)
        const existing = existingPartners.find(
          p => p.name.toLowerCase() === partner.name.toLowerCase()
        );
        
        // Validate required fields
        if (!partner.name) {
          return { ...partner, _status: "error" as const, _error: "Namn saknas" };
        }
        if (!partner.website) {
          return { ...partner, _status: "error" as const, _error: "Hemsida saknas" };
        }
        
        if (existing) {
          return { ...partner, _status: "update" as const, _existingId: existing.id };
        }
        
        return { ...partner, _status: "new" as const };
      });

      setParsedPartners(mapped);
      setImportResults(null);
      setIsDialogOpen(true);
    };
    
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    let success = 0;
    let failed = 0;

    for (const partner of parsedPartners) {
      if (partner._status === "error") {
        failed++;
        continue;
      }

      // Remove internal fields
      const { _status, _error, _existingId, ...partnerData } = partner;

      try {
        if (_status === "update" && _existingId) {
          // Update existing partner
          const { error } = await supabase.functions.invoke("manage-partners", {
            body: {
              action: "update",
              id: _existingId,
              partner: partnerData,
              password,
            },
          });
          if (error) throw error;
        } else {
          // Create new partner
          const { error } = await supabase.functions.invoke("manage-partners", {
            body: {
              action: "create",
              partner: partnerData,
              password,
            },
          });
          if (error) throw error;
        }
        success++;
      } catch (error) {
        console.error("Import error for", partner.name, error);
        failed++;
      }
    }

    setImportResults({ success, failed });
    setIsImporting(false);
    
    if (success > 0) {
      onImportComplete();
      toast({
        title: "Import klar",
        description: `${success} partners importerade/uppdaterade${failed > 0 ? `, ${failed} misslyckades` : ""}.`,
      });
    } else {
      toast({
        title: "Import misslyckades",
        description: "Inga partners kunde importeras.",
        variant: "destructive",
      });
    }
  };

  const removePartner = (index: number) => {
    setParsedPartners(prev => prev.filter((_, i) => i !== index));
  };

  const newCount = parsedPartners.filter(p => p._status === "new").length;
  const updateCount = parsedPartners.filter(p => p._status === "update").length;
  const errorCount = parsedPartners.filter(p => p._status === "error").length;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv,.txt"
        className="hidden"
      />
      
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Ladda upp CSV
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Förhandsgranska import</DialogTitle>
          </DialogHeader>

          {importResults ? (
            <div className="py-8 text-center">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Import slutförd</h3>
              <p className="text-muted-foreground">
                {importResults.success} lyckades, {importResults.failed} misslyckades
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(false)}>
                Stäng
              </Button>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {newCount} nya
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {updateCount} uppdateras
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {errorCount} fel
                  </Badge>
                )}
              </div>

              <Card>
                <CardHeader className="py-3">
                  <CardDescription>
                    Granska partners innan import. Befintliga partners (baserat på namn) kommer att uppdateras.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[400px] overflow-y-auto">
                    {parsedPartners.map((partner, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 border-b last:border-b-0 ${
                          partner._status === "error" ? "bg-red-50" : 
                          partner._status === "update" ? "bg-blue-50" : "bg-green-50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{partner.name || "(inget namn)"}</span>
                            {partner._status === "new" && (
                              <Badge variant="outline" className="text-green-700 border-green-300 text-xs">Ny</Badge>
                            )}
                            {partner._status === "update" && (
                              <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">Uppdateras</Badge>
                            )}
                            {partner._status === "error" && (
                              <Badge variant="outline" className="text-red-700 border-red-300 text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {partner._error}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {partner.website || "(ingen hemsida)"}
                          </p>
                          {partner.applications && partner.applications.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {partner.applications.slice(0, 3).map(app => (
                                <Badge key={app} variant="secondary" className="text-xs">{app}</Badge>
                              ))}
                              {partner.applications.length > 3 && (
                                <Badge variant="outline" className="text-xs">+{partner.applications.length - 3}</Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePartner(index)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-sm text-muted-foreground mt-2">
                <strong>Tips:</strong> CSV-filen bör ha kolumner som: namn, hemsida, beskrivning, email, telefon, adress, applikationer, branscher
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting || parsedPartners.length === 0}
                >
                  {isImporting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Importerar...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importera {newCount + updateCount} partners
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
