import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Save, ArrowLeft, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface PageImage {
  id: string;
  page: string;
  url: string;
  filename: string;
  alt: string | null;
  order: number;
}

export function AdminHome() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

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

  // Fetch header slider images
  const { data: headerImages = [], isLoading: imagesLoading } = useQuery<PageImage[]>({
    queryKey: ["/api/page-images", "startseite"],
    queryFn: async () => {
      const response = await fetch("/api/page-images/startseite", {
        credentials: "include",
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  // Upload header image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);  // Backend expects "file", not "image"
      formData.append("page", "startseite");
      formData.append("alt", "");
      
      const response = await fetch("/api/page-images", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-images"] });
      toast({ title: "✅ Bild hochgeladen" });
      setUploadingImage(false);
    },
    onError: () => {
      toast({ 
        title: "❌ Fehler beim Hochladen", 
        variant: "destructive" 
      });
      setUploadingImage(false);
    },
  });

  // Delete header image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(`/api/page-images/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-images"] });
      toast({ title: "✅ Bild gelöscht" });
    },
    onError: () => {
      toast({ 
        title: "❌ Fehler beim Löschen", 
        variant: "destructive" 
      });
    },
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ 
        title: "❌ Ungültige Datei", 
        description: "Bitte wählen Sie ein Bild aus",
        variant: "destructive" 
      });
      return;
    }

    setUploadingImage(true);
    uploadImageMutation.mutate(file);
    e.target.value = ''; // Reset input
  };

  const handleImageDelete = (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      deleteImageMutation.mutate(imageToDelete);
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

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
      <div className="container mx-auto max-w-5xl">
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
          Bearbeitung der Startseite und Hero-Section
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
            <p className="text-muted-foreground">Lädt...</p>
          </div>
        ) : (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-2xl font-poppins">Seiteninhalt</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Page Title & Subtitle */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h2 className="font-poppins text-xl font-bold text-ocean mb-4">Seiten-Meta (Order Options)</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-lg font-semibold mb-2 block">
                        Sektions-Titel
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={content?.title || "Wähle dein Erlebnis"}
                        className="text-lg h-14 bg-white"
                        placeholder="Wähle dein Erlebnis"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle" className="text-lg font-semibold mb-2 block">
                        Sektions-Untertitel
                      </Label>
                      <Input
                        id="subtitle"
                        name="subtitle"
                        defaultValue={content?.subtitle || "Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert."}
                        className="text-base h-12 bg-white"
                        placeholder="Beschreibung der Order-Optionen"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                  <h2 className="font-poppins text-xl font-bold text-ocean mb-4">Hero Section</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="heroTitle" className="text-lg font-semibold mb-2 block">
                        Hero Titel (Großer Satz)
                      </Label>
                      <Input
                        id="heroTitle"
                        name="heroTitle"
                        defaultValue={contentData.heroTitle || "Dein Kurzurlaub in der Schüssel."}
                        className="text-lg h-14 bg-white"
                        placeholder="Dein Kurzurlaub in der Schüssel."
                      />
                    </div>

                    <div>
                      <Label htmlFor="heroSubtitle" className="text-lg font-semibold mb-2 block">
                        Hero Untertitel
                      </Label>
                      <Input
                        id="heroSubtitle"
                        name="heroSubtitle"
                        defaultValue={contentData.heroSubtitle || "Frische, Geschmack und Hawaii-Feeling direkt in Hamburg. Gönn dir das Beste."}
                        className="text-base h-12 bg-white"
                        placeholder="Frische, Geschmack und Hawaii-Feeling direkt in Hamburg. Gönn dir das Beste."
                      />
                    </div>

                    <div>
                      <Label htmlFor="awardTitle" className="text-lg font-semibold mb-2 block">
                        Auszeichnung Badge
                      </Label>
                      <Input
                        id="awardTitle"
                        name="awardTitle"
                        defaultValue={contentData.awardTitle || "Deutschlands Beste Poke Bowl 2024"}
                        className="text-base h-12 bg-white"
                        placeholder="Deutschlands Beste Poke Bowl 2024"
                      />
                    </div>
                  </div>
                </div>

                {/* Header Slider Images */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-poppins text-xl font-bold text-ocean">📸 Header Slider Bilder</h2>
                    <Label
                      htmlFor="header-image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? "Hochladen..." : "Bild hochladen"}
                      <Input
                        id="header-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </Label>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Empfohlen: 3 Bilder für den automatischen Slider (1920x1080px, JPG/PNG)
                  </p>

                  {imagesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean"></div>
                    </div>
                  ) : headerImages.length === 0 ? (
                    <div className="bg-white/50 border-2 border-dashed border-amber-300 rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-semibold mb-1">Noch keine Bilder hochgeladen</p>
                      <p className="text-sm text-gray-500">
                        Laden Sie 3 Bilder hoch für den Header-Slider
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {headerImages.map((image, index) => (
                        <div
                          key={image.id}
                          className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border-2 border-amber-200"
                        >
                          <div className="aspect-video relative">
                            <img
                              src={image.url}
                              alt={image.filename}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-ocean text-white px-3 py-1 rounded-full text-sm font-bold">
                              #{index + 1}
                            </div>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50">
                            <p className="text-sm font-medium text-gray-700 truncate mb-2">
                              {image.filename}
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => handleImageDelete(image.id)}
                              className="w-full"
                              disabled={deleteImageMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Löschen
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <h2 className="font-poppins text-xl font-bold text-ocean mb-4">Order Options</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="orderTitle" className="text-lg font-semibold mb-2 block">
                        Titel
                      </Label>
                      <Input
                        id="orderTitle"
                        name="orderTitle"
                        defaultValue={contentData.orderTitle || "Wähle dein Erlebnis"}
                        className="text-base h-12 bg-white"
                        placeholder="Wähle dein Erlebnis"
                      />
                    </div>

                    <div>
                      <Label htmlFor="orderSubtitle" className="text-lg font-semibold mb-2 block">
                        Beschreibung
                      </Label>
                      <Textarea
                        id="orderSubtitle"
                        name="orderSubtitle"
                        rows={3}
                        defaultValue={contentData.orderSubtitle || "Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert."}
                        className="bg-white font-lato resize-none"
                        placeholder="Ob schnell geliefert, zum Mitnehmen oder gemütlich bei uns – Frische ist garantiert."
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Card */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                  <h2 className="font-poppins text-xl font-bold text-ocean mb-4">🚚 Lieferung</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deliveryTitle" className="font-semibold mb-2 block">
                        Titel
                      </Label>
                      <Input
                        id="deliveryTitle"
                        name="deliveryTitle"
                        defaultValue={contentData.deliveryTitle || "Lieferung"}
                        className="h-12 bg-white"
                        placeholder="Lieferung"
                      />
                    </div>

                    <div>
                      <Label htmlFor="deliveryDesc" className="font-semibold mb-2 block">
                        Beschreibung
                      </Label>
                      <Input
                        id="deliveryDesc"
                        name="deliveryDesc"
                        defaultValue={contentData.deliveryDesc || "Bestell online und spare 10%!"}
                        className="h-12 bg-white"
                        placeholder="Bestell online und spare 10%!"
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Card */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                  <h2 className="font-poppins text-xl font-bold text-ocean mb-4">🛍️ Abholung</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickupTitle" className="font-semibold mb-2 block">
                        Titel
                      </Label>
                      <Input
                        id="pickupTitle"
                        name="pickupTitle"
                        defaultValue={contentData.pickupTitle || "Speisekarte & Abholung"}
                        className="h-12 bg-white"
                        placeholder="Speisekarte & Abholung"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pickupDesc" className="font-semibold mb-2 block">
                        Beschreibung
                      </Label>
                      <Input
                        id="pickupDesc"
                        name="pickupDesc"
                        defaultValue={contentData.pickupDesc || "Online vorbestellen, ohne Wartezeit abholen."}
                        className="h-12 bg-white"
                        placeholder="Online vorbestellen, ohne Wartezeit abholen."
                      />
                    </div>
                  </div>
                </div>

                {/* Reservation Card */}
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200">
                  <h2 className="font-poppins text-xl font-bold text-ocean mb-4">📅 Reservation</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reservationTitle" className="font-semibold mb-2 block">
                        Titel
                      </Label>
                      <Input
                        id="reservationTitle"
                        name="reservationTitle"
                        defaultValue={contentData.reservationTitle || "Vor Ort genießen"}
                        className="h-12 bg-white"
                        placeholder="Vor Ort genießen"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reservationDesc" className="font-semibold mb-2 block">
                        Beschreibung
                      </Label>
                      <Input
                        id="reservationDesc"
                        name="reservationDesc"
                        defaultValue={contentData.reservationDesc || "Genieße deine Bowl in gemütlicher Atmosphäre!"}
                        className="h-12 bg-white"
                        placeholder="Genieße deine Bowl in gemütlicher Atmosphäre!"
                      />
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
        )}

        {/* Delete Image Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bild löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                Möchten Sie dieses Header-Bild wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setImageToDelete(null)}>
                Abbrechen
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
