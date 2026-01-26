import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Available options
const APPLICATION_OPTIONS = [
  "Business Central",
  "Finance & SCM",
  "Sales",
  "Customer Service",
  "Field Service",
  "Customer Insights (Marketing)",
  "Contact Center",
];

const INDUSTRY_OPTIONS = [
  "Tillverkningsindustri",
  "Grossist & Distribution",
  "Retail & E-handel",
  "Bygg & Entreprenad",
  "Livsmedel & Processindustri",
  "Life Science / Medtech",
  "Konsulttjänster",
  "Transport & Logistik",
  "Fastighet & Förvaltning",
  "Finans & Försäkring",
  "Offentlig sektor",
  "Utbildning",
];

const GEOGRAPHY_OPTIONS = [
  "Sverige",
  "Norden",
  "Europa",
  "Övriga världen",
];

interface Invitation {
  id: string;
  partner_name: string;
  email: string;
  partner_id: string | null;
  status: string;
  expires_at: string;
}

interface ExistingData {
  name: string;
  description: string;
  website: string;
  logo_url: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  applications: string[];
  industries: string[];
  secondary_industries: string[];
  geography: string[];
}

const PartnerUpdate = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    logo_url: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    applications: [] as string[],
    industries: [] as string[],
    secondary_industries: [] as string[],
    geography: [] as string[],
    notes: "",
  });

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError("Ogiltig länk");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase.functions.invoke(
          "partner-invitations",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: null,
          }
        );

        // Use fetch directly for GET with query params
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-invitation&token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            setError("Detta formulär har redan skickats in.");
          } else if (response.status === 410) {
            setError("Denna inbjudan har gått ut. Kontakta administratören för en ny länk.");
          } else {
            setError(result.error || "Kunde inte hämta inbjudan");
          }
          setLoading(false);
          return;
        }

        setInvitation(result.invitation);
        
        // Pre-fill form with existing data if available
        if (result.existingData) {
          setFormData({
            name: result.existingData.name || result.invitation.partner_name,
            description: result.existingData.description || "",
            website: result.existingData.website || "",
            logo_url: result.existingData.logo_url || "",
            contact_person: result.existingData.contact_person || "",
            email: result.existingData.email || result.invitation.email,
            phone: result.existingData.phone || "",
            address: result.existingData.address || "",
            applications: result.existingData.applications || [],
            industries: result.existingData.industries || [],
            secondary_industries: result.existingData.secondary_industries || [],
            geography: result.existingData.geography || [],
            notes: "",
          });
        } else {
          setFormData(prev => ({
            ...prev,
            name: result.invitation.partner_name,
            email: result.invitation.email,
          }));
        }
      } catch (err) {
        console.error("Error fetching invitation:", err);
        setError("Ett fel uppstod. Försök igen senare.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: 'applications' | 'industries' | 'secondary_industries' | 'geography', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !invitation) return;

    // Validation
    if (!formData.name.trim()) {
      toast.error("Företagsnamn krävs");
      return;
    }
    if (!formData.website.trim()) {
      toast.error("Webbplats krävs");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            token,
            submissionData: formData,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunde inte skicka formuläret");
      }

      setSubmitted(true);
      toast.success("Tack! Dina uppgifter har skickats in.");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.message || "Ett fel uppstod");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Laddar formulär...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h1 className="text-xl font-semibold mb-2">Ett problem uppstod</h1>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h1 className="text-xl font-semibold mb-2">Tack för dina uppgifter!</h1>
                <p className="text-muted-foreground mb-4">
                  Vi har mottagit dina uppgifter och kommer att granska dem. 
                  Du får ett bekräftelsemail när din profil har uppdaterats.
                </p>
                <Button onClick={() => navigate("/")} variant="outline">
                  Gå till startsidan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Uppdatera partnerprofil | d365.se</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Uppdatera partnerprofil</h1>
            <p className="text-muted-foreground">
              Fyll i eller uppdatera era uppgifter för {invitation?.partner_name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Grundläggande information</CardTitle>
                <CardDescription>Företagets kontaktuppgifter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Företagsnamn *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Webbplats *</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://"
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beskrivning av företaget</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Beskriv ert företag och era tjänster..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Kontaktperson</Label>
                    <Input
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-post</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adress</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logotyp URL</Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    type="url"
                    placeholder="https://..."
                    value={formData.logo_url}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Länk till er logotyp. Rekommenderat format: SVG eller PNG med transparent bakgrund.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Dynamics 365-produkter</CardTitle>
                <CardDescription>Vilka produkter arbetar ni med?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {APPLICATION_OPTIONS.map((app) => (
                    <div key={app} className="flex items-center space-x-2">
                      <Checkbox
                        id={`app-${app}`}
                        checked={formData.applications.includes(app)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('applications', app, checked as boolean)
                        }
                      />
                      <Label htmlFor={`app-${app}`} className="cursor-pointer">{app}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Industries */}
            <Card>
              <CardHeader>
                <CardTitle>Branschfokus</CardTitle>
                <CardDescription>Välj de branscher ni främst arbetar med</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Primära branscher</Label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {INDUSTRY_OPTIONS.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ind-${industry}`}
                            checked={formData.industries.includes(industry)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('industries', industry, checked as boolean)
                            }
                          />
                          <Label htmlFor={`ind-${industry}`} className="cursor-pointer text-sm">{industry}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Geography */}
            <Card>
              <CardHeader>
                <CardTitle>Geografisk täckning</CardTitle>
                <CardDescription>Var erbjuder ni era tjänster?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {GEOGRAPHY_OPTIONS.map((geo) => (
                    <div key={geo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`geo-${geo}`}
                        checked={formData.geography.includes(geo)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('geography', geo, checked as boolean)
                        }
                      />
                      <Label htmlFor={`geo-${geo}`} className="cursor-pointer">{geo}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Övriga kommentarer</CardTitle>
                <CardDescription>Något mer ni vill meddela oss?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Skriv eventuella kommentarer här..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={submitting} size="lg">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  "Skicka in uppgifter"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PartnerUpdate;
