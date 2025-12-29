import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

const allApplications = [
  "Business Central",
  "Finance & SCM",
  "Sales",
  "Customer Service",
  "Customer Insights (Marketing)",
  "Field Service",
  "Contact Center",
  "Project Operations",
];

const allIndustries = [
  "Tillverkning",
  "Handel & Distribution",
  "IT & Tech",
  "Konsultföretag",
  "Bygg & Entreprenad",
  "Transport & Logistik",
  "Livsmedel",
  "Läkemedel & Life Science",
  "Energi",
  "Fastigheter",
  "Service & Underhåll",
  "Miljö & Återvinning",
  "Medlemsorganisationer",
  "Detaljhandel",
  "Parti- & Agenturhandel",
];

interface PartnerChangeRequestFormProps {
  partnerId: string;
  partnerName: string;
  currentData: {
    description?: string | null;
    logo_url?: string | null;
    website: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    applications: string[];
    industries: string[];
  };
  onSuccess?: () => void;
}

const PartnerChangeRequestForm = ({
  partnerId,
  partnerName,
  currentData,
  onSuccess,
}: PartnerChangeRequestFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [changes, setChanges] = useState({
    description: currentData.description || "",
    logo_url: currentData.logo_url || "",
    website: currentData.website,
    email: currentData.email || "",
    phone: currentData.phone || "",
    address: currentData.address || "",
    applications: currentData.applications || [],
    industries: currentData.industries || [],
  });

  const toggleApplication = (app: string) => {
    setChanges((prev) => ({
      ...prev,
      applications: prev.applications.includes(app)
        ? prev.applications.filter((a) => a !== app)
        : [...prev.applications, app],
    }));
  };

  const toggleIndustry = (ind: string) => {
    setChanges((prev) => ({
      ...prev,
      industries: prev.industries.includes(ind)
        ? prev.industries.filter((i) => i !== ind)
        : [...prev.industries, ind],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requesterName.trim() || !requesterEmail.trim()) {
      toast({
        title: "Fyll i alla obligatoriska fält",
        description: "Namn och e-post krävs",
        variant: "destructive",
      });
      return;
    }

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requesterEmail.trim())) {
      toast({
        title: "Ogiltig e-postadress",
        description: "Ange en giltig e-postadress",
        variant: "destructive",
      });
      return;
    }

    if (requesterName.trim().length > 100) {
      toast({
        title: "Namn för långt",
        description: "Namnet får max vara 100 tecken",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use server-side validated edge function instead of direct insert
      const { data, error } = await supabase.functions.invoke("submit-change-request", {
        body: {
          partner_id: partnerId,
          partner_name: partnerName,
          requester_name: requesterName.trim(),
          requester_email: requesterEmail.trim(),
          changes: changes,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Ändringsförfrågan skickad",
        description: "Vi granskar dina ändringar och återkommer inom kort.",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Fel vid skickande",
        description: error.message || "Kunde inte skicka ändringsförfrågan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Föreslå ändringar för {partnerName}</CardTitle>
        <CardDescription>
          Fyll i de uppgifter du vill uppdatera. Alla ändringar granskas av admin innan de publiceras.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Requester info */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="requesterName">Ditt namn *</Label>
              <Input
                id="requesterName"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Förnamn Efternamn"
                maxLength={100}
                required
              />
            </div>
            <div>
              <Label htmlFor="requesterEmail">Din e-post *</Label>
              <Input
                id="requesterEmail"
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                placeholder="din@email.se"
                maxLength={255}
                required
              />
            </div>
          </div>

          {/* Partner info */}
          <div>
            <Label htmlFor="website">Hemsida</Label>
            <Input
              id="website"
              type="url"
              value={changes.website}
              onChange={(e) => setChanges({ ...changes, website: e.target.value })}
              placeholder="https://example.com"
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={changes.description}
              onChange={(e) => setChanges({ ...changes, description: e.target.value })}
              rows={4}
              placeholder="Beskriv ert företag och era tjänster..."
              maxLength={5000}
            />
          </div>

          <div>
            <Label htmlFor="logo_url">Logotyp-URL</Label>
            <Input
              id="logo_url"
              type="url"
              value={changes.logo_url}
              onChange={(e) => setChanges({ ...changes, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
              maxLength={500}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Kontakt e-post</Label>
              <Input
                id="email"
                type="email"
                value={changes.email}
                onChange={(e) => setChanges({ ...changes, email: e.target.value })}
                maxLength={255}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={changes.phone}
                onChange={(e) => setChanges({ ...changes, phone: e.target.value })}
                maxLength={30}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adress</Label>
            <Input
              id="address"
              value={changes.address}
              onChange={(e) => setChanges({ ...changes, address: e.target.value })}
              maxLength={300}
            />
          </div>

          <div>
            <Label>Applikationer ni arbetar med</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allApplications.map((app) => (
                <Badge
                  key={app}
                  variant={changes.applications.includes(app) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleApplication(app)}
                >
                  {app}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Branscher ni arbetar med</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allIndustries.map((ind) => (
                <Badge
                  key={ind}
                  variant={changes.industries.includes(ind) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(ind)}
                >
                  {ind}
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Skickar..." : "Skicka ändringsförfrågan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnerChangeRequestForm;
