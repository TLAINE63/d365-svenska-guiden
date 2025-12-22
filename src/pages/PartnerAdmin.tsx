import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Lock, X } from "lucide-react";
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  generateSlug,
  DatabasePartner,
  PartnerInput,
} from "@/hooks/usePartners";
import { allIndustries } from "@/data/partners";

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

const PartnerAdmin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingPartner, setEditingPartner] = useState<DatabasePartner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: partners = [], isLoading } = usePartners();
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();

  // Form state
  const [formData, setFormData] = useState<PartnerInput>({
    slug: "",
    name: "",
    description: "",
    logo_url: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    applications: [],
    industries: [],
    is_featured: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setIsAuthenticated(true);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      name: "",
      description: "",
      logo_url: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      applications: [],
      industries: [],
      is_featured: false,
    });
    setEditingPartner(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (partner: DatabasePartner) => {
    setEditingPartner(partner);
    setFormData({
      slug: partner.slug,
      name: partner.name,
      description: partner.description || "",
      logo_url: partner.logo_url || "",
      website: partner.website,
      email: partner.email || "",
      phone: partner.phone || "",
      address: partner.address || "",
      applications: partner.applications || [],
      industries: partner.industries || [],
      is_featured: partner.is_featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPartner) {
        await updatePartner.mutateAsync({
          id: editingPartner.id,
          partner: formData,
          password,
        });
        toast({ title: "Partner uppdaterad", description: `${formData.name} har uppdaterats.` });
      } else {
        const dataWithSlug = {
          ...formData,
          slug: formData.slug || generateSlug(formData.name),
        };
        await createPartner.mutateAsync({ partner: dataWithSlug, password });
        toast({ title: "Partner skapad", description: `${formData.name} har lagts till.` });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Något gick fel",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePartner.mutateAsync({ id, password });
      toast({ title: "Partner borttagen" });
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte ta bort partner",
        variant: "destructive",
      });
    }
  };

  const toggleApplication = (app: string) => {
    setFormData((prev) => ({
      ...prev,
      applications: prev.applications?.includes(app)
        ? prev.applications.filter((a) => a !== app)
        : [...(prev.applications || []), app],
    }));
  };

  const toggleIndustry = (ind: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries?.includes(ind)
        ? prev.industries.filter((i) => i !== ind)
        : [...(prev.industries || []), ind],
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Admin-inloggning
              </CardTitle>
              <CardDescription>
                Ange admin-lösenordet för att hantera partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">Lösenord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ange lösenord"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Logga in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Partner-administration</h1>
            <p className="text-muted-foreground">Hantera partnerbeskrivningar och information</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Lägg till partner
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Laddar partners...</p>
        ) : partners.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Inga partners har lagts till ännu. Klicka på "Lägg till partner" för att komma igång.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                          Logo
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {partner.description || "Ingen beskrivning"}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {partner.applications.slice(0, 3).map((app) => (
                            <Badge key={app} variant="secondary" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                          {partner.applications.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{partner.applications.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(partner)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirmId(partner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Redigera partner" : "Lägg till partner"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Namn *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder={generateSlug(formData.name) || "genereras-automatiskt"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Hemsida *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="logo_url">Logotyp-URL</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({ ...formData, logo_url: e.target.value })
                }
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adress</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Applikationer</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allApplications.map((app) => (
                  <Badge
                    key={app}
                    variant={formData.applications?.includes(app) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleApplication(app)}
                  >
                    {app}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Branscher</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allIndustries.map((ind) => (
                  <Badge
                    key={ind}
                    variant={formData.industries?.includes(ind) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleIndustry(ind)}
                  >
                    {ind}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
              />
              <Label htmlFor="is_featured">Utvald partner</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Avbryt
              </Button>
              <Button type="submit" disabled={createPartner.isPending || updatePartner.isPending}>
                {editingPartner ? "Spara ändringar" : "Skapa partner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ta bort partner?</DialogTitle>
          </DialogHeader>
          <p>Är du säker på att du vill ta bort denna partner? Detta kan inte ångras.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deletePartner.isPending}
            >
              Ta bort
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PartnerAdmin;
