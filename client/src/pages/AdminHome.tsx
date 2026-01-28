import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Upload, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface PageImage {
  id: string;
  page: string;
  url: string;
  filename: string;
  alt?: string;
  order: number;
  uploadedAt: string;
}

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  order?: number;
}

export function AdminHome() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [sliderImageFile, setSliderImageFile] = useState<File | null>(null);
  const [sliderImagePreview, setSliderImagePreview] = useState<string | null>(null);
  const [isUploadingSlider, setIsUploadingSlider] = useState(false);
  
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState<string | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ["/api/static-content", "home", { locale: "de" }],
    queryFn: async () => {
      const response = await fetch("/api/static-content/home?locale=de", {
        credentials: "include",
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: headerImages = [] } = useQuery<PageImage[]>({
    queryKey: ["/api/page-images/startseite"],
  });

  const { data: galleryImages = [] } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      subtitle: string;
      heroTitle: string;
      heroSubtitle: string;
      awardTitle: string;
      orderTitle: string;
      orderSubtitle: string;
      deliveryTitle: string;
      deliveryDesc: string;
      pickupTitle: string;
      pickupDesc: string;
      reservationTitle: string;
      reservationDesc: string;
    }) => {
      return await apiRequest("PUT", "/api/static-content/home", {
        locale: "de",
        title: data.title,
        subtitle: data.subtitle,
        content: JSON.stringify({
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          awardTitle: data.awardTitle,
          orderTitle: data.orderTitle,
          orderSubtitle: data.orderSubtitle,
          deliveryTitle: data.deliveryTitle,
          deliveryDesc: data.deliveryDesc,
          pickupTitle: data.pickupTitle,
          pickupDesc: data.pickupDesc,
          reservationTitle: data.reservationTitle,
          reservationDesc: data.reservationDesc,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/static-content"] });
      toast({ title: "✅ Änderungen gespeichert" });
    },
    onError: () => {
      toast({ 
        title: "❌ Fehler beim Speichern", 
        variant: "destructive" 
      });
    },
  });

  const createPageImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/page-images", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-images/startseite"] });
      setSliderImageFile(null);
      setSliderImagePreview(null);
      toast({ title: "✅ Slider-Bild hochgeladen" });
    },
    onError: () => {
      toast({ title: "❌ Fehler beim Hochladen", variant: "destructive" });
    },
  });

  const deletePageImageMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/page-images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-images/startseite"] });
      toast({ title: "✅ Bild gelöscht" });
    },
  });

  const reorderPageImageMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      return await apiRequest("PUT", `/api/page-images/${id}/reorder`, { direction });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-images/startseite"] });
    },
  });

  const createGalleryImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setGalleryImageFile(null);
      setGalleryImagePreview(null);
      toast({ title: "✅ Galerie-Bild hochgeladen" });
    },
    onError: () => {
      toast({ title: "❌ Fehler beim Hochladen", variant: "destructive" });
    },
  });

  const deleteGalleryImageMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "✅ Galerie-Bild gelöscht" });
    },
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const contentData = content?.content ? 
      (typeof content.content === 'string' ? JSON.parse(content.content) : content.content) 
      : {};

    saveMutation.mutate({
      title: (formData.get("title") as string) || "Wähle dein Erlebnis",
      subtitle: (formData.get("subtitle") as string) || "Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert.",
      heroTitle: (formData.get("heroTitle") as string) || contentData.heroTitle || "Dein Kurzurlaub in der Schüssel.",
      heroSubtitle: (formData.get("heroSubtitle") as string) || contentData.heroSubtitle || "Frische, Geschmack und Hawaii-Feeling direkt in Hamburg. Gönn dir das Beste.",
      awardTitle: (formData.get("awardTitle") as string) || contentData.awardTitle || "Deutschlands Beste Poke Bowl 2024",
      orderTitle: (formData.get("orderTitle") as string) || contentData.orderTitle || "Wähle dein Erlebnis",
      orderSubtitle: (formData.get("orderSubtitle") as string) || contentData.orderSubtitle || "Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert.",
      deliveryTitle: (formData.get("deliveryTitle") as string) || contentData.deliveryTitle || "Lieferung",
      deliveryDesc: (formData.get("deliveryDesc") as string) || contentData.deliveryDesc || "Bestell online und spare 10%!",
      pickupTitle: (formData.get("pickupTitle") as string) || contentData.pickupTitle || "Speisekarte & Abholung",
      pickupDesc: (formData.get("pickupDesc") as string) || contentData.pickupDesc || "Online vorbestellen, ohne Wartezeit abholen.",
      reservationTitle: (formData.get("reservationTitle") as string) || contentData.reservationTitle || "Vor Ort genießen",
      reservationDesc: (formData.get("reservationDesc") as string) || contentData.reservationDesc || "Genieße deine Bowl in gemütlicher Atmosphäre!",
    });
  };

  const contentData = content?.content ? 
    (typeof content.content === 'string' ? JSON.parse(content.content) : content.content) 
    : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/admin/dashboard")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Button>

        <h1 className="font-poppins text-4xl font-bold text-foreground mb-2">
          Startseite
        </h1>
        <p className="text-muted-foreground font-lato mb-8">
          Slider, Galerie und Texte der Startseite bearbeiten
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
            <p className="text-muted-foreground">Lädt...</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Slider Images */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Hero Slider ({headerImages.length})</CardTitle>
                <p className="text-sm text-muted-foreground">Slider-Bilder für die Startseite Hero-Section</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSliderImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSliderImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="slider-upload"
                  />
                  <label htmlFor="slider-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Slider-Bild hochladen</p>
                  </label>
                  {sliderImagePreview && (
                    <div className="mt-4">
                      <img src={sliderImagePreview} alt="Preview" className="max-h-40 mx-auto rounded" />
                      <div className="flex gap-2 justify-center mt-2">
                        <Button
                          onClick={async () => {
                            if (!sliderImageFile) return;
                            setIsUploadingSlider(true);
                            try {
                              const formData = new FormData();
                              formData.append("image", sliderImageFile);
                              formData.append("page", "startseite");
                              formData.append("order", String(headerImages.length + 1));
                              await createPageImageMutation.mutateAsync(formData);
                            } catch (error) {
                              toast({ title: "Fehler beim Hochladen", variant: "destructive" });
                            } finally {
                              setIsUploadingSlider(false);
                            }
                          }}
                          disabled={isUploadingSlider}
                        >
                          {isUploadingSlider ? "Hochladen..." : "Speichern"}
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setSliderImageFile(null);
                          setSliderImagePreview(null);
                        }}>
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {headerImages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Keine Slider-Bilder vorhanden</p>
                  ) : (
                    headerImages.map((image, index) => (
                      <div key={image.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <img src={image.url} alt={image.filename} className="w-24 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{image.filename}</p>
                          <p className="text-xs text-muted-foreground">Position: {index + 1}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => reorderPageImageMutation.mutate({ id: image.id, direction: "up" })}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => reorderPageImageMutation.mutate({ id: image.id, direction: "down" })}
                            disabled={index === headerImages.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePageImageMutation.mutate(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery Images */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Galerie ({galleryImages.length})</CardTitle>
                <p className="text-sm text-muted-foreground">Galerie-Bilder für die Startseite</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setGalleryImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setGalleryImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label htmlFor="gallery-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Galerie-Bild hochladen</p>
                  </label>
                  {galleryImagePreview && (
                    <div className="mt-4">
                      <img src={galleryImagePreview} alt="Preview" className="max-h-40 mx-auto rounded" />
                      <div className="flex gap-2 justify-center mt-2">
                        <Button
                          onClick={async () => {
                            if (!galleryImageFile) return;
                            setIsUploadingGallery(true);
                            try {
                              const formData = new FormData();
                              formData.append("image", galleryImageFile);
                              await createGalleryImageMutation.mutateAsync(formData);
                            } catch (error) {
                              toast({ title: "Fehler beim Hochladen", variant: "destructive" });
                            } finally {
                              setIsUploadingGallery(false);
                            }
                          }}
                          disabled={isUploadingGallery}
                        >
                          {isUploadingGallery ? "Hochladen..." : "Speichern"}
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setGalleryImageFile(null);
                          setGalleryImagePreview(null);
                        }}>
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {galleryImages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Keine Galerie-Bilder vorhanden</p>
                  ) : (
                    galleryImages.map((image) => (
                      <div key={image.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <img src={image.url} alt={image.alt || "Gallery"} className="w-24 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{image.alt || "Galerie-Bild"}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteGalleryImageMutation.mutate(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Text Content - Full Width */}
            <Card className="border-2 shadow-lg lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl font-poppins">Texte bearbeiten</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200">
                      <h2 className="font-poppins text-xl font-bold text-ocean mb-4">Hero Section</h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="heroTitle">Hero Titel</Label>
                          <Input
                            id="heroTitle"
                            name="heroTitle"
                            defaultValue={contentData.heroTitle || "Dein Kurzurlaub in der Schüssel."}
                          />
                        </div>
                        <div>
                          <Label htmlFor="heroSubtitle">Hero Untertitel</Label>
                          <Textarea
                            id="heroSubtitle"
                            name="heroSubtitle"
                            defaultValue={contentData.heroSubtitle || "Frische, Geschmack und Hawaii-Feeling direkt in Hamburg."}
                          />
                        </div>
                        <div>
                          <Label htmlFor="awardTitle">Auszeichnung</Label>
                          <Input
                            id="awardTitle"
                            name="awardTitle"
                            defaultValue={contentData.awardTitle || "Deutschlands Beste Poke Bowl 2024"}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Order Options */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <h2 className="font-poppins text-xl font-bold text-ocean mb-4">Bestelloptionen</h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Sektions-Titel</Label>
                          <Input
                            id="title"
                            name="title"
                            defaultValue={content?.title || "Wähle dein Erlebnis"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="subtitle">Sektions-Untertitel</Label>
                          <Textarea
                            id="subtitle"
                            name="subtitle"
                            defaultValue={content?.subtitle || "Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert."}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h2 className="font-poppins text-xl font-bold text-green-700 mb-4">Lieferung</h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="deliveryTitle">Titel</Label>
                          <Input
                            id="deliveryTitle"
                            name="deliveryTitle"
                            defaultValue={contentData.deliveryTitle || "Lieferung"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="deliveryDesc">Beschreibung</Label>
                          <Textarea
                            id="deliveryDesc"
                            name="deliveryDesc"
                            defaultValue={contentData.deliveryDesc || "Bestell online und spare 10%!"}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pickup */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                      <h2 className="font-poppins text-xl font-bold text-amber-700 mb-4">Abholung</h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="pickupTitle">Titel</Label>
                          <Input
                            id="pickupTitle"
                            name="pickupTitle"
                            defaultValue={contentData.pickupTitle || "Speisekarte & Abholung"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pickupDesc">Beschreibung</Label>
                          <Textarea
                            id="pickupDesc"
                            name="pickupDesc"
                            defaultValue={contentData.pickupDesc || "Online vorbestellen, ohne Wartezeit abholen."}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reservation */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 md:col-span-2">
                      <h2 className="font-poppins text-xl font-bold text-purple-700 mb-4">Vor Ort</h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="reservationTitle">Titel</Label>
                          <Input
                            id="reservationTitle"
                            name="reservationTitle"
                            defaultValue={contentData.reservationTitle || "Vor Ort genießen"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="reservationDesc">Beschreibung</Label>
                          <Textarea
                            id="reservationDesc"
                            name="reservationDesc"
                            defaultValue={contentData.reservationDesc || "Genieße deine Bowl in gemütlicher Atmosphäre!"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={saveMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg h-14"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saveMutation.isPending ? "Speichern..." : "Änderungen speichern"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
