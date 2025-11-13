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

export function AdminContact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: content, isLoading } = useQuery({
    queryKey: ["/api/static-content", "contact", { locale: "de" }],
    queryFn: async () => {
      const response = await fetch("/api/static-content/contact?locale=de", {
        credentials: "include",
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; subtitle: string; content: string; phone: string; address: string; hours: string }) => {
      return await apiRequest("PUT", "/api/static-content/contact", {
        locale: "de",
        title: data.title,
        subtitle: data.subtitle,
        content: JSON.stringify({ phone: data.phone, address: data.address, hours: data.hours }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/static-content"] });
      toast({ title: "✅ Изменения сохранены" });
    },
  });

  const parseContent = (content: any) => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      return { phone: "040 36939098", address: "Fuhlsbüttler Straße 328, Hamburg", hours: "Mo-So: 11:15 - 21:00" };
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const hours = formData.get("hours") as string;
    saveMutation.mutate({
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string || "",
      content: JSON.stringify({ phone, address, hours }),
      phone,
      address,
      hours,
    });
  };

  const contactData = content?.content ? parseContent(content.content) : { phone: "040 36939098", address: "Fuhlsbüttler Straße 328, Hamburg", hours: "Mo-So: 11:15 - 21:00" };

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
          Kontakt bearbeiten
        </h1>
        <p className="text-muted-foreground font-lato mb-8">
          Verwalten Sie Ihre Kontaktinformationen
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-2xl font-poppins">Kontaktdaten</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold mb-2 block">
                    Titel
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={content?.title || "Kontakt"}
                    className="text-lg h-14 bg-white"
                    placeholder="Kontakt"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="text-lg font-semibold mb-2 block">
                    Untertitel (optional)
                  </Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    defaultValue={content?.subtitle || "Wir freuen uns auf deinen Besuch!"}
                    className="text-base h-12 bg-white"
                    placeholder="Wir freuen uns auf deinen Besuch!"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-lg font-semibold mb-2 block">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={contactData.phone}
                    className="text-base h-12 bg-white"
                    placeholder="040 36939098"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-lg font-semibold mb-2 block">
                    Adresse
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    rows={3}
                    defaultValue={contactData.address}
                    className="text-base bg-white"
                    placeholder="Fuhlsbüttler Straße 328, Hamburg"
                  />
                </div>

                <div>
                  <Label htmlFor="hours" className="text-lg font-semibold mb-2 block">
                    Öffnungszeiten
                  </Label>
                  <Input
                    id="hours"
                    name="hours"
                    defaultValue={contactData.hours}
                    className="text-base h-12 bg-white"
                    placeholder="Mo-So: 11:15 - 21:00"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={saveMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg h-14"
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
