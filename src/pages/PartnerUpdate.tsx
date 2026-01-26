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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Product sections matching admin structure
type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

const productSections: { key: ProductKey; label: string; apps: string[] }[] = [
  { key: 'bc', label: 'Business Central', apps: ['Business Central'] },
  { key: 'fsc', label: 'Finance & Supply Chain', apps: ['Finance & SCM'] },
  { key: 'sales', label: 'Sales & Customer Insights', apps: ['Sales', 'Customer Insights (Marketing)'] },
  { key: 'service', label: 'Customer Service / Field Service / Contact Center', apps: ['Customer Service', 'Field Service', 'Contact Center'] },
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

interface ProductFilter {
  industries: string[];
  geography: string;
  ranking: number;
  customerExamples: string[];
  productDescription: string;
}

interface ProductFilters {
  bc?: ProductFilter;
  fsc?: ProductFilter;
  sales?: ProductFilter;
  service?: ProductFilter;
}

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
  product_filters: ProductFilters;
}

const emptyProductFilter: ProductFilter = {
  industries: [],
  geography: "Sverige",
  ranking: 0,
  customerExamples: [],
  productDescription: "",
};

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
    notes: "",
  });

  // Product filters state - separated for easier management
  const [productFilters, setProductFilters] = useState<ProductFilters>({});
  const [activeProducts, setActiveProducts] = useState<ProductKey[]>([]);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError("Ogiltig länk");
        setLoading(false);
        return;
      }

      try {
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
            notes: "",
          });
          
          // Pre-fill product filters if available
          if (result.existingData.product_filters) {
            setProductFilters(result.existingData.product_filters);
            // Determine which products are active based on existing data
            const active: ProductKey[] = [];
            productSections.forEach(section => {
              const filter = result.existingData.product_filters[section.key];
              if (filter && (filter.industries?.length > 0 || filter.productDescription)) {
                active.push(section.key);
              }
            });
            setActiveProducts(active);
          }
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

  const toggleProduct = (key: ProductKey) => {
    setActiveProducts(prev => {
      if (prev.includes(key)) {
        // Remove from active products and clear its filter
        setProductFilters(current => {
          const updated = { ...current };
          delete updated[key];
          return updated;
        });
        return prev.filter(k => k !== key);
      } else {
        // Add to active products with default filter
        setProductFilters(current => ({
          ...current,
          [key]: { ...emptyProductFilter }
        }));
        return [...prev, key];
      }
    });
  };

  const getProductFilter = (key: ProductKey): ProductFilter => {
    return productFilters[key] || { ...emptyProductFilter };
  };

  const updateProductFilter = (key: ProductKey, updates: Partial<ProductFilter>) => {
    setProductFilters(current => ({
      ...current,
      [key]: { ...getProductFilter(key), ...updates }
    }));
  };

  const toggleProductIndustry = (productKey: ProductKey, industry: string) => {
    const filter = getProductFilter(productKey);
    const maxIndustries = 3;
    
    if (filter.industries.includes(industry)) {
      updateProductFilter(productKey, {
        industries: filter.industries.filter(i => i !== industry)
      });
    } else if (filter.industries.length < maxIndustries) {
      updateProductFilter(productKey, {
        industries: [...filter.industries, industry]
      });
    } else {
      toast.error(`Max ${maxIndustries} branscher per produkt`);
    }
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
    if (activeProducts.length === 0) {
      toast.error("Välj minst en produkt ni arbetar med");
      return;
    }

    setSubmitting(true);

    try {
      // Build applications array from active products
      const applications: string[] = [];
      activeProducts.forEach(key => {
        const section = productSections.find(s => s.key === key);
        if (section) {
          applications.push(...section.apps);
        }
      });

      // Build submission data
      const submissionData = {
        ...formData,
        applications,
        industries: [], // Industries are now per-product
        secondary_industries: [],
        geography: [], // Geography is now per-product
        product_filters: productFilters,
      };

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
            submissionData,
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
        <div className="max-w-4xl mx-auto">
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

            {/* Products Section */}
            <Card>
              <CardHeader>
                <CardTitle>Dynamics 365-produkter</CardTitle>
                <CardDescription>
                  Välj de produkter ni arbetar med och fyll i detaljer för varje produkt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {productSections.map((section) => (
                    <Badge
                      key={section.key}
                      variant={activeProducts.includes(section.key) ? "default" : "outline"}
                      className="cursor-pointer text-sm py-1.5 px-3"
                      onClick={() => toggleProduct(section.key)}
                    >
                      {section.label}
                    </Badge>
                  ))}
                </div>

                {activeProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Välj minst en produkt ovan för att fortsätta
                  </p>
                )}

                {/* Product-specific sections */}
                {activeProducts.map((productKey) => {
                  const section = productSections.find(s => s.key === productKey)!;
                  const filter = getProductFilter(productKey);
                  
                  return (
                    <Card key={productKey} className="border-primary/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>{section.label}</span>
                          <Badge variant="default" className="text-xs">Aktiv</Badge>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Applikationer: {section.apps.join(", ")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Product Description */}
                        <div>
                          <Label className="text-sm">Kort beskrivning av erbjudande</Label>
                          <Input
                            placeholder="T.ex. 'Specialiserade på tillverkande företag med fokus på lageroptimering'"
                            value={filter.productDescription || ''}
                            onChange={(e) => updateProductFilter(productKey, { productDescription: e.target.value })}
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Beskriv ert fokus och expertis för denna produkt</p>
                        </div>

                        {/* Industries */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Branschfokus</Label>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${filter.industries.length > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              {filter.industries.length}/3
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {INDUSTRY_OPTIONS.map((ind) => (
                              <Badge
                                key={ind}
                                variant={filter.industries.includes(ind) ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                                onClick={() => toggleProductIndustry(productKey, ind)}
                              >
                                {ind}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Välj max 3 branscher ni fokuserar på för denna produkt</p>
                        </div>

                        {/* Geography */}
                        <div>
                          <Label className="text-sm">Geografisk täckning</Label>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {GEOGRAPHY_OPTIONS.map((geo) => (
                              <Badge
                                key={geo}
                                variant={filter.geography === geo ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                                onClick={() => updateProductFilter(productKey, { geography: geo })}
                              >
                                {geo}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Var erbjuder ni implementation för denna produkt?</p>
                        </div>

                        {/* Ranking (number of projects) */}
                        <div>
                          <Label className="text-sm">Ungefärligt antal genomförda projekt</Label>
                          <Input
                            type="number"
                            min={0}
                            max={999}
                            placeholder="0"
                            value={filter.ranking || ''}
                            onChange={(e) => updateProductFilter(productKey, { ranking: parseInt(e.target.value) || 0 })}
                            className="w-32 mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Hur många implementationsprojekt har ni genomfört för denna produkt?</p>
                        </div>

                        {/* Customer Examples */}
                        <div>
                          <Label className="text-sm">Kundexempel</Label>
                          <Input
                            placeholder="Volvo, IKEA, Scania..."
                            value={(filter.customerExamples || []).join(', ')}
                            onChange={(e) => {
                              const examples = e.target.value
                                .split(',')
                                .map(s => s.trim())
                                .filter(s => s.length > 0);
                              updateProductFilter(productKey, { customerExamples: examples });
                            }}
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Separera med komma. Lämna tomt om ni inte vill ange några.</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
              <Button type="submit" disabled={submitting || activeProducts.length === 0} size="lg">
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
