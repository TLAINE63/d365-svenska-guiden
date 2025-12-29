import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, CheckCircle, Filter } from "lucide-react";

interface LeadCTAProps {
  sourcePage: string;
  selectedProduct?: string;
  selectedIndustry?: string;
  selectedCompanySize?: string;
  variant?: "inline" | "card";
  title?: string;
  description?: string;
}

const companySizeOptions = [
  { value: "1-49", label: "Små- och mindre företag (1-49 anställda)" },
  { value: "50-99", label: "SMB (50-99 anställda)" },
  { value: "100-999", label: "Mid-market (100-999 anställda)" },
  { value: "1000+", label: "Enterprise (1.000+ anställda)" },
];

export const LeadCTA = ({
  sourcePage,
  selectedProduct,
  selectedIndustry,
  selectedCompanySize,
  variant = "card",
  title = "Få hjälp att hitta rätt partner",
  description = "Lämna dina kontaktuppgifter så hjälper vi dig att hitta den partner som passar bäst för dina behov.",
}: LeadCTAProps) => {
  const { toast } = useToast();
  const hasFilters = selectedProduct || selectedIndustry || selectedCompanySize;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    company_size: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.contact_name || !formData.email) {
      toast({
        title: "Fyll i obligatoriska fält",
        description: "Företagsnamn, kontaktperson och e-post är obligatoriska.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...formData,
          industry: selectedIndustry,
          selected_product: selectedProduct,
          source_page: sourcePage,
          source_type: "cta",
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Tack för ditt intresse!",
        description: "Vi återkommer inom kort med förslag på partners.",
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Något gick fel",
        description: "Försök igen senare eller kontakta oss direkt.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center py-8">
            <CheckCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tack för ditt intresse!</h3>
            <p className="text-muted-foreground">
              Vi har tagit emot din förfrågan och återkommer inom kort med förslag på lämpliga partners.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Företagsnamn *</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            placeholder="Ditt företag AB"
            maxLength={100}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_name">Kontaktperson *</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            placeholder="Förnamn Efternamn"
            maxLength={100}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-post *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="namn@foretag.se"
            maxLength={255}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="070-123 45 67"
            maxLength={20}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_size">Företagsstorlek</Label>
        <Select
          value={formData.company_size}
          onValueChange={(value) => setFormData({ ...formData, company_size: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Välj antal anställda" />
          </SelectTrigger>
          <SelectContent>
            {companySizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Meddelande (valfritt)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Beskriv kort vad ni söker hjälp med..."
          rows={3}
          maxLength={1000}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          "Skickar..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Skicka förfrågan
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Genom att skicka godkänner du vår{" "}
        <a href="/dataskydd" className="underline hover:text-primary">
          integritetspolicy
        </a>
        .
      </p>
    </form>
  );

  if (variant === "inline") {
    return content;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
        
        {/* Display selected filters */}
        {hasFilters && (
          <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dina val</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedProduct && (
                <Badge variant="secondary" className="text-xs">
                  {selectedProduct}
                </Badge>
              )}
              {selectedIndustry && (
                <Badge variant="outline" className="text-xs">
                  {selectedIndustry}
                </Badge>
              )}
              {selectedCompanySize && (
                <Badge variant="outline" className="text-xs bg-secondary/50">
                  {selectedCompanySize}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export default LeadCTA;
