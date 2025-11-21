import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export function AdminHome() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

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
      </div>
    </div>
  );
}
